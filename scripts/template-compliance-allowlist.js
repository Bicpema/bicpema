// checkSimulationTemplateCompliance.js のチェックを許容する、
// 既知の非準拠シミュレーションslug一覧。
//
// 以下は本チェックを導入した時点（2026-09-04）でtemplates/の構成
// （id="navBar" / id="p5Container" / id="p5Canvas" を持つ要素、
// js/index.(js|ts)を<script type="module">で読み込む構成）から
// 外れていたシミュレーション。順次テンプレートへ揃えていく。
// 是正した場合はここから削除すること（削除し忘れは
// staleAllowlistSlugsとしてチェックが検知する）。
export const TEMPLATE_COMPLIANCE_ALLOWLIST = [
  "cellophane",
  "lens",
  "normal-force",
  "pendulum",
  "pendulum-wave",
  "projectile-motion",
  "refraction",
  "spring",
];
