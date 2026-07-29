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
    <span
      role="group"
      aria-label="Theme"
      className="flex w-fit items-center gap-0.5 overflow-hidden rounded-[6px] bg-grey-100 p-[2px] dark:bg-grey-900"
    >
      {THEMES.map(({ label, icon: Icon }) => (
        <button
          type="button"
          key={label}
          aria-label={`Use ${label} theme`}
          aria-pressed={activeTheme === label}
          onClick={() => setTheme(label)}
          className={cn(
            "flex size-6 items-center justify-center rounded-[4px] text-grey-600 transition-opacity hover:opacity-50 dark:text-grey-300",
            {
              "bg-grey-200 dark:bg-grey-600 text-grey-800 dark:text-grey-100":
                activeTheme === label,
            },
          )}
        >
          <Icon size={13} aria-hidden="true" />
        </button>
      ))}
    </span>
  );
}

export function AppThemeProvider({ children }: React.PropsWithChildren) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      {children}
    </ThemeProvider>
  );
}
