/** 仮想キャンバス幅 */
export const V_W = 1000;
/** 仮想キャンバス高さ (16:9) */
export const V_H = (V_W * 9) / 16;
/** フレームレート */
export const FPS = 30;
/** グラフデータ記録間隔 (秒) */
export const GRAPH_INTERVAL = 0.1;
/** マーカー間隔 (秒) */
export const MARKER_INTERVAL = 0.5;
/** 地面のY座標（仮想座標系）*/
export const GROUND_Y = 460;
/** トラックのY座標（仮想座標系）*/
export const TRACK_Y = 400;
/** 車の表示スケール (px/m) */
export const PIXELS_PER_METER = 60;
/** 最大表示時間 (秒) */
export const MAX_TIME = 8;
/** 車の幅 (px) */
export const CAR_WIDTH = 80;
/** 車の高さ (px) */
export const CAR_HEIGHT = 40;
/** 地面のY座標（キャンバス高さに対する比率） */
export const GROUND_Y_RATIO = 0.82;
/** 等時間マーカーの表示高さ（車の高さに対する比率） */
export const MARKER_DOT_HEIGHT_RATIO = 0.8;
/** 車画像中心の高さ（車の高さに対する比率） */
export const CAR_IMAGE_CENTER_HEIGHT_RATIO = 0.3;
/** マーカー時刻ラベルのテキストサイズ (px) */
export const MARKER_TEXT_SIZE = 12;
/** 情報パネルのテキストサイズ (px) */
export const INFO_TEXT_SIZE = 18;
/** 初期設定時のテキストサイズ (px) */
export const DEFAULT_TEXT_SIZE = 16;
