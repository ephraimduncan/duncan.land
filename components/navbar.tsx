import { Link } from "@tanstack/react-router";

const NAV_ITEMS = [
  { href: "/", label: "home" },
  { href: "/blog", label: "blog" },
  { href: "/thoughts", label: "thoughts" },
  { href: "/guestbook", label: "guestbook" },
] as const;

export function Navbar() {
  return (
    <nav className="-mx-2 mb-12 mt-10 overflow-x-auto lg:sticky lg:top-20" id="nav">
      <div className="flex min-w-max pr-10">
        {NAV_ITEMS.map(({ href, label }) => (
          <Link
            key={href}
            to={href}
            className="relative flex items-center px-2 py-1 text-grey-700 hover:text-grey-900 dark:text-grey-300 dark:hover:text-grey-100"
          >
            {label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
