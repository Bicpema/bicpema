// 固定ページ（src/content/pages/licenses.md）の {{< bundled-licenses >}} に、
// シミュレーションがバンドルしているサードパーティライブラリのライセンス一覧を表示する。
//
// ライセンス一覧（third-party-licenses.md）はViteのクライアントビルド時（vite.build.license）に
// 生成され、Markdownの変換より後になる。そのため、remarkプラグインで目印の要素を出力しておき、
// ビルド完了後（astro:build:done）に生成済みのHTMLへライセンス本文を差し込む。
// ライセンス本文が取得できないパッケージは data/third_party_license_supplements.yaml の内容で補う。
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { visit } from "unist-util-visit";
import { parse } from "yaml";
import { escapeHtml } from "../plugins/escapeHtml.mjs";

const SHORTCODE = /^\{\{<\s*bundled-licenses\s*>\}\}$/;
const PLACEHOLDER =
  '<div data-bundled-licenses=""><p>ライセンス一覧はビルド時に生成されます。</p></div>';
const LICENSES_FILE_NAME = "third-party-licenses.md";
const SUPPLEMENTS_PATH = fileURLToPath(
  new URL("../../data/third_party_license_supplements.yaml", import.meta.url)
);

/**
 * ライセンス一覧（Markdown）からHTMLを生成する。
 * @param {string} licensesMarkdown
 * @returns {string}
 */
export function renderLicenses(licensesMarkdown) {
  /** @type {Record<string, string>} */
  const supplements = parse(readFileSync(SUPPLEMENTS_PATH, "utf-8")) ?? {};
  return licensesMarkdown
    .split("\n## ")
    .slice(1)
    .map((section) => {
      const [titleLine, ...lines] = section.split("\n");
      const title = (titleLine ?? "").trim();
      const name = title.split(" - ")[0] ?? title;
      const body =
        lines.join("\n").replace(/^\n+/, "").trimEnd() ||
        (supplements[name] ?? "").trimEnd();
      if (!body) {
        throw new Error(
          `bundled-licenses: ${name} のライセンス本文が見つかりません。data/third_party_license_supplements.yaml に追記してください。`
        );
      }
      return (
        `<h3>${escapeHtml(title)}</h3>` +
        `<details><summary>ライセンス全文</summary><pre><code>${escapeHtml(body)}</code></pre></details>`
      );
    })
    .join("\n");
}

/**
 * {{< bundled-licenses >}} を目印の要素に置き換えるremarkプラグイン。
 * @returns {(tree: import("mdast").Root) => void}
 */
export function remarkBundledLicenses() {
  return (tree) => {
    visit(tree, "paragraph", (node, index, parent) => {
      if (!parent || index === undefined) {
        return;
      }
      if (node.children.length !== 1 || node.children[0].type !== "text") {
        return;
      }
      if (!SHORTCODE.test(node.children[0].value.trim())) {
        return;
      }
      parent.children[index] = { type: "html", value: PLACEHOLDER };
    });
  };
}

/**
 * ビルド完了後に、目印の要素をライセンス一覧に置き換えるAstroインテグレーション。
 * @returns {import("astro").AstroIntegration}
 */
export function bundledLicenses() {
  return {
    name: "bundled-licenses",
    hooks: {
      "astro:build:done": ({ dir, pages, logger }) => {
        const licensesHtml = renderLicenses(
          readFileSync(new URL(LICENSES_FILE_NAME, dir), "utf-8")
        );
        // 404.html・search.jsonなど、<パス>/index.html 以外の出力は対象外
        const files = pages
          .map(({ pathname }) => new URL(`${pathname}index.html`, dir))
          .filter((file) => existsSync(file));
        for (const file of files) {
          const html = readFileSync(file, "utf-8");
          if (html.includes(PLACEHOLDER)) {
            writeFileSync(file, html.replace(PLACEHOLDER, licensesHtml));
            logger.info(
              `${file.pathname.replace(dir.pathname, "/")} にライセンス一覧を出力しました`
            );
          }
        }
      }
    }
  };
}
