import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import wasm from "vite-plugin-wasm";
import { nodePolyfills } from "vite-plugin-node-polyfills";
import path from "path";

// https://vite.dev/config/
export default defineConfig(() => {
  return {
    plugins: [
      react(),
      nodePolyfills({
        include: ["buffer"],
        globals: {
          Buffer: true,
          global: true,
          process: true,
        },
      }),
      wasm(),
    ],
    resolve: {
      alias: {
        '../../packages/inzpektor_handler': path.resolve(__dirname, './packages/inzpektor_handler/src/index.ts'),
        '../../packages/inzpektor_handler/dist/index.js': path.resolve(__dirname, './packages/inzpektor_handler/src/index.ts'),
        '../../packages/inzpektor_id_nft': path.resolve(__dirname, './packages/inzpektor_id_nft/src/index.ts'),
        '../../packages/inzpektor_id_nft/dist/index.js': path.resolve(__dirname, './packages/inzpektor_id_nft/src/index.ts'),
        '../../packages/ultrahonk_zk': path.resolve(__dirname, './packages/ultrahonk_zk/src/index.ts'),
        '../../packages/ultrahonk_zk/dist/index.js': path.resolve(__dirname, './packages/ultrahonk_zk/src/index.ts'),
      },
    },
    build: {
      target: "esnext",
    },
    optimizeDeps: {
      exclude: [
        "@stellar/stellar-xdr-json",
        "@noir-lang/noir_wasm",
        "@noir-lang/noirc_abi",
        "@noir-lang/acvm_js",
        "@noir-lang/noir_js",
        "@aztec/bb.js",
      ],
    },
    assetsInclude: ["**/*.wasm"],
    define: {
      global: "globalThis",
      "process.env": "{}",
    },
    envPrefix: "PUBLIC_",
    server: {
      headers: {
        "Cross-Origin-Embedder-Policy": "credentialless",
        "Cross-Origin-Opener-Policy": "same-origin",
      },
      proxy: {
        "/friendbot": {
          target: "http://localhost:8000/friendbot",
          changeOrigin: true,
        },
      },
    },
  };
});
