// シミュレーション間で共通のUIパーツ（ナビバー・ローディングスピナー・
// 設定ボタン・設定モーダルの外枠・アイコン）を、各index.htmlに手書きでコピーする代わりに
// `<bicpema-*>` タグとして記述し、ビルド時に共通マークアップへ展開する。
// DOM構造やスタイルを変更する場合は、このファイルを修正するだけで
// 全シミュレーションに反映される。
//
// 実行時にJSで挿入せずビルド時に展開するのは、以下の理由による。
// - ローディングスピナーはJSバンドルの読み込み前から表示されている必要がある
// - #navBarの高さはBicpemaCanvasControllerがsetup()時に参照するため、
//   p5.jsの初期化より前にDOMへ存在している必要がある
//
// 使い方（index.html内）:
//   <bicpema-nav-bar></bicpema-nav-bar>
//   <bicpema-loading-spinner></bicpema-loading-spinner>
//   <bicpema-settings-button></bicpema-settings-button>
//   <bicpema-settings-modal>...設定項目...</bicpema-settings-modal>
//   <bicpema-settings-modal variant="dark" panel-class="w-[340px]">...</bicpema-settings-modal>
//   <bicpema-icon name="camera" size="20" class="pb-1"></bicpema-icon>
//
// タグの中身に含まれる<bicpema-*>タグ（設定モーダル内のアイコンなど）も展開する。
//
// ※ このファイルのクラス名はvite/css/tailwind.cssの@sourceで
//   Tailwindの検出対象に含めている。

import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join, resolve } from "node:path";
import { getSimulationArticleDirs } from "../../scripts/_lib/checkArticleSimulationLinks.js";

const DEFAULT_SETTINGS_LABEL = "シミュレーションの設定";
const DEFAULT_SETTINGS_MODAL_ID = "simulationSettingModal";
const DEFAULT_LIGHT_PANEL_WIDTH_CLASS = "w-full max-w-lg";
const DEFAULT_SETTINGS_BUTTON_POSITION_CLASS =
  "absolute top-5 right-5 z-[1000] max-[576px]:top-2.5 max-[576px]:right-2.5";
const DEFAULT_ICON_SIZE = "16";
const TOP_PAGE_PATH = "/";
const POSTS_DIR = resolve(
  import.meta.dirname,
  "..",
  "..",
  "src",
  "content",
  "posts"
);
// 直前のページが戻り先と同じ場合のみ履歴を1つ戻り、スクロール位置を保ったまま解説ページへ戻す。
// 教科書のQRコード等から直接開いた場合（履歴に戻り先がない場合）は、hrefの戻り先へ遷移する。
// インラインのイベントハンドラーではdocumentのプロパティがスコープに含まれ、
// `URL`がdocument.URL（文字列）を指すため、window.URLを明示する。
const NAV_BACK_ONCLICK =
  "try{var r=new window.URL(document.referrer);if(history.length>1&&r.origin===location.origin&&r.pathname===this.pathname){history.back();return false}}catch(e){}";
const BOOTSTRAP_ICONS_DIR = join(
  dirname(
    createRequire(import.meta.url).resolve("bootstrap-icons/package.json")
  ),
  "icons"
);

/** @type {Map<string, { viewBox: string, innerSvg: string }>} */
const iconCache = new Map();

/**
 * 属性値として埋め込めるよう、HTMLの特殊文字をエスケープする。
 * @param {string} value
 * @returns {string}
 */
function escapeAttribute(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

/**
 * `<bicpema-* a="b" c="d">` の属性部分をオブジェクトに変換する。
 * @param {string} attributesText
 * @returns {Record<string, string>}
 */
export function parseAttributes(attributesText) {
  /** @type {Record<string, string>} */
  const attributes = {};
  for (const match of attributesText.matchAll(/([\w-]+)="([^"]*)"/g)) {
    attributes[match[1]] = match[2];
  }
  return attributes;
}

/**
 * シミュレーションのindex.htmlのパスから、ナビバーの戻るボタンの遷移先を決める。
 * シミュレーションへリンクしている解説ページ（src/content/posts/<記事>/index.md）があればその記事、
 * なければトップページを返す。
 * @param {string | undefined} filename index.htmlの絶対パス
 * @param {string} [postsDir] 記事のディレクトリ（テスト用）
 * @returns {string}
 */
