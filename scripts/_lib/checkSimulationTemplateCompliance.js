import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

// templates/ をコピーして作られるシミュレーション（vite/simulations/<slug>/）が
// テンプレートの必須構成から外れていないかを検査する。
//
// 検査項目:
// - エントリーポイント（js/index.js または js/index.ts）が存在し、
//   index.htmlから<script type="module">で読み込まれているか
// - id="navBar" / id="p5Container" / id="p5Canvas" を持つ要素があるか
// - BicpemaCanvasControllerを利用している場合、シミュレーション固有の
//   複製ファイルではなく共通の vite/js/bicpema-canvas-controller.js を
//   参照しているか（#79の再発防止）
const CANVAS_CONTROLLER_IMPORT_PATTERN =
  /from\s+(["'])([^"']*bicpema-canvas-controller\.js)\1/;
const CANONICAL_CANVAS_CONTROLLER_IMPORT_PATH =
  "../../../js/bicpema-canvas-controller.js";
const ENTRY_SCRIPT_CANDIDATES = ["js/index.ts", "js/index.js"];
const JS_FILE_EXTENSIONS = [".js", ".ts"];

/**
 * vite/simulations/ 配下のシミュレーションslug一覧を取得する。
 * @param {string} simulationsDir
 * @returns {string[]}
 */
export function getSimulationSlugs(simulationsDir) {
  return readdirSync(simulationsDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();
}

/**
 * ディレクトリ配下のjs/tsファイルを再帰的に列挙する。
 * @param {string} dir
 * @returns {string[]} 絶対パスの一覧
 */
function listJsFilesRecursively(dir) {
  if (!existsSync(dir)) return [];

  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = join(dir, entry.name);
    if (entry.isDirectory()) return listJsFilesRecursively(entryPath);
    if (JS_FILE_EXTENSIONS.some((ext) => entry.name.endsWith(ext))) {
      return [entryPath];
    }
    return [];
  });
}

/**
 * 1件のシミュレーションを検査し、テンプレートからの逸脱を返す。
 * @param {string} simulationDir
 * @returns {string[]} 検出した問題のコード一覧（問題がなければ空配列）
 */
export function findSimulationTemplateIssues(simulationDir) {
  const issues = [];
  const indexHtmlPath = join(simulationDir, "index.html");

  if (!existsSync(indexHtmlPath)) {
    return ["missing-index-html"];
  }

  const html = readFileSync(indexHtmlPath, "utf-8");

  const entryScriptRelPath = ENTRY_SCRIPT_CANDIDATES.find((candidate) =>
    existsSync(join(simulationDir, candidate))
  );
  if (!entryScriptRelPath) {
    issues.push("missing-entry-script");
  } else {
    const scriptTags = html.match(/<script[^>]*>/g) ?? [];
    const isLoadedAsModule = scriptTags.some(
      (tag) =>
        tag.includes('type="module"') &&
        tag.includes(`src="./${entryScriptRelPath}"`)
    );
    if (!isLoadedAsModule) {
      issues.push("entry-script-not-loaded-as-module");
    }
  }

  if (!/id="navBar"/.test(html)) issues.push("missing-nav-bar");
  if (!/id="p5Container"/.test(html)) issues.push("missing-p5-container");
  if (!/id="p5Canvas"/.test(html)) issues.push("missing-p5-canvas");

  const jsFiles = listJsFilesRecursively(simulationDir);
  const fileContents = new Map(
    jsFiles.map((file) => [file, readFileSync(file, "utf-8")])
  );
  const usesCanvasController = [...fileContents.values()].some((content) =>
    content.includes("BicpemaCanvasController")
  );
  if (usesCanvasController) {
    const hasLocalCopy = jsFiles.some((file) =>
      file.endsWith("bicpema-canvas-controller.js")
    );
    const hasNonCanonicalImport = [...fileContents.values()].some((content) => {
      const match = content.match(CANVAS_CONTROLLER_IMPORT_PATTERN);
      return (
        match !== null && match[2] !== CANONICAL_CANVAS_CONTROLLER_IMPORT_PATH
      );
    });
    if (hasLocalCopy || hasNonCanonicalImport) {
      issues.push("non-canonical-canvas-controller");
    }
  }

  return issues;
}

/**
 * vite/simulations/ 配下全体のテンプレート準拠チェックを行う。
 * @param {object} options
 * @param {string} options.simulationsDir
 * @param {string[]} [options.allowedNonCompliantSlugs] 既知の非準拠として許容するslug
 * @returns {{
 *   violations: { slug: string, issues: string[] }[],
 *   staleAllowlistSlugs: string[],
 * }}
 */
export function checkSimulationTemplateCompliance({
  simulationsDir,
  allowedNonCompliantSlugs = [],
}) {
  const slugs = getSimulationSlugs(simulationsDir);
  const allowedSet = new Set(allowedNonCompliantSlugs);

  const allIssuesBySlug = new Map();
  for (const slug of slugs) {
    const issues = findSimulationTemplateIssues(join(simulationsDir, slug));
    if (issues.length > 0) {
      allIssuesBySlug.set(slug, issues);
    }
  }

  const violations = [...allIssuesBySlug.entries()]
    .filter(([slug]) => !allowedSet.has(slug))
    .map(([slug, issues]) => ({ slug, issues }))
    .sort((a, b) => a.slug.localeCompare(b.slug));

  // 許容リストに載っているのに、実在しない/既に問題が解消されているslugは
  // 許容リストの記載漏れ・掃除忘れとして検出する。
  const slugSet = new Set(slugs);
  const staleAllowlistSlugs = allowedNonCompliantSlugs.filter(
    (slug) => !slugSet.has(slug) || !allIssuesBySlug.has(slug)
  );

  return { violations, staleAllowlistSlugs };
}
