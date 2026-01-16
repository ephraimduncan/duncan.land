"use client";

import Link from "next/link";

export function GuestbookCTA() {
  return (
    <Link
      href="/guestbook"
      className="fixed right-4 top-4 z-50 rounded-lg border border-grey-200 bg-white/90 px-4 py-2 text-sm font-medium text-grey-900 shadow-sm backdrop-blur-sm transition-colors hover:bg-grey-50 dark:border-grey-800 dark:bg-grey-900/90 dark:text-grey-100 dark:hover:bg-grey-800"
    >
      Sign the Guestbook
    </Link>
  );
}
