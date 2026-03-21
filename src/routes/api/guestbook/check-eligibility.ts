import { createFileRoute } from '@tanstack/react-router'
import { auth as betterAuth } from '@/lib/auth'
import { checkUserHasPost } from '@/lib/data/guestbook'

const cacheHeaders = { 'Cache-Control': 'private, max-age=30' }

export const Route = createFileRoute('/api/guestbook/check-eligibility')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const session = await betterAuth.api.getSession({ headers: request.headers })

        if (!session?.user) {
          return Response.json(
            { eligible: false, reason: 'NOT_AUTHENTICATED' },
            { headers: cacheHeaders },
          )
        }

        const hasPost = await checkUserHasPost(session.user.id)

        if (hasPost) {
          return Response.json(
            { eligible: false, reason: 'ALREADY_SIGNED' },
            { headers: cacheHeaders },
          )
        }

        return Response.json({ eligible: true }, { headers: cacheHeaders })
      },
    },
  },
})
