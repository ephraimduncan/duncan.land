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
});

function formatCost(cost: number) {
  return cost.toFixed(2);
}

function getChartWidth(lineCount: number) {
  const lineWidth = 1;
  const lineGap = 10;
  return lineCount * lineWidth + Math.max(lineCount - 1, 0) * lineGap;
}

function TokenUsagePage() {
  const data = Route.useLoaderData();
  const totalCost = data.reduce((sum, day) => sum + day.cost, 0);
  const chartWidth = getChartWidth(data.length);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 pt-[30px] pb-3">
        <div className="flex justify-center">
          <div className="flex items-center justify-between" style={{ width: chartWidth }}>
            <Link to="/" className="pointer-events-auto font-mono text-xs text-grey-800 dark:text-grey-100">
              ←
            </Link>
            <div className="font-mono text-xs text-grey-800 dark:text-grey-100">
              ${formatCost(totalCost)}
            </div>
          </div>
        </div>
      </header>
      <TokenUsageGraph data={data} />
    </>
  );
}
