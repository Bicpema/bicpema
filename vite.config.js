import { resolve } from "path";
import { defineConfig } from "vite";
import { viteStaticCopy } from "vite-plugin-static-copy";
import { getHtmlInputsRecursively } from "./vite/_build/getHtmlInputsRecursively";

const root = resolve(__dirname, "vite");
const outDir = resolve(__dirname, "static/vite");

export default defineConfig({
  root,
  emptyOutDir: true,
  build: {
    outDir,
    emptyOutDir: true,
    rollupOptions: {
      input: getHtmlInputsRecursively(root),
    },
    chunkSizeWarningLimit: 1500,
  },
  css: {
    preprocessorOptions: {
      scss: {
        quietDeps: true,
      },
    },
  },
  plugins: [
    viteStaticCopy({
      targets: [
        {
          src: resolve(root, "simulations"),
          dest: outDir,
          overwrite: false,
        },
      ],
    }),
  ],
});
