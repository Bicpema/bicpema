import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const indexTs = readFileSync(
  resolve("vite/_templates/simulation/ts/index.ts"),
  "utf-8"
);

describe("シミュレーションのひな形（ts/index.ts）", () => {
  it.each([
    "../../../ts/components/arrow.js",
    "../../../ts/components/dashed-line.js",
    "../../../ts/components/component-group.js"
  ])("共通コンポーネント（%s）をimportしている", (path) => {
    expect(indexTs).toContain(`from "${path}"`);
  });

  it("矢印と点線の使用例を含む", () => {
    expect(indexTs).toContain("new Arrow(");
    expect(indexTs).toContain("drawDashedLine(");
    expect(indexTs).toContain("drawArrowWithLabel(");
    expect(indexTs).toContain("new ComponentGroup(");
  });
});
