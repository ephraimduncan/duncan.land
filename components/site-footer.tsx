import { Link } from "@tanstack/react-router";

const FOOTER_LINKS = [{ href: "/token-usage" as const, label: "/token-usage" }];

export function SiteFooter() {
  return (
    <footer className="fixed bottom-0 z-50 w-full border-t border-separator bg-surface pt-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))]">
      <div className="mx-auto flex max-w-[712px] justify-between px-4">
        <div className="flex items-center gap-8">
          <a
            href="https://twitter.com/ephraimduncan"
            aria-label="Twitter"
            className="text-foreground-secondary hover:text-foreground"
          >
            <TwitterIcon />
          </a>

          {FOOTER_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              to={href as string}
              className="text-sm text-foreground-secondary hover:text-foreground"
            >
              {label}
            </Link>
          ))}
        </div>

        <div className="text-sm text-foreground-muted font-nwr">MMXXVI</div>
      </div>
    </footer>
  );
}

function TwitterIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 15 15"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <title>Twitter</title>
      <path
        d="M7.23 4.7C7.23 2.97 8.63 1.57 10.36 1.57C11.37 1.57 12.18 2.05 12.73 2.74C13.31 2.62 13.86 2.41 14.35 2.12C14.16 2.73 13.74 3.24 13.2 3.56C13.2 3.57 13.2 3.57 13.2 3.57C13.73 3.5 14.24 3.36 14.7 3.16L14.7 3.16C14.37 3.66 13.94 4.11 13.46 4.47C13.48 4.65 13.5 4.82 13.5 5C13.5 8.69 10.69 12.97 5.52 12.97C3.94 12.97 2.47 12.51 1.23 11.72C0.99 11.57 0.93 11.26 1.07 11.02C1.09 11 1.1 10.98 1.12 10.97C1.21 10.82 1.37 10.73 1.56 10.75C2.47 10.86 3.39 10.75 4.19 10.4C3.39 10.04 2.77 9.36 2.5 8.52C2.45 8.37 2.49 8.2 2.59 8.08C2.6 8.08 2.6 8.08 2.6 8.07C1.96 7.51 1.56 6.68 1.56 5.76V5.73C1.56 5.57 1.64 5.42 1.78 5.34C1.83 5.31 1.88 5.3 1.93 5.29C1.71 4.86 1.58 4.38 1.58 3.87C1.58 3.4 1.58 2.81 1.91 2.28C1.99 2.16 2.11 2.09 2.24 2.07C2.43 2.01 2.64 2.07 2.77 2.23C3.87 3.57 5.44 4.5 7.23 4.74L7.23 4.7ZM5.52 11.97C4.73 11.97 3.98 11.84 3.27 11.6C4.13 11.45 4.95 11.12 5.66 10.56C5.81 10.44 5.87 10.24 5.81 10.06C5.75 9.88 5.58 9.76 5.39 9.76C4.69 9.74 4.07 9.4 3.68 8.87C3.87 8.85 4.05 8.82 4.23 8.77C4.44 8.72 4.57 8.53 4.57 8.32C4.56 8.11 4.41 7.94 4.21 7.9C3.43 7.74 2.8 7.17 2.56 6.42C2.76 6.47 2.97 6.5 3.18 6.51C3.39 6.51 3.57 6.39 3.63 6.19C3.69 6 3.62 5.79 3.45 5.68C2.87 5.29 2.48 4.62 2.48 3.87C2.48 3.7 2.48 3.55 2.49 3.42C3.85 4.8 5.71 5.69 7.78 5.79C7.93 5.8 8.08 5.74 8.18 5.62C8.28 5.5 8.32 5.34 8.29 5.18C8.25 5.03 8.23 4.86 8.23 4.7C8.23 3.52 9.19 2.57 10.36 2.57C11.59 2.57 12.5 3.71 12.5 5C12.5 8.26 10.02 11.97 5.52 11.97Z"
        fill="currentColor"
        fillRule="evenodd"
        clipRule="evenodd"
      />
    </svg>
  );
}
