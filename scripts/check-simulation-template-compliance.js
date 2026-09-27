// vite/simulations/ 配下の各シミュレーションが、vite/_templates/simulation/の必須構成
// （<bicpema-nav-bar> / id="p5Container" / id="p5Canvas"、設定ボタン・設定モーダルの
// 共通コンポーネント利用、ts/index.tsを
// <script type="module">で読み込む構成、共通のBicpemaCanvasControllerの
// 利用）から外れていないかを検査する。
//
// 使い方:
//   npm run check:template-compliance

import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { checkSimulationTemplateCompliance } from "./_lib/checkSimulationTemplateCompliance.js";
import {
  NON_SETTINGS_MODAL_SLUGS,
  TEMPLATE_COMPLIANCE_ALLOWLIST
} from "./template-compliance-allowlist.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(__dirname, "..");

/** @type {Record<string, string>} */
const ISSUE_DESCRIPTIONS = {
  "missing-index-html": "index.htmlが存在しません",
  "missing-entry-script": "ts/index.tsが存在しません",
  "entry-script-not-loaded-as-module":
    'エントリーポイントが<script type="module">で読み込まれていません',
  "missing-nav-bar": "<bicpema-nav-bar>（ナビバー）がありません",
  "inline-nav-bar":
    'ナビバー（id="navBar"）が手書きされています。<bicpema-nav-bar>を利用してください',
  "inline-loading-spinner":
    'ローディングスピナー（id="loadingSpinner"）が手書きされています。<bicpema-loading-spinner>を利用してください',
  "inline-settings-button":
    "設定ボタン（.settings-modal-open）が手書きされています。<bicpema-settings-button>を利用してください",
  "inline-settings-modal":
    "設定モーダル（.modal-panel / .modal-close）が手書きされています。<bicpema-settings-modal>を利用してください",
  "inline-icon":
    'SVGアイコン（class="bi bi-..."）がべた書きされています。<bicpema-icon>を利用してください',
  "missing-p5-container": 'id="p5Container"を持つ要素がありません',
  "missing-p5-canvas": 'id="p5Canvas"を持つ要素がありません',
  "non-canonical-canvas-controller":
    "BicpemaCanvasControllerが共通ファイル（vite/ts/bicpema-canvas-controller.js）以外から読み込まれています"
};

const result = checkSimulationTemplateCompliance({
  simulationsDir: resolve(rootDir, "vite", "simulations"),
  allowedNonCompliantSlugs: TEMPLATE_COMPLIANCE_ALLOWLIST,
  nonSettingsModalSlugs: NON_SETTINGS_MODAL_SLUGS
});

let hasError = false;

if (result.violations.length > 0) {
  hasError = true;
  console.error(
    "テンプレート（vite/_templates/simulation/）の構成から外れているシミュレーションがあります:"
  );
  for (const { slug, issues } of result.violations) {
    console.error(`  vite/simulations/${slug}`);
    for (const issue of issues) {
      console.error(`    - ${ISSUE_DESCRIPTIONS[issue] ?? issue}`);
    }
  }
  console.error(
    "既存の実装を段階的に是正するか、意図的な構成の場合は scripts/template-compliance-allowlist.js に追加してください。"
  );
}

if (result.staleAllowlistSlugs.length > 0) {
  hasError = true;
  console.error(
    "scripts/template-compliance-allowlist.js に不要なエントリがあります（シミュレーションが存在しないか、既にテンプレートへ準拠しています）:"
  );
  for (const slug of result.staleAllowlistSlugs) {
    console.error(`  ${slug}`);
  }
}

if (result.staleNonSettingsModalSlugs.length > 0) {
  hasError = true;
  console.error(
    "scripts/template-compliance-allowlist.js のNON_SETTINGS_MODAL_SLUGSに不要なエントリがあります（シミュレーションが存在しないか、手書きのモーダルがありません）:"
  );
  for (const slug of result.staleNonSettingsModalSlugs) {
    console.error(`  ${slug}`);
  }
}

if (hasError) {
  process.exit(1);
}

console.log(
  "シミュレーションのテンプレート準拠チェックに問題は見つかりませんでした。"
);
