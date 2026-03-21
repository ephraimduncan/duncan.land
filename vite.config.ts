import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact, { reactCompilerPreset } from "@vitejs/plugin-react";
import babel from "@rolldown/plugin-babel";
import contentCollections from "@content-collections/vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  server: { port: 3000 },
  resolve: {
    tsconfigPaths: true,
    alias: {
      // bright (code highlighter) imports server-only which throws outside RSC.
      // Alias to empty module since TanStack Start has no RSC boundary.
      "server-only": new URL("./src/shims/server-only.ts", import.meta.url).pathname,
    },
  },
  ssr: {
    // Force Vite to bundle bright so the server-only alias applies to its CJS require()
    noExternal: ["bright"],
  },
  plugins: [
    contentCollections(),
    tailwindcss(),
    tanstackStart(),
    // React's Vite plugin must come after TanStack Start's plugin
    viteReact(),
    babel({ presets: [reactCompilerPreset()] }),
  ],
});
