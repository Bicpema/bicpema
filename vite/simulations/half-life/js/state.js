// state.js はシミュレーションの共有可変状態を管理するファイルです。

export const state = {
  /** ロードした原子画像 */
  img: null,
  /** 現在の経過時間 */
  currentTime: 0,
  /** 半減期（年または日） */
  halfLife: 5730,
  /** 表示する最大時間（halfLife * 5） */
  maxYears: 5730 * 5,
  /** 1フレームあたりの経過時間 */
  T: 5730 / 150,
  /** 原子グリッドの一辺の数 */
  n: 8,
  /** 初期原子数（n * n） */
  N0: 64,
  /** 各原子の崩壊閾値ランダム値の配列 */
  atoms: [],
  /** シミュレーション実行中かどうか */
  isRunning: false,
  /** 崩壊した原子の数 */
  count: 0,
  /** トグルボタンの参照 */
  toggleButton: null,
  /** 原子数増加ボタンの参照 */
  plusBtn: null,
  /** 原子数減少ボタンの参照 */
  minusBtn: null,
  /** 原子数表示スパンの参照 */
  nDisplay: null,
  /** 物質選択ラジオボタンの参照配列 */
  radioButtons: null,
};

/**
 * 原子配列を初期化する。
 * @param {*} p - p5 インスタンス。
 */
export function initAtoms(p) {
  state.atoms = [];
  for (let i = 0; i < state.N0; i++) {
    state.atoms.push(p.random(0, 1));
  }
}
