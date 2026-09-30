import { getCollection } from "astro:content";

export const PAGE_SIZE = 2; // PoCでは記事が3本のため、ページ送りを確認できるよう小さくする（Hugoは10）

/** 公開対象の記事を日付の新しい順に返す */
export async function getPosts() {
  const posts = await getCollection("posts", ({ data }) => !data.draft);
  return posts.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

export const postUrl = (id: string) => `/post/${id}/`;
export const tagUrl = (tag: string) => `/tags/${tag.toLowerCase()}/`;
