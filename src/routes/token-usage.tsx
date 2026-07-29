import { createFileRoute, Link } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import TokenUsageGraph from "@/components/token-usage/source";
import { fetchUsageData } from "@/components/token-usage/data";

const loadUsageData = createServerFn({ method: "GET" }).handler(() => {
  return fetchUsageData();
});

export const Route = createFileRoute("/token-usage")({
  loader: () => loadUsageData(),
  head: () => ({
    meta: [{ title: "Token Usage | Ephraim Duncan" }],
  }),
  component: TokenUsagePage,
  errorComponent: () => (
    <div className="flex min-h-dvh items-center justify-center">
      <div className="text-center font-mono text-sm">
        <Link to="/" aria-label="Back to home" className="text-foreground">
          ←
        </Link>
        <p className="mt-4 text-foreground-subtle">Failed to load usage data</p>
      </div>
    </div>
  ),
});

function formatCost(cost: number) {
  return cost.toFixed(2);
}

function TokenUsagePage() {
  const data = Route.useLoaderData();

  if (data.length === 0) {
    return (
      <div className="flex min-h-dvh items-center justify-center">
        <div className="text-center font-mono text-sm">
          <Link to="/" aria-label="Back to home" className="text-foreground">
            ←
          </Link>
          <p className="mt-4 text-foreground-subtle">No usage data available</p>
        </div>
      </div>
    );
  }

  const totalCost = data.reduce((sum, day) => sum + day.cost, 0);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 pt-[30px] pb-3">
        <div className="mx-auto flex w-full max-w-[712px] items-center justify-between px-4">
          <Link
            to="/"
            aria-label="Back to home"
            className="pointer-events-auto font-mono text-xs text-foreground"
          >
            ←
          </Link>
          <div className="font-mono text-xs tabular-nums text-foreground">
            ${formatCost(totalCost)}
          </div>
        </div>
      </header>
      <TokenUsageGraph data={data} />
    </>
  );
}
