import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

// 記事（/post/<スラッグ>/）
const posts = defineCollection({
  // <スラッグ>/index.md のページバンドル構成で置き、画像（thumbnail.png）を同じフォルダーに置ける。
  // idはフォルダー名（日本語スラッグ）とし、Hugo時代のURL /post/<スラッグ>/ を維持する
  loader: glob({
    pattern: "*/index.md",
    base: "./src/content/posts",
    /**
     * 記事のidを返す。
     * @param options - `entry` は base からの相対パス（`<スラッグ>/index.md`）
     * @returns フォルダー名
     */
    generateId: ({ entry }) => entry.replace(/\/index\.md$/, "")
  }),
  /**
   * 記事のfront matterのスキーマを返す。未定義のキー（typoなど）もエラーにするため strictObject とする。
   * @param context - `image` はページバンドル内の画像を解決するヘルパー
   * @returns front matterのスキーマ
   */
  schema: ({ image }) =>
    z.strictObject({
      title: z.string(),
      description: z.string(),
      author: z.string().optional(),
      date: z.coerce.date(),
      // ページバンドル内の画像（thumbnail.png）または外部URL（Firebase Storage）
      image: z.union([z.url(), image()]).optional(),
      tags: z.array(z.string()).default([]),
      categories: z.array(z.string()).default([]),
      series: z.array(z.string()).default([]),
      // 旧URLからのリダイレクト。/ で始まり / で終わるパスに限定する
      aliases: z.array(z.string().regex(/^\/.*\/$/)).default([]),
      draft: z.boolean().default(false)
    })
});

// 固定ページ（/about/ など）。idはファイル名
const pages = defineCollection({
  loader: glob({ pattern: "*.md", base: "./src/content/pages" }),
  schema: z.strictObject({
    title: z.string(),
    description: z.string(),
    author: z.string().optional(),
    date: z.coerce.date()
  })
});

export const collections = { posts, pages };
