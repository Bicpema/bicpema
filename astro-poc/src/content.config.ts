import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

// Hugoのfront matter（archetypes/post.md）に対応するスキーマ
const posts = defineCollection({
  // content/post/<スラッグ>/index.md のページバンドル構成をそのまま読み込む。
  // idはフォルダー名（日本語スラッグ）とし、URL /post/<スラッグ>/ を維持する
  loader: glob({
    pattern: "*/index.{md,mdx}",
    base: "./src/content/posts",
    generateId: ({ entry }) => entry.replace(/\/index\.mdx?$/, "")
  }),
  schema: ({ image }) =>
    // 未定義のキー（typoなど）もエラーにするため strictObject とする
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

export const collections = { posts };