export function resolveNavBackHref(filename, postsDir = POSTS_DIR) {
  const slug = filename
    ?.replaceAll("\\", "/")
    .match(/\/simulations\/([^/]+)\/index\.html$/)?.[1];
  const articleDir = slug && getSimulationArticleDirs(postsDir).get(slug);
  return articleDir ? encodeURI(`/post/${articleDir}/`) : TOP_PAGE_PATH;
}

/**
 * ページ上部のナビバー（#navBar）。
 * 左端に解説ページ（またはトップページ）へ戻るボタン（#navBackButton）を配置する。
 * @param {{ title: string, backHref?: string }} options
 *   backHref: 戻るボタンの遷移先（既定はトップページ）
 * @returns {string}
 */
export function renderNavBar({ title, backHref = TOP_PAGE_PATH }) {
  const backLabel =
    backHref === TOP_PAGE_PATH ? "トップページへ戻る" : "解説ページへ戻る";
  return `<nav
      class="fixed inset-x-0 top-0 z-50 flex h-[60px] items-center border-b border-neutral-700 bg-neutral-900 px-4 max-[576px]:px-2"
      id="navBar"
    >
      <a
        id="navBackButton"
        class="mr-3 flex h-9 w-9 shrink-0 items-center justify-center rounded text-neutral-300 no-underline hover:bg-neutral-700 hover:text-white max-[576px]:mr-2"
        href="${escapeAttribute(backHref)}"
        aria-label="${backLabel}"
        title="${backLabel}"
        onclick="${NAV_BACK_ONCLICK}"
      >${renderIcon({ name: "arrow-left", size: "20" })}</a>
      <a class="shrink-0 font-semibold text-white no-underline" href="/">Bicpema</a>
      <span class="ml-3 min-w-0 truncate font-light text-neutral-300">${title}</span>
    </nav>`;
}

/**
 * 初期化完了まで画面全体を覆うローディングスピナー（#loadingSpinner）。
 * 非表示にする処理はvite/ts/bicpema-loading-spinner.tsのhideLoadingSpinner()が担う。
 * @returns {string}
 */
export function renderLoadingSpinner() {
  return `<div
      id="loadingSpinner"
      class="fixed inset-0 z-[2000] flex items-center justify-center bg-neutral-900"
      role="status"
      aria-live="polite"
      aria-label="読み込み中"
    >
      <div class="h-12 w-12 animate-spin rounded-full border-4 border-neutral-600 border-t-blue-500"></div>
    </div>`;
}

/**
 * 設定モーダルを開くボタン。開閉はinitModal()の`.settings-modal-open`で行う。
 * @param {{ id?: string, positionClass?: string }} options
 *   id: ボタンに付与するid。positionClass: ラッパーの配置クラス（未指定時は右上）
 * @returns {string}
 */
export function renderSettingsButton({
  id,
  positionClass = DEFAULT_SETTINGS_BUTTON_POSITION_CLASS
} = {}) {
  const idAttribute = id ? ` id="${escapeAttribute(id)}"` : "";
  return `<div class="${escapeAttribute(positionClass)}">
        <button
          type="button"${idAttribute}
          class="settings-modal-open btn-settings-modal-open"
          aria-label="${DEFAULT_SETTINGS_LABEL}"
        >
          ⚙ 設定
        </button>
      </div>`;
}

/**
 * 設定モーダルの外枠（オーバーレイ・見出し・閉じるボタン）。
 * 設定項目はシミュレーション固有のため、bodyHtmlとして差し込む。
 * 開閉はinitModal()の`.modal-close`で行う。
 * @param {{
 *   id?: string,
 *   title?: string,
 *   variant?: string,
 *   panelClass?: string,
 *   bodyHtml: string
 * }} options
 *   variant: "light"（既定。白背景）または"dark"（.modal-panelの暗色パネル）。
 *   panelClass: パネルの幅を指定するクラス。lightでは既定の"w-full max-w-lg"を置き換え、
 *   darkでは.modal-panelの幅（w-[350px]等）をユーティリティクラスで上書きする。
 * @returns {string}
 */
