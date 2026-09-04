// 対応する記事（content/post/*/index.md からのリンク）が存在しなくても
// checkArticleSimulationLinks.js のチェックを許容するシミュレーションslug一覧。
//
// 以下は本チェックを導入した時点（2026-09-03）で記事が存在しなかった
// シミュレーション。実験・デモ用途や記事執筆中などの理由で意図的に
// 記事なしとする場合はここに追加する。記事を追加した場合はここから
// 削除すること（削除し忘れは staleAllowlistSlugs としてチェックが検知する）。
export const ARTICLELESS_SIMULATION_ALLOWLIST = [
  "2025_DGI_cellophane-color2_ELK",
  "3d-strata",
  "3d-strata-csv",
  "cellophane",
  "cellophane-color-2D_animation",
  "cellophane_display",
  "lens",
  "normal-force",
  "pendulum-wave",
  "projectile-motion",
  "refraction",
  "spring",
  "train-acceleration",
];
