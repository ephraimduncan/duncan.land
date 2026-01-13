export const guestbookKeys = {
  all: ['guestbook'] as const,
  postsList: () => [...guestbookKeys.all, 'posts', 'list'] as const,
  eligibility: () => [...guestbookKeys.all, 'eligibility'] as const,
} as const;
