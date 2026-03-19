import 'server-only';
import { drizzleDb } from '@/lib/drizzle';
import { post, user } from '@/lib/schema';
import { and, asc, eq, isNotNull, ne } from 'drizzle-orm';
import type { GuestbookSignature } from '@/types/guestbook';

function expectSignature(signature: string | null, postId: string) {
  if (signature !== null && signature !== '') {
    return signature;
  }

  throw new Error(`Missing signature image for wall post ${postId}`);
}

export async function getAllSignatures(): Promise<GuestbookSignature[]> {
  const rows = await drizzleDb
    .select({
      id: post.id,
      created_at: post.created_at,
      signature: post.signature,
      username: user.username,
      name: user.name,
    })
    .from(post)
    .innerJoin(user, eq(post.user_id, user.id))
    .where(and(isNotNull(post.signature), ne(post.signature, '')))
    .orderBy(asc(post.created_at));

  return rows.map((row) => ({
    ...row,
    created_at: row.created_at.toISOString(),
    signature: expectSignature(row.signature, row.id),
  }));
}
