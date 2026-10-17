import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { describe, it, expect } from "vitest";
import {
  checkDuplicateComponents,
  collectDuplicateEntries,
  findDuplicateDefinitions
} from "../../scripts/_lib/checkDuplicateComponents.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const simulationsDir = resolve(
  __dirname,
  "fixtures",
  "duplicate-components",
  "simulations"
);

describe("findDuplicateDefinitions", () => {
  it("関数宣言と変数への代入を検出する", () => {
    expect(
      findDuplicateDefinitions(
        "function drawArrow(p) {}\nexport const drawDashed = () => {};"
      )
    ).toEqual(["drawArrow", "drawDashed"]);
  });

  it("呼び出しやimportは検出しない", () => {
    expect(
      findDuplicateDefinitions(
        'import { drawArrow } from "x";\ndrawArrow(p, 0, 0, 1, 1);'
      )
    ).toEqual([]);
  });

  it("名前が異なる関数は検出しない", () => {
    expect(findDuplicateDefinitions("function drawArrows(p) {}")).toEqual([]);
  });
});

describe("collectDuplicateEntries", () => {
  it("slug:関数名の一覧を返す", () => {
    expect(collectDuplicateEntries(simulationsDir)).toEqual([
      "dup-sim:drawArrow",
      "dup-sim:drawDashedLine"
    ]);
  });
});

describe("checkDuplicateComponents", () => {
  it("許可リストにない重複を違反として返す", () => {
    const result = checkDuplicateComponents({
      simulationsDir,
      allowlist: ["dup-sim:drawArrow"]
    });
    expect(result.violations).toEqual(["dup-sim:drawDashedLine"]);
    expect(result.staleAllowlist).toEqual([]);
  });

  it("解消済みの許可リストエントリを検出する", () => {
    const result = checkDuplicateComponents({
      simulationsDir,
      allowlist: [
        "dup-sim:drawArrow",
        "dup-sim:drawDashedLine",
        "clean-sim:drawArrow"
      ]
    });
    expect(result.violations).toEqual([]);
    expect(result.staleAllowlist).toEqual(["clean-sim:drawArrow"]);
  });
});
