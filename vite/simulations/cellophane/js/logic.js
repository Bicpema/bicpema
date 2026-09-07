// logic.jsは毎フレームの描画処理を定義するファイルです。

import { state } from "./state.js";
import {
  POLARIZER_SIZE,
  POLARIZER_Z,
  RAY_Z_RANGE,
  RAY_Z_LIMIT,
} from "./constants.js";

/**
 * 偏光板を描画する
 * @param {*} p p5インスタンス
 * @param {number} size 偏光板の大きさ
 * @param {number} x x座標
 * @param {number} y y座標
 * @param {number} z z座標
 * @param {0 | 1} pattern 偏光板の向き（0: スタート寄り, 1: ゴール寄り）
 */
function createPolarizer(p, size, x, y, z, pattern) {
  p.push();
  p.translate(x, y, z);
  p.noFill();
  p.strokeWeight(2);
  p.stroke(0, 50);
  p.box(size, size, 0);
  if (pattern === 0) {
    for (let i = 0; i < size; i += 5) {
      p.line(size / 2 - i, -size / 2, 0, -size / 2, size / 2 - i, 0);
      p.line(size / 2, -size / 2 + i, 0, -size / 2 + i, size / 2, 0);
    }
  } else if (pattern === 1) {
    for (let i = 0; i < size; i += 5) {
      p.line(-size / 2, -size / 2 + i, 0, size / 2 - i, size / 2, 0);
      p.line(-size / 2 + i, -size / 2, 0, size / 2, size / 2 - i, 0);
    }
  }
  p.pop();
}

/**
 * 偏光板・光の進行軸・セロハンを描画する
 * @param {*} p p5インスタンス
 */
export function drawSimulation(p) {
  // スタート寄りの偏光板
  createPolarizer(p, POLARIZER_SIZE, 0, 0, POLARIZER_Z, 0);

  // ゴール寄りの偏光板
  createPolarizer(p, POLARIZER_SIZE, 0, 0, -POLARIZER_Z, 1);

  p.strokeWeight(1);
  // 光の進行方向の軸（長さはRAY_Z_RANGE(px)）
  p.fill(0);
  p.stroke(0);
  p.push();
  p.rotateX(p.PI / 2);
  p.cylinder(1, RAY_Z_RANGE, 8, 8);
  p.pop();
  p.push();
  p.rotateX(-p.PI / 2);
  p.translate(0, RAY_Z_LIMIT, 0);
  p.cone(4, 7, 10, 10, true);
  p.pop();

  // セロハンの描画
  const cellophaneCount = state.cellophaneCountSlider.value();
  p.fill(0, 255, 255, 15);
  p.strokeWeight(1);
  p.push();
  p.translate(0, 0, cellophaneCount);
  for (let i = 0; i < cellophaneCount; i++) {
    p.push();
    p.translate(0, 0, -2 * i);
    p.box(50, 100, 2);
    p.pop();
  }
  p.pop();
}
