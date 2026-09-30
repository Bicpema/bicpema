// 記事のRSSフィード（Hugo時代と同じ /index.xml で配信する）。
import rss from "@astrojs/rss";
import type { APIRoute } from "astro";
import { getPosts, postUrl } from "../lib/posts";

/**
 * 記事のRSSフィードを返す。
 * @param context - `site` はastro.config.mjsのsite
 * @returns RSSフィードのレスポンス
 */
export const GET: APIRoute = async ({ site }) => {
  const posts = await getPosts();
  return rss({
    title: "Bicpema",
    description:
      "中学生と高校生のための物理シミュレーション教材の配布サイトです。",
    site: site!,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.date,
      link: postUrl(post.id),
      categories: [...post.data.categories, ...post.data.tags]
    })),
    customData: "<language>ja</language>"
  });
};
