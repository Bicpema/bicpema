// checkSimulationTemplateCompliance.js のチェックを許容する、
// 既知の非準拠シミュレーションslug一覧。
//
// 以下は本チェックを導入した時点（2026-09-04）でテンプレート（現vite/_templates/simulation/）の構成
// （id="navBar" / id="p5Container" / id="p5Canvas" を持つ要素、
// ts/index.tsを<script type="module">で読み込む構成）から
// 外れていたシミュレーション。順次テンプレートへ揃えていく。
// 是正した場合はここから削除すること（削除し忘れは
// staleAllowlistSlugsとしてチェックが検知する）。
export const TEMPLATE_COMPLIANCE_ALLOWLIST = [
  "lens",
  "normal-force",
  "pendulum",
  "pendulum-wave",
  "projectile-motion",
  "refraction",
  "spring"
];

// 設定モーダル以外の目的（データ登録・CSV形式の説明など）のモーダルを
// 手書きしているシミュレーションslug一覧。これらのモーダルは見出し部分に
// 独自の要素を持つなど<bicpema-settings-modal>の外枠と構成が異なるため、
// inline-settings-modal（.modal-panel / .modal-closeの手書き）のチェックから除外する。
// 手書きのモーダルがなくなった場合はここから削除すること（削除し忘れは
// staleNonSettingsModalSlugsとしてチェックが検知する）。
export const NON_SETTINGS_MODAL_SLUGS = ["3d-strata", "3d-strata-csv"];
