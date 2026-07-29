import { Link } from "@tanstack/react-router";

export function GuestbookCTA() {
  return (
    <Link
      to="/guestbook"
      className="fixed right-[calc(1rem+env(safe-area-inset-right))] top-[calc(1rem+env(safe-area-inset-top))] z-50 rounded-lg border border-separator bg-surface-raised/90 px-4 py-2 text-sm font-medium text-foreground shadow-sm backdrop-blur-sm transition-colors hover:bg-grey-50 dark:hover:bg-grey-800"
    >
      Sign the guestbook
    </Link>
  );
}
