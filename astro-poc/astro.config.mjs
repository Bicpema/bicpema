// @ts-check
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { defineConfig } from "astro/config";
import { unified } from "@astrojs/markdown-remark";
import { remarkSimulationLink } from "./src/plugins/remark-simulation-link.mjs";

const publicDir = fileURLToPath(new URL("./public", import.meta.url));

/**
 * `astro dev` は public/ 配下のディレクトリURL（/vite/simulations/<名前>/）を
 * index.html に解決しないため、開発サーバーでのみ index.html へ書き換える。
 * ビルド後（astro preview・Firebase Hosting）は静的ホスティングが解決するため不要。
 * @returns {import("vite").Plugin}
 */
function servePublicDirectoryIndex() {
  return {
    name: "serve-public-directory-index",
    configureServer(server) {
      server.middlewares.use((req, _res, next) => {
        const [pathname, query] = (req.url ?? "").split("?");
        if (pathname.startsWith("/vite/") && pathname.endsWith("/")) {
          const indexPath = `${pathname}index.html`;
          if (existsSync(publicDir + decodeURIComponent(indexPath))) {
            req.url = query === undefined ? indexPath : `${indexPath}?${query}`;
          }
        }
        next();
      });
    }
  };
}

export default defineConfig({
  site: "https://bicpema.com",
  // Hugoと同じく末尾スラッシュ付きのディレクトリ形式（/post/<スラッグ>/index.html）で出力する
  trailingSlash: "always",
  build: { format: "directory" },
  markdown: {
    // Astro 7既定のMarkdown処理系ではなくremark/rehypeパイプラインを使い、
    // 既存記事の {{< simulation-link >}} 記法をremarkプラグインで変換する
    processor: unified({
      remarkPlugins: [remarkSimulationLink]
    })
  },
  vite: {
    plugins: [servePublicDirectoryIndex()]
  }
});
