import { getCollection } from "astro:content";

export const PAGE_SIZE = 10;

/** 公開対象の記事を日付の新しい順に返す */
export async function getPosts() {
  const posts = await getCollection("posts", ({ data }) => !data.draft);
  return posts.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

/**
 * 記事ページのURLを返す。
 * @param id - 記事のid（フォルダー名）
 * @returns `/post/<id>/`
 */
export const postUrl = (id: string) => `/post/${id}/`;

/**
 * タグ別一覧ページのURLを返す。
 * @param tag - タグ名
 * @returns `/tags/<小文字化したタグ名>/`
 */
export const tagUrl = (tag: string) => `/tags/${tag.toLowerCase()}/`;
