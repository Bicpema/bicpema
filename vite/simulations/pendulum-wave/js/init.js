// init.jsは初期処理専用のファイルです。

import { state } from "./state.js";
import { Ball } from "./class.js";
import {
  BALL_COUNT,
  FPS,
  LENGTH_COLUMN,
  WEIGHT_IMAGE_WIDTH_DIVISOR,
  GUIDE_TEXT_SIZE_DIVISOR,
  PIVOT_Y
} from "./constants.js";

/**
 * シミュレーションそのものの設定を行います。
 * @param {*} p p5インスタンス
 */
export function settingInit(p) {
  p.frameRate(FPS);
  p.textSize(p.width / GUIDE_TEXT_SIZE_DIVISOR);
}

/**
 * 初期値を設定します。
 * @param {*} p p5インスタンス
 */
export function valueInit(p) {
  state.weightImage.resize(p.width / WEIGHT_IMAGE_WIDTH_DIVISOR, 0);

  state.balls = [];
  for (let i = 0; i < BALL_COUNT; i++) {
    const length = state.pendulumData.getNum(i, LENGTH_COLUMN);
    state.balls.push(new Ball(length, p.asin(PIVOT_Y / length)));
  }

  state.count = 0;
}
