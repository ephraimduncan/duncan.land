import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const dateFormatter = new Intl.DateTimeFormat("en", {
  year: "numeric",
  month: "short",
  day: "numeric",
});

const numberFormatter = new Intl.NumberFormat("en", {
  style: "decimal",
});

const relativeTimeFormatter = new Intl.RelativeTimeFormat("en", {
  numeric: "auto",
});

interface Formatter {
  date(input: Date): string;
  number(input: number): string;
  time(value: number, unit: Intl.RelativeTimeFormatUnit): string;
}

export const formatter = {
  date(input) {
    return dateFormatter.format(input);
  },
  number(input) {
    return numberFormatter.format(input);
  },
  time(value, unit) {
    return relativeTimeFormatter.format(value, unit);
  },
} satisfies Formatter;
