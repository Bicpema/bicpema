// vite/simulations/ 配下の各シミュレーションが、templates/の必須構成
// （id="navBar" / id="p5Container" / id="p5Canvas"、js/index.(js|ts)を
// <script type="module">で読み込む構成、共通のBicpemaCanvasControllerの
// 利用）から外れていないかを検査する。
//
// 使い方:
//   npm run check:template-compliance

import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { checkSimulationTemplateCompliance } from "./_lib/checkSimulationTemplateCompliance.js";
import { TEMPLATE_COMPLIANCE_ALLOWLIST } from "./template-compliance-allowlist.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(__dirname, "..");

const ISSUE_DESCRIPTIONS = {
  "missing-index-html": "index.htmlが存在しません",
  "missing-entry-script": "js/index.jsまたはjs/index.tsが存在しません",
  "entry-script-not-loaded-as-module":
    'エントリーポイントが<script type="module">で読み込まれていません',
  "missing-nav-bar": 'id="navBar"を持つ要素がありません',
  "missing-p5-container": 'id="p5Container"を持つ要素がありません',
  "missing-p5-canvas": 'id="p5Canvas"を持つ要素がありません',
  "non-canonical-canvas-controller":
    "BicpemaCanvasControllerが共通ファイル（vite/js/bicpema-canvas-controller.js）以外から読み込まれています",
};

const result = checkSimulationTemplateCompliance({
  simulationsDir: resolve(rootDir, "vite", "simulations"),
  allowedNonCompliantSlugs: TEMPLATE_COMPLIANCE_ALLOWLIST,
});

let hasError = false;

if (result.violations.length > 0) {
  hasError = true;
  console.error(
    "テンプレート（templates/）の構成から外れているシミュレーションがあります:"
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

if (hasError) {
  process.exit(1);
}

console.log(
  "シミュレーションのテンプレート準拠チェックに問題は見つかりませんでした。"
);
