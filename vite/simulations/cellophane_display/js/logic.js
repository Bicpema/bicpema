// logic.jsはシミュレーションの描画処理と計算処理専用のファイルです。

import * as math from "mathjs";
import Chart from "chart.js/auto";
import { state } from "./state.js";
import { optChanged } from "./element-function.js";

// ============================================================
// 純粋数学ヘルパー関数
// ============================================================

/**
 * 回転行列R(theta)
 * @param {number} theta ラジアン
 */
function r_theta(theta) {
  return [
    [Math.cos(theta), -Math.sin(theta)],
    [Math.sin(theta), Math.cos(theta)],
  ];
}

/**
 * 回転行列R(-theta)
 * @param {number} theta ラジアン
 */
function mai_r_theta(theta) {
  return [
    [Math.cos(theta), Math.sin(theta)],
    [-Math.sin(theta), Math.cos(theta)],
  ];
}

/**
 * ジョーンズマトリクス
 * @param {number} theta ラジアン
 */
function jhons(theta) {
  return [
    [Math.sin(theta) ** 2, -Math.sin(theta) * Math.cos(theta)],
    [-Math.sin(theta) * Math.cos(theta), Math.cos(theta) ** 2],
  ];
}

/**
 * XYZ → 線形RGBのクランプ・ガンマ補正 → 0〜255整数への変換
 * @param {number} a 線形光値
 * @returns {number} 0〜255の整数
 */
function toRGB(a) {
  if (a <= 0.0031308) {
    a = 12.92 * a;
  } else {
    a = 1.055 * math.pow(a, 1 / 2.4) - 0.055;
  }
  a = math.max(0, math.min(1, a));
  return math.round(a * 255);
}

// ============================================================
// 色計算
// ============================================================

/**
 * 偏光板1枚を透過したときの色の計算
 */
export function beforeColorCalculate() {
  for (let i = 380; i <= 750; i++) {
    state.xArrBefore[i - 380] =
      state.R_all[i - 380] * state.osArrOrigin[i - 380] * state.xLambda[i - 380];
    state.yArrBefore[i - 380] =
      state.R_all[i - 380] * state.osArrOrigin[i - 380] * state.yLambda[i - 380];
    state.zArrBefore[i - 380] =
      state.R_all[i - 380] * state.osArrOrigin[i - 380] * state.zLambda[i - 380];
    state.R_os[i - 380] = state.R_all[i - 380] * state.osArrOrigin[i - 380];
  }
  state.Intensity_all_now = math.sum(state.R_os);
  for (let i = 380; i <= 750; i++) {
    state.speyBox[i - 380] =
      state.osArrOrigin[i - 380] * state.yLambda[i - 380] * state.R_all[i - 380];
  }
  state.spey = math.sum(state.speyBox);
  state.K = 1.0 / state.spey;
  const xSumBefore = math.sum(state.xArrBefore) * state.K;
  const ySumBefore = math.sum(state.yArrBefore) * state.K;
  const zSumBefore = math.sum(state.zArrBefore) * state.K;
  const tosRGB = [
    [3.2406, -1.5372, -0.4986],
    [-0.9689, 1.8758, 0.0415],
    [0.0557, -0.204, 1.057],
  ];
  const rgbBefore = math.multiply(tosRGB, [xSumBefore, ySumBefore, zSumBefore]);
  state.rBefore = toRGB(rgbBefore[0]);
  state.gBefore = toRGB(rgbBefore[1]);
  state.bBefore = toRGB(rgbBefore[2]);
}

/**
 * セロハン及び2枚目の偏光板を透過したときの色の計算（全組）
 */
