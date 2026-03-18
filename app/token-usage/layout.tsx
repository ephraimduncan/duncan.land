import { fetchUsageData } from "@/components/token-usage/data";

interface TokenUsageLayoutProps {
  children: React.ReactNode;
}

export default async function TokenUsageLayout({ children }: TokenUsageLayoutProps) {
  const data = await fetchUsageData();
  const totalCost = data.reduce((sum, day) => sum + day.cost, 0);
  const chartWidth = getChartWidth(data.length);

  return (
    <>
      <header className="pointer-events-none fixed inset-x-0 top-0 z-50 pt-[30px] pb-3">
        <div className="flex justify-center">
          <div className="flex justify-end" style={{ width: chartWidth }}>
            <div className="font-mono text-xs text-grey-800 dark:text-grey-100">
              ${formatCost(totalCost)}
            </div>
          </div>
        </div>
      </header>
      {children}
    </>
  );
}

function formatCost(cost: number) {
  return cost.toFixed(2);
}

function getChartWidth(lineCount: number) {
  const lineWidth = 1;
  const lineGap = 10;

  return lineCount * lineWidth + Math.max(lineCount - 1, 0) * lineGap;
}