export function renderSettingsModal({
  id = DEFAULT_SETTINGS_MODAL_ID,
  title = DEFAULT_SETTINGS_LABEL,
  variant = "light",
  panelClass,
  bodyHtml
}) {
  if (variant !== "light" && variant !== "dark") {
    throw new Error(
      `<bicpema-settings-modal>のvariantは"light"または"dark"を指定してください: ${variant}`
    );
  }
  const labelId = `${id}Label`;
  const widthClass = escapeAttribute(
    panelClass ?? (variant === "dark" ? "" : DEFAULT_LIGHT_PANEL_WIDTH_CLASS)
  );
  const panel =
    variant === "dark"
      ? `<div class="${["modal-panel max-h-[85vh] overflow-y-auto", widthClass].filter(Boolean).join(" ")}">
        <h1 class="mb-5 text-center text-lg font-semibold text-white" id="${escapeAttribute(labelId)}">${title}</h1>
        ${bodyHtml.trim()}
        <button type="button" class="modal-close modal-close-solid mt-2">閉じる</button>
      </div>`
      : `<div class="max-h-[85vh] ${widthClass} overflow-y-auto rounded bg-white p-4 text-neutral-900">
        <div class="mb-3 flex items-center justify-between border-b border-neutral-200 pb-2">
          <h1 class="text-lg font-semibold" id="${escapeAttribute(labelId)}">${title}</h1>
          <button type="button" class="modal-close modal-close-icon" aria-label="閉じる">&times;</button>
        </div>
        ${bodyHtml.trim()}
        <div class="flex justify-end border-t border-neutral-200 pt-2">
          <button type="button" class="modal-close modal-close-outline">閉じる</button>
        </div>
      </div>`;
  // 暗色パネルは設定を変えながらシミュレーションを見られるよう、背景を暗くしない
  const overlayClass = variant === "dark" ? "" : " bg-black/50";
  return `<div
      class="fixed inset-0 z-[1100] hidden flex items-center justify-center${overlayClass}"
      id="${escapeAttribute(id)}"
      role="dialog"
      aria-modal="true"
      aria-labelledby="${escapeAttribute(labelId)}"
    >
      ${panel}
    </div>`;
}

/**
 * Bootstrap Icons（node_modules/bootstrap-icons/icons/<name>.svg）を読み込み、
 * viewBoxとSVGの中身（<path>等）を返す。
 * @param {string} name
 * @returns {{ viewBox: string, innerSvg: string }}
 */
function loadBootstrapIcon(name) {
  const cached = iconCache.get(name);
  if (cached) return cached;

  // パス区切りなどを含む名前でアイコン集の外を読まないよう、名前の書式を制限する
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(name)) {
    throw new Error(`<bicpema-icon>のnameが不正です: ${name}`);
  }
  let svg;
  try {
    svg = readFileSync(join(BOOTSTRAP_ICONS_DIR, `${name}.svg`), "utf-8");
  } catch {
    throw new Error(
      `<bicpema-icon>に存在しないアイコン名が指定されました（https://icons.getbootstrap.com/ で名前を確認してください）: ${name}`
    );
  }
  const match = svg.match(/<svg\b[^>]*\bviewBox="([^"]*)"[^>]*>([\s\S]*)<\/svg>/);
  if (!match) {
    throw new Error(`アイコンのSVGを解釈できませんでした: ${name}.svg`);
  }
  const icon = { viewBox: match[1], innerSvg: match[2].trim() };
  iconCache.set(name, icon);
  return icon;
}

/**
 * Bootstrap Iconsのアイコン（インラインSVG）。
 * 装飾目的のため読み上げ対象から外す。アイコンのみのボタンでは、
 * ボタン側にaria-labelを付与すること。
 * @param {{ name: string, size?: string, className?: string }} options
 *   name: アイコン名（例: "camera"）。size: 幅・高さ（px、既定は16）。
 *   className: 追加するクラス（"pb-1"など）
 * @returns {string}
 */
