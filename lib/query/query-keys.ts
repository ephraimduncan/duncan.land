const guestbookRootKey = ['guestbook'] as const;

export const guestbookKeys = {
  all: guestbookRootKey,
  postsList: [...guestbookRootKey, 'posts', 'list'] as const,
  eligibility: [...guestbookRootKey, 'eligibility'] as const,
} as const;
