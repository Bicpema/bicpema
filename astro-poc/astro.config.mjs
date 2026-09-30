// @ts-check
import { defineConfig } from "astro/config";
import { unified } from "@astrojs/markdown-remark";
import { remarkSimulationLink } from "./src/plugins/remark-simulation-link.mjs";

export default defineConfig({
  site: "https://bicpema.com",
  // Hugoと同じく末尾スラッシュ付きのディレクトリ形式（/post/<スラッグ>/index.html）で出力する
  trailingSlash: "always",
  build: { format: "directory" },
  markdown: {
    // 既定のSätteriではなくremark/rehypeパイプラインを使い、
    // 既存記事の {{< simulation-link >}} 記法をremarkプラグインで変換する
    processor: unified({
      remarkPlugins: [remarkSimulationLink]
    })
  }
});
