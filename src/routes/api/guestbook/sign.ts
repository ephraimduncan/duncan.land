import { createFileRoute } from '@tanstack/react-router'
import { auth as betterAuth } from '@/lib/auth'
import { checkUserHasPost, createPost, getPostWithUser } from '@/lib/data/guestbook'

export const Route = createFileRoute('/api/guestbook/sign')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const session = await betterAuth.api.getSession({ headers: request.headers })

        if (!session?.user) {
          return Response.json(
            { error: 'UNAUTHORIZED', message: 'You must be signed in' },
            { status: 401 },
          )
        }

        const user = session.user
        const body = await request.json().catch(() => null)

        if (typeof body !== 'object' || body === null) {
          return Response.json(
            { error: 'INVALID_INPUT', message: 'Request body must be a JSON object' },
            { status: 400 },
          )
        }

        const { message, signature } = body

        if (typeof message !== 'string') {
          return Response.json(
            { error: 'INVALID_INPUT', message: 'Message is required' },
            { status: 400 },
          )
        }

        const trimmedMessage = message.trim()

        if (trimmedMessage.length === 0) {
          return Response.json(
            { error: 'INVALID_INPUT', message: 'Message is required' },
            { status: 400 },
          )
        }

        if (trimmedMessage.length > 500) {
          return Response.json(
            { error: 'INVALID_INPUT', message: 'Message must be 500 characters or less' },
            { status: 400 },
          )
        }

        if (signature !== null && (typeof signature !== 'string' || signature.length === 0)) {
          return Response.json(
            { error: 'INVALID_INPUT', message: 'Signature must be a non-empty string or null' },
            { status: 400 },
          )
        }

        try {
          const hasPost = await checkUserHasPost(user.id)
          if (hasPost) {
            return Response.json(
              { error: 'ALREADY_SIGNED', message: 'You have already signed the guestbook' },
              { status: 409 },
            )
          }

          const postId = await createPost({
            userId: user.id,
            message: trimmedMessage,
            signature,
          })

          const post = await getPostWithUser(postId)
          return Response.json({ post, message: 'Successfully signed the guestbook' }, { status: 201 })
        } catch (error) {
          console.error('[GUESTBOOK_SIGN]', error)
          return Response.json(
            { error: 'INTERNAL_ERROR', message: 'Failed to sign the guestbook' },
            { status: 500 },
          )
        }
      },
    },
  },
})