export function renderIcon({ name, size = DEFAULT_ICON_SIZE, className }) {
  if (!name) {
    throw new Error("<bicpema-icon>にはname属性が必要です");
  }
  if (!/^\d+$/.test(size)) {
    throw new Error(
      `<bicpema-icon>のsizeはpx単位の整数で指定してください: ${size}`
    );
  }
  const { viewBox, innerSvg } = loadBootstrapIcon(name);
  const classNames = ["bi", `bi-${name}`, className].filter(Boolean).join(" ");
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" fill="currentColor" class="${escapeAttribute(classNames)}" viewBox="${viewBox}" aria-hidden="true">${innerSvg}</svg>`;
}

/**
 * HTML内の`<bicpema-*>`タグを共通マークアップに展開する。
 * HTMLコメント内（コメントアウトされた利用例など）は展開しない。
 * 未知のタグ名は記述ミスとみなしてエラーにする。
 * @param {string} html
 * @param {{ backHref?: string }} [options]
 *   backHref: ナビバーの戻るボタンの遷移先（既定はトップページ）
 * @returns {string}
 */
export function expandBicpemaComponents(html, { backHref } = {}) {
  const pageTitle = html.match(/<title>([\s\S]*?)<\/title>/)?.[1].trim() ?? "";

  // コメントを一時的にプレースホルダーへ退避し、展開後に元へ戻す
  /** @type {string[]} */
  const comments = [];
  const masked = html.replace(/<!--[\s\S]*?-->/g, (comment) => {
    comments.push(comment);
    return `__BICPEMA_COMMENT_${comments.length - 1}__`;
  });
  return expandMasked(masked, { pageTitle, backHref }).replace(
    /__BICPEMA_COMMENT_(\d+)__/g,
    (_match, index) => comments[Number(index)]
  );
}

/**
 * コメントを退避済みのHTML内の`<bicpema-*>`タグを展開する。
 * @param {string} html
 * @param {{ pageTitle: string, backHref?: string }} context
 *   pageTitle: ナビバーのタイトル省略時に使う<title>の内容。backHref: 戻るボタンの遷移先
 * @returns {string}
 */
function expandMasked(html, context) {
  const expanded = expandTags(html, context);

  const unexpandedTag = expanded.match(/<\/?bicpema-[\w-]+/);
  if (unexpandedTag) {
    throw new Error(
      `共通コンポーネントを展開できませんでした（閉じタグの有無・属性の書式を確認してください）: ${unexpandedTag[0]}`
    );
  }
  return expanded;
}

/**
 * `<bicpema-*>`タグを展開する。タグの中身は先に再帰的に展開するため、
 * 設定モーダル内のアイコンのように入れ子になったタグも展開される。
 * @param {string} html
 * @param {{ pageTitle: string, backHref?: string }} context
 * @returns {string}
 */
function expandTags(html, context) {
  return html.replace(
    /<bicpema-([\w-]+)((?:\s+[\w-]+="[^"]*")*)\s*>([\s\S]*?)<\/bicpema-\1>/g,
    (_match, name, attributesText, rawInnerHtml) => {
      const attributes = parseAttributes(attributesText);
      const innerHtml = expandTags(rawInnerHtml, context);
      switch (name) {
        case "nav-bar":
          return renderNavBar({
            title: attributes.title ?? context.pageTitle,
            backHref: context.backHref
          });
        case "loading-spinner":
          return renderLoadingSpinner();
        case "settings-button":
          return renderSettingsButton({
            id: attributes.id,
            positionClass: attributes.class
          });
        case "settings-modal":
          return renderSettingsModal({
            id: attributes.id,
            title: attributes.title,
            variant: attributes.variant,
            panelClass: attributes["panel-class"],
            bodyHtml: innerHtml
          });
        case "icon":
          return renderIcon({
            name: attributes.name,
            size: attributes.size,
            className: attributes.class
          });
        default:
          throw new Error(`未知の共通コンポーネントです: <bicpema-${name}>`);
      }
    }
  );
}

/**
 * index.htmlの`<bicpema-*>`タグを展開するViteプラグイン。
 * @returns {import("vite").Plugin}
 */
export function bicpemaComponentsPlugin() {
  return {
    name: "bicpema-components",
    transformIndexHtml: {
      order: "pre",
      handler: (html, ctx) =>
        expandBicpemaComponents(html, {
          backHref: resolveNavBackHref(ctx.filename)
        })
    }
  };
}
