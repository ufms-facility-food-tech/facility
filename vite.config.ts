import { vite as millionLint } from "@million/lint";
import { vitePlugin as remix } from "@remix-run/dev";
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    target: "es2022",
  },
  plugins: [
    millionLint({
      enabled: true,
    }),
    remix({
      future: {
        v3_fetcherPersist: true,
        v3_relativeSplatPath: true,
        v3_throwAbortReason: true,
        v3_singleFetch: true,
        v3_lazyRouteDiscovery: true,
        unstable_optimizeDeps: true,
      },
    }),
  ],
  resolve: {
    alias: {
      "~": "/app",
    },
  },
  optimizeDeps: {
    exclude: ["@node-rs/argon2"],
  },
});
