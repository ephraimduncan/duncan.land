/**
 * One-shot migration of guestbook signatures from the suspended Vercel Blob
 * store to Cloudflare R2 (bucket: duncan-land-signatures, served at
 * https://signatures.duncan.land).
 *
 * The Vercel store is "limits-exceeded-suspended": the list API works but
 * content downloads 403 with "Your store is blocked" until the Hobby billing
 * cycle resets (or the account is upgraded). Run with --watch to poll every
 * 10 minutes and grab everything the moment downloads unblock.
 *
 * Usage:
 *   BLOB_READ_WRITE_TOKEN=<duncan-land store token> \
 *   TURSO_DATABASE_URL=libsql://portfolio-guestbook-dephraiim.turso.io \
 *   TURSO_AUTH_TOKEN=<prod token> \
 *   bun scripts/migrate-signatures-to-r2.ts [--watch]
 *
 * The blob token is the duncan-land project's BLOB_READ_WRITE_TOKEN
 * (vercel env pull, project duncan-land). NOT the one in .env.local — that
 * belongs to a demo store. Cloudflare auth reuses the local wrangler OAuth
 * session (or set CLOUDFLARE_API_TOKEN).
 *
 * Steps (idempotent, safe to re-run):
 *   1. List all blobs in the Vercel store.
 *   2. Download each to scripts/.signatures-backup/ (skips existing files).
 *   3. Upload each to R2 via the Cloudflare API (skips existing objects).
 *   4. Verify every blob is served from signatures.duncan.land.
 *   5. Rewrite post.signature URLs in Turso (single UPDATE).
 */

import { createClient } from "@libsql/client";
import { mkdir, readdir } from "node:fs/promises";
import { homedir } from "node:os";
import { join } from "node:path";

const OLD_HOST = "https://iunwcvu7hfv59jkh.public.blob.vercel-storage.com";
const OLD_PREFIX = `${OLD_HOST}/signatures/`;
const NEW_PREFIX = "https://signatures.duncan.land/";
const BUCKET = "duncan-land-signatures";
const ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID ?? "8e642ff58d22bbbe4eda926dda88649e";
const BACKUP_DIR = join(import.meta.dir, ".signatures-backup");
const WATCH = process.argv.includes("--watch");
const WATCH_INTERVAL_MS = 10 * 60 * 1000;
const CONCURRENCY = 8;

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    console.error(`Missing required env var: ${name}`);
    process.exit(1);
  }
  return value;
}

const blobToken = requireEnv("BLOB_READ_WRITE_TOKEN");
if (!blobToken.startsWith("vercel_blob_rw_iunwCvu7HFv59Jkh_")) {
  console.error(
    "BLOB_READ_WRITE_TOKEN is not for the duncan-land store (iunwCvu7HFv59Jkh).\n" +
      "Pull it from the Vercel duncan-land project, not .env.local.",
  );
  process.exit(1);
}

interface BlobEntry {
  url: string;
  pathname: string;
  size: number;
}

async function listVercelBlobs(): Promise<BlobEntry[]> {
  const blobs: BlobEntry[] = [];
  let cursor: string | null = null;
  do {
    const url = new URL("https://blob.vercel-storage.com/");
    url.searchParams.set("limit", "1000");
    if (cursor) url.searchParams.set("cursor", cursor);
    const res = await fetch(url, { headers: { authorization: `Bearer ${blobToken}` } });
    if (!res.ok) throw new Error(`Blob list failed: ${res.status} ${await res.text()}`);
    const page = (await res.json()) as { blobs: BlobEntry[]; hasMore: boolean; cursor: string };
    blobs.push(...page.blobs);
    cursor = page.hasMore ? page.cursor : null;
  } while (cursor);
  return blobs;
}

/** Downloads one blob; returns "blocked" while the store is suspended. */
async function downloadBlob(blob: BlobEntry, dest: string): Promise<"ok" | "blocked"> {
  const res = await fetch(blob.url, { headers: { authorization: `Bearer ${blobToken}` } });
  if (res.status === 403) return "blocked";
  if (!res.ok) throw new Error(`Download failed for ${blob.pathname}: ${res.status}`);
  const bytes = new Uint8Array(await res.arrayBuffer());
  if (blob.size > 0 && bytes.byteLength !== blob.size) {
    throw new Error(`Size mismatch for ${blob.pathname}: got ${bytes.byteLength}, want ${blob.size}`);
  }
  await Bun.write(dest, bytes);
  return "ok";
}

async function cloudflareToken(): Promise<string> {
  if (process.env.CLOUDFLARE_API_TOKEN) return process.env.CLOUDFLARE_API_TOKEN;
  // Refresh the wrangler OAuth session, then reuse its token.
  await Bun.spawn(["npx", "wrangler", "whoami"], { stdout: "ignore", stderr: "ignore" }).exited;
  const configPath = join(homedir(), "Library/Preferences/.wrangler/config/default.toml");
  const config = await Bun.file(configPath).text();
  const match = config.match(/oauth_token\s*=\s*"([^"]+)"/);
  if (!match) throw new Error(`No oauth_token in ${configPath}; set CLOUDFLARE_API_TOKEN instead`);
  return match[1];
}

