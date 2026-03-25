import { Link } from "@tanstack/react-router";

export function GuestbookCTA() {
  return (
    <Link
      to="/guestbook"
      className="fixed right-4 top-4 z-50 rounded-lg bg-white/90 px-4 py-2 text-sm font-medium text-grey-900 shadow-[var(--shadow-border)] backdrop-blur-sm transition-[box-shadow,background-color] duration-150 ease-out hover:shadow-[var(--shadow-border-hover)] hover:bg-grey-50 dark:bg-grey-900/90 dark:text-grey-100 dark:hover:bg-grey-800"
    >
      Sign the Guestbook
    </Link>
  );
}
