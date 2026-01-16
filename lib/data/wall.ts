import 'server-only';
import { drizzleDb } from '@/lib/drizzle';
import { post, user } from '@/lib/schema';
import { eq, asc, isNotNull } from 'drizzle-orm';

export interface WallSignature {
  id: string;
  created_at: Date;
  signature: string;
  username: string;
  name: string | null;
}

export async function getAllSignatures(): Promise<WallSignature[]> {
  const signatures = await drizzleDb
    .select({
      id: post.id,
      created_at: post.created_at,
      signature: post.signature,
      username: user.username,
      name: user.name,
    })
    .from(post)
    .innerJoin(user, eq(post.user_id, user.id))
    .where(isNotNull(post.signature))
    .orderBy(asc(post.created_at));

  return signatures.filter((s): s is WallSignature => s.signature !== null && s.signature !== "");
}
