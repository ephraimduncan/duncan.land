export interface UsageClient {
  client: string;
  modelId: string;
  providerId: string;
  cost: number;
}

export interface UsageDay {
  date: string;
  cost: number;
  tokens: number;
  clients: UsageClient[];
}

interface ApiResponse {
  contributions: {
    date: string;
    totals: { tokens: number; cost: number };
    clients: {
      client: string;
      modelId: string;
      providerId: string;
      cost: number;
      tokens: { input: number; output: number; cacheRead: number; cacheWrite: number; reasoning: number };
    }[];
  }[];
}

function aggregateByModel(
  clients: ApiResponse["contributions"][number]["clients"],
): UsageClient[] {
  const map = new Map<string, UsageClient>();
  for (const cl of clients.filter((c) => c.modelId !== "<synthetic>" && c.cost > 0)) {
    const existing = map.get(cl.modelId);
    if (existing) {
      existing.cost += cl.cost;
    } else {
      map.set(cl.modelId, {
        client: cl.client,
        modelId: cl.modelId,
        providerId: cl.providerId,
        cost: cl.cost,
      });
    }
  }
  return Array.from(map.values());
}

const API_URL = "https://agent-api-production-eea5.up.railway.app/api/usage";

export async function fetchUsageData(): Promise<UsageDay[]> {
  const res = await fetch(API_URL, { next: { revalidate: 3600 } });
  if (!res.ok) throw new Error("Failed to fetch usage data");
  const data: ApiResponse = await res.json();

  return data.contributions.map((c) => ({
    date: c.date,
    cost: c.totals.cost,
    tokens: c.totals.tokens,
    clients: aggregateByModel(c.clients),
  }));
}
