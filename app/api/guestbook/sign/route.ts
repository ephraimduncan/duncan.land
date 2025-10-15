import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { auth } from '@/lib/auth';
import { generateId } from 'lucia';
import type { SignGuestbookInput, SignGuestbookResponse } from '@/types/guestbook';

/**
 * POST /api/guestbook/sign
 *
 * Sign the guestbook (authenticated users only)
 */

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const { user } = await auth();

    if (!user) {
      return NextResponse.json(
        { error: 'UNAUTHORIZED', message: 'You must be signed in' },
        { status: 401 }
      );
    }

    // Parse and validate input
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

    // Check if user has already signed
    const existingPostQuery = await db.execute({
      sql: 'SELECT id FROM post WHERE user_id = ?',
      args: [user.id],
    });

    if (existingPostQuery.rows.length > 0) {
      return NextResponse.json(
        { error: 'ALREADY_SIGNED', message: 'You have already signed the guestbook' },
        { status: 409 }
      );
    }

    // Create post
    const postId = generateId(15);
    const createdAt = Math.floor(Date.now() / 1000);

    await db.execute({
      sql: `
        INSERT INTO post (id, created_at, message, user_id, signature)
        VALUES (?, ?, ?, ?, ?)
      `,
      args: [postId, createdAt, body.message.trim(), user.id, body.signature || null],
    });

    // Fetch the created post with user info
    const postQuery = await db.execute({
      sql: `
        SELECT
          post.id,
          post.message,
          post.created_at,
          post.signature,
          user.username,
          user.name
        FROM post
        JOIN user ON post.user_id = user.id
        WHERE post.id = ?
      `,
      args: [postId],
    });

    const post = postQuery.rows[0] as any;

    const response: SignGuestbookResponse = {
      post,
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
