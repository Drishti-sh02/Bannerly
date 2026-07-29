import { reactRouter } from "@react-router/dev/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Related: https://github.com/remix-run/remix/issues/2835#issuecomment-1144102176
// Replace the HOST env var with SHOPIFY_APP_URL so that it doesn't break the Vite server.
// The CLI will eventually stop passing in HOST,
// so we can remove this workaround after the next major release.
if (
  process.env.HOST &&
  (!process.env.SHOPIFY_APP_URL ||
    process.env.SHOPIFY_APP_URL === process.env.HOST)
) {
  process.env.SHOPIFY_APP_URL = process.env.HOST;
  delete process.env.HOST;
}

const host = new URL(process.env.SHOPIFY_APP_URL || "http://localhost")
  .hostname;
let hmrConfig;

if (host === "localhost") {
  hmrConfig = {
    protocol: "ws",
    host: "localhost",
    port: 64999,
    clientPort: 64999,
  };
} else {
  hmrConfig = {
    protocol: "wss",
    host: host,
    port: parseInt(process.env.FRONTEND_PORT) || 8002,
    clientPort: 443,
  };
}

export default defineConfig({
  server: {
    host: "127.0.0.1",
    allowedHosts: [host],
    cors: {
      preflightContinue: true,
    },
    port: Number(process.env.PORT || 3000),
    hmr: hmrConfig,
    fs: {
      // See https://vitejs.dev/config/server-options.html#server-fs-allow for more information
      allow: ["app", "node_modules", "../src"],
    },
  },
  plugins: [reactRouter(), tsconfigPaths()],
  resolve: {
    alias: [
      {
        find: /@shopify\/shopify-api\/dist\/esm\/(.*)/,
        replacement: '@shopify/shopify-api/dist/cjs/$1.js'
      },
      {
        find: /@shopify\/shopify-api\/dist\/esm\/runtime\/(.*)/,
        replacement: '@shopify/shopify-api/dist/cjs/runtime/$1.js'
      },
      {
        find: '@shopify/polaris',
        replacement: path.resolve(__dirname, 'node_modules/@shopify/polaris')
      },
      {
        find: '@shopify/app-bridge-react',
        replacement: path.resolve(__dirname, 'node_modules/@shopify/app-bridge-react')
      }
    ],
    dedupe: ['react', 'react-dom', 'react-router']
  },
  ssr: {
    noExternal: ['lucide-react', '@shopify/polaris', '@shopify/shopify-app-react-router'],
  },
  build: {
    assetsInlineLimit: 0,
  },
  optimizeDeps: {
    include: ["@shopify/app-bridge-react", "lucide-react"],
  },
});
