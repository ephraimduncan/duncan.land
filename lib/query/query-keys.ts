const guestbookRootKey = ["guestbook"] as const;

export const guestbookKeys = {
  all: guestbookRootKey,
  posts: [...guestbookRootKey, "posts"] as const,
} as const;
