import { mkdirSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
  createComponent,
  getComponentPaths,
  toPascalCase,
  validateComponentName,
  validateKind
} from "../../scripts/_lib/newComponent.js";

/** @type {string} */
let rootDir;

beforeEach(() => {
  rootDir = mkdtempSync(join(tmpdir(), "new-component-"));
  mkdirSync(join(rootDir, "vite", "ts", "components"), { recursive: true });
});

afterEach(() => {
  rmSync(rootDir, { recursive: true, force: true });
});

describe("toPascalCase", () => {
  it("ケバブケースをパスカルケースに変換する", () => {
    expect(toPascalCase("grid-lines")).toBe("GridLines");
    expect(toPascalCase("arrow")).toBe("Arrow");
  });
});

describe("validateComponentName", () => {
  it.each(["grid-lines", "arrow", "axes2d"])(
    "命名規則に沿った名前（%s）は問題なし",
    (name) => {
      expect(validateComponentName(name, rootDir)).toBeNull();
    }
  );

  it.each(["", "GridLines", "grid_lines", "-grid", "grid-", "a--b", "矢印"])(
    "命名規則に反する名前（%s）はエラーになる",
    (name) => {
      expect(validateComponentName(name, rootDir)).toMatch(/半角英小文字/);
    }
  );

  it("既存のコンポーネントと重複する名前はエラーになる", () => {
    createComponent({
      rootDir,
      name: "grid",
      title: "グリッド",
      kind: "class"
    });
    expect(validateComponentName("grid", rootDir)).toMatch(/既に存在/);
  });
});

describe("validateKind", () => {
  it("function / class は問題なし", () => {
    expect(validateKind("function")).toBeNull();
    expect(validateKind("class")).toBeNull();
  });

  it("それ以外はエラーになる", () => {
    expect(validateKind("")).not.toBeNull();
    expect(validateKind("object")).not.toBeNull();
  });
});

describe("createComponent", () => {
  it("function: 描画関数・test・storyを生成する", () => {
    const created = createComponent({
      rootDir,
      name: "grid-lines",
      title: "グリッド線",
      kind: "function"
    });
    expect(created).toEqual(getComponentPaths(rootDir, "grid-lines"));

    const [component, test, story] = created.map((path) =>
      readFileSync(path, "utf-8")
    );
    expect(component).toContain("export function drawGridLines(");
    expect(test).toContain('from "../../vite/ts/components/grid-lines.js"');
    expect(story).toContain('title: "描画部品/グリッド線"');
    expect(story).toContain("drawGridLines(");
  });

  it("class: update/drawを持つクラス・test・storyを生成する", () => {
    const [component, test, story] = createComponent({
      rootDir,
      name: "grid-lines",
      title: "グリッド線",
      kind: "class"
    }).map((path) => readFileSync(path, "utf-8"));
    expect(component).toContain("export class GridLines");
    expect(component).toContain("update(): void");
    expect(component).toContain("draw(p: p5): void");
    expect(test).toContain("new GridLines(");
    expect(story).toContain("component.update();");
  });
});
