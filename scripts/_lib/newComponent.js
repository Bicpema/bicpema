// 新規コンポーネントのひな形生成に関する処理。
// 対話部分は scripts/new-component.js が担い、ここでは検証とファイル生成のみを行う。

import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

// 半角英小文字・数字をハイフンで区切った形式（先頭末尾・連続のハイフンは不可）
export const COMPONENT_NAME_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/** コンポーネントの種類。関数は状態を持たない描画、クラスは状態を持ち毎フレーム更新する部品 */
export const COMPONENT_KINDS = ["function", "class"];

/**
 * コンポーネント名を検証する。
 * @param {string} name
 * @param {string} rootDir リポジトリのルート
 * @returns {string | null} エラーメッセージ（問題なければnull）
 */
export function validateComponentName(name, rootDir) {
  if (!COMPONENT_NAME_PATTERN.test(name)) {
    return "半角英小文字・数字をハイフン（-）で区切った形式で入力してください（大文字・アンダースコア・先頭末尾や連続のハイフンは不可）。";
  }
  const existing = getComponentPaths(rootDir, name).find((path) =>
    existsSync(path)
  );
  if (existing) {
    return `「${name}」は既に存在します（${existing}）。別の名前を入力してください。`;
  }
  return null;
}

/**
 * コンポーネントの種類を検証する。
 * @param {string} kind
 * @returns {string | null} エラーメッセージ（問題なければnull）
 */
export function validateKind(kind) {
  return COMPONENT_KINDS.includes(kind)
    ? null
    : `種類は ${COMPONENT_KINDS.join(" または ")} を入力してください。`;
}

/**
 * コンポーネント・test・storyの生成先パスを返す。
 * @param {string} rootDir リポジトリのルート
 * @param {string} name ケバブケースのコンポーネント名
 * @returns {[string, string, string]} [コンポーネント, test, story]
 */
export function getComponentPaths(rootDir, name) {
  return [
    join(rootDir, "vite", "ts", "components", `${name}.ts`),
    join(rootDir, "test", "components", `${name}.test.js`),
    join(rootDir, "stories", `${name}.stories.js`)
  ];
}

/**
 * ケバブケースをパスカルケースに変換する。
 * @param {string} name
 * @returns {string}
 */
export function toPascalCase(name) {
  return name
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("");
}

/**
 * 関数形式のコンポーネントのソースを返す。
 * @param {string} name
 * @returns {string}
 */
function renderFunctionComponent(name) {
  const fn = `draw${toPascalCase(name)}`;
  return `import type p5 from "p5";

/** ${name}の見た目に関するオプション */
export interface ${toPascalCase(name)}Style {
  /** 線の太さ（既定: 2） */
  weight?: number;
}

/**
 * ${name}を描画する。
 * 描画後のstroke/strokeWeightは変更されたまま残る場合は、その旨をここに明記する。
 * @param p - p5インスタンス
 * @param x - 中心のX座標
 * @param y - 中心のY座標
 * @param col - 線の色
 * @param style - 見た目のオプション
 */
export function ${fn}(
  p: p5,
  x: number,
  y: number,
  col: p5.Color,
  { weight = 2 }: ${toPascalCase(name)}Style = {}
): void {
  p.stroke(col);
  p.strokeWeight(weight);
  p.line(x - 10, y, x + 10, y);
}
`;
}

/**
 * クラス形式のコンポーネントのソースを返す。
 * SimComponent（vite/ts/components/sim-component.ts）とは構造的に互換にし、
 * インターフェースの拡張に追従しやすいよう明示的なimplementsは付けない。
 * @param {string} name
 * @returns {string}
 */
function renderClassComponent(name) {
  const cls = toPascalCase(name);
  return `import type p5 from "p5";

/**
 * ${name}。状態の更新（update）と描画（draw）を分離する。
 * 一時停止中はupdate()を呼ばずdraw()のみを呼ぶ。
 * SimComponent（sim-component.ts）と同じ形のメソッドを持つ。
 */
export class ${cls} {
  /** 経過フレーム数 */
  private frame = 0;

  /**
   * @param x - 中心のX座標
   * @param y - 中心のY座標
   */
  constructor(
    private readonly x: number,
    private readonly y: number
  ) {}

  /** 1フレーム分の状態を更新する */
  update(): void {
    this.frame += 1;
  }

  /**
   * p5インスタンスに描画する。状態は変更しない。
   * @param p - p5インスタンス
   */
  draw(p: p5): void {
    p.line(this.x, this.y, this.x + this.frame, this.y);
  }
}
`;
}