function afterColorCalculate() {
  if (state.colabNum >= 1) {
    const ls_xArrAfter = [];
    const ls_yArrAfter = [];
    const ls_zArrAfter = [];

    const referenceAngleEl = document.getElementById("rotateInput-1");
    const a = -(parseFloat(referenceAngleEl.value) * Math.PI) / 180;
    const firstCellophaneNumEl = document.getElementById("numInput-1");
    const E_1 = [[-Math.sin(a)], [Math.cos(a)]];

    for (let i = 380; i <= 750; i++) {
      const l = i;
      const firstopdVal = parseFloat(state.opdInput.value());
      const delta =
        (state.dArr[i - 380] *
          parseFloat(firstCellophaneNumEl.value) *
          2 *
          firstopdVal *
          Math.PI) /
        l /
        100;
      const cello = [
        [1, 0],
        [0, math.exp(math.complex(0, -delta))],
      ];
      let E_2 = math.multiply(cello, E_1);

      if (state.colabNum >= 2) {
        for (let n = 2; n <= state.colabNum; n++) {
          const otherCellophaneNumEl = document.getElementById("numInput-" + n);
          const otheropdVal = parseFloat(state.opdInput.value());
          const deltaN =
            (state.dArr[i - 380] *
              parseFloat(otherCellophaneNumEl.value) *
              2 *
              otheropdVal *
              Math.PI) /
            l /
            100;
          const celloN = [
            [1, 0],
            [0, math.exp(math.complex(0, -deltaN))],
          ];
          const targetAngleEl = document.getElementById("rotateInput-" + n);
          const b =
            ((parseFloat(targetAngleEl.value) - parseFloat(referenceAngleEl.value)) *
              Math.PI) /
            180;
          E_2 = math.multiply(
            r_theta(b),
            math.multiply(celloN, math.multiply(mai_r_theta(b), E_2))
          );
        }
      }

      let c;
      if (state.polarizerSelect.value() == "平行ニコル配置") {
        c = a;
      } else {
        c = a - Math.PI / 2;
      }

      const E_3 = math.multiply(jhons(c), E_2);
      const relativeStrength = math.abs(
        math.abs(math.multiply(E_3[0], E_3[0])) +
          math.abs(math.multiply(E_3[1], E_3[1]))
      );
      state.osArr[i - 380] =
        relativeStrength * state.osArrOrigin[i - 380] * state.R_all[i - 380];
      state.xArrAfter[i - 380] = state.osArr[i - 380] * state.xLambda[i - 380];
      state.yArrAfter[i - 380] = state.osArr[i - 380] * state.yLambda[i - 380];
      state.zArrAfter[i - 380] = state.osArr[i - 380] * state.zLambda[i - 380];
      ls_xArrAfter[i - 380] =
        state.osArrOrigin[i - 380] * state.R_all[i - 380] * state.xLambda[i - 380];
      ls_yArrAfter[i - 380] =
        state.osArrOrigin[i - 380] * state.R_all[i - 380] * state.yLambda[i - 380];
      ls_zArrAfter[i - 380] =
        state.osArrOrigin[i - 380] * state.R_all[i - 380] * state.zLambda[i - 380];
    }
    state.Intensity_all_now = math.sum(state.osArr);
    const sum_ls_xArrAfter = math.sum(ls_xArrAfter);
    const sum_ls_yArrAfter = math.sum(ls_yArrAfter);
    const sum_ls_zArrAfter = math.sum(ls_zArrAfter);
    for (let i = 380; i <= 750; i++) {
      state.speyBox[i - 380] =
        state.osArrOrigin[i - 380] * state.yLambda[i - 380] * state.R_all[i - 380];
    }
    state.spey = math.sum(state.speyBox);
    state.K = 1.0 / state.spey;
    const xSumAfter = math.sum(state.xArrAfter) * state.K;
    const ySumAfter = math.sum(state.yArrAfter) * state.K;
    const zSumAfter = math.sum(state.zArrAfter) * state.K;
    const tosRGB = [
      [3.2406, -1.5372, -0.4986],
      [-0.9689, 1.8758, 0.0415],
      [0.0557, -0.204, 1.057],
    ];
    const sRGB = math.multiply(tosRGB, [xSumAfter, ySumAfter, zSumAfter]);
    state.rAfter = toRGB(sRGB[0]);
    state.gAfter = toRGB(sRGB[1]);
    state.bAfter = toRGB(sRGB[2]);
  } else {
    if (state.polarizerSelect.value() == "平行ニコル配置") {
      state.rAfter = state.rBefore;
      state.gAfter = state.gBefore;
      state.bAfter = state.bBefore;
    } else {
      state.rAfter = 0;
      state.gAfter = 0;
      state.bAfter = 0;
      for (let i = 380; i <= 750; i++) {
        state.osArr[i - 380] = 0;
      }
    }
  }
}

/**
 * セロハン及び2枚目の偏光板を透過したときの色の計算（セロハン1枚のみ）
 */
