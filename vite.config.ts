// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, nitro (build-only using cloudflare as a default target),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
  // Deploy target. Lovable's wrapper defaults to Cloudflare; we deploy to Vercel,
  // so pin the Vercel preset (applies outside a Lovable build). NITRO_PRESET env still wins.
  //
  // serverDir enables Nitro's file-based route scanning for server/routes/ and server/api/.
  // Without it, serverDir defaults to false and handlers are never picked up.
  //
  // compatibilityDate < "2025-07-15" disables Nitro's Vercel "observability routes" feature
  // (_presets.mjs getObservabilityRoutes). That feature emits { src, dest } routing entries
  // for every scanned handler and then creates per-route .func junction directories. It is
  // incompatible with TanStack Start's single-bundle architecture (everything lives in
  // __server.func) and also has a Windows junction bug in this Nitro beta — the relative
  // symlink target is resolved against process.cwd() instead of the junction's parent, so
  // the junction is never created but config.json still contains the route entry, causing
  // "ENOENT: no such file or directory" on vercel deploy --prebuilt.
  // With this date set, scanned handlers are still bundled into __server.func and routed
  // correctly by the existing catch-all { src: "/(.*)", dest: "/__server" }.
  nitro: { preset: "vercel", serverDir: "server", compatibilityDate: "2025-01-01" },
});
