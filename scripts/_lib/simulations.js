import { readdirSync } from "node:fs";

/**
 * src/simulations/ 配下のシミュレーションslug（フォルダー名）一覧を取得する。
 * `_` で始まるフォルダー（ひな形の _template/ など）はシミュレーションとして扱わない。
 * @param {string} simulationsDir
 * @returns {string[]}
 */
export function getSimulationSlugs(simulationsDir) {
  return readdirSync(simulationsDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && !entry.name.startsWith("_"))
    .map((entry) => entry.name)
    .toSorted();
}
