/**
 * Query key factory for guestbook feature
 * Follows TanStack Query best practices for hierarchical keys
 *
 * Structure:
 * - ['guestbook'] - all guestbook queries
 * - ['guestbook', 'posts'] - all posts lists
 * - ['guestbook', 'posts', { cursor }] - specific page
 * - ['guestbook', 'eligibility'] - user eligibility
 */

export const guestbookKeys = {
  // Base key for all guestbook queries
  all: ['guestbook'] as const,

  // All post lists (invalidate all infinite queries)
  posts: () => [...guestbookKeys.all, 'posts'] as const,

  // Specific infinite query with filters
  postsList: (filters?: { cursor?: number }) =>
    [...guestbookKeys.posts(), filters] as const,

  // User eligibility to sign
  eligibility: () => [...guestbookKeys.all, 'eligibility'] as const,
} as const;
