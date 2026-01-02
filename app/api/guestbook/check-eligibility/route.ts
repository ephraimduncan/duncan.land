import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth-server';
import { checkUserHasPost } from '@/lib/data/guestbook';
import type { EligibilityResponse } from '@/types/guestbook';

/**
 * GET /api/guestbook/check-eligibility
 *
 * Check if authenticated user can sign guestbook
 */

export async function GET(request: NextRequest) {
  try {
    const { user } = await auth();

    if (!user) {
      const response: EligibilityResponse = {
        eligible: false,
        reason: 'Not authenticated',
      };

      return NextResponse.json(response);
    }

    const hasPost = await checkUserHasPost(user.id);

    const response: EligibilityResponse = {
      eligible: !hasPost,
      reason: hasPost ? 'Already signed' : undefined,
    };

    return NextResponse.json(response, {
      headers: {
        'Cache-Control': 'private, max-age=30',
      },
    });

  } catch (error) {
    console.error('[GUESTBOOK_ELIGIBILITY]', error);

    return NextResponse.json(
      { error: 'INTERNAL_ERROR', message: 'Failed to check eligibility' },
      { status: 500 }
    );
  }
}
