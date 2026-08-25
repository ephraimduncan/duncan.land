import * as stylex from "@stylexjs/stylex";
import { Link, useMatchRoute } from "@tanstack/react-router";

import { colors } from "../src/styles/tokens.stylex";

const NAV_ITEMS = [
  { href: "/", label: "home" },
  { href: "/blog", label: "blog" },
  { href: "/thoughts", label: "thoughts" },
  { href: "/guestbook", label: "guestbook" },
] as const;

export function Navbar() {
  // Active styles must merge through one stylex.props call; activeProps-injected
  // classes would collide with the base color class and lose the cascade.
  const matchRoute = useMatchRoute();

  return (
    <nav {...stylex.props(styles.nav)} id="nav">
      <div {...stylex.props(styles.links)}>
        {NAV_ITEMS.map(({ href, label }) => {
          const active = matchRoute({ to: href, fuzzy: href !== "/" }) !== false;
          return (
            <Link
              key={href}
              to={href}
              activeOptions={{ exact: href === "/" }}
              {...stylex.props(styles.link, active && styles.activeLink)}
            >
              {label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

const styles = stylex.create({
  nav: {
    marginInline: "-0.5rem",
    marginTop: "2.5rem",
    marginBottom: "3rem",
    overflowX: "auto",
  },
  links: {
    display: "flex",
    minWidth: "max-content",
    paddingRight: "2.5rem",
  },
  link: {
    position: "relative",
    display: "flex",
    alignItems: "center",
    paddingInline: "0.5rem",
    paddingBlock: "0.25rem",
    color: {
      default: colors.foregroundSecondary,
      ":hover": colors.foreground,
    },
  },
  activeLink: {
    color: colors.foreground,
    textDecorationLine: "underline",
    textUnderlineOffset: "0.25rem",
  },
});
