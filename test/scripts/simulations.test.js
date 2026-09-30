import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { describe, it, expect } from "vitest";
import { getSimulationSlugs } from "../../scripts/_lib/simulations.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const simulationsDir = resolve(__dirname, "fixtures", "simulations");

describe("getSimulationSlugs", () => {
  it("シミュレーションディレクトリ名の一覧を昇順で取得する", () => {
    expect(getSimulationSlugs(simulationsDir)).toEqual([
      "sim-a",
      "sim-b",
      "sim-c"
    ]);
  });

  it("`_` で始まるフォルダー（ひな形）は含めない", () => {
    expect(getSimulationSlugs(simulationsDir)).not.toContain("_template");
  });
});
