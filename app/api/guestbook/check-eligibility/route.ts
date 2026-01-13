import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth-server';
import { checkUserHasPost } from '@/lib/data/guestbook';
import type { EligibilityResponse } from '@/types/guestbook';

export async function GET(): Promise<NextResponse<EligibilityResponse>> {
  const { user } = await auth();

  if (!user) {
    return NextResponse.json({ eligible: false, reason: 'Not authenticated' });
  }

  const hasPost = await checkUserHasPost(user.id);

  return NextResponse.json(
    { eligible: !hasPost, reason: hasPost ? 'Already signed' : undefined },
    { headers: { 'Cache-Control': 'private, max-age=30' } }
  );
}
