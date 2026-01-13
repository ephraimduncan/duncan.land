import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';
import { auth } from '@/lib/auth-server';
import { checkUserHasPost, createPost, getPostWithUser } from '@/lib/data/guestbook';
import type { SignGuestbookInput } from '@/types/guestbook';

export async function POST(request: NextRequest): Promise<NextResponse> {
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

  revalidateTag('guestbook-posts', 'max');
  revalidateTag('guestbook-count', 'max');

  const post = await getPostWithUser(postId);

  return NextResponse.json(
    { post, message: 'Successfully signed the guestbook' },
    { status: 201 }
  );
}
