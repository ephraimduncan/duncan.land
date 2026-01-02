import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth-server';
import { checkUserHasPost, createPost, getPostWithUser } from '@/lib/data/guestbook';
import type { SignGuestbookInput, SignGuestbookResponse } from '@/types/guestbook';

/**
 * POST /api/guestbook/sign
 *
 * Sign the guestbook (authenticated users only)
 */

export async function POST(request: NextRequest) {
  try {
    const { user } = await auth();

    if (!user) {
      return NextResponse.json(
        { error: 'UNAUTHORIZED', message: 'You must be signed in' },
        { status: 401 }
      );
    }

    const body = await request.json() as SignGuestbookInput;

    if (!body.message || body.message.trim().length === 0) {
      return NextResponse.json(
        { error: 'INVALID_INPUT', message: 'Message is required' },
        { status: 400 }
      );
    }

    if (body.message.length > 500) {
      return NextResponse.json(
        { error: 'INVALID_INPUT', message: 'Message must be 500 characters or less' },
        { status: 400 }
      );
    }

    const hasPost = await checkUserHasPost(user.id);

    if (hasPost) {
      return NextResponse.json(
        { error: 'ALREADY_SIGNED', message: 'You have already signed the guestbook' },
        { status: 409 }
      );
    }

    const postId = await createPost({
      userId: user.id,
      message: body.message.trim(),
      signature: body.signature || null,
    });

    const createdPost = await getPostWithUser(postId);

    const response: SignGuestbookResponse = {
      post: createdPost,
      message: 'Successfully signed the guestbook',
    };

    return NextResponse.json(response, { status: 201 });

  } catch (error) {
    console.error('[GUESTBOOK_SIGN]', error);

    return NextResponse.json(
      { error: 'INTERNAL_ERROR', message: 'Failed to sign guestbook' },
      { status: 500 }
    );
  }
}
