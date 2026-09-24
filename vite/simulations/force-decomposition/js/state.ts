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
  // p5.Elementはp.select()等で取得するまでnullのため、型はp5.Element | nullとする。
  magnitudeInput: null as p5.Element | null,
  magnitudeValue: null as p5.Element | null,
  angleInput: null as p5.Element | null,
  angleValue: null as p5.Element | null
};
