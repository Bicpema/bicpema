// シミュレーションページ（src/pages/vite/simulations/）の生成時に使う処理。
// ビルド時（Node.js上）でのみ実行し、ブラウザーには読み込まれない。
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { getCollection } from "astro:content";
import { extractLinkedSimulationSlugs } from "../../scripts/_lib/checkArticleSimulationLinks.js";

export const TOP_PAGE_PATH = "/";

// ビルド時はバンドル後のチャンク（dist/.prerender/）から実行され import.meta.url が
// 元の位置を指さないため、リポジトリ直下（カレントディレクトリ）を基準にする
const BOOTSTRAP_ICONS_DIR = join(
  dirname(
    createRequire(join(process.cwd(), "package.json")).resolve(
      "bootstrap-icons/package.json"
    )
  ),
  "icons"
);

let simulationArticleIds: Promise<Map<string, string>> | undefined;

const iconCache = new Map<string, { viewBox: string; innerSvg: string }>();

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

/**
 * Bootstrap Icons（node_modules/bootstrap-icons/icons/<name>.svg）を読み込み、
 * viewBoxとSVGの中身（<path>等）を返す。
 * @param name - アイコン名（例: "camera"）
 * @returns viewBoxとSVGの中身
 */
export function loadBootstrapIcon(name: string) {
  const cached = iconCache.get(name);
  if (cached) {
    return cached;
  }
  // パス区切りなどを含む名前でアイコン集の外を読まないよう、名前の書式を制限する
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(name)) {
    throw new Error(`<Icon>のnameが不正です: ${name}`);
  }
  let svg: string;
  try {
    svg = readFileSync(join(BOOTSTRAP_ICONS_DIR, `${name}.svg`), "utf-8");
  } catch {
    throw new Error(
      `<Icon>に存在しないアイコン名が指定されました（https://icons.getbootstrap.com/ で名前を確認してください）: ${name}`
    );
  }
  const match = svg.match(
    /<svg\b[^>]*\bviewBox="([^"]*)"[^>]*>([\s\S]*)<\/svg>/
  );
  if (!match) {
    throw new Error(`アイコンのSVGを解釈できませんでした: ${name}.svg`);
  }
  const icon = { viewBox: match[1] ?? "", innerSvg: (match[2] ?? "").trim() };
  iconCache.set(name, icon);
  return icon;
}
