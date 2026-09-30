// 記事中の {{< simulation-link "/vite/simulations/<名前>/" >}}（Hugo時代のショートコード記法）を、
// シミュレーションの埋め込み（iframe）と「全画面表示」「別タブで開く」ボタンに変換するremarkプラグイン。
// ボタンの動作は src/components/SimulationEmbedScript.astro が担う。
// scripts/_lib/checkArticleSimulationLinks.js が記事とシミュレーションの対応付けに
// "/vite/simulations/<名前>/" 形式のパスを使うため、記法は変えずに残している。
import { visit } from "unist-util-visit";
import { renderBootstrapIcon } from "../lib/bootstrap-icons.mjs";
import { escapeHtml } from "./escapeHtml.mjs";

// smartypants（Hugoのtypographerに相当）が先に適用され、引用符が “ ” に変換される場合も許容する
const SHORTCODE = /^\{\{<\s*simulation-link\s+["“”]([^"“”]+)["“”]\s*>\}\}$/;
const HREF = /^\/vite\/simulations\/[A-Za-z0-9_-]+\/$/;

/**
 * シミュレーションの埋め込みのHTMLを返す。
 * @param {string} href シミュレーションのパス
 * @param {string} title 記事のタイトル（iframeのtitleに使う）
 * @returns {string}
 */
export function renderSimulationEmbed(href, title) {
  const src = escapeHtml(href);
  const label = escapeHtml(`シミュレーション「${title}」`);
  return (
    `<div class="not-prose simulation-embed" data-simulation-embed>` +
    `<div class="simulation-embed__frame">` +
    // loading="lazy": 画面に入るまでp5.jsを起動しない
    // allow: オシロスコープのマイク入力と、iframe内からの全画面表示を許可する
    `<iframe src="${src}" title="${label}" loading="lazy" allow="fullscreen; microphone" allowfullscreen></iframe>` +
    `<button type="button" class="simulation-embed__close" data-simulation-embed-exit hidden>全画面表示を終了</button>` +
    `</div>` +
    `<div class="simulation-embed__actions">` +
    `<button type="button" class="simulation-embed__button" data-simulation-embed-fullscreen>${renderBootstrapIcon("arrows-fullscreen")}全画面表示</button>` +
    `<a class="simulation-embed__button" href="${src}" target="_blank" rel="noopener">${renderBootstrapIcon("box-arrow-up-right")}別タブで開く<span class="sr-only">（新しいタブで開きます）</span></a>` +
    `</div>` +
    `</div>`
  );
}

/** @returns {(tree: import("mdast").Root, file: import("vfile").VFile) => void} */
export function remarkSimulationLink() {
  return (tree, file) => {
    /** @type {{ title?: string }} */
    const frontmatter = /** @type {any} */ (file.data).astro?.frontmatter ?? {};
    visit(tree, "paragraph", (node, index, parent) => {
      if (!parent || index === undefined) {
        return;
      }
      if (node.children.length !== 1 || node.children[0].type !== "text") {
        return;
      }
      const match = node.children[0].value.trim().match(SHORTCODE);
      if (!match) {
        return;
      }
      const href = match[1] ?? "";
      if (!HREF.test(href)) {
        file.fail(
          `simulation-link: "/vite/simulations/<名前>/" 形式のパスを指定してください（${href}）`,
          node
        );
      }
      parent.children[index] = {
        type: "html",
        value: renderSimulationEmbed(href, frontmatter.title ?? "")
      };
    });
  };
}
