// @ts-check
import { defineConfig } from "astro/config";
import { unified } from "@astrojs/markdown-remark";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import {
  bundledLicenses,
  remarkBundledLicenses
} from "./src/integrations/bundled-licenses.mjs";
import { remarkSimulationLink } from "./src/plugins/remark-simulation-link.mjs";

export default defineConfig({
  site: "https://bicpema.com",
  // Hugoと同じく末尾スラッシュ付きのディレクトリ形式（/post/<スラッグ>/index.html）で出力する
  trailingSlash: "always",
  build: { format: "directory" },
  integrations: [bundledLicenses(), sitemap()],
  // 開発時のツールバーが全画面表示のシミュレーションの操作ボタンと重なるため無効にする
  devToolbar: { enabled: false },
  markdown: {
    // Astro 7既定のMarkdown処理系ではなくremark/rehypeパイプラインを使い、
    // Hugo時代のショートコード記法（{{< simulation-link >}}・{{< bundled-licenses >}}）をremarkプラグインで変換する
    processor: unified({
      remarkPlugins: [remarkSimulationLink, remarkBundledLicenses]
    })
  },
  vite: {
    // シミュレーション（src/simulations/）のスタイルはTailwind CSSで記述する
    plugins: [tailwindcss()],
    build: {
      chunkSizeWarningLimit: 1500,
      // バンドルしたサードパーティライブラリのライセンス一覧を出力する（/licenses/ で表示）。
      // 既定の出力先（.vite/license.md）はFirebase Hostingのignore対象（**/.*）となるため変更する。
      license: { fileName: "third-party-licenses.md" }
    }
  }
});
