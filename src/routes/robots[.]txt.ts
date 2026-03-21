import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/robots.txt')({
  server: {
    handlers: {
      GET: async () => {
        const body = `User-agent: *
Allow: /

Sitemap: https://ephraimduncan.com/sitemap.xml`

        return new Response(body, {
          headers: {
            'Content-Type': 'text/plain',
            'Cache-Control': 'public, s-maxage=86400',
          },
        })
      },
    },
  },
})
