// constants.ts はレイアウトや見た目に関する名前付き定数を管理するファイルです。

/** 矩形（仮想座標、px） */
export interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

/** フレームレート（本シミュレーションは動きが小さく、アニメーションも短いため標準の60fpsとする） */
export const FPS = 60;

// 仮想キャンバス寸法（px）。実際の描画は p.scale(p.width / V_W) で拡縮する。
export const V_W = 1000;
export const V_H = 562;

// 本・机・スタックのレイアウト
export const BOOK_WIDTH = 220;
export const BOOK_HEIGHT = 54;
export const STACK_CENTER_X = 395;
export const DESK_TOP_Y = 400;
export const DESK_WIDTH = 460;
export const DESK_THICKNESS = 36;
export const DESK_LEG_HEIGHT = 100;

/** 机とスタックを含むドロップ可能領域（本をここへドロップすると追加される） */
export const DESK_ZONE: Rect = {
  x: STACK_CENTER_X - DESK_WIDTH / 2,
  y: 116,
  w: DESK_WIDTH,
  h: DESK_TOP_Y + DESK_THICKNESS - 116
};

/** 本のパレット（ここからドラッグして追加する） */
export const PALETTE: Rect = { x: 845, y: 130, w: 135, h: 110 };
/** ゴミ箱エリア（スタックの本をここへドロップすると削除される） */
export const TRASH: Rect = { x: 845, y: 330, w: 135, h: 110 };

// 矢印のレーン（中心からの水平距離）。本ごとにずらして重ならないようにする。
export const LANE_OFFSET_FIRST = 52;
export const LANE_SPACING = 12;
/** 重力・地球を引く力の中心からの水平距離 */
export const GRAVITY_LANE_DX = 20;

// 矢印の縮尺
/** 基準の縮尺[px/N] */
export const ARROW_BASE_SCALE = 4;
/** 最大の力の矢印の長さの上限[px] */
export const ARROW_MAX_LENGTH = 150;
/** 重力の矢印の長さの上限[px]（本の高さに収める） */
export const ARROW_MAX_WEIGHT_LENGTH = BOOK_HEIGHT * 0.85;
export const ARROW_WEIGHT = 3;
export const ARROW_HEAD_SIZE = 11;
export const ARROW_WEIGHT_HIGHLIGHT = 5.5;
/** 矢印の当たり判定の半径[px] */
export const ARROW_HIT_RADIUS = 10;
/** 破線矢印の線分と間隔[px] */
export const DASH_LENGTH = 9;
export const DASH_GAP = 6;

// アニメーション
/** ドロップ時に本が落ちてくる高さ[px] */
export const DROP_START_OFFSET = 90;
/** 指数減衰の時定数[ms]（小さいほど速く収束する） */
export const ANIMATION_TIME_CONSTANT = 90;
/** 収束とみなす差[px または N] */
export const ANIMATION_EPSILON = 0.02;

// 文字サイズ
export const LABEL_FONT_SIZE = 12;
export const LEGEND_FONT_SIZE = 13;

// 色 [R, G, B]（色覚多様性に配慮したOkabe-Ito配色。背景が明るいため濃い色を使う）
/** つり合いの2力（重力・垂直抗力）: 青の実線 */
export const BALANCE_COLOR = [0, 114, 178] as const;
/** 作用反作用の力: 朱色の破線 */
export const REACTION_COLOR = [213, 94, 0] as const;
export const BACKGROUND_GRAY = 238;
