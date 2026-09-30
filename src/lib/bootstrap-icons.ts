// Bootstrap Icons（node_modules/bootstrap-icons/）のSVGをビルド時に読み込む。
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";

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

const iconCache = new Map<string, { viewBox: string; innerSvg: string }>();

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
