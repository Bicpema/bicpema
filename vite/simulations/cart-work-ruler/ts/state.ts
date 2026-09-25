import type p5 from "p5";

// グローバル状態管理オブジェクト
export const state: {
  font: p5.Font | null;
  bookImage: p5.Image | null;
  cartImage: p5.Image | null;
  groundImage: p5.Image | null;
  massInput: p5.Element | null;
  velocityInput: p5.Element | null;
  forceInput: p5.Element | null;
  resetButton: p5.Element | null;
  playPauseButton: p5.Element | null;
  infoMassEl: p5.Element | null;
  infoV0El: p5.Element | null;
  infoFEl: p5.Element | null;
  infoKe0El: p5.Element | null;
  infoDEl: p5.Element | null;
  infoWEl: p5.Element | null;
  statusCriticalEl: p5.Element | null;
  statusStoppedEl: p5.Element | null;
  statusRunningEl: p5.Element | null;
  statusKe0El: p5.Element | null;
  statusKeEl: p5.Element | null;
  mass_kg: number;
  v0_ms: number;
  force_N: number;
  approachX_px: number;
  velocity_ms: number;
  penetration_m: number;
  criticalExceeded: boolean;
  phase: "idle" | "approach" | "contact" | "stopped";
  isRunning: boolean;
} = {
  // --- ロードアセット ---
  /** フォント */
  font: null,
  /** 本の画像（読み込み完了までnull） */
  bookImage: null,
  /** 台車の画像（読み込み完了までnull） */
  cartImage: null,
  /** 地面の画像（読み込み完了までnull） */
  groundImage: null,

  // --- DOM 要素（p.select()で取得するまではnull） ---
  massInput: null,
  velocityInput: null,
  forceInput: null,
  resetButton: null,
  playPauseButton: null,
  /** 情報パネルの DOM 要素参照 */
  infoMassEl: null,
  infoV0El: null,
  infoFEl: null,
  infoKe0El: null,
  infoDEl: null,
  infoWEl: null,
  statusCriticalEl: null,
  statusStoppedEl: null,
  statusRunningEl: null,
  statusKe0El: null,
  statusKeEl: null,

  // --- シミュレーションパラメータ ---
  /** 台車の質量 (kg) */
  mass_kg: 0.5,
  /** 初速度 (m/s) */
  v0_ms: 2.0,
  /** 抵抗力 (N) */
  force_N: 5,

  // --- シミュレーション状態 ---
  /** 接近フェーズでの台車左端x座標 (px) */
  approachX_px: 30,
  /** 現在の速度 (m/s) */
  velocity_ms: 2.0,
  /** めり込み距離 (m) */
  penetration_m: 0,
  /** 最大めり込み超過フラグ（true のとき臨界超過） */
  criticalExceeded: false,
  /** フェーズ: 'idle' | 'approach' | 'contact' | 'stopped' */
  phase: "idle",
  /** シミュレーション実行中フラグ */
  isRunning: false
};
