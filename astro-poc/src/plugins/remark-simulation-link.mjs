// Hugoのショートコード {{< simulation-link "/vite/simulations/<名前>/" >}} を、
// layouts/shortcodes/simulation-link.html と同じマークアップのカードに変換するremarkプラグイン。
// 記事本文を書き換えずにAstroへ移行できるかを確認するためのPoC実装。
import { visit } from "unist-util-visit";

// smartypants（Hugoのtypographerに相当）が先に適用され、引用符が “ ” に変換される場合も許容する
const SHORTCODE = /^\{\{<\s*simulation-link\s+["“”]([^"“”]+)["“”]\s*>\}\}$/;
const HREF = /^\/vite\/simulations\/[A-Za-z0-9_-]+\/$/;

const escapeHtml = (s) =>
  String(s).replace(
    /[&<>"]/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]
  );

export function remarkSimulationLink() {
  return (tree, file) => {
    const frontmatter = file.data.astro?.frontmatter ?? {};
    visit(tree, "paragraph", (node, index, parent) => {
      if (node.children.length !== 1 || node.children[0].type !== "text")
        return;
      const match = node.children[0].value.trim().match(SHORTCODE);
      if (!match) return;
      const href = match[1];
      if (!HREF.test(href)) {
        file.fail(
          `simulation-link: "/vite/simulations/<名前>/" 形式のパスを指定してください（${href}）`,
          node
        );
      }
      const children = [
        {
          type: "html",
          value: `<a class="not-prose simulation-link" href="${escapeHtml(href)}">`
        }
      ];
      if (frontmatter.image) {
        // mdastのimageノードとして出力し、ページバンドル内の画像はAstroの画像最適化に任せる。
        // Hugoのページリソース（"thumbnail.png"）はAstroでは相対パス（"./thumbnail.png"）として解決する
        const url =
          /^(https?:)?\/\//.test(frontmatter.image) ||
          frontmatter.image.startsWith("./")
            ? frontmatter.image
            : `./${frontmatter.image}`;
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
