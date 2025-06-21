import { fileURLToPath, URL } from 'url';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import environment from 'vite-plugin-environment';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: '../../.env' });

// Manually expose specific env variables
const canisterId = process.env.CANISTER_ID_ICP_TASK_MANAGER_BACKEND;
const dfxNetwork = process.env.DFX_NETWORK || 'local';

export default defineConfig({
  build: {
    emptyOutDir: true,
  },
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: "globalThis",
      },
    },
  },
  server: {
    proxy: {
      "/api": {
        target: "http://127.0.0.1:4943",
        changeOrigin: true,
      },
    },
  },
  plugins: [
    react(),
    environment("all", { prefix: "CANISTER_" }),
    environment("all", { prefix: "DFX_" }),
  ],
  define: {
    "process.env.CANISTER_ID_ICP_TASK_MANAGER_BACKEND": JSON.stringify(canisterId),
    "process.env.DFX_NETWORK": JSON.stringify(dfxNetwork),
  },
  resolve: {
    alias: [
      {
        find: "declarations",
        replacement: fileURLToPath(
          new URL("../declarations", import.meta.url)
        ),
      },
      {
        find: "@",
        replacement: path.resolve(__dirname, "src"),
      },
    ],
    dedupe: ["@dfinity/agent"],
  },
});
