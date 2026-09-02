import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

// content/post/*/index.md 内の "/vite/simulations/<slug>/" 形式のリンクから
// slugを抽出する。記事ディレクトリ名は日本語、slugは英語のことが多く両者を
// 直接対応付けられないため、ディレクトリ名ではなく記事本文中のリンクを
// 手がかりにシミュレーションとの対応を判定する。
const SIMULATION_LINK_PATTERN = /\/vite\/simulations\/([A-Za-z0-9_-]+)\/?/g;

/**
 * vite/simulations/ 配下のシミュレーションslug一覧を取得する。
 * @param {string} simulationsDir
 * @returns {string[]}
 */
export function getSimulationSlugs(simulationsDir) {
  return readdirSync(simulationsDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();
}

/**
 * content/post/ 配下の記事（index.mdを持つディレクトリ）一覧を取得する。
 * @param {string} postsDir
 * @returns {{ articleDir: string, content: string }[]}
 */
export function getArticleEntries(postsDir) {
  return readdirSync(postsDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .flatMap((entry) => {
      const indexPath = join(postsDir, entry.name, "index.md");
      try {
        return [
          { articleDir: entry.name, content: readFileSync(indexPath, "utf-8") },
        ];
      } catch {
        // index.mdが存在しないディレクトリは記事として扱わない
        return [];
      }
    });
}

/**
 * 記事本文から "/vite/simulations/<slug>/" 形式のリンクslugを抽出する。
 * @param {string} markdownContent
 * @returns {string[]}
 */
export function extractLinkedSimulationSlugs(markdownContent) {
  const slugs = new Set();
  for (const match of markdownContent.matchAll(SIMULATION_LINK_PATTERN)) {
    slugs.add(match[1]);
  }
  return [...slugs];
}

/**
 * 記事とシミュレーションのリンク整合性を検査する。
 * @param {object} options
 * @param {string} options.simulationsDir
 * @param {string} options.postsDir
 * @param {string[]} [options.allowedArticlelessSlugs] 記事がなくても許容するslug
 * @returns {{
 *   missingArticleSlugs: string[],
 *   brokenLinks: { articleDir: string, slug: string }[],
 *   staleAllowlistSlugs: string[],
 * }}
 */
export function checkArticleSimulationLinks({
  simulationsDir,
  postsDir,
  allowedArticlelessSlugs = [],
}) {
  const simulationSlugs = new Set(getSimulationSlugs(simulationsDir));
  const articles = getArticleEntries(postsDir);

  const linkedSlugCounts = new Map();
  const brokenLinks = [];

  for (const article of articles) {
    for (const slug of extractLinkedSimulationSlugs(article.content)) {
      if (simulationSlugs.has(slug)) {
        linkedSlugCounts.set(slug, (linkedSlugCounts.get(slug) ?? 0) + 1);
      } else {
        brokenLinks.push({ articleDir: article.articleDir, slug });
      }
    }
  }

  const allowedSet = new Set(allowedArticlelessSlugs);
  const missingArticleSlugs = [...simulationSlugs]
    .filter((slug) => !linkedSlugCounts.has(slug) && !allowedSet.has(slug))
    .sort();

  // 許容リストに載っているのに、実在しない/既に記事からリンクされているslugは
  // 許容リストの記載漏れ・掃除忘れとして検出する。
  const staleAllowlistSlugs = allowedArticlelessSlugs.filter(
    (slug) => !simulationSlugs.has(slug) || linkedSlugCounts.has(slug)
  );

  return { missingArticleSlugs, brokenLinks, staleAllowlistSlugs };
}
