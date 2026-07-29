import { Outlet, createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/navbar";
import { SiteFooter } from "@/components/site-footer";

export const Route = createFileRoute("/_main")({
  component: MainLayout,
});

function MainLayout() {
  return (
    <>
      <main className="isolate mx-auto min-h-dvh max-w-[712px] px-4 pb-[calc(4rem+env(safe-area-inset-bottom))] md:pt-10">
        <Navbar />
        <Outlet />
      </main>
      <SiteFooter />
    </>
  );
}
