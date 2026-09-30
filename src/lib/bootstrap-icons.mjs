// Bootstrap Icons（node_modules/bootstrap-icons/）のSVGをビルド時に読み込む。
// Iconコンポーネントとremarkプラグイン（astro.config.mjsから読み込まれる）の両方で使うため、.mjsで記述する。
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

/** @type {Map<string, { viewBox: string, innerSvg: string }>} */
const iconCache = new Map();

/**
 * Bootstrap Icons（node_modules/bootstrap-icons/icons/<name>.svg）を読み込み、
 * viewBoxとSVGの中身（<path>等）を返す。
 * @param {string} name アイコン名（例: "camera"）
 * @returns {{ viewBox: string, innerSvg: string }}
 */
export function loadBootstrapIcon(name) {
  const cached = iconCache.get(name);
  if (cached) {
    return cached;
  }
  // パス区切りなどを含む名前でアイコン集の外を読まないよう、名前の書式を制限する
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(name)) {
    throw new Error(`<Icon>のnameが不正です: ${name}`);
  }
  let svg;
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

/**
 * アイコンのインラインSVGを返す。装飾目的のため読み上げ対象から外す。
 * @param {string} name アイコン名
 * @param {number} [size] 幅・高さ（px）
 * @returns {string}
 */
export function renderBootstrapIcon(name, size = 16) {
  const { viewBox, innerSvg } = loadBootstrapIcon(name);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" fill="currentColor" class="bi bi-${name}" viewBox="${viewBox}" aria-hidden="true">${innerSvg}</svg>`;
}
