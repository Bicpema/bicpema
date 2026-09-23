// constants.ts はマジックナンバーを排除するための名前付き定数を管理するファイルです。

/** 積み上げられる本の最大冊数（画面内に収まる範囲、かつ矢印が読み取れる範囲に制限する） */
export const MAX_BOOKS = 6;

/** ドラッグ判定のヒットマージン（本・パレット・トレイの矩形に加算する余白, px） */
export const DRAG_HIT_MARGIN = 10;

/** 力の矢印の最大長さ（px）。本の冊数が増えて合力が大きくなっても画面からはみ出さないよう上限を設ける */
export const MAX_ARROW_LENGTH = 56;

/**
 * 力のレーン（本の左右にある矢印の描画位置）を、本のインデックスに応じて
 * 外側へずらす量（px）。積み上げた本の段数が増えても、隣接する本の
 * ラベルが同じX座標に重ならないよう階段状に広げるために使う。
 */
export const LANE_FAN_STEP = 22;

/** 力が0に非常に近いとき等、矢印を描画しない長さのしきい値（px） */
export const MIN_ARROW_LENGTH = 1;

/** 矢印の基準スケール（px/N）。本の冊数が少なく合力が小さいときに使う基準値 */
export const BASE_ARROW_SCALE = 6;

/** 力の数値ラベル（○○ N）で共通して使うフォントサイズ */
export const FORCE_LABEL_FONT_SIZE = 12;

/** 新しい本が机・スタックに落ちるアニメーションの所要時間（ミリ秒） */
export const DROP_ANIMATION_MS = 260;

/** 反作用（破線）矢印の「進む破線」演出の速さ（フレームあたりのオフセットpx） */
export const DASH_ANIMATION_SPEED = 0.5;

/** 一時的な案内メッセージの表示時間（ミリ秒） */
export const NOTICE_DURATION_MS = 1800;