function afterColorCalculate1() {
  if (state.colabNum >= 1) {
    const referenceAngleEl = document.getElementById("rotateInput-1");
    const a = -(parseFloat(referenceAngleEl.value) * Math.PI) / 180;
    const firstCellophaneNumEl = document.getElementById("numInput-1");
    const E_1 = [[-Math.sin(a)], [Math.cos(a)]];

    for (let i = 380; i <= 750; i++) {
      const l = i;
      const firstopdVal = parseFloat(state.opdInput.value());
      const delta =
        (state.dArr[i - 380] *
          parseFloat(firstCellophaneNumEl.value) *
          2 *
          firstopdVal *
          Math.PI) /
        l /
        100;
      const cello = [
        [1, 0],
        [0, math.exp(math.complex(0, -delta))],
      ];
      let E_2 = math.multiply(cello, E_1);

      let c;
      if (state.polarizerSelect.value() == "平行ニコル配置") {
        c = a;
      } else {
        c = a - Math.PI / 2;
      }

      const E_3 = math.multiply(jhons(c), E_2);
      const relativeStrength = math.abs(
        math.abs(math.multiply(E_3[0], E_3[0])) +
          math.abs(math.multiply(E_3[1], E_3[1]))
      );
      state.osArr[i - 380] =
        relativeStrength * state.osArrOrigin[i - 380] * state.R_all[i - 380];
      state.xArrAfter[i - 380] = state.osArr[i - 380] * state.xLambda[i - 380];
      state.yArrAfter[i - 380] = state.osArr[i - 380] * state.yLambda[i - 380];
      state.zArrAfter[i - 380] = state.osArr[i - 380] * state.zLambda[i - 380];
    }
    state.Intensity_all_now = math.sum(state.osArr);
    for (let i = 380; i <= 750; i++) {
      state.speyBox[i - 380] =
        state.osArrOrigin[i - 380] * state.yLambda[i - 380] * state.R_all[i - 380];
    }
    state.spey = math.sum(state.speyBox);
    state.K = 1.0 / state.spey;
    const xSumAfter = math.sum(state.xArrAfter) * state.K;
    const ySumAfter = math.sum(state.yArrAfter) * state.K;
    const zSumAfter = math.sum(state.zArrAfter) * state.K;
    const tosRGB = [
      [3.2406, -1.5372, -0.4986],
      [-0.9689, 1.8758, 0.0415],
      [0.0557, -0.204, 1.057],
    ];
    const sRGB = math.multiply(tosRGB, [xSumAfter, ySumAfter, zSumAfter]);
    state.rAfter1 = toRGB(sRGB[0]);
    state.gAfter1 = toRGB(sRGB[1]);
    state.bAfter1 = toRGB(sRGB[2]);
  } else {
    if (state.polarizerSelect.value() == "平行ニコル配置") {
      state.rAfter1 = state.rBefore;
      state.gAfter1 = state.gBefore;
      state.bAfter1 = state.bBefore;
    } else {
      state.rAfter1 = 0;
      state.gAfter1 = 0;
      state.bAfter1 = 0;
      for (let i = 380; i <= 750; i++) {
        state.osArr[i - 380] = 0;
      }
    }
  }
}

/**
 * セロハン及び2枚目の偏光板を透過したときの色の計算（バイナリ組み合わせ）
 * @param {string} binaryString 組み合わせを表すバイナリ文字列
 */
