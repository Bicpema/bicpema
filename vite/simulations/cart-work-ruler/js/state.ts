// グローバル状態管理オブジェクト
export const state = {
  // --- ロードアセット ---
  /** フォント */
  font: null,
  /** 本の画像（読み込み完了までnull） */
  bookImage: null as p5.Image | null,
  /** 台車の画像（読み込み完了までnull） */
  cartImage: null as p5.Image | null,
  /** 地面の画像（読み込み完了までnull） */
  groundImage: null as p5.Image | null,

  // --- DOM 要素（p.select()で取得するまではnull） ---
  massInput: null as p5.Element | null,
  velocityInput: null as p5.Element | null,
  forceInput: null as p5.Element | null,
  resetButton: null as p5.Element | null,
  playPauseButton: null as p5.Element | null,
  /** 情報パネルの DOM 要素参照 */
  infoMassEl: null as p5.Element | null,
  infoV0El: null as p5.Element | null,
  infoFEl: null as p5.Element | null,
  infoKe0El: null as p5.Element | null,
  infoDEl: null as p5.Element | null,
  infoWEl: null as p5.Element | null,
  statusCriticalEl: null as p5.Element | null,
  statusStoppedEl: null as p5.Element | null,
  statusRunningEl: null as p5.Element | null,
  statusKe0El: null as p5.Element | null,
  statusKeEl: null as p5.Element | null,

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
