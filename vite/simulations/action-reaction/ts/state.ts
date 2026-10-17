// state.ts はシミュレーションの共有可変状態を管理するファイルです。

import type p5 from "p5";
import { DEFAULT_GRAVITY, DEFAULT_MASS, type Force } from "./physics.js";
import type { Segment } from "./geometry.js";

/** ドラッグ中の本の状態 */
export interface DragState {
  /** ドラッグの開始元（パレットから追加 / スタックから取り出して削除候補） */
  source: "palette" | "stack";
  /** ポインターの仮想座標 */
  x: number;
  y: number;
  /** 机とスタックの領域の上にあるか */
  overDesk: boolean;
  /** ゴミ箱の上にあるか */
  overTrash: boolean;
}

/** 描画で使う色（setup で一度だけ生成する） */
export interface Palette {
  balance: p5.Color;
  balanceDim: p5.Color;
  reaction: p5.Color;
  reactionDim: p5.Color;
}

/** シミュレーションの共有状態 */
export const state = {
  /** 本の冊数（ドラッグ中の本は含まない） */
  bookCount: 1,
  /** 本1冊の質量[kg] */
  mass: DEFAULT_MASS,
  /** 重力加速度[m/s^2] */
  gravity: DEFAULT_GRAVITY,
  /** 再生中か（停止中は追加・削除や矢印の更新アニメーションを行わず即時に反映する） */
  isPlaying: true,

  /** 重力を表示するか */
  showGravity: true,
  /** 垂直抗力を表示するか */
  showNormal: true,
  /** 作用反作用の力（本が地球を引く力・本が下の面を押す力）を表示するか */
  showReaction: true,
  /** 力の数値（N）を表示するか */
  showNumbers: true,

  /** 現在の冊数・質量・gから求めた力（変更時のみ再計算する） */
  forces: [] as Force[],
  /** 矢印の縮尺[px/N] */
  scale: 1,
  /** アニメーション中に表示している力の大きさ（力の id → N） */
  displayed: new Map<string, number>(),
  /** ドロップした本の落下アニメーション */
  drop: { index: 0, offset: 0 },

  /** ドラッグ中の本（ドラッグしていなければ null） */
  drag: null as DragState | null,
  /** 強調表示する力の id（ペアの相手も同時に強調する） */
  hoverId: null as string | null,
  /** 再描画が必要か（停止中・待機中の描画抑制に使う） */
  dirty: true,
  /** 当たり判定用の一時的な線分（毎フレームの生成物を避ける） */
  scratchSegment: { x1: 0, y1: 0, x2: 0, y2: 0 } as Segment,

  /** 色（setup で生成するまでは null） */
  colors: null as Palette | null,
  /** DOM要素（p.select()で取得するまでは null） */
  playPauseButton: null as p5.Element | null,
  gravityInput: null as p5.Element | null,
  gravityDisplay: null as p5.Element | null,
  showGravityCheckBox: null as p5.Element | null,
  showNormalCheckBox: null as p5.Element | null,
  showReactionCheckBox: null as p5.Element | null,
  showNumbersCheckBox: null as p5.Element | null
};
