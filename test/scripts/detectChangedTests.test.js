import { describe, it, expect } from "vitest";
import { classifyChangedFiles } from "../../scripts/_lib/detectChangedTests.js";

describe("classifyChangedFiles", () => {
  it("シミュレーション配下の変更は、そのシミュレーションのみを対象にする", () => {
    expect(
      classifyChangedFiles([
        "vite/simulations/doppler/main.js",
        "test/simulations/free-fall/physics.test.js",
        "test/e2e/spring.spec.js"
      ])
    ).toEqual({
      scope: "simulations",
      simulations: ["doppler", "free-fall", "spring"]
    });
  });

  it.each([
    "vite/ts/common.ts",
    "vite/css/common.css",
    "vite/_build/plugin.js",
    "test/e2e/helpers/util.js",
    "package.json",
    "package-lock.json",
    "playwright.config.js",
    "vite.config.js",
    ".github/workflows/e2e-test.yml"
  ])("共通コード・設定の変更（%s）は全テストを対象にする", (file) => {
    expect(
      classifyChangedFiles(["vite/simulations/doppler/main.js", file])
    ).toEqual({ scope: "all", simulations: [] });
  });

  it("テストに関係しない変更のみの場合は実行不要と判定する", () => {
    expect(
      classifyChangedFiles(["content/articles/doppler.md", "README.md"])
    ).toEqual({
      scope: "none",
      simulations: []
    });
  });

  it("変更がない場合は実行不要と判定する", () => {
    expect(classifyChangedFiles([])).toEqual({
      scope: "none",
      simulations: []
    });
  });
});
