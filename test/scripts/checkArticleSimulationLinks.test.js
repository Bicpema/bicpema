import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { describe, it, expect } from "vitest";
import {
  checkArticleSimulationLinks,
  extractLinkedSimulationSlugs,
  getArticleEntries,
  getSimulationSlugs,
} from "../../scripts/_lib/checkArticleSimulationLinks.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const fixturesDir = resolve(__dirname, "fixtures");
const simulationsDir = resolve(fixturesDir, "simulations");
const postsDir = resolve(fixturesDir, "posts");

describe("getSimulationSlugs", () => {
  it("シミュレーションディレクトリ名の一覧を取得する", () => {
    expect(getSimulationSlugs(simulationsDir)).toEqual([
      "sim-a",
      "sim-b",
      "sim-c",
    ]);
  });
});

describe("getArticleEntries", () => {
  it("index.mdを持つディレクトリのみを記事として取得する", () => {
    const entries = getArticleEntries(postsDir);
    const articleDirs = entries.map((entry) => entry.articleDir).sort();

    expect(articleDirs).toEqual(["記事あ", "記事い"]);
  });
});

describe("extractLinkedSimulationSlugs", () => {
  it("本文中の/vite/simulations/<slug>/リンクを抽出する", () => {
    const content = "[開く](/vite/simulations/sim-a/) と [これも](/vite/simulations/sim-a/)";

    expect(extractLinkedSimulationSlugs(content)).toEqual(["sim-a"]);
  });

  it("リンクが存在しない場合は空配列を返す", () => {
    expect(extractLinkedSimulationSlugs("本文のみ")).toEqual([]);
  });
});

describe("checkArticleSimulationLinks", () => {
  it("実在しないシミュレーションへのリンクをbrokenLinksとして検出する", () => {
    const result = checkArticleSimulationLinks({ simulationsDir, postsDir });

    expect(result.brokenLinks).toEqual([
      { articleDir: "記事い", slug: "sim-x" },
    ]);
  });

  it("記事からリンクされていないシミュレーションをmissingArticleSlugsとして検出する", () => {
    const result = checkArticleSimulationLinks({ simulationsDir, postsDir });

    expect(result.missingArticleSlugs).toEqual(["sim-c"]);
  });

  it("許容リストに含まれるslugはmissingArticleSlugsから除外される", () => {
    const result = checkArticleSimulationLinks({
      simulationsDir,
      postsDir,
      allowedArticlelessSlugs: ["sim-c"],
    });

    expect(result.missingArticleSlugs).toEqual([]);
    expect(result.staleAllowlistSlugs).toEqual([]);
  });

  it("既にリンクされている、または実在しないslugが許容リストにある場合はstaleAllowlistSlugsとして検出する", () => {
    const result = checkArticleSimulationLinks({
      simulationsDir,
      postsDir,
      allowedArticlelessSlugs: ["sim-a", "sim-does-not-exist"],
    });

    expect(result.staleAllowlistSlugs.sort()).toEqual([
      "sim-a",
      "sim-does-not-exist",
    ]);
  });
});
