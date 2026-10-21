// constants.js はマジックナンバーを排除するための名前付き定数を管理するファイルです。

import { GRAVITY_ACCELERATION } from "../../../ts/physics/constants.js";

/** 重力加速度 (m/s²) */
export const GRAVITY = GRAVITY_ACCELERATION;

/** v-tグラフの「記録テープのデータ」系列の色（点・線で共通） */
export const RECORDED_DATA_COLOR = "rgb(220, 60, 60)";

/** v-tグラフの軸タイトルの共通フォントサイズ */
export const AXIS_TITLE_FONT_SIZE = 14;

/** v-tグラフの目盛りラベルの共通フォントサイズ */
export const AXIS_TICK_FONT_SIZE = 12;
