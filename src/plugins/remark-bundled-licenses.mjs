// {{< bundled-licenses >}} を、Viteのビルド時に生成されるライセンス一覧（vite.config.js の build.license）の
// 依存パッケージごとのライセンス本文に置き換えるremarkプラグイン。
// Astroのビルド前に `npm run build:simulations` を実行しておく必要がある。
// ライセンス本文が取得できないパッケージは data/third_party_license_supplements.yaml の内容で補う。
import { existsSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { visit } from "unist-util-visit";
import { parse } from "yaml";
import { escapeHtml } from "./escapeHtml.mjs";

const SHORTCODE = /^\{\{<\s*bundled-licenses\s*>\}\}$/;
const LICENSES_PATH = fileURLToPath(
  new URL("../../public/vite/third-party-licenses.md", import.meta.url)
);
const SUPPLEMENTS_PATH = fileURLToPath(
  new URL("../../data/third_party_license_supplements.yaml", import.meta.url)
);

/**
 * ライセンス一覧のHTMLを生成する。
 * @param {import("vfile").VFile} file
 * @returns {string}
 */
function renderLicenses(file) {
  if (!existsSync(LICENSES_PATH)) {
    file.message(
      "bundled-licenses: public/vite/third-party-licenses.md が見つかりません。先に npm run build:simulations を実行してください。"
    );
    return "<p>ライセンス一覧はビルド時に生成されます。</p>";
  }
  /** @type {Record<string, string>} */
  const supplements = parse(readFileSync(SUPPLEMENTS_PATH, "utf-8")) ?? {};
  return readFileSync(LICENSES_PATH, "utf-8")
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
        file.fail(
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

/** @returns {(tree: import("mdast").Root, file: import("vfile").VFile) => void} */
export function remarkBundledLicenses() {
  return (tree, file) => {
    visit(tree, "paragraph", (node, index, parent) => {
      if (!parent || index === undefined) return;
      if (node.children.length !== 1 || node.children[0].type !== "text") {
        return;
      }
      if (!SHORTCODE.test(node.children[0].value.trim())) return;
      parent.children[index] = { type: "html", value: renderLicenses(file) };
    });
  };
}
