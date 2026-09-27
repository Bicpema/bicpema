// 教科書などの外部出版物に掲載されたURL（data/published-urls.yaml）が、
// ビルド成果物（public/）からアクセス可能かを検査する。
//
// - URLに対応するページが public/ に存在するか
// - 存在しない場合、firebase.json の redirects に一致し、リダイレクト先が存在するか
//
// Hugo・Viteのビルド後に実行する。
//
// 使い方:
//   npm run build && hugo --minify
//   npm run check:published-urls

import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { parse } from "yaml";
import { checkPublishedUrls } from "./_lib/checkPublishedUrls.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(__dirname, "..");
const publicDir = resolve(rootDir, "public");
const SITE_ORIGIN = "https://bicpema.com";

if (!existsSync(publicDir)) {
  console.error(
    "public/ が見つかりません。先に `npm run build && hugo --minify` でビルドしてください。"
  );
  process.exit(1);
}

const entries =
  parse(
    readFileSync(resolve(rootDir, "data", "published-urls.yaml"), "utf-8")
  ) ?? [];
if (!Array.isArray(entries)) {
  console.error(
    "data/published-urls.yaml はURLエントリの配列で記述してください。"
  );
  process.exit(1);
}

const firebaseConfig = JSON.parse(
  readFileSync(resolve(rootDir, "firebase.json"), "utf-8")
);

const result = checkPublishedUrls({
  entries,
  publicDir,
  siteOrigin: SITE_ORIGIN,
  redirects: firebaseConfig.hosting?.redirects ?? []
});

let hasError = false;

if (result.invalidEntries.length > 0) {
  hasError = true;
  console.error("data/published-urls.yaml に不正なエントリがあります:");
  for (const { url, reason } of result.invalidEntries) {
    console.error(`  ${String(url)}: ${reason}`);
  }
}

if (result.unreachableUrls.length > 0) {
  hasError = true;
  console.error(
    "外部に掲載されたURLにアクセスできません。URLを変更した場合は firebase.json の redirects にリダイレクトを追加してください:"
  );
  for (const { url, redirectChain } of result.unreachableUrls) {
    const chain =
      redirectChain.length > 0 ? ` -> ${redirectChain.join(" -> ")}` : "";
    console.error(`  ${url}${chain}`);
  }
}

if (hasError) {
  process.exit(1);
}

console.log(`掲載URL ${entries.length} 件はすべてアクセス可能です。`);
