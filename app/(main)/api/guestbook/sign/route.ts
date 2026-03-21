import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth-server';
import { checkUserHasPost, createPost, getPostWithUser } from '@/lib/data/guestbook';
import type { ApiError, SignGuestbookRequest, SignGuestbookResponse } from '@/types/guestbook';

type SignGuestbookRouteResponse =
  | SignGuestbookResponse
  | ApiError<'ALREADY_SIGNED' | 'INVALID_INPUT' | 'INTERNAL_ERROR' | 'UNAUTHORIZED'>;

export async function POST(
  request: NextRequest,
): Promise<NextResponse<SignGuestbookRouteResponse>> {
  const { user } = await auth();

  if (!user) {
    return NextResponse.json(
      { error: 'UNAUTHORIZED', message: 'You must be signed in' },
      { status: 401 },
    );
  }

  const body = await request.json().catch(() => null);

  if (typeof body !== 'object' || body === null) {
    return NextResponse.json(
      { error: 'INVALID_INPUT', message: 'Request body must be a JSON object' },
      { status: 400 },
    );
  }

  const { message, signature } = body;

  if (typeof message !== 'string') {
    return NextResponse.json(
      { error: 'INVALID_INPUT', message: 'Message is required' },
      { status: 400 },
    );
  }

  const trimmedMessage = message.trim();

  if (trimmedMessage.length === 0) {
    return NextResponse.json(
      { error: 'INVALID_INPUT', message: 'Message is required' },
      { status: 400 },
    );
  }

  if (trimmedMessage.length > 500) {
    return NextResponse.json(
      { error: 'INVALID_INPUT', message: 'Message must be 500 characters or less' },
      { status: 400 },
    );
  }

  if (signature !== null && (typeof signature !== 'string' || signature.length === 0)) {
    return NextResponse.json(
      {
        error: 'INVALID_INPUT',
        message: 'Signature must be a non-empty string or null',
      },
      { status: 400 },
    );
  }

  const input: SignGuestbookRequest = {
    message: trimmedMessage,
    signature,
  };

  try {
    const hasPost = await checkUserHasPost(user.id);
    if (hasPost) {
      return NextResponse.json(
        { error: 'ALREADY_SIGNED', message: 'You have already signed the guestbook' },
        { status: 409 },
      );
    }

    const postId = await createPost({
      userId: user.id,
      message: input.message,
      signature: input.signature,
    });

    const post = await getPostWithUser(postId);

    return NextResponse.json(
      { post, message: 'Successfully signed the guestbook' },
      { status: 201 },
    );
  } catch (error) {
    console.error('[GUESTBOOK_SIGN]', error);

    return NextResponse.json(
      { error: 'INTERNAL_ERROR', message: 'Failed to sign the guestbook' },
      { status: 500 },
    );
  }
}