function afterColorCalculates(binaryString) {
  let bi = 0;
  let tape_sum = 0;
  let numStart = 0;
  let firstCellophaneNumEl;
  let referenceAngleEl;
  let a;
  const bit = new Array(binaryString.length).fill(0);
  for (let j = 0; j < binaryString.length; j++) {
    bit[j] = parseInt(binaryString[j], 10);
    if (bit[j] == 0) {
      tape_sum += 1;
    }
  }

  if (bit[0] == 0) {
    referenceAngleEl = document.getElementById("rotateInput-1");
    a = -(parseFloat(referenceAngleEl.value) * Math.PI) / 180;
    firstCellophaneNumEl = document.getElementById("numInput-1");
    numStart = 1;
  } else {
    for (let j = 0; j < binaryString.length - 1; j++) {
      if (bit[j] == 0) {
        numStart = j;
        bi = 1;
        break;
      }
    }
    if (bi == 0) {
      if (bit[binaryString.length - 1] == 0) {
        numStart = binaryString.length - 1;
      } else {
        numStart = 0;
      }
    }
    if (numStart != 0) {
      const numS = numStart + 1;
      referenceAngleEl = document.getElementById("rotateInput-" + numS);
      a = -(parseFloat(referenceAngleEl.value) * Math.PI) / 180;
      firstCellophaneNumEl = document.getElementById("numInput-" + numS);
    }
  }

  if (numStart !== 0) {
    const E_1 = [[-Math.sin(a)], [Math.cos(a)]];
    for (let i = 380; i <= 750; i++) {
      const l = i;
      const firstopdVal = parseFloat(state.opdInput.value());
      const delta =
        (state.dArr[i - 380] *
          parseFloat(firstCellophaneNumEl.value) *
          2 *
          firstopdVal *
          Math.PI) /
        l /
        100;
      const cello = [
        [1, 0],
        [0, math.exp(math.complex(0, -delta))],
      ];
      let E_2 = math.multiply(cello, E_1);

      if (bit[0] == 0) {
        for (let j = 1; j < state.colabNum; j++) {
          const n = j + 1;
          const otherCellophaneNumEl = document.getElementById("numInput-" + n);
          const otheropdVal = parseFloat(state.opdInput.value());
          const deltaJ =
            (state.dArr[i - 380] *
              parseFloat(otherCellophaneNumEl.value) *
              2 *
              otheropdVal *
              Math.PI) /
            l /
            100;
          const celloJ = [
            [1, 0],
            [0, math.exp(math.complex(0, -deltaJ))],
          ];
          const targetAngleEl = document.getElementById("rotateInput-" + n);
          const b =
            ((parseFloat(targetAngleEl.value) - parseFloat(referenceAngleEl.value)) *
              Math.PI) /
            180;
          if (bit[j] == 0) {
            E_2 = math.multiply(
              r_theta(b),
              math.multiply(celloJ, math.multiply(mai_r_theta(b), E_2))
            );
          }
        }
      } else if (tape_sum > 1) {
        for (let k = numStart + 1; k < binaryString.length; k++) {
          const num = k + 1;
          const otherCellophaneNumEl = document.getElementById("numInput-" + num);
          const otheropdVal = parseFloat(state.opdInput.value());
          const deltaK =
            (state.dArr[i - 380] *
              parseFloat(otherCellophaneNumEl.value) *
              2 *
              otheropdVal *
              Math.PI) /
            l /
            100;
          const celloK = [
            [1, 0],
            [0, math.exp(math.complex(0, -deltaK))],
          ];
          const targetAngleEl = document.getElementById("rotateInput-" + num);
          const b =
            ((parseFloat(targetAngleEl.value) - parseFloat(referenceAngleEl.value)) *
              Math.PI) /
            180;
          if (bit[k] == 0) {
            E_2 = math.multiply(
              r_theta(b),
              math.multiply(celloK, math.multiply(mai_r_theta(b), E_2))
            );
          }
        }
      }

      let c;
      if (state.polarizerSelect.value() == "平行ニコル配置") {
        c = a;
      } else {
        c = a - Math.PI / 2;
      }

      const E_3 = math.multiply(jhons(c), E_2);
      const relativeStrength = math.abs(
        math.abs(math.multiply(E_3[0], E_3[0])) +
          math.abs(math.multiply(E_3[1], E_3[1]))
      );
      state.osArr[i - 380] =
        relativeStrength * state.osArrOrigin[i - 380] * state.R_all[i - 380];
      state.xArrAfter[i - 380] = state.osArr[i - 380] * state.xLambda[i - 380];
      state.yArrAfter[i - 380] = state.osArr[i - 380] * state.yLambda[i - 380];
      state.zArrAfter[i - 380] = state.osArr[i - 380] * state.zLambda[i - 380];
    }
    state.Intensity_all_now = math.sum(state.osArr);
    state.sum_ls_xArrAfter = math.sum(
      Array.from({ length: 371 }, (_, i) =>
        state.osArrOrigin[i] * state.R_all[i] * state.xLambda[i]
      )
    );
    state.sum_ls_yArrAfter = math.sum(
      Array.from({ length: 371 }, (_, i) =>
        state.osArrOrigin[i] * state.R_all[i] * state.yLambda[i]
      )
    );
    state.sum_ls_zArrAfter = math.sum(
      Array.from({ length: 371 }, (_, i) =>
        state.osArrOrigin[i] * state.R_all[i] * state.zLambda[i]
      )
    );
    for (let i = 380; i <= 750; i++) {
      state.speyBox[i - 380] =
        state.osArrOrigin[i - 380] * state.yLambda[i - 380] * state.R_all[i - 380];
    }
    state.spey = math.sum(state.speyBox);
    state.K = 1.0 / state.spey;
    const xSumAfter = math.sum(state.xArrAfter) * state.K;
    const ySumAfter = math.sum(state.yArrAfter) * state.K;
    const zSumAfter = math.sum(state.zArrAfter) * state.K;
    const tosRGB = [
      [3.2406, -1.5372, -0.4986],
      [-0.9689, 1.8758, 0.0415],
      [0.0557, -0.204, 1.057],
    ];
    const sRGB = math.multiply(tosRGB, [xSumAfter, ySumAfter, zSumAfter]);
    state.rAfter2 = toRGB(sRGB[0]);
    state.gAfter2 = toRGB(sRGB[1]);
    state.bAfter2 = toRGB(sRGB[2]);
  } else {
    if (state.polarizerSelect.value() == "平行ニコル配置") {
      state.rAfter2 = 200;
      state.gAfter2 = 200;
      state.bAfter2 = 200;
    } else {
      state.rAfter2 = 0;
      state.gAfter2 = 0;
      state.bAfter2 = 0;
    }
  }
}

// ============================================================
// 3D描画関数
// ============================================================

