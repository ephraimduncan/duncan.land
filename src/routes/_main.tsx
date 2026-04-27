import { Outlet, createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/navbar";
import { SiteFooter } from "@/components/site-footer";

export const Route = createFileRoute("/_main")({
  component: MainLayout,
});

function MainLayout() {
  return (
    <>
      <main className="isolate mx-auto mb-10 min-h-[calc(100dvh-50px-100px)] max-w-[712px] px-4 md:py-10">
        <Navbar />
        <Outlet />
      </main>
      <SiteFooter />
    </>
  );
}
