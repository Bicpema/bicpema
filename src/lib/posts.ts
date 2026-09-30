import { getCollection, type CollectionEntry } from "astro:content";

export type Post = CollectionEntry<"posts">;

/** 対象学年を表すタグ（記事一覧の「対象」の絞り込みに使う） */
export const GRADE_TAGS = ["中学", "高校", "大学"] as const;

/** カテゴリーごとの表示色（Tailwind CSSのクラス）。未定義のカテゴリーは既定色で表示する */
const CATEGORY_STYLES: Record<string, { badge: string; accent: string }> = {
  力学: {
    badge: "bg-blue-100 text-blue-800 dark:bg-blue-500/20 dark:text-blue-200",
    accent: "from-blue-500 to-sky-400"
  },
  波動: {
    badge: "bg-teal-100 text-teal-800 dark:bg-teal-500/20 dark:text-teal-200",
    accent: "from-teal-500 to-cyan-400"
  },
  熱: {
    badge:
      "bg-orange-100 text-orange-800 dark:bg-orange-500/20 dark:text-orange-200",
    accent: "from-orange-500 to-amber-400"
  },
  電磁気: {
    badge:
      "bg-violet-100 text-violet-800 dark:bg-violet-500/20 dark:text-violet-200",
    accent: "from-violet-500 to-fuchsia-400"
  },
  原子物理: {
    badge:
      "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-200",
    accent: "from-emerald-500 to-lime-400"
  }
};
const DEFAULT_CATEGORY_STYLE = {
  badge: "bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-200",
  accent: "from-slate-500 to-slate-400"
};

/**
 * 公開対象の記事を日付の新しい順に返す。
 * @returns 記事の一覧
 */
export async function getPosts() {
  const posts = await getCollection("posts", ({ data }) => !data.draft);
  return posts.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

/**
 * 記事の一覧から、値ごとの記事数を多い順に集計する。
 * @param posts - 記事の一覧
 * @param pick - 記事から値の一覧を取り出す関数
 * @returns 値と記事数の組の一覧
 */
export function countBy(
  posts: readonly Post[],
  pick: (post: Post) => string[]
) {
  const counts = new Map<string, number>();
  for (const post of posts) {
    for (const value of pick(post)) {
      counts.set(value, (counts.get(value) ?? 0) + 1);
    }
  }
  return [...counts].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
}

/**
 * カテゴリーの表示色を返す。
 * @param category - カテゴリー名
 * @returns バッジとアクセント（グラデーション）のクラス
 */
export const categoryStyle = (category: string | undefined) =>
  (category && CATEGORY_STYLES[category]) || DEFAULT_CATEGORY_STYLE;

/**
 * 日付を「2026年9月5日」の形式で返す。
 * @param date - 日付
 * @returns 表示用の日付
 */
export const formatDate = (date: Date) =>
  date.toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });

/**
 * 記事ページのURLを返す。
 * @param id - 記事のid（フォルダー名）
 * @returns `/post/<id>/`
 */
export const postUrl = (id: string) => `/post/${id}/`;

/**
 * タグ別一覧ページのURLを返す（Hugoのタクソノミーと同じく小文字化する）。
 * @param tag - タグ名
 * @returns `/tags/<小文字化したタグ名>/`
 */
export const tagUrl = (tag: string) => `/tags/${tag.toLowerCase()}/`;

/**
 * カテゴリー別一覧ページのURLを返す。
 * @param category - カテゴリー名
 * @returns `/categories/<小文字化したカテゴリー名>/`
 */
export const categoryUrl = (category: string) =>
  `/categories/${category.toLowerCase()}/`;

/**
 * シリーズ別一覧ページのURLを返す。
 * @param series - シリーズ名
 * @returns `/series/<小文字化したシリーズ名>/`
 */
export const seriesUrl = (series: string) => `/series/${series.toLowerCase()}/`;
