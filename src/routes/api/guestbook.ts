import { createFileRoute } from '@tanstack/react-router'
import { getGuestbookPosts } from '@/lib/data/guestbook'

export const Route = createFileRoute('/api/guestbook')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url)
        const cursorParam = url.searchParams.get('cursor')

        if (cursorParam !== null && !/^\d+$/.test(cursorParam)) {
          return Response.json(
            { error: 'INVALID_CURSOR', message: 'Cursor must be a non-negative integer' },
            { status: 400 },
          )
        }

        const cursor = cursorParam === null ? 0 : Number.parseInt(cursorParam, 10)

        try {
          const response = await getGuestbookPosts(cursor)
          return Response.json(response, {
            headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300' },
          })
        } catch (error) {
          console.error('[GUESTBOOK_GET]', error)
          return Response.json(
            { error: 'INTERNAL_ERROR', message: 'Failed to fetch guestbook posts' },
            { status: 500 },
          )
        }
      },
    },
  },
})
