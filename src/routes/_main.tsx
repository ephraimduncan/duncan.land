import { Outlet, createFileRoute } from "@tanstack/react-router";
import { LaunchBanner } from "@/components/launch-banner";
import { Navbar } from "@/components/navbar";
import { SiteFooter } from "@/components/site-footer";

export const Route = createFileRoute("/_main")({
  loader: () => ({ renderedAt: Date.now() }),
  component: MainLayout,
});

function MainLayout() {
  const { renderedAt } = Route.useLoaderData();

  return (
    <>
      <LaunchBanner renderedAt={renderedAt} />
      <main className="isolate mx-auto min-h-dvh max-w-[712px] px-4 pb-[calc(4rem+env(safe-area-inset-bottom))] md:pt-10">
        <Navbar />
        <Outlet />
      </main>
      <SiteFooter />
    </>
  );
}
