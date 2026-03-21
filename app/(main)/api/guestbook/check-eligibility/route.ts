import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth-server';
import { checkUserHasPost } from '@/lib/data/guestbook';
import type { EligibilityResponse } from '@/types/guestbook';

const cacheHeaders = { 'Cache-Control': 'private, max-age=30' };

export async function GET(): Promise<NextResponse<EligibilityResponse>> {
  const { user } = await auth();

  if (!user) {
    return NextResponse.json(
      { eligible: false, reason: 'NOT_AUTHENTICATED' },
      { headers: cacheHeaders },
    );
  }

  const hasPost = await checkUserHasPost(user.id);

  if (hasPost) {
    return NextResponse.json(
      { eligible: false, reason: 'ALREADY_SIGNED' },
      { headers: cacheHeaders },
    );
  }

  return NextResponse.json({ eligible: true }, { headers: cacheHeaders });
}
