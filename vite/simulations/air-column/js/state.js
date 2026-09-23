export const state = {
  /** @type {"closed" | "open"} */
  type: "closed",
  m_n: 1,
  pipeL: 400,
  pipeY: 200,
  Amp: 40,
  time: 0,
  waveLayer: null,
  /** シミュレーション実行中かどうか（再生/一時停止ボタンで切り替え） */
  isRunning: false
};
