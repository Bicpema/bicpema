// 変更されたファイルの一覧から、PRで実行すべきテストの範囲を判定する。

const SIMULATION_SOURCE = /^vite\/simulations\/([^/]+)\//;
const SIMULATION_UNIT_TEST = /^test\/simulations\/([^/]+)\//;
const SIMULATION_E2E_TEST = /^test\/e2e\/([^/]+)\.spec\.js$/;

// 変更されると全シミュレーションに影響しうるファイル（共通コード・設定・依存・CI）
const COMMON_PATTERNS = [
  /^vite\//,
  /^test\/_build\//,
  /^test\/scripts\//,
  /^test\/e2e\//,
  /^scripts\//,
  /^vite\.config\.js$/,
  /^playwright\.config\.js$/,
  /^package(-lock)?\.json$/,
  /^\.nvmrc$/,
  /^\.github\/workflows\/(unit|e2e)-test\.yml$/
];

/**
 * @param {string} file
 * @returns {string | null} シミュレーション固有のファイルならシミュレーション名
 */
function getSimulationName(file) {
  for (const pattern of [
    SIMULATION_SOURCE,
    SIMULATION_UNIT_TEST,
    SIMULATION_E2E_TEST
  ]) {
    const match = file.match(pattern);
    if (match) return match[1];
  }
  return null;
}

/**
 * @param {string[]} files 変更されたファイルのリポジトリルートからの相対パス
 * @returns {{ scope: "all" | "simulations" | "none", simulations: string[] }}
 *   - all: 共通コード・設定の変更があるため全テストを実行する
 *   - simulations: simulationsに挙げたシミュレーションのテストのみ実行する
 *   - none: テストに関係する変更がない
 */
export function classifyChangedFiles(files) {
  const simulations = new Set();
  for (const file of files) {
    const name = getSimulationName(file);
    if (name) {
      simulations.add(name);
    } else if (COMMON_PATTERNS.some((pattern) => pattern.test(file))) {
      return { scope: "all", simulations: [] };
    }
  }
  return {
    scope: simulations.size > 0 ? "simulations" : "none",
    simulations: [...simulations].sort()
  };
}
