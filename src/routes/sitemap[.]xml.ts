import { createFileRoute } from '@tanstack/react-router'
import { allPosts, allThoughts, allPages } from 'content-collections'

const BASE_URL = 'https://ephraimduncan.com'

function buildSitemapXml(): string {
  const urls: { loc: string; lastmod: string; changefreq: string; priority: number }[] = []

  // Static routes
  const now = new Date().toISOString()
  urls.push(
    { loc: BASE_URL, lastmod: now, changefreq: 'monthly', priority: 1 },
    { loc: `${BASE_URL}/blog`, lastmod: now, changefreq: 'weekly', priority: 0.8 },
    { loc: `${BASE_URL}/archive`, lastmod: now, changefreq: 'monthly', priority: 0.5 },
    { loc: `${BASE_URL}/thoughts`, lastmod: now, changefreq: 'weekly', priority: 0.8 },
    { loc: `${BASE_URL}/talks`, lastmod: now, changefreq: 'monthly', priority: 0.6 },
    { loc: `${BASE_URL}/guestbook`, lastmod: now, changefreq: 'daily', priority: 0.7 },
    { loc: `${BASE_URL}/wall`, lastmod: now, changefreq: 'daily', priority: 0.6 },
  )

  // Posts
  for (const post of allPosts) {
    if (post.draft) continue
    urls.push({
      loc: `${BASE_URL}${post.slug}`,
      lastmod: new Date(post.date).toISOString(),
      changefreq: 'yearly',
      priority: 0.7,
    })
  }

  // Thoughts
  for (const thought of allThoughts) {
    urls.push({
      loc: `${BASE_URL}${thought.slug}`,
      lastmod: new Date(thought.date).toISOString(),
      changefreq: 'yearly',
      priority: 0.6,
    })
  }

  // Pages
  for (const page of allPages) {
    if (page.slugAsParams === 'login') continue
    urls.push({
      loc: `${BASE_URL}${page.slug}`,
      lastmod: now,
      changefreq: 'monthly',
      priority: 0.5,
    })
  }

  const entries = urls
    .map(
      (u) => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${u.lastmod}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`,
    )
    .join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries}
</urlset>`
}

export const Route = createFileRoute('/sitemap.xml')({
  server: {
    handlers: {
      GET: async () => {
        return new Response(buildSitemapXml(), {
          headers: {
            'Content-Type': 'application/xml',
            'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
          },
        })
      },
    },
  },
})
