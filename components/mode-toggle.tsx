"use client";

import type React from "react";

import { useIsHydrated } from "@/lib/hooks/use-is-hydrated";
import { cn } from "@/lib/utils";
import { Monitor, Moon, Sun } from "lucide-react";
import { ThemeProvider, useTheme } from "next-themes";

const THEMES = [
  { label: "system", icon: Monitor },
  { label: "dark", icon: Moon },
  { label: "light", icon: Sun },
] as const;

export function AppThemeSwitcher() {
  const isHydrated = useIsHydrated();
  const { theme, setTheme } = useTheme();

  if (!isHydrated) return null;

  const activeTheme = theme ?? "system";

  return (
    <span className="flex w-fit items-center gap-0.5 overflow-hidden rounded-[6px] dark:bg-grey-900 bg-grey-100 p-[2px]">
      {THEMES.map(({ label, icon: Icon }) => (
        <button
          type="button"
          key={label}
          onClick={() => setTheme(label)}
          className={cn(
            "transition-all flex h-6 w-6 items-center justify-center rounded-[4px] hover:opacity-50 text-grey-600 dark:text-grey-300",
            {
              "bg-grey-200 dark:bg-grey-600 text-grey-800 dark:text-grey-100":
                activeTheme === label,
            },
          )}
        >
          <Icon width={13} />
        </button>
      ))}
    </span>
  );
}

export function AppThemeProvider({ children }: React.PropsWithChildren) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
    >
      {children}
    </ThemeProvider>
  );
}
