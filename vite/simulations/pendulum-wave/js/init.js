// init.jsは初期処理専用のファイルです。

import { state } from "./state.js";
import { Ball } from "./class.js";

/** 振り子（おもり）の個数 */
export const BALL_COUNT = 100;
/** 重力加速度 (m/s^2) */
export const GRAVITY = 9.8;
/** 振り子の長さデータのCSV上の列インデックス */
const LENGTH_COLUMN = 3;

/**
 * シミュレーションそのものの設定を行います。
 * @param {*} p p5インスタンス
 */
export function settingInit(p) {
  p.textSize(p.width / 25);
}

/**
 * 初期値を設定します。
 * @param {*} p p5インスタンス
 */
export function valueInit(p) {
  state.weightImage.resize(p.width / 50, 0);

  state.balls = [];
  for (let i = 0; i < BALL_COUNT; i++) {
    const length = state.pendulumData.getNum(i, LENGTH_COLUMN);
    state.balls.push(new Ball(length, p.asin(100 / length)));
  }

  state.gravity = GRAVITY;
  state.count = 0;
}