/**
 * 偏光板を描画する処理
 * @param {*} p p5インスタンス
 * @param {number} size サイズ
 * @param {number} x x座標
 * @param {number} y y座標
 * @param {number} z z座標
 * @param {number} pattern 0=平行, 1=直交
 */
function createPolarizer(p, size, x, y, z, pattern) {
  p.push();
  p.translate(x, y, z);
  p.noFill();
  p.strokeWeight(0.1);
  p.stroke(0, 200);
  p.box(size, size, 0);
  if (pattern == 0) {
    for (let i = 0; i < size; i += 5) {
      p.line(-size / 2 + i, size / 2, 0, -size / 2 + i, -size / 2, 0);
    }
  } else {
    for (let i = 0; i < size; i += 5) {
      p.line(-size / 2, -size / 2 + i, 0, size / 2, -size / 2 + i, 0);
    }
  }
  p.pop();
}

/**
 * セロハンを3Dで描画する処理
 * @param {*} p p5インスタンス
 * @param {number} n 枚数
 * @param {number} rotAngle 回転角（度）
 * @param {number} a z座標オフセット
 * @param {number} angle_1 テープ幅計算用角度
 */
function createCellophane(p, n, rotAngle, a, angle_1) {
  p.push();
  p.rotateZ((rotAngle * Math.PI) / 180);
  p.fill(255, 255, 255, 0);
  for (let i = 0; i < n; i++) {
    p.push();
    p.translate(-0, 0, -0.1 * (i + a));
    p.box(
      2 * state.radius * Math.cos(angle_1),
      2 * state.radius * Math.sin(angle_1),
      0.1
    );
    p.pop();
  }
  p.pop();
}

/**
 * 補助線の描画
 * @param {*} p p5インスタンス
 */
function checked(p) {
  p.push();
  p.translate(0, 0, -60);
  p.stroke(255, 0, 0);
  p.line(0, 100, 0, -100);
  p.pop();
  for (let i = 0; i < state.colabNum; i++) {
    const num = i + 1;
    const rotateInputEl = document.getElementById("rotateInput-" + num);
    p.push();
    p.rotateZ((parseFloat(rotateInputEl.value) * Math.PI) / 180);
    p.stroke(0, 0, 0);
    p.push();
    p.translate(0, 0, -60);
    p.line(0, 100, 0, -100);
    p.pop();
    p.pop();
  }
}

// ============================================================
// 画像ピクセル処理
// ============================================================

/**
 * ある角度におけるテープの4隅の点の情報を算出し、state に格納する
 * @param {*} p p5インスタンス
 * @param {number} tape_angle テープの角度（ラジアン）
 */
function getrectPoint(p, tape_angle) {
  p.push();
  p.translate(-100, -100);
  const sinValues = [
    Math.sin(state.angle_1 + tape_angle - Math.PI / 2),
    Math.sin(state.angle_2 + tape_angle - Math.PI / 2),
    Math.sin(state.angle_3 + tape_angle - Math.PI / 2),
    Math.sin(state.angle_4 + tape_angle - Math.PI / 2),
  ];
  const cosValues = [
    Math.cos(state.angle_1 + tape_angle - Math.PI / 2),
    Math.cos(state.angle_2 + tape_angle - Math.PI / 2),
    Math.cos(state.angle_3 + tape_angle - Math.PI / 2),
    Math.cos(state.angle_4 + tape_angle - Math.PI / 2),
  ];

  state.x1 = state.centerX + cosValues[0] * state.radius;
  state.y1 = state.centerY + sinValues[0] * state.radius;
  state.x2 = state.centerX + cosValues[1] * state.radius;
  state.y2 = state.centerY + sinValues[1] * state.radius;
  state.x3 = state.centerX + cosValues[2] * state.radius;
  state.y3 = state.centerY + sinValues[2] * state.radius;
  state.x4 = state.centerX + cosValues[3] * state.radius;
  state.y4 = state.centerY + sinValues[3] * state.radius;

  p.line(state.x1, state.y1, state.x2, state.y2);
  p.line(state.x2, state.y2, state.x3, state.y3);
  p.line(state.x3, state.y3, state.x4, state.y4);
  p.line(state.x4, state.y4, state.x1, state.y1);
  p.pop();
}

/**
 * そのピクセルがテープの内部にあるかを判定
 * @param {number} i ピクセルインデックス（ピクセル数）
 * @returns {boolean}
 */
function checkA(i) {
  const x = i % state.img.width;
  const y = (i - x) / state.img.width;
  const P0 = { x, y };
  const P1 = { x: state.x1, y: state.y1 };
  const P2 = { x: state.x2, y: state.y2 };
  const P3 = { x: state.x3, y: state.y3 };
  const P4 = { x: state.x4, y: state.y4 };

  const c1 = crossProduct(P0, P1, P2);
  const c2 = crossProduct(P0, P2, P3);
  const c3 = crossProduct(P0, P3, P4);
  const c4 = crossProduct(P0, P4, P1);

  return (
    (c1 > 0 && c2 > 0 && c3 > 0 && c4 > 0) ||
    (c1 < 0 && c2 < 0 && c3 < 0 && c4 < 0)
  );
}

