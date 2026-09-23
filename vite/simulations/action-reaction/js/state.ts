// state.ts はシミュレーションの共有可変状態と、ジオメトリ・配色などの
// 設定値（定数）をまとめて管理するファイルです。

// ────────────────────────────────────────────
// 仮想キャンバス寸法（px）
// BicpemaCanvasControllerの既定（16:9固定）に合わせた比率にしている
// ────────────────────────────────────────────
export const V_W = 1000;
export const V_H = 562;

// ────────────────────────────────────────────
// 机・本のジオメトリ（仮想座標系, px）
// ────────────────────────────────────────────
/** 本1冊の幅 */
export const BOOK_W = 150;
/** 本1冊の高さ（積み重ね方向） */
export const BOOK_H = 34;
/** 本のスタックの中心X座標 */
export const STACK_X = 500;
/** 机の天板上面のY座標（最下段の本はここに乗る） */
export const DESK_TOP_Y = 400;
/** 机の天板の厚み */
export const DESK_THICKNESS = 16;
/** 机の天板の半幅 */
export const DESK_HALF_WIDTH = 190;
/** 机の脚の下端Y座標 */
export const DESK_LEG_BOTTOM_Y = 540;
/** 本の左右から力の矢印のレーンまでのオフセット */
export const LANE_OFFSET = 58;

/** 本を追加するためのドラッグ元（パレット）の矩形 */
export const PALETTE_RECT = { x: 30, y: 20, w: 140, h: 118 };
/** 本を取り除くためのドロップ先（トレイ）の矩形 */
export const TRASH_RECT = { x: 830, y: 20, w: 140, h: 118 };

// ────────────────────────────────────────────
// カラー定義 [R, G, B]
// 「本にはたらく力（実線）」と「その反作用＝本が及ぼす力（破線）」を
// 同系色・線種の違いで対にすることで、作用反作用の関係を視覚的に示す。
// ────────────────────────────────────────────
/** 重力（本にはたらく力）: 赤・実線 */
export const GRAVITY_COLOR: [number, number, number] = [216, 64, 64];
/** 垂直抗力（本にはたらく力）: 青・実線 */
export const NORMAL_COLOR: [number, number, number] = [56, 118, 216];
/** 地球を引く力（重力の反作用、本が地球に及ぼす力）: 薄い赤・破線 */
export const EARTH_REACTION_COLOR: [number, number, number] = [232, 140, 140];
/** 机・本を押す力（垂直抗力の反作用、本が及ぼす力）: 薄い青・破線 */
export const NORMAL_REACTION_COLOR: [number, number, number] = [140, 178, 232];

export const BOOK_COLOR: [number, number, number] = [196, 152, 92];
export const BOOK_SPINE_COLOR: [number, number, number] = [142, 104, 60];
export const BOOK_TOP_COLOR: [number, number, number] = [214, 176, 122];
export const DESK_COLOR: [number, number, number] = [122, 84, 52];
export const DESK_LEG_COLOR: [number, number, number] = [96, 64, 38];

// ────────────────────────────────────────────
// 既定値
// ────────────────────────────────────────────
export const DEFAULT_GRAVITY = 9.8;
export const DEFAULT_MASS = 1.0;

// ────────────────────────────────────────────
// 型定義
// ────────────────────────────────────────────
/** スタック内の1冊の本 */
export interface BookEntity {
  /** 生成順を表す一意なID（表示用の通し番号にも利用する） */
  id: number;
  /** 現在の描画中心Y座標（仮想座標系）。ドロップ演出のため目標値へ滑らかに近づける */
  currentY: number;
  /** 目標の中心Y座標（スタック内の位置から算出される） */
  targetY: number;
}

/** ドラッグ中の対象。"new"はパレットから新規追加中、"top"はスタック最上段の移動中 */
export type DraggingKind = "new" | "top" | null;

/** 画面上部に一時的に表示する案内メッセージ */
export interface Notice {
  text: string;
  until: number;
}

export interface AppState {
  font: p5.Font | null;
  /** 積み上げられている本（0番目が最下段） */
  books: BookEntity[];
  /** 次に追加する本に振るID（削除しても再利用しない） */
  nextBookId: number;

  /** 表示設定: 重力を表示するか */
  showGravity: boolean;
  /** 表示設定: 垂直抗力を表示するか */
  showNormal: boolean;
  /** 表示設定: 地球を引く力（重力の反作用）を表示するか */
  showEarthReaction: boolean;
  /** 表示設定: 机・本を押す力（垂直抗力の反作用）を表示するか */
  showNormalReaction: boolean;

  /** 重力加速度 (m/s^2) */
  gravity: number;
  /** 本1冊あたりの質量 (kg) */
  mass: number;

  /** 再生中かどうか。falseの間はドロップ演出・破線アニメーションを止める */
  isPlaying: boolean;

  /** ドラッグ中の種類 */
  dragging: DraggingKind;
  /** ドラッグ中の仮想座標 */
  dragX: number;
  dragY: number;

  /** 破線矢印の「進む破線」演出用オフセット */
  dashOffset: number;

  /** 画面上部の一時的な案内メッセージ */
  notice: Notice | null;

  /** DOM要素参照 */
  gravityCheckBox: p5.Element | null;
  normalCheckBox: p5.Element | null;
  earthReactionCheckBox: p5.Element | null;
  normalReactionCheckBox: p5.Element | null;
  gravityInput: p5.Element | null;
  gravityDisplay: p5.Element | null;
  massInput: p5.Element | null;
  massDisplay: p5.Element | null;
  clearBooksButton: p5.Element | null;
  playPauseButton: p5.Element | null;
}

export const state: AppState = {
  font: null,
  books: [],
  nextBookId: 1,

  showGravity: true,
  showNormal: true,
  showEarthReaction: true,
  showNormalReaction: true,

  gravity: DEFAULT_GRAVITY,
  mass: DEFAULT_MASS,

  isPlaying: true,

  dragging: null,
  dragX: 0,
  dragY: 0,

  dashOffset: 0,

  notice: null,

  gravityCheckBox: null,
  normalCheckBox: null,
  earthReactionCheckBox: null,
  normalReactionCheckBox: null,
  gravityInput: null,
  gravityDisplay: null,
  massInput: null,
  massDisplay: null,
  clearBooksButton: null,
  playPauseButton: null
};
