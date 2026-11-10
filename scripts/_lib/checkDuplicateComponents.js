import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

// 共通コンポーネント（vite/ts/components/）と同種の関数名。
// シミュレーション内でこれらの名前の関数を独自に定義していれば重複とみなす。
export const COMPONENT_FUNCTION_NAMES = [
  "drawArrow",
  "drawArrowWithLabel",
  "drawDashed",
  "drawDashedLine",
  "drawGrid",
  "drawAxes",
  "drawGraph",
  "drawPlotArea",
  "drawPolyline"
];

const SOURCE_EXTENSIONS = [".ts", ".js"];

/** 関数宣言（function name）と変数への代入（const name = ）を検出する正規表現を作る。 */
/** @param {string} name */
function buildDefinitionPattern(name) {
  return new RegExp(
    `(?:\\bfunction\\s*\\*?\\s+${name}\\s*[(<])|(?:\\b(?:const|let|var)\\s+${name}\\s*(?::[^=]+)?=)`
  );
}

const DEFINITION_PATTERNS = COMPONENT_FUNCTION_NAMES.map((name) => ({
  name,
  pattern: buildDefinitionPattern(name)
}));

/** ソース中で独自定義されている共通コンポーネント同種の関数名を返す。 */
/** @param {string} source */
export function findDuplicateDefinitions(source) {
  return DEFINITION_PATTERNS.filter(({ pattern }) => pattern.test(source)).map(
    ({ name }) => name
  );
}

/**
 * @param {string} dir
 * @returns {string[]}
 */
function listSourceFiles(dir) {
  const files = [];
  for (const entry of readdirSync(dir)) {
    const fullPath = join(dir, entry);
    if (entry === "node_modules") {
      // 依存パッケージは対象外
    } else if (statSync(fullPath).isDirectory()) {
      files.push(...listSourceFiles(fullPath));
    } else if (SOURCE_EXTENSIONS.some((ext) => entry.endsWith(ext))) {
      files.push(fullPath);
    }
  }
  return files;
}

/**
 * 各シミュレーションの重複定義を "slug:関数名" の一覧（ソート済み・重複なし）で返す。
 */
/** @param {string} simulationsDir */
export function collectDuplicateEntries(simulationsDir) {
  const entries = new Set();
  for (const slug of readdirSync(simulationsDir)) {
    const slugDir = join(simulationsDir, slug);
    const isSimulation =
      !slug.startsWith("_") && statSync(slugDir).isDirectory();
    for (const file of isSimulation ? listSourceFiles(slugDir) : []) {
      const source = readFileSync(file, "utf8");
      for (const name of findDuplicateDefinitions(source)) {
        entries.add(`${slug}:${name}`);
      }
    }
  }
  return [...entries].sort();
}

/**
 * @param {{ simulationsDir: string, allowlist: string[] }} options
 * @returns {{ violations: string[], staleAllowlist: string[] }}
 */
export function checkDuplicateComponents({ simulationsDir, allowlist }) {
  if (!existsSync(simulationsDir)) {
    throw new Error(
      `simulationsDir not found: ${relative(".", simulationsDir)}`
    );
  }
  const found = collectDuplicateEntries(simulationsDir);
  const allowed = new Set(allowlist);
  const foundSet = new Set(found);
  return {
    violations: found.filter((entry) => !allowed.has(entry)),
    staleAllowlist: [...allowed].filter((entry) => !foundSet.has(entry)).sort()
  };
}