/**
 * テープ内部判定用の外積計算
 */
function crossProduct(P, A, B) {
  const AB = { x: B.x - A.x, y: B.y - A.y };
  const AP = { x: P.x - A.x, y: P.y - A.y };
  return AB.x * AP.y - AB.y * AP.x;
}

/**
 * tape1枚目のみに色を塗る
 * @param {number} rAfter1
 * @param {number} gAfter1
 * @param {number} bAfter1
 */
function drawTape_1(rAfter1, gAfter1, bAfter1) {
  for (let i = 0; i < state.img.pixels.length / 4; i++) {
    if (checkA(i)) {
      state.img.pixels[i * 4] = rAfter1;
      state.img.pixels[i * 4 + 1] = gAfter1;
      state.img.pixels[i * 4 + 2] = bAfter1;
    } else {
      if (state.polarizerSelect.value() == "平行ニコル配置") {
        state.img.pixels[i * 4] = 200;
        state.img.pixels[i * 4 + 1] = 200;
        state.img.pixels[i * 4 + 2] = 200;
      } else {
        state.img.pixels[i * 4] = 0;
        state.img.pixels[i * 4 + 1] = 0;
        state.img.pixels[i * 4 + 2] = 0;
      }
    }
  }
}

/**
 * tapeが2枚以上ある場合における色の塗りつぶし
 * @param {*} p p5インスタンス
 */
function drawTapes(p) {
  if (!state.DrawisDead) {
    state.drawT++;
    if (state.drawCount == 0) {
      state.tape_array = new Array(state.img.pixels.length / 4).fill("");
      state.tape_arraySum = new Array(state.img.pixels.length / 4).fill("");
      state.drawCount++;
    }
    state.drawSize = Math.floor(state.img.height / state.colabNum);
    const startYT = (state.drawT - 1) * state.drawSize;
    const endYT = Math.min(state.img.height, startYT + state.drawSize);
    state.img.loadPixels();
    for (let t = 0; t < state.colabNum; t++) {
      state.tape_angle_get =
        ((state.tape_angle[t] - 90) * Math.PI) / 180;
      getrectPoint(p, state.tape_angle_get);

      for (let i = startYT * state.img.width; i < endYT * state.img.width; i++) {
        if (checkA(i)) {
          state.tape_array[i] = "0";
        } else {
          state.tape_array[i] = "1";
        }
        state.tape_arraySum[i] += state.tape_array[i];
      }
    }

    for (let i = startYT * state.img.width; i < endYT * state.img.width; i++) {
      state.zz = parseInt(state.tape_arraySum[i], 2);
      const index = i * 4;
      state.img.pixels[index] = state.rAftera[state.zz];
      state.img.pixels[index + 1] = state.gAftera[state.zz];
      state.img.pixels[index + 2] = state.bAftera[state.zz];
    }
    if (state.drawT >= state.colabNum) {
      state.DrawisDead = true;
    }
    state.img.updatePixels();
  } else {
    state.CisDead = true;
  }
}

// ============================================================
// セロハンの総枚数カウント
// ============================================================

/**
 * セロハンの総数の数え上げをする処理
 * @returns {number} 総枚数
 */
function numInputFunction() {
  state.cellophaneNum = 0;
  for (let i = 0; i < state.colabNum; i++) {
    const num = i + 1;
    const numInputEl = document.getElementById("numInput-" + num);
    state.cellophaneNum += parseInt(numInputEl.value);
  }
  return state.cellophaneNum;
}

// ============================================================
// 白画像の初期化
// ============================================================

/**
 * 白画像を定位置に配置し、pixelsの色を初期値にする処理
 */
export function createStartimg() {
  state.img.resize(200, 200);
  state.centerX = 100;
  state.centerY = 100;
  state.img.loadPixels();
  for (let i = 0; i < state.img.pixels.length; i += 4) {
    state.img.pixels[i] = 200;
    state.img.pixels[i + 1] = 200;
    state.img.pixels[i + 2] = 200;
    state.img.pixels[i + 3] = 255;
  }
  state.img.updatePixels();
}

// ============================================================
// メイン描画ルーティン
// ============================================================

/**
 * normalにおける配列用意や画像の貼り付け、テープ幅の設定、偏光板の表示など
 * @param {*} p p5インスタンス
 */
