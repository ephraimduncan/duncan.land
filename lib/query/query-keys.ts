/**
 * Query key factory for type-safe key generation
 * @see https://tanstack.com/query/latest/docs/react/guides/query-keys
 */
export const guestbookKeys = {
  all: ['guestbook'] as const,
  postsList: () => [...guestbookKeys.all, 'posts', 'list'] as const,
  eligibility: () => [...guestbookKeys.all, 'eligibility'] as const,
} as const;
