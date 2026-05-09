import { formatDistance } from "date-fns";

interface RelativeTimeProps {
  date: string;
}

export function RelativeTime({ date }: RelativeTimeProps) {
  const label = formatDistance(new Date(date), new Date(), {
    addSuffix: true,
  });

  return (
    <span className="text-sm" suppressHydrationWarning>
      {label}
    </span>
  );
}
