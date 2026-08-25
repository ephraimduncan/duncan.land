import * as stylex from "@stylexjs/stylex";

// Theme-aware values resolve through the custom properties in globals.css,
// which next-themes flips via the `.dark` class. StyleX cannot scope styles
// to an ancestor class, so that table stays the single light/dark flip point.
export const colors = stylex.defineVars({
  surface: "var(--surface)",
  surfaceRaised: "var(--surface-raised)",
  separator: "var(--separator)",
  foreground: "var(--foreground)",
  foregroundSecondary: "var(--foreground-secondary)",
  foregroundMuted: "var(--foreground-muted)",
  foregroundSubtle: "var(--foreground-subtle)",
  accent: "var(--accent)",
  danger: "var(--danger)",
  decorationMuted: "var(--decoration-muted)",
  decorationMutedHover: "var(--decoration-muted-hover)",
});

export const grey = stylex.defineVars({
  g50: "#f7f6f6",
  g100: "#e6e2e1",
  g200: "#cdc5c2",
  g300: "#aca19c",
  g400: "#8a7d77",
  g500: "#70615c",
  g600: "#584e49",
  g700: "#48423d",
  g800: "#3c3633",
  g900: "#342f2d",
  g950: "#1c1917",
});

export const fonts = stylex.defineVars({
  sans: "ui-sans-serif, system-ui, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'",
  mono: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  serif: "var(--font-kaisei)",
  emp: "var(--font-newsreader)",
  nwr: "var(--font-newsreader-regular)",
});