function prenormal(p) {
  p.frameRate(60);
  state.tape_angle = new Array(state.colabNum).fill(0);
  state.tape_angle_cal = new Array(state.colabNum).fill(0);
  state.tape_number_cal = new Array(state.colabNum).fill(0);

  state.angle_1 = Math.atan2(100, state.slider.value());
  state.angle_2 = Math.PI - Math.atan2(100, state.slider.value());
  state.angle_3 = Math.PI + Math.atan2(100, state.slider.value());
  state.angle_4 = 2 * Math.PI - Math.atan2(100, state.slider.value());

  p.rotateY((180 * Math.PI) / 180);
  p.background(state.rBefore, state.gBefore, state.bBefore);
  p.push();
  p.translate(-100, -100);
  p.image(state.img, 0, 0);
  p.pop();

  createPolarizer(p, 200, 0, 0, 0, 0);
  state.cellophaneNum = numInputFunction();
  if (state.polarizerSelect.value() == "平行ニコル配置") {
    createPolarizer(p, 200, 0, 0, -0.1 * state.cellophaneNum, 0);
  }
  if (state.polarizerSelect.value() == "直交ニコル配置") {
    createPolarizer(p, 200, 0, 0, -0.1 * state.cellophaneNum, 1);
  }
}

/**
 * normalにおける、組数1での色計算と配色の処理
 * @param {*} p p5インスタンス
 */
function colabNum1_normal(p) {
  if (state.colabNum == 1) {
    let z = 0;
    const numInputEl = document.getElementById("numInput-1");
    const rotateInputEl = document.getElementById("rotateInput-1");
    createCellophane(
      p,
      parseInt(numInputEl.value),
      parseFloat(rotateInputEl.value),
      z,
      state.angle_1
    );
    afterColorCalculate1();
    state.img.loadPixels();
    state.tape_angle_get =
      ((parseFloat(rotateInputEl.value) - 90) * Math.PI) / 180;
    getrectPoint(p, state.tape_angle_get);
    drawTape_1(
      state.rAfter1,
      state.gAfter1,
      state.bAfter1
    );
    state.img.updatePixels();
  }
}

/**
 * normalにおける、組数2以上での色計算と配色の処理
 * @param {*} p p5インスタンス
 */
function colabNum2_normal(p) {
  if (state.colabNum >= 2) {
    if (state.count2 === 0) {
      for (let i = 0; i < state.img.pixels.length; i += 4) {
        state.img.pixels[i] = 200;
        state.img.pixels[i + 1] = 200;
        state.img.pixels[i + 2] = 200;
        state.img.pixels[i + 3] = 255;
      }
      state.img.updatePixels();
    }

    if (state.colabNum !== state.lastValue) {
      state.BisDead = false;
      state.CisDead = false;
      state.Bcount = 0;
      state.Bdraw = 0;
      state.DrawisDead = false;
      state.drawT = 0;
      state.drawCount = 0;
      state.lastValue = state.colabNum;
      state.calculate = 0;
    }
    state.currentSlider = state.slider.value();
    let check = 0;
    for (let n = 1; n <= state.colabNum; n++) {
      const numInputVal = parseInt(
        document.getElementById("numInput-" + n).value
      );
      const rotateInputVal = parseFloat(
        document.getElementById("rotateInput-" + n).value
      );
      const optInputVal = state.opdInput.value();
      const nowpolarizer = state.polarizerSelect.value();
      if (numInputVal !== state.last_otherCellophaneNums[n - 2]) {
        check++;
        state.last_otherCellophaneNums[n - 2] = numInputVal;
      }
      if (rotateInputVal !== state.last_targetAngles[n - 2]) {
        check++;
        state.last_targetAngles[n - 2] = rotateInputVal;
      }
      if (optInputVal !== state.last_opt1) {
        check++;
        state.last_opt1 = optInputVal;
      }
      if (nowpolarizer !== state.last_polarizer) {
        check++;
        state.last_polarizer = nowpolarizer;
      }
    }
    if (state.lastSlider !== state.currentSlider) {
      state.lastSlider = state.currentSlider;
      state.Cluster1isDead = false;
      state.BisDead = false;
      state.CisDead = false;
      state.Bcount = 0;
      state.Bdraw = 0;
      state.DrawisDead = false;
      state.drawT = 0;
      state.drawCount = 0;
      state.changeisDead = false;
    }
    if (check >= 1) {
      state.BisDead = false;
      state.CisDead = false;
      state.Bcount = 0;
      state.Bdraw = 0;
      state.DrawisDead = false;
      state.drawT = 0;
      state.drawCount = 0;
      state.calculate = 0;
    }

    if (!state.BisDead) {
      state.Bdraw++;
      if (state.Bcount == 0) {
        state.rAftera = new Array(math.pow(2, state.colabNum));
        state.gAftera = new Array(math.pow(2, state.colabNum));
        state.bAftera = new Array(math.pow(2, state.colabNum));
        state.Bcount += 1;
      }
      p.push();
      p.fill(255, 0, 0, 10);
      p.ellipse(0, 0, p.frameRate() * 8, p.frameRate() * 8);
      p.pop();
      if (typeof state.Bsize === "undefined") {
        state.Bsize = 100;
      }
      if (p.frameRate() < 30) {
        state.Bsize = Math.max(25, state.Bsize / 2);
      } else {
        state.Bsize = Math.min(1000, state.Bsize * 1.5);
      }

      const start = (state.Bdraw - 1) * state.Bsize;
      const end = Math.min(math.pow(2, state.colabNum), start + state.Bsize);
      for (let i = start; i < end; i++) {
        const binaryString = i
          .toString(2)
          .padStart(state.colabNum, "0");
        afterColorCalculates(binaryString);
        state.rAftera[i] = state.rAfter2;
        state.gAftera[i] = state.gAfter2;
        state.bAftera[i] = state.bAfter2;
      }
      if (end == math.pow(2, state.colabNum)) {
        state.BisDead = true;
      }
    }

    if (state.BisDead == true) {
      if (!state.CisDead) {
        let z = 0;
        for (let i = 0; i < state.colabNum; i++) {
          const num = i + 1;
          const numInputEl = document.getElementById("numInput-" + num);
          const rotateInputEl = document.getElementById("rotateInput-" + num);
          createCellophane(
            p,
            parseInt(numInputEl.value),
            parseFloat(rotateInputEl.value),
            z,
            state.angle_1
          );
          z += parseInt(numInputEl.value);
          state.tape_angle[i] = parseFloat(rotateInputEl.value);
        }
        drawTapes(p);
        state.img.updatePixels();
      }
    }
  }
}

