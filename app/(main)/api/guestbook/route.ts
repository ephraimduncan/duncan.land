import { NextRequest, NextResponse } from 'next/server';
import { getGuestbookPosts } from '@/lib/data/guestbook';
import type { ApiError, GuestbookPostsResponse } from '@/types/guestbook';

type GetGuestbookResponse =
  | GuestbookPostsResponse
  | ApiError<'INVALID_CURSOR' | 'INTERNAL_ERROR'>;

export async function GET(
  request: NextRequest,
): Promise<NextResponse<GetGuestbookResponse>> {
  const cursorParam = request.nextUrl.searchParams.get('cursor');

  if (cursorParam !== null && !/^\d+$/.test(cursorParam)) {
    return NextResponse.json(
      { error: 'INVALID_CURSOR', message: 'Cursor must be a non-negative integer' },
      { status: 400 },
    );
  }

  const cursor = cursorParam === null ? 0 : Number.parseInt(cursorParam, 10);

  try {
    const response = await getGuestbookPosts(cursor);

    return NextResponse.json(response, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
      },
    });
  } catch (error) {
    console.error('[GUESTBOOK_GET]', error);

    return NextResponse.json(
      { error: 'INTERNAL_ERROR', message: 'Failed to fetch guestbook posts' },
      { status: 500 },
    );
  }
}
