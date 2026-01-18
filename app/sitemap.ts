import type { MetadataRoute } from "next";
import { allPosts, allThoughts, allPages } from "content-collections";

const BASE_URL = "https://ephraimduncan.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${BASE_URL}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/archive`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/thoughts`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/talks`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/guestbook`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/wall`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.6,
    },
  ];

  const postRoutes: MetadataRoute.Sitemap = allPosts
    .filter((post) => !post.draft)
    .map((post) => ({
      url: `${BASE_URL}${post.slug}`,
      lastModified: new Date(post.date),
      changeFrequency: "yearly" as const,
      priority: 0.7,
    }));

  const thoughtRoutes: MetadataRoute.Sitemap = allThoughts.map((thought) => ({
    url: `${BASE_URL}${thought.slug}`,
    lastModified: new Date(thought.date),
    changeFrequency: "yearly" as const,
    priority: 0.6,
  }));

  const pageRoutes: MetadataRoute.Sitemap = allPages
    .filter((page) => page.slugAsParams !== "login")
    .map((page) => ({
      url: `${BASE_URL}${page.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.5,
    }));

  return [...staticRoutes, ...postRoutes, ...thoughtRoutes, ...pageRoutes];
}