/**
 * testのソースを返す。
 * @param {string} name
 * @param {string} kind
 * @returns {string}
 */
function renderTest(name, kind) {
  const cls = toPascalCase(name);
  if (kind === "class") {
    return `import { describe, it, expect, vi } from "vitest";
import { ${cls} } from "../../vite/ts/components/${name}.js";

/** @returns {any} p5インスタンスのモック */
function createMockP() {
  return {
    line: vi.fn()
  };
}

describe("${cls}", () => {
  it("draw()は状態を変更しない", () => {
    const p = createMockP();
    const component = new ${cls}(10, 20);
    component.update();
    component.draw(p);
    component.draw(p);
    expect(p.line.mock.calls[0]).toEqual(p.line.mock.calls[1]);
  });

  it("update()を呼ぶたびに描画結果が進む", () => {
    const p = createMockP();
    const component = new ${cls}(10, 20);
    component.update();
    component.draw(p);
    component.update();
    component.draw(p);
    expect(p.line.mock.calls).toEqual([
      [10, 20, 11, 20],
      [10, 20, 12, 20]
    ]);
  });
});
`;
  }
  return `import { describe, it, expect, vi } from "vitest";
import { draw${cls} } from "../../vite/ts/components/${name}.js";

/** @returns {any} p5インスタンスのモック */
function createMockP() {
  return {
    stroke: vi.fn(),
    strokeWeight: vi.fn(),
    line: vi.fn()
  };
}

describe("draw${cls}", () => {
  it("指定した色と既定の太さで描画する", () => {
    const p = createMockP();
    draw${cls}(p, 0, 0, /** @type {any} */ ("red"));
    expect(p.stroke).toHaveBeenCalledWith("red");
    expect(p.strokeWeight).toHaveBeenCalledWith(2);
    expect(p.line).toHaveBeenCalledTimes(1);
  });

  it("オプションで太さを変更できる", () => {
    const p = createMockP();
    draw${cls}(p, 0, 0, /** @type {any} */ ("red"), { weight: 5 });
    expect(p.strokeWeight).toHaveBeenCalledWith(5);
  });
});
`;
}

/**
 * storyのソースを返す。
 * @param {string} name
 * @param {string} title 日本語の表示名
 * @param {string} kind
 * @returns {string}
 */
function renderStory(name, title, kind) {
  const cls = toPascalCase(name);
  const isClass = kind === "class";
  const importName = isClass ? cls : `draw${cls}`;
  const setup = isClass
    ? `      const component = new ${cls}(p.width / 2 - 50, p.height / 2);
      p.setup = () => {
        p.createCanvas(400, 300);
      };
      p.draw = () => {
        p.background(255);
        p.stroke(p.color(100));
        p.strokeWeight(weight);
        component.update();
        component.draw(p);
      };`
    : `      p.setup = () => {
        p.createCanvas(400, 300);
      };
      p.draw = () => {
        p.background(255);
        const col = p.color(100);
        const style = { weight };
        draw${cls}(p, p.width / 2, p.height / 2, col, style);
      };`;
  return `import { ${importName} } from "../vite/ts/components/${name}.ts";
import { createP5Story } from "./p5-decorator.js";

export default {
  title: "描画部品/${title}",
  parameters: { layout: "centered" },
  argTypes: {
    weight: { control: { type: "range", min: 1, max: 10, step: 0.5 } }
  },
  args: { weight: 2 }
};

/** コントロールで見た目を変更できる${title}。 */
export const Default = {
  render: ({ weight }) =>
    createP5Story((p) => {
${setup}
    })
};
`;
}

/**
 * コンポーネント・test・storyのひな形を生成する。
 * @param {{ rootDir: string, name: string, title: string, kind: string }} options
 *   title: storyの表示名（日本語）。kind: "function" または "class"
 * @returns {string[]} 生成したファイルのパス
 */
export function createComponent({ rootDir, name, title, kind }) {
  const [componentPath, testPath, storyPath] = getComponentPaths(rootDir, name);
  const files = [
    [
      componentPath,
      kind === "class"
        ? renderClassComponent(name)
        : renderFunctionComponent(name)
    ],
    [testPath, renderTest(name, kind)],
    [storyPath, renderStory(name, title, kind)]
  ];
  for (const [path, content] of files) {
    mkdirSync(dirname(path), { recursive: true });
    writeFileSync(path, content);
  }
  return files.map(([path]) => path);
}
