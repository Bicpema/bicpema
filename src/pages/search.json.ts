// ヘッダーの検索（src/components/Search.astro）が読み込む、記事の検索用データ。
import type { APIRoute } from "astro";
import { getPosts, postUrl } from "../lib/posts";

/**
 * 記事のタイトル・説明・URL・サムネイル・カテゴリー・タグの一覧をJSONで返す。
 * @returns 検索用データのレスポンス
 */
export const GET: APIRoute = async () => {
  const posts = await getPosts();
  const entries = posts.map((post) => {
    const { title, description, image, categories, tags } = post.data;
    return {
      title,
      description,
      url: postUrl(post.id),
      image: typeof image === "string" ? image : image?.src,
      category: categories[0],
      tags
    };
  });
  return new Response(JSON.stringify(entries), {
    headers: { "Content-Type": "application/json; charset=utf-8" }
  });
};
