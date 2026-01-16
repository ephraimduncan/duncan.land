import { NextRequest, NextResponse } from 'next/server';
import { getGuestbookPosts } from '@/lib/data/guestbook';

export async function GET(request: NextRequest) {
  try {
    const cursor = parseInt(request.nextUrl.searchParams.get('cursor') || '0', 10);

    if (isNaN(cursor) || cursor < 0) {
      return NextResponse.json(
        { error: 'INVALID_CURSOR', message: 'Invalid cursor parameter' },
        { status: 400 }
      );
    }

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
      { status: 500 }
    );
  }
}
