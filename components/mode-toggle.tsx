"use client";

import type React from "react";

import { cn } from "@/lib/utils";
import { Monitor, Moon, Sun } from "lucide-react";
import { ThemeProvider, useTheme } from "next-themes";
import { useEffect, useState } from "react";

export const AppThemeSwitcher = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const buttons = [
    {
      label: "system",
      icon: <Monitor width={13} />,
      active: theme === "system",
    },
    { label: "dark", icon: <Moon width={13} />, active: theme === "dark" },
    { label: "light", icon: <Sun width={13} />, active: theme === "light" },
  ];

  return (
    <span className="flex w-fit items-center gap-0.5 overflow-hidden rounded-[6px] dark:bg-grey-900 bg-grey-100 p-[2px]">
      {buttons.map(({ label, icon, active }) => (
        <button
          type="button"
          key={label}
          onClick={() => setTheme(label)}
          className={cn(
            "transition-all flex h-6 w-6 items-center justify-center rounded-[4px] hover:opacity-50 text-grey-600 dark:text-grey-300",
            {
              "bg-grey-200 dark:bg-grey-600 text-grey-800 dark:text-grey-100":
                active,
            },
          )}
        >
          {icon}
        </button>
      ))}
    </span>
  );
};

export const AppThemeProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <ThemeProvider
      enableSystem={true}
      attribute="class"
      storageKey="theme"
      defaultTheme="system"
    >
      {children}
    </ThemeProvider>
  );
};
