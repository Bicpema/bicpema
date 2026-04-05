// グローバル状態管理オブジェクト
export const state = {
  // --- ロードアセット ---
  /** フォント */
  font: null,
  /** 本の画像 */
  bookImage: null,
  /** 台車の画像 */
  cartImage: null,
  /** 地面の画像 */
  groundImage: null,

  // --- DOM 要素 ---
  massInput: null,
  velocityInput: null,
  forceInput: null,
  resetButton: null,
  playPauseButton: null,
  toggleModal: null,
  closeModal: null,
  settingsModal: null,

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
  /** フェーズ: 'idle' | 'approach' | 'contact' | 'stopped' */
  phase: "idle",
  /** シミュレーション実行中フラグ */
  isRunning: false,
};
