import {
  INITIAL_HALF_LIFE,
  MAX_YEARS_MULTIPLIER,
  TIME_STEPS_PER_HALF_LIFE,
  INITIAL_GRID_SIDE,
  INITIAL_ATOM_COUNT
} from "./constants.js";

// グローバル状態管理オブジェクト
export const state: {
  /** プリロードされたp5.Imageインスタンス */
  img: any;
  currentTime: number;
  halfLife: number;
  maxYears: number;
  T: number;
  n: number;
  N0: number;
  atoms: number[];
  isRunning: boolean;
  count: number;
  atomPlusBtn: HTMLElement | null;
  atomMinusBtn: HTMLElement | null;
  materialRadios: NodeListOf<HTMLInputElement> | null;
  /** p.select()が返すp5.Elementインスタンス（スタート/ストップ トグルボタン） */
  toggleBtn: any;
  /** p.select()が返すp5.Elementインスタンス（リセットボタン） */
  resetBtn: any;
} = {
  /** プリロードされた原子画像 */
  img: null,
  /** 経過時間 */
  currentTime: 0,
  /** 半減期 */
  halfLife: INITIAL_HALF_LIFE,
  /** グラフの最大時間 */
  maxYears: INITIAL_HALF_LIFE * MAX_YEARS_MULTIPLIER,
  /** 1フレームあたりの時間増分 */
  T: INITIAL_HALF_LIFE / TIME_STEPS_PER_HALF_LIFE,
  /** グリッドの1辺の原子数 */
  n: INITIAL_GRID_SIDE,
  /** 原子の総数 */
  N0: INITIAL_ATOM_COUNT,
  /** 各原子の崩壊しきい値（0〜1のランダム値） */
  atoms: [],
  /** シミュレーション実行中かどうか */
  isRunning: false,
  /** 崩壊後（青色）の原子数 */
  count: 0,
  /** ＋ボタン（原子数を増やす） */
  atomPlusBtn: null,
  /** ーボタン（原子数を減らす） */
  atomMinusBtn: null,
  /** 物質選択ラジオボタン群 */
  materialRadios: null,
  /** スタート/ストップ トグルボタン（p5.Element） */
  toggleBtn: null,
  /** リセットボタン（p5.Element） */
  resetBtn: null
};
