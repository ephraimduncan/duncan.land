import "@/components/token-usage/styles.css";
import LineGraph from "@/components/token-usage/source";

export const metadata = {
  title: "Token Usage",
};

export default function TokenUsagePage() {
  return <LineGraph />;
}