// ============================================================
// シミュレーション描画エントリポイント
// ============================================================

/**
 * 1フレーム分のシミュレーションを描画する
 * @param {*} p p5インスタンス
 */
export function drawSimulation(p) {
  state.currentValue = state.optRadio.value();
  state.radius = 111;
  prenormal(p);
  colabNum1_normal(p);
  colabNum2_normal(p);
  if (state.lineradio.value() === "補助線あり") {
    checked(p);
  }
  afterColorCalculate();
  if (state.preValue !== state.currentValue) {
    optChanged();
    p.ellipse(0, 0, 50, 50);
  }
}

// ============================================================
// グラフ描画
// ============================================================

/**
 * スペクトルグラフを描画する
 */
export function drawGraph() {
  if (typeof state.mainChartObj !== "undefined" && state.mainChartObj) {
    state.mainChartObj.destroy();
  }
  const mainData = {
    labels: state.waveLengthArr,
    datasets: [
      {
        label: "シミュレーションのスペクトル",
        data: state.osArr,
        backgroundColor:
          "rgba(" +
          state.rAfter +
          "," +
          state.gAfter +
          "," +
          state.bAfter +
          ",0.5)",
        borderColor:
          "rgba(" +
          state.rAfter +
          "," +
          state.gAfter +
          "," +
          state.bAfter +
          ",1)",
        pointRadius: 0,
        fill: "start",
        showLine: true,
      },
      {
        label: "１枚目の偏光板を透過した時のスペクトル",
        data: state.osArrOrigin,
        backgroundColor:
          "rgba(" +
          state.rBefore +
          "," +
          state.gBefore +
          "," +
          state.bBefore +
          ",0.5)",
        borderColor:
          "rgba(" +
          state.rBefore +
          "," +
          state.gBefore +
          "," +
          state.bBefore +
          ",1)",
        pointRadius: 0,
        fill: "start",
        showLine: true,
      },
    ],
  };
  const mainOptions = {
    plugins: {
      legend: { labels: { font: { size: 16 } } },
      title: {
        display: true,
        text: "１枚目の偏光板を透過した後とシミュレーションのスペクトルの比較",
        font: { size: 20 },
      },
    },
    responsive: true,
    maintainAspectRatio: false,
    animation: false,
    scales: {
      x: {
        display: true,
        title: { display: true, text: "波長(nm)", font: { size: 16 } },
        max: 750,
        min: 380,
        ticks: { font: { size: 14 } },
      },
      y: {
        display: true,
        title: { display: true, text: "強度(a.u.)", font: { size: 16 } },
        max: 1,
        min: 0,
        ticks: { font: { size: 14 } },
      },
    },
  };
  const mainCtx = document.getElementById("mainSpectrumGraph");
  if (mainCtx) {
    state.mainChartObj = new Chart(mainCtx, {
      type: "scatter",
      data: mainData,
      options: mainOptions,
    });
  }
}
