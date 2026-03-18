export function requiredEnv(name: string, value: string | undefined): string {
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

export function requiredEnvList(
  name: string,
  value: string | undefined
): string[] {
  const items = requiredEnv(name, value)
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  if (items.length === 0) {
    throw new Error(`Expected ${name} to include at least one value`);
  }

  return items;
}
