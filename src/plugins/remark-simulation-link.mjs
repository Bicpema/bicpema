// 記事中の {{< simulation-link "/vite/simulations/<名前>/" >}}（Hugo時代のショートコード記法）を、
// サムネイル付きのカードに変換するremarkプラグイン。
// サムネイルとタイトルは記事のfront matter（image / title）から取得する。
// scripts/_lib/checkArticleSimulationLinks.js が記事とシミュレーションの対応付けに
// "/vite/simulations/<名前>/" 形式のパスを使うため、記法は変えずに残している。
import { visit } from "unist-util-visit";
import { escapeHtml } from "./escapeHtml.mjs";

// smartypants（Hugoのtypographerに相当）が先に適用され、引用符が “ ” に変換される場合も許容する
const SHORTCODE = /^\{\{<\s*simulation-link\s+["“”]([^"“”]+)["“”]\s*>\}\}$/;
const HREF = /^\/vite\/simulations\/[A-Za-z0-9_-]+\/$/;

/** @returns {(tree: import("mdast").Root, file: import("vfile").VFile) => void} */
export function remarkSimulationLink() {
  return (tree, file) => {
    /** @type {{ title?: string, image?: string }} */
    const frontmatter = /** @type {any} */ (file.data).astro?.frontmatter ?? {};
    visit(tree, "paragraph", (node, index, parent) => {
      if (!parent || index === undefined) return;
      if (node.children.length !== 1 || node.children[0].type !== "text") {
        return;
      }
      const match = node.children[0].value.trim().match(SHORTCODE);
      if (!match) return;
      const href = match[1] ?? "";
      if (!HREF.test(href)) {
        file.fail(
          `simulation-link: "/vite/simulations/<名前>/" 形式のパスを指定してください（${href}）`,
          node
        );
      }
      /** @type {import("mdast").PhrasingContent[]} */
      const children = [
        {
          type: "html",
          value: `<a class="not-prose simulation-link" href="${escapeHtml(href)}">`
        }
      ];
      if (frontmatter.image) {
        // mdastのimageノードとして出力し、ページバンドル内の画像はAstroの画像最適化に任せる。
        // front matterの "thumbnail.png" は記事と同じフォルダーの画像として "./thumbnail.png" に解決する
        const { image } = frontmatter;
        const url =
          /^(https?:)?\/\//.test(image) || image.startsWith("./")
            ? image
            : `./${image}`;
        children.push({
          type: "image",
          url,
          alt: "",
          data: {
            hProperties: {
              className: ["simulation-link__thumbnail"],
              loading: "lazy"
            }
          }
        });
      }
      children.push({
        type: "html",
        value:
          `<span class="simulation-link__body">` +
          `<span class="simulation-link__label">シミュレーション</span>` +
          `<span class="simulation-link__title">${escapeHtml(frontmatter.title ?? "")}</span>` +
          `<span class="simulation-link__button">シミュレーションを開く` +
          `<svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m13 6 6 6-6 6"/></svg>` +
          `</span></span></a>`
      });
      parent.children[index] = { type: "paragraph", children };
    });
  };
}
