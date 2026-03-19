import TokenUsageGraph from "@/components/token-usage/source";
import { fetchUsageData } from "@/components/token-usage/data";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Token Usage",
};

export default async function TokenUsagePage() {
  const data = await fetchUsageData();

  return <TokenUsageGraph data={data} />;
}
