import { Outlet, createFileRoute } from "@tanstack/react-router";
import * as stylex from "@stylexjs/stylex";
import { Navbar } from "@/components/navbar";
import { SiteFooter } from "@/components/site-footer";

export const Route = createFileRoute("/_main")({
  component: MainLayout,
});

function MainLayout() {
  return (
    <>
      <main {...stylex.props(styles.main)}>
        <Navbar />
        <Outlet />
      </main>
      <SiteFooter />
    </>
  );
}

const styles = stylex.create({
  main: {
    isolation: "isolate",
    marginInline: "auto",
    minHeight: "100dvh",
    maxWidth: "712px",
    paddingInline: "1rem",
    paddingBottom: "calc(4rem + env(safe-area-inset-bottom))",
    paddingTop: {
      default: 0,
      "@media (min-width: 768px)": "2.5rem",
    },
  },
});
