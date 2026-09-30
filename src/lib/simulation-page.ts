// シミュレーションページ（src/pages/vite/simulations/）の生成時に使う処理。
// ビルド時（Node.js上）でのみ実行し、ブラウザーには読み込まれない。
import { getCollection } from "astro:content";
import { extractLinkedSimulationSlugs } from "../../scripts/_lib/checkArticleSimulationLinks.js";

export const TOP_PAGE_PATH = "/";

let simulationArticleIds: Promise<Map<string, string>> | undefined;

/**
 * シミュレーションのフォルダー名から、そのシミュレーションへリンクしている記事のidへの対応表を作る。
 * 複数の記事からリンクされている場合は、idの昇順で最初の記事を採用する。
 * @param posts - 記事のidと本文の一覧
 * @returns シミュレーションのフォルダー名から記事のidへの対応表
 */
export function findSimulationArticleIds(
  posts: readonly { id: string; body?: string }[]
) {
  const ids = new Map<string, string>();
  for (const post of posts.toSorted((a, b) => a.id.localeCompare(b.id))) {
    for (const slug of extractLinkedSimulationSlugs(post.body ?? "")) {
      if (!ids.has(slug)) {
        ids.set(slug, post.id);
      }
    }
  }
  return ids;
}

/**
 * ナビバーの戻るボタンの遷移先を決める。
 * シミュレーションへリンクしている解説ページ（`src/content/posts/<記事>/index.md`）があればその記事、
 * なければトップページを返す。
 * @param slug - シミュレーションのフォルダー名
 * @returns 戻るボタンの遷移先
 */
export async function resolveNavBackHref(slug: string) {
  simulationArticleIds ??= getCollection("posts").then(
    findSimulationArticleIds
  );
  const articleId = (await simulationArticleIds).get(slug);
  return articleId ? encodeURI(`/post/${articleId}/`) : TOP_PAGE_PATH;
}
