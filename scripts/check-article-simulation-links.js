// content/post/ 配下の記事と vite/simulations/ 配下のシミュレーションの
// 対応関係を検査する。
//
// - 記事内の "/vite/simulations/<slug>/" リンクが実在するシミュレーションを
//   指しているか（タイポやリネーム漏れの検出）
// - 各シミュレーションに対応する記事が存在するか
//   （意図的に記事なしとするものは articleless-simulation-allowlist.js に明示する）
//
// 使い方:
//   npm run check:article-links

import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { checkArticleSimulationLinks } from "./_lib/checkArticleSimulationLinks.js";
import { ARTICLELESS_SIMULATION_ALLOWLIST } from "./articleless-simulation-allowlist.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(__dirname, "..");

const result = checkArticleSimulationLinks({
  simulationsDir: resolve(rootDir, "vite", "simulations"),
  postsDir: resolve(rootDir, "content", "post"),
  allowedArticlelessSlugs: ARTICLELESS_SIMULATION_ALLOWLIST,
});

let hasError = false;

if (result.brokenLinks.length > 0) {
  hasError = true;
  console.error(
    "記事内に、存在しないシミュレーションへのリンクがあります（タイポやリネーム漏れの可能性があります）:"
  );
  for (const { articleDir, slug } of result.brokenLinks) {
    console.error(
      `  content/post/${articleDir}/index.md -> /vite/simulations/${slug}/`
    );
  }
}

if (result.missingArticleSlugs.length > 0) {
  hasError = true;
  console.error(
    "対応する記事が見つからないシミュレーションがあります（意図的な場合は scripts/articleless-simulation-allowlist.js に追加してください）:"
  );
  for (const slug of result.missingArticleSlugs) {
    console.error(`  vite/simulations/${slug}`);
  }
}

if (result.staleAllowlistSlugs.length > 0) {
  hasError = true;
  console.error(
    "scripts/articleless-simulation-allowlist.js に不要なエントリがあります（シミュレーションが存在しないか、既に記事からリンクされています）:"
  );
  for (const slug of result.staleAllowlistSlugs) {
    console.error(`  ${slug}`);
  }
}

if (hasError) {
  process.exit(1);
}

console.log(
  "記事とシミュレーションのリンク整合性チェックに問題は見つかりませんでした。"
);
