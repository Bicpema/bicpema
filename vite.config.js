import { resolve } from "node:path";
import { globSync } from "tinyglobby";
import { configDefaults, defineConfig } from "vitest/config";
import tailwindcss from "@tailwindcss/vite";
import { getHtmlInputsRecursively } from "./vite/_build/getHtmlInputsRecursively.js";
import { bicpemaComponentsPlugin } from "./vite/_build/bicpemaComponents.js";

const root = resolve(import.meta.dirname, "vite");
// Astroのpublic/配下へ出力し、Astroのビルドでdist/vite/へそのままコピーさせる
const outDir = resolve(import.meta.dirname, "public/vite");

export default defineConfig({
  root,
  base: "/vite",
  build: {
    outDir,
    emptyOutDir: true,
    rolldownOptions: {
      input: getHtmlInputsRecursively(root)
    },
    chunkSizeWarningLimit: 1500,
    // バンドルしたサードパーティライブラリのライセンス一覧を出力する。
    // 既定の出力先（.vite/license.md）はFirebase Hostingのignore対象（**/.*）となるため変更する。
    license: { fileName: "third-party-licenses.md" }
  },
  test: {
    // Viteのrootはvite/のため、Vitestの基準ディレクトリはリポジトリ直下に戻す
    root: import.meta.dirname,
    include: ["test/**/*.{test,spec}.{js,mjs}"],
    // test/e2e/ はPlaywrightのテストのため、Vitestの対象から除外する
    exclude: [...configDefaults.exclude, "test/e2e/**"]
  },
  plugins: [
    tailwindcss(),
    // index.htmlの<bicpema-*>タグを共通UIパーツのマークアップに展開する
    bicpemaComponentsPlugin(),
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