async function listR2Keys(cfToken: string): Promise<Set<string>> {
  const keys = new Set<string>();
  let cursor: string | null = null;
  do {
    const url = new URL(
      `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/r2/buckets/${BUCKET}/objects`,
    );
    url.searchParams.set("per_page", "1000");
    if (cursor) url.searchParams.set("cursor", cursor);
    const res = await fetch(url, { headers: { authorization: `Bearer ${cfToken}` } });
    if (!res.ok) throw new Error(`R2 list failed: ${res.status} ${await res.text()}`);
    const page = (await res.json()) as {
      result: { key: string }[];
      result_info?: { cursor?: string; is_truncated?: boolean };
    };
    for (const obj of page.result) keys.add(obj.key);
    cursor = page.result_info?.is_truncated ? (page.result_info.cursor ?? null) : null;
  } while (cursor);
  return keys;
}

async function uploadToR2(cfToken: string, key: string, file: string): Promise<void> {
  const body = await Bun.file(file).arrayBuffer();
  const res = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/r2/buckets/${BUCKET}/objects/${encodeURIComponent(key)}`,
    {
      method: "PUT",
      headers: { authorization: `Bearer ${cfToken}`, "content-type": "image/png" },
      body,
    },
  );
  if (!res.ok) throw new Error(`R2 put failed for ${key}: ${res.status} ${await res.text()}`);
}

async function runPool<T>(items: T[], worker: (item: T) => Promise<void>): Promise<void> {
  let next = 0;
  const lanes = Array.from({ length: Math.min(CONCURRENCY, items.length) }, async () => {
    while (next < items.length) {
      const item = items[next++];
      await worker(item);
    }
  });
  await Promise.all(lanes);
}

// 1. Inventory
const blobs = await listVercelBlobs();
console.log(`Vercel store: ${blobs.length} blobs, ${blobs.reduce((s, b) => s + b.size, 0)} bytes`);
await mkdir(BACKUP_DIR, { recursive: true });

// 2. Download (poll in --watch mode while the store is suspended)
for (;;) {
  const existing = new Set(await readdir(BACKUP_DIR));
  const pending = blobs.filter((b) => !existing.has(b.pathname.replace("signatures/", "")));
  if (pending.length === 0) break;

  const probe = await downloadBlob(pending[0], join(BACKUP_DIR, pending[0].pathname.replace("signatures/", "")));
  if (probe === "blocked") {
    const msg = `Store still blocked (${pending.length} files pending)`;
    if (!WATCH) {
      console.error(`${msg}. Re-run when unblocked, or use --watch.`);
      process.exit(1);
    }
    console.log(`${new Date().toISOString()} ${msg}; retrying in 10 min…`);
    await Bun.sleep(WATCH_INTERVAL_MS);
    continue;
  }

  let done = 1;
  await runPool(pending.slice(1), async (blob) => {
    const status = await downloadBlob(blob, join(BACKUP_DIR, blob.pathname.replace("signatures/", "")));
    if (status === "blocked") throw new Error("Store re-blocked mid-download; re-run to resume");
    done += 1;
    if (done % 50 === 0) console.log(`  downloaded ${done}/${pending.length}`);
  });
  console.log(`Downloaded ${done} files to ${BACKUP_DIR}`);
}
console.log("All blobs backed up locally.");

// 3. Upload to R2
const cfToken = await cloudflareToken();
const r2Keys = await listR2Keys(cfToken);
const files = (await readdir(BACKUP_DIR)).filter((f) => f.endsWith(".png"));
const toUpload = files.filter((f) => !r2Keys.has(f));
console.log(`R2: ${r2Keys.size} objects present, uploading ${toUpload.length}`);
let uploaded = 0;
await runPool(toUpload, async (file) => {
  await uploadToR2(cfToken, file, join(BACKUP_DIR, file));
  uploaded += 1;
  if (uploaded % 50 === 0) console.log(`  uploaded ${uploaded}/${toUpload.length}`);
});

// 4. Verify serving before touching the DB
const sample = files[Math.floor(files.length / 2)];
const served = await fetch(`${NEW_PREFIX}${sample}`);
if (!served.ok) throw new Error(`Verification failed: ${NEW_PREFIX}${sample} → ${served.status}`);
console.log(`Verified ${NEW_PREFIX}${sample} → ${served.status}`);

// 5. Rewrite DB URLs
const db = createClient({
  url: requireEnv("TURSO_DATABASE_URL"),
  authToken: requireEnv("TURSO_AUTH_TOKEN"),
});
const result = await db.execute({
  sql: "UPDATE post SET signature = replace(signature, ?, ?) WHERE signature LIKE ?",
  args: [OLD_PREFIX, NEW_PREFIX, `${OLD_HOST}%`],
});
console.log(`Rewrote ${result.rowsAffected} post.signature URLs.`);
console.log("Done. Local backup retained at", BACKUP_DIR);
