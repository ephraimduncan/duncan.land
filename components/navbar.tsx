import { Link } from "@tanstack/react-router";

const NAV_ITEMS = [
  { href: "/", label: "home" },
  { href: "/blog", label: "blog" },
  { href: "/thoughts", label: "thoughts" },
  { href: "/guestbook", label: "guestbook" },
] as const;

export function Navbar() {
  return (
    <nav className="-mx-2 mb-12 mt-10 overflow-x-auto" id="nav">
      <div className="flex min-w-max pr-10">
        {NAV_ITEMS.map(({ href, label }) => (
          <Link
            key={href}
            to={href}
            activeOptions={{ exact: href === "/" }}
            className="relative flex items-center px-2 py-1 text-foreground-secondary hover:text-foreground aria-[current=page]:text-foreground aria-[current=page]:underline aria-[current=page]:underline-offset-4"
          >
            {label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
