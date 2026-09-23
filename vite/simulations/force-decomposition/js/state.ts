/** シミュレーションの共有状態 */
export const state = {
  /** フォント */
  font: null,
  /** 力の大きさ（N） */
  forceMag: 3,
  /** 力の向き（度, 0=右向き, 90=上向き） */
  forceAngle: 0,
  /** ドラッグ中かどうか */
  isDragging: false,
  // --- DOM 要素（本シミュレーションでは未使用。設定UIなし） ---
  magnitudeInput: null,
  magnitudeValue: null,
  angleInput: null,
  angleValue: null
};
