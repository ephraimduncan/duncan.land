"use client";

import { formatDistance } from "date-fns";

interface RelativeTimeProps {
  date: string;
}

export function RelativeTime({ date }: RelativeTimeProps) {
  return (
    <span className="text-sm">
      {formatDistance(new Date(date), new Date(), {
        addSuffix: true,
      })}
    </span>
  );
}
