import { Link } from "next-view-transitions";

const NAV_ITEMS = [
  { href: "/", label: "home" },
  { href: "/blog", label: "blog" },
  { href: "/thoughts", label: "thoughts" },
  { href: "/guestbook", label: "guestbook" },
] as const;

export function Navbar() {
  return (
    <aside className="-ml-[8px] mb-12 mt-10">
      <div className="lg:sticky lg:top-20">
        <nav
          className="flex flex-row items-start relative px-0 pb-0 fade md:overflow-auto scroll-pr-6 md:relative"
          id="nav"
        >
          <div className="flex flex-row space-x-0 pr-10">
            {NAV_ITEMS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="transition-all hover:text-neutral-800 dark:hover:text-neutral-200 flex align-middle relative py-1 px-2"
              >
                {label}
              </Link>
            ))}
          </div>
        </nav>
      </div>
    </aside>
  );
}
