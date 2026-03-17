import "@/components/token-usage/styles.css";
import LineGraph from "@/components/token-usage/source";
import { fetchUsageData } from "@/components/token-usage/data";

export const metadata = {
  title: "Token Usage",
};

export default async function TokenUsagePage() {
  const data = await fetchUsageData();
  return <LineGraph data={data} />;
}
