import { resolve } from "node:path";
import { globSync } from "tinyglobby";
import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import { getHtmlInputsRecursively } from "./vite/_build/getHtmlInputsRecursively.js";

const root = resolve(import.meta.dirname, "vite");
const outDir = resolve(import.meta.dirname, "static/vite");

export default defineConfig({
  root,
  base: "/vite",
  build: {
    outDir,
    emptyOutDir: true,
    rolldownOptions: {
      input: getHtmlInputsRecursively(root)
    },
    chunkSizeWarningLimit: 1500
  },
  plugins: [
    tailwindcss(),
    // vite-ignoreをしているファイルに差分があった際も再ビルドする
    // https://stackoverflow.com/questions/63373804/rollup-watch-include-directory/63548394
    {
      name: "watch-external",
      async buildStart() {
        const files = await globSync("vite/**/*");
        for (const file of files) {
          this.addWatchFile(file);
        }
      }
    }
  ]
});
