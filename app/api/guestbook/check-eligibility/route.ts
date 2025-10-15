import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { auth } from '@/lib/auth';
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

    // Check if user has already signed
    const existingPostQuery = await db.execute({
      sql: 'SELECT id FROM post WHERE user_id = ?',
      args: [user.id],
    });

    const eligible = existingPostQuery.rows.length === 0;

    const response: EligibilityResponse = {
      eligible,
      reason: eligible ? undefined : 'Already signed',
    };

    return NextResponse.json(response, {
      headers: {
        // Short cache since eligibility changes after signing
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
