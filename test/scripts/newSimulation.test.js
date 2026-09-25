import {
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
  createSimulation,
  renderTemplate,
  validateDirName,
  validateTitle
} from "../../scripts/_lib/newSimulation.js";

/** @type {string} */
let workDir;
/** @type {string} */
let templateDir;
/** @type {string} */
let simulationsDir;

beforeEach(() => {
  workDir = mkdtempSync(join(tmpdir(), "new-simulation-"));
  templateDir = join(workDir, "templates");
  simulationsDir = join(workDir, "simulations");
  mkdirSync(join(templateDir, "js"), { recursive: true });
  mkdirSync(join(simulationsDir, "doppler"), { recursive: true });
  writeFileSync(
    join(templateDir, "index.html"),
    '<title>{% title %}</title><span>{% title %}</span><a href="{% path %}"></a>'
  );
  writeFileSync(join(templateDir, "js", "main.js"), "// main");
});

afterEach(() => {
  rmSync(workDir, { recursive: true, force: true });
});

describe("validateTitle", () => {
  it("空文字・空白のみはエラーになる", () => {
    expect(validateTitle("")).not.toBeNull();
    expect(validateTitle("  ")).not.toBeNull();
  });

  it("入力があれば問題なし", () => {
    expect(validateTitle("ドップラー効果")).toBeNull();
  });
});

describe("validateDirName", () => {
  it.each(["projectile-motion", "3d-strata", "lens"])(
    "命名規則に沿った名前（%s）は問題なし",
    (name) => {
      expect(validateDirName(name, simulationsDir)).toBeNull();
    }
  );

  it.each([
    "",
    "Doppler",
    "free_fall",
    "-lens",
    "lens-",
    "wave--machine",
    "波"
  ])("命名規則に反する名前（%s）はエラーになる", (name) => {
    expect(validateDirName(name, simulationsDir)).toMatch(/半角英小文字/);
  });

  it("既存フォルダーと重複する名前はエラーになる", () => {
    expect(validateDirName("doppler", simulationsDir)).toMatch(/既に存在/);
  });
});

describe("renderTemplate", () => {
  it("同じプレースホルダーをすべて置換する", () => {
    expect(renderTemplate("{% a %}-{% a %}-{% b %}", { a: "x", b: "y" })).toBe(
      "x-x-y"
    );
  });
});

describe("createSimulation", () => {
  it("テンプレートをコピーしてプレースホルダーを置換する", () => {
    const destDir = createSimulation({
      templateDir,
      simulationsDir,
      title: "レンズ",
      dirName: "lens"
    });

    expect(readFileSync(join(destDir, "index.html"), "utf-8")).toBe(
      '<title>レンズ</title><span>レンズ</span><a href="/simulations/lens"></a>'
    );
    expect(readFileSync(join(destDir, "js", "main.js"), "utf-8")).toBe(
      "// main"
    );
  });

  it("既存フォルダーには上書きしない", () => {
    expect(() =>
      createSimulation({
        templateDir,
        simulationsDir,
        title: "ドップラー効果",
        dirName: "doppler"
      })
    ).toThrow(/既に存在/);
  });
});
