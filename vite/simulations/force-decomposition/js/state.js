/** シミュレーションの共有状態 */
export const state = {
  /** フォント */
  font: null,
  /** 表示モード: 'xy' = 水平・垂直分解, 'slope' = 斜面分解 */
  mode: "xy",
  /** 力の大きさ（N） */
  forceMag: 100,
  /** 力の向き（度, 0=右向き, 90=上向き） */
  forceAngle: 45,
  /** ドラッグ中かどうか */
  isDragging: false,
  /** 斜面の角度（度） */
  slopeAngle: 30,
  /** 斜面モードの質量（kg） */
  mass: 10,
  /** UI要素 */
  settingsModal: null,
  toggleModal: null,
  closeModal: null,
  magnitudeInput: null,
  magnitudeValue: null,
  angleInput: null,
  angleValue: null,
  slopeAngleInput: null,
  slopeAngleValue: null,
  massInput: null,
  massValue: null,
  modeXYButton: null,
  modeSlopeButton: null,
};
