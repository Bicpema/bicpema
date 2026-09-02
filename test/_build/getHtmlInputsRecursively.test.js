import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { describe, it, expect } from "vitest";
import { getHtmlInputsRecursively } from "../../vite/_build/getHtmlInputsRecursively.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const fixturesDir = resolve(__dirname, "fixtures");

describe("getHtmlInputsRecursively", () => {
  it("指定ディレクトリ以下の index.html を収集する", () => {
    const inputs = getHtmlInputsRecursively(fixturesDir);

    expect(inputs).toHaveProperty(
      "sim-a",
      resolve(fixturesDir, "sim-a/index.html")
    );
    expect(inputs).toHaveProperty(
      "sim-b",
      resolve(fixturesDir, "sim-b/index.html")
    );
  });

  it("index.html 以外は「親ディレクトリ名-ファイル名」をキーにする", () => {
    const inputs = getHtmlInputsRecursively(fixturesDir);

    expect(inputs).toHaveProperty(
      "sim-b-extra",
      resolve(fixturesDir, "sim-b/extra.html")
    );
  });

  it("ネストしたディレクトリも再帰的に収集する", () => {
    const inputs = getHtmlInputsRecursively(fixturesDir);

    expect(inputs).toHaveProperty(
      "nested",
      resolve(fixturesDir, "sim-b/nested/index.html")
    );
  });

  it("html以外のファイルは無視する", () => {
    const inputs = getHtmlInputsRecursively(fixturesDir);
    const paths = Object.values(inputs);

    expect(paths.some((path) => path.endsWith("not-html.txt"))).toBe(false);
    expect(Object.keys(inputs)).toHaveLength(4);
  });
});
