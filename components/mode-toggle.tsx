import * as stylex from "@stylexjs/stylex";
import { Monitor, Moon, Sun } from "lucide-react";
import { ThemeProvider, useTheme } from "next-themes";
import type React from "react";

import { useIsHydrated } from "@/lib/hooks/use-is-hydrated";
import "./site-theme.css";

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
    <span role="group" aria-label="Theme" {...stylex.props(styles.track)}>
      {THEMES.map(({ label, icon: Icon }) => (
        <button
          type="button"
          key={label}
          aria-label={`Use ${label} theme`}
          aria-pressed={activeTheme === label}
          onClick={() => setTheme(label)}
          {...stylex.props(styles.button, activeTheme === label && styles.active)}
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

const styles = stylex.create({
  track: {
    display: "flex",
    width: "fit-content",
    alignItems: "center",
    gap: "0.125rem",
    overflow: "hidden",
    borderRadius: "6px",
    backgroundColor: "var(--theme-switcher-track)",
    padding: "2px",
  },
  button: {
    display: "flex",
    width: "1.5rem",
    height: "1.5rem",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "4px",
    color: "var(--theme-switcher-icon)",
    opacity: {
      default: 1,
      ":hover": 0.5,
    },
    transitionProperty: "opacity",
    transitionDuration: "150ms",
    transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
  },
  active: {
    backgroundColor: "var(--theme-switcher-active-track)",
    color: "var(--theme-switcher-active-icon)",
  },
});
