import { Readable, Writable } from "node:stream";
import { pipeline } from "node:stream/promises";
import { createGzip } from "node:zlib";
import { defineHandler } from "nitro";

// Matches patterns that have zero business existing on this site.
const SCANNER = new RegExp(
  [
    "\\.php(?:\\?|$)", //  *.php — no PHP here, ever
    "\\.env(?:[.~/]|$)", //  .env, .env.local, .env.backup, .env~, ...
    "/\\.git(?:/|$)", //  .git/HEAD, .git/config, ...
    "/wp-", //  wp-admin, wp-content, wp-includes, wp-login
    "/xmlrpc", //  WordPress XML-RPC
    "/ALFA_DATA", //  ALFA shell probes
    "/cgi-bin", //  CGI probes
    "/admin(?:/|istrator|$)", //  /admin, /admin/*, /administrator*
    "/vendor/phpunit", //  Composer dependency probes
    "/phpinfo", //  PHP info pages
    "/assets/plugins/jQuery-File-Upload", // jQuery upload exploit
    "/license\\.txt$", //  WordPress fingerprinting
    "/modules/mod_simplefileupload", //  Joomla upload exploit
    "/sites/default/files", //  Drupal files
  ].join("|"),
  "i",
);

const BOMB_CHUNK_SIZE = 1024 * 1024;
const BOMB_CHUNK_COUNT = 1024;
const ZERO_CHUNK = Buffer.alloc(BOMB_CHUNK_SIZE);

// Lazy-initialized on first scanner hit. Legitimate users never match the
// regex, so they never pay for the generation cost. The first bot after a
// cold start eats the delay; every subsequent bot gets the cached bomb.
let bombPromise: Promise<Buffer> | null = null;

async function createBomb(): Promise<Buffer> {
  const chunks: Buffer[] = [];

  await pipeline(
    Readable.from(
      (async function* () {
        for (let index = 0; index < BOMB_CHUNK_COUNT; index += 1) {
          yield ZERO_CHUNK;
        }
      })(),
    ),
    createGzip({ level: 9 }),
    new Writable({
      write(chunk, _encoding, callback) {
        chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
        callback();
      },
    }),
  );

  return Buffer.concat(chunks);
}

function getBomb(): Promise<Buffer> {
  if (!bombPromise) {
    bombPromise = createBomb().catch((error: unknown) => {
      bombPromise = null;
      throw error;
    });
  }

  return bombPromise;
}

export default defineHandler(async (event) => {
  const path = event.url.pathname + event.url.search;

  if (!SCANNER.test(path)) return; // pass through to app

  const payload = await getBomb();
  return new Response(new Uint8Array(payload), {
    status: 200,
    headers: {
      "Content-Type": "text/html",
      "Content-Encoding": "gzip",
      "Content-Length": payload.length.toString(),
      "Cache-Control": "no-store",
    },
  });
});
