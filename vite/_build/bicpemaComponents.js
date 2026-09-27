// シミュレーション間で共通のUIパーツ（ナビバー・ローディングスピナー・
// 設定ボタン・設定モーダルの外枠）を、各index.htmlに手書きでコピーする代わりに
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
//
// ※ このファイルのクラス名はvite/css/tailwind.cssの@sourceで
//   Tailwindの検出対象に含めている。

const DEFAULT_SETTINGS_LABEL = "シミュレーションの設定";
const DEFAULT_SETTINGS_MODAL_ID = "simulationSettingModal";
const DEFAULT_SETTINGS_BUTTON_POSITION_CLASS =
  "absolute top-5 right-5 z-[1000] max-[576px]:top-2.5 max-[576px]:right-2.5";

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
 * ページ上部のナビバー（#navBar）。
 * @param {{ title: string }} options
 * @returns {string}
 */
export function renderNavBar({ title }) {
  return `<nav
      class="fixed inset-x-0 top-0 z-50 flex h-[60px] items-center border-b border-neutral-700 bg-neutral-900 px-4"
      id="navBar"
    >
      <a class="font-semibold text-white no-underline" href="https://bicpema.com/">Bicpema</a>
      <span class="ml-3 font-light text-neutral-300">${title}</span>
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
 * @param {{ id?: string, title?: string, bodyHtml: string }} options
 * @returns {string}
 */
export function renderSettingsModal({
  id = DEFAULT_SETTINGS_MODAL_ID,
  title = DEFAULT_SETTINGS_LABEL,
  bodyHtml
}) {
  const labelId = `${id}Label`;
  return `<div
      class="fixed inset-0 z-[1100] hidden flex items-center justify-center bg-black/50"
      id="${escapeAttribute(id)}"
      role="dialog"
      aria-modal="true"
      aria-labelledby="${escapeAttribute(labelId)}"
    >
      <div class="max-h-[85vh] w-full max-w-lg overflow-y-auto rounded bg-white p-4 text-neutral-900">
        <div class="mb-3 flex items-center justify-between border-b border-neutral-200 pb-2">
          <h1 class="text-lg font-semibold" id="${escapeAttribute(labelId)}">${title}</h1>
          <button type="button" class="modal-close modal-close-icon" aria-label="閉じる">&times;</button>
        </div>
        ${bodyHtml.trim()}
        <div class="flex justify-end border-t border-neutral-200 pt-2">
          <button type="button" class="modal-close modal-close-outline">閉じる</button>
        </div>
      </div>
    </div>`;
}

/**
 * HTML内の`<bicpema-*>`タグを共通マークアップに展開する。
 * HTMLコメント内（コメントアウトされた利用例など）は展開しない。
 * 未知のタグ名は記述ミスとみなしてエラーにする。
 * @param {string} html
 * @returns {string}
 */
export function expandBicpemaComponents(html) {
  const pageTitle = html.match(/<title>([\s\S]*?)<\/title>/)?.[1].trim() ?? "";

  // コメントを一時的にプレースホルダーへ退避し、展開後に元へ戻す
  /** @type {string[]} */
  const comments = [];
  const masked = html.replace(/<!--[\s\S]*?-->/g, (comment) => {
    comments.push(comment);
    return `__BICPEMA_COMMENT_${comments.length - 1}__`;
  });
  return expandMasked(masked, pageTitle).replace(
    /__BICPEMA_COMMENT_(\d+)__/g,
    (_match, index) => comments[Number(index)]
  );
}

/**
 * コメントを退避済みのHTML内の`<bicpema-*>`タグを展開する。
 * @param {string} html
 * @param {string} pageTitle ナビバーのタイトル省略時に使う<title>の内容
 * @returns {string}
 */
function expandMasked(html, pageTitle) {
  const expanded = html.replace(
    /<bicpema-([\w-]+)((?:\s+[\w-]+="[^"]*")*)\s*>([\s\S]*?)<\/bicpema-\1>/g,
    (_match, name, attributesText, innerHtml) => {
      const attributes = parseAttributes(attributesText);
      switch (name) {
        case "nav-bar":
          return renderNavBar({ title: attributes.title ?? pageTitle });
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
            bodyHtml: innerHtml
          });
        default:
          throw new Error(`未知の共通コンポーネントです: <bicpema-${name}>`);
      }
    }
  );

  const unexpandedTag = expanded.match(/<\/?bicpema-[\w-]+/);
  if (unexpandedTag) {
    throw new Error(
      `共通コンポーネントを展開できませんでした（閉じタグの有無・属性の書式を確認してください）: ${unexpandedTag[0]}`
    );
  }
  return expanded;
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
      handler: (html) => expandBicpemaComponents(html)
    }
  };
}
