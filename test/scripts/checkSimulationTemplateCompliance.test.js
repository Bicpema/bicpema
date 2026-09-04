import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { describe, it, expect } from "vitest";
import {
  checkSimulationTemplateCompliance,
  findSimulationTemplateIssues,
  getSimulationSlugs,
} from "../../scripts/_lib/checkSimulationTemplateCompliance.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const simulationsDir = resolve(
  __dirname,
  "fixtures",
  "template-compliance",
  "simulations"
);

describe("getSimulationSlugs", () => {
  it("シミュレーションディレクトリ名の一覧を取得する", () => {
    expect(getSimulationSlugs(simulationsDir)).toEqual([
      "compliant-sim",
      "local-controller-copy",
      "missing-p5-canvas",
    ]);
  });
});

describe("findSimulationTemplateIssues", () => {
  it("テンプレートに準拠している場合は空配列を返す", () => {
    expect(
      findSimulationTemplateIssues(resolve(simulationsDir, "compliant-sim"))
    ).toEqual([]);
  });

  it('id="p5Canvas"を持たない場合はmissing-p5-canvasを検出する', () => {
    expect(
      findSimulationTemplateIssues(resolve(simulationsDir, "missing-p5-canvas"))
    ).toEqual(["missing-p5-canvas"]);
  });

  it("BicpemaCanvasControllerを複製している場合はnon-canonical-canvas-controllerを検出する", () => {
    expect(
      findSimulationTemplateIssues(
        resolve(simulationsDir, "local-controller-copy")
      )
    ).toEqual(["non-canonical-canvas-controller"]);
  });
});

describe("checkSimulationTemplateCompliance", () => {
  it("許容リストがない場合、非準拠のシミュレーションをすべてviolationsとして検出する", () => {
    const result = checkSimulationTemplateCompliance({ simulationsDir });

    expect(result.violations).toEqual([
      {
        slug: "local-controller-copy",
        issues: ["non-canonical-canvas-controller"],
      },
      { slug: "missing-p5-canvas", issues: ["missing-p5-canvas"] },
    ]);
    expect(result.staleAllowlistSlugs).toEqual([]);
  });

  it("許容リストに含まれるslugはviolationsから除外される", () => {
    const result = checkSimulationTemplateCompliance({
      simulationsDir,
      allowedNonCompliantSlugs: ["missing-p5-canvas"],
    });

    expect(result.violations).toEqual([
      {
        slug: "local-controller-copy",
        issues: ["non-canonical-canvas-controller"],
      },
    ]);
    expect(result.staleAllowlistSlugs).toEqual([]);
  });

  it("既に準拠している、または実在しないslugが許容リストにある場合はstaleAllowlistSlugsとして検出する", () => {
    const result = checkSimulationTemplateCompliance({
      simulationsDir,
      allowedNonCompliantSlugs: ["compliant-sim", "sim-does-not-exist"],
    });

    expect(result.staleAllowlistSlugs.sort()).toEqual([
      "compliant-sim",
      "sim-does-not-exist",
    ]);
  });
});
