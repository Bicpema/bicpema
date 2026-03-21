// logic.jsはシミュレーションの描画処理と計算処理専用のファイルです。

import * as math from "mathjs";
import Chart from "chart.js/auto";
import { state } from "./state.js";
import { optChanged } from "./element-function.js";

// ============================================================
// 純粋数学ヘルパー関数
// ============================================================

function r_theta(theta) {
  return [
    [Math.cos(theta), -Math.sin(theta)],
    [Math.sin(theta), Math.cos(theta)],
  ];
}

function mai_r_theta(theta) {
  return [
    [Math.cos(theta), Math.sin(theta)],
    [-Math.sin(theta), Math.cos(theta)],
  ];
}

function jhons(theta) {
  return [
    [Math.sin(theta) ** 2, -Math.sin(theta) * Math.cos(theta)],
    [-Math.sin(theta) * Math.cos(theta), Math.cos(theta) ** 2],
  ];
}

function toRGB(a) {
  if (a <= 0.0031308) {
    a = 12.92 * a;
  } else {
    a = 1.055 * Math.pow(a, 1 / 2.4) - 0.055;
  }
  a = Math.max(0, Math.min(1, a));
  return Math.round(a * 255);
}

// ============================================================
// 色計算
// ============================================================

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
  const beforeColorEl = document.getElementById("beforeColor");
  if (beforeColorEl) {
    beforeColorEl.style.backgroundColor =
      `rgb(${state.rBefore},${state.gBefore},${state.bBefore})`;
  }
}

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
      const firstopdVal = parseFloat(
        document.getElementById("opdInput-1")?.value || "270"
      );
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
          const otheropdVal = parseFloat(
            document.getElementById("opdInput-" + n)?.value || "270"
          );
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
  const afterColorEl = document.getElementById("afterColor");
  if (afterColorEl) {
    afterColorEl.style.backgroundColor =
      `rgb(${state.rAfter},${state.gAfter},${state.bAfter})`;
  }
}

function afterColorCalculate1() {
  if (state.colabNum >= 1) {
    const referenceAngleEl = document.getElementById("rotateInput-1");
    const a = -(parseFloat(referenceAngleEl.value) * Math.PI) / 180;
    const firstCellophaneNumEl = document.getElementById("numInput-1");
    const E_1 = [[-Math.sin(a)], [Math.cos(a)]];

    for (let i = 380; i <= 750; i++) {
      const l = i;
      const firstopdVal = parseFloat(
        document.getElementById("opdInput-1")?.value || "270"
      );
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
      const firstopdVal = parseFloat(
        document.getElementById("opdInput-1")?.value || "270"
      );
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
          const otheropdVal = parseFloat(
            document.getElementById("opdInput-" + n)?.value || "270"
          );
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
          const otheropdVal = parseFloat(
            document.getElementById("opdInput-" + num)?.value || "270"
          );
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
      Array.from({ length: 371 }, (_, idx) =>
        state.osArrOrigin[idx] * state.R_all[idx] * state.xLambda[idx]
      )
    );
    state.sum_ls_yArrAfter = math.sum(
      Array.from({ length: 371 }, (_, idx) =>
        state.osArrOrigin[idx] * state.R_all[idx] * state.yLambda[idx]
      )
    );
    state.sum_ls_zArrAfter = math.sum(
      Array.from({ length: 371 }, (_, idx) =>
        state.osArrOrigin[idx] * state.R_all[idx] * state.zLambda[idx]
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

function crossProduct(P, A, B) {
  const AB = { x: B.x - A.x, y: B.y - A.y };
  const AP = { x: P.x - A.x, y: P.y - A.y };
  return AB.x * AP.y - AB.y * AP.x;
}

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
      state.tape_angle_get = ((state.tape_angle[t] - 90) * Math.PI) / 180;
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
    drawTape_1(state.rAfter1, state.gAfter1, state.bAfter1);
    state.img.updatePixels();
  }
}

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
      const optInputVal = parseFloat(
        document.getElementById("opdInput-" + n)?.value || "270"
      );
      const nowpolarizer = state.polarizerSelect.value();
      if (numInputVal !== state.last_otherCellophaneNums[n - 2]) {
        check++;
        state.last_otherCellophaneNums[n - 2] = numInputVal;
      }
      if (rotateInputVal !== state.last_targetAngles[n - 2]) {
        check++;
        state.last_targetAngles[n - 2] = rotateInputVal;
      }
      if (optInputVal !== state.last_opt[n - 2]) {
        check++;
        state.last_opt[n - 2] = optInputVal;
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
        state.rAftera = new Array(Math.pow(2, state.colabNum));
        state.gAftera = new Array(Math.pow(2, state.colabNum));
        state.bAftera = new Array(Math.pow(2, state.colabNum));
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
      const end = Math.min(Math.pow(2, state.colabNum), start + state.Bsize);
      for (let i = start; i < end; i++) {
        const binaryString = i.toString(2).padStart(state.colabNum, "0");
        afterColorCalculates(binaryString);
        state.rAftera[i] = state.rAfter2;
        state.gAftera[i] = state.gAfter2;
        state.bAftera[i] = state.bAfter2;
      }
      if (end == Math.pow(2, state.colabNum)) {
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
  const gp0 = document.getElementById("mainSpectrumGraphParent0");
  const gp = document.getElementById("mainSpectrumGraphParent");
  if (gp0) gp0.style.display = "none";
  if (gp) gp.style.display = "block";
  drawGraph();
  if (state.preValue !== state.currentValue) {
    optChanged();
    p.ellipse(0, 0, 50, 50);
  }
}

// ============================================================
// グラフ描画
// ============================================================

function drawGraph() {
  if (typeof state.mainChartObj !== "undefined" && state.mainChartObj) {
    state.mainChartObj.destroy();
  }
  const mainData = {
    labels: state.waveLengthArr,
    datasets: [
      {
        label: "シミュレーションのスペクトル",
        data: state.osArr,
        backgroundColor: `rgba(${state.rAfter},${state.gAfter},${state.bAfter},0.5)`,
        borderColor: `rgba(${state.rAfter},${state.gAfter},${state.bAfter},1)`,
        pointRadius: 0,
        fill: "start",
        showLine: true,
      },
      {
        label: "１枚目の偏光板を透過した時のスペクトル",
        data: state.osArrOrigin,
        backgroundColor: `rgba(${state.rBefore},${state.gBefore},${state.bBefore},0.5)`,
        borderColor: `rgba(${state.rBefore},${state.gBefore},${state.bBefore},1)`,
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

function drawGraph2_1(x1, y1) {
  if (typeof state.mainChartObj !== "undefined" && state.mainChartObj) {
    state.mainChartObj.destroy();
  }
  const osArr = [{ x: x1, y: y1 }];
  const circleArr = [];
  for (let theta = 0; theta < 2 * Math.PI; theta += Math.PI / 180) {
    circleArr.push({ x: Math.cos(theta), y: Math.sin(theta) });
  }
  const mainData = {
    datasets: [
      {
        label: "各層の色座標(円の外側程鮮やかS=1)",
        data: osArr,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        borderColor: "rgba(200, 200, 200, 1)",
        pointRadius: 5,
        showLine: false,
      },
      {
        label: "HSV色空間の境界",
        data: circleArr,
        borderColor: "red",
        borderWidth: 2,
        showLine: true,
        fill: false,
        pointRadius: 0,
      },
    ],
  };
  const mainOptions = {
    plugins: {
      legend: { labels: { font: { size: 16 } } },
      title: { display: true, text: "HSV色空間上での各層の色", font: { size: 20 } },
    },
    responsive: true,
    maintainAspectRatio: false,
    animation: false,
    scales: {
      x: {
        display: true,
        title: { display: true, text: "x", font: { size: 16 } },
        max: 1,
        min: -1,
        ticks: { font: { size: 14 }, stepSize: 0.1 },
      },
      y: {
        display: true,
        title: { display: true, text: "y", font: { size: 16 } },
        max: 1,
        min: -1,
        ticks: { font: { size: 14 }, stepSize: 0.1 },
      },
    },
  };
  const mainCtx = document.getElementById("mainSpectrumGraph0");
  if (mainCtx) {
    state.mainChartObj = new Chart(mainCtx, {
      type: "scatter",
      data: mainData,
      options: mainOptions,
    });
  }
}

function drawGraph2() {
  if (typeof state.mainChartObj !== "undefined" && state.mainChartObj) {
    state.mainChartObj.destroy();
  }
  const osArr = [];
  for (let i = 0; i < state.colabNum; i++) {
    const x2 = state.sAfterak[i] * Math.cos(state.hAfterak[i]);
    const y2 = state.sAfterak[i] * Math.sin(state.hAfterak[i]);
    osArr.push({ x: x2, y: y2 });
  }
  const circleArr = [];
  for (let theta = 0; theta < 2 * Math.PI; theta += Math.PI / 180) {
    circleArr.push({ x: Math.cos(theta), y: Math.sin(theta) });
  }
  const mainData = {
    datasets: [
      {
        label: "各層の色座標(円の外側程鮮やかS=1)",
        data: osArr,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        borderColor: "rgba(200, 200, 200, 1)",
        pointRadius: 5,
        showLine: false,
      },
      {
        label: "HSV色空間の境界",
        data: circleArr,
        borderColor: "red",
        borderWidth: 2,
        showLine: true,
        fill: false,
        pointRadius: 0,
      },
    ],
  };
  const mainOptions = {
    plugins: {
      legend: { labels: { font: { size: 16 } } },
      title: { display: true, text: "HSV色空間上での各層の色", font: { size: 20 } },
    },
    responsive: true,
    maintainAspectRatio: false,
    animation: false,
    scales: {
      x: {
        display: true,
        title: { display: true, text: "x", font: { size: 16 } },
        max: 1,
        min: -1,
        ticks: { font: { size: 14 }, stepSize: 0.1 },
      },
      y: {
        display: true,
        title: { display: true, text: "y", font: { size: 16 } },
        max: 1,
        min: -1,
        ticks: { font: { size: 14 }, stepSize: 0.1 },
      },
    },
  };
  const mainCtx = document.getElementById("mainSpectrumGraph0");
  if (mainCtx) {
    state.mainChartObj = new Chart(mainCtx, {
      type: "scatter",
      data: mainData,
      options: mainOptions,
    });
  }
}

// ============================================================
// HSV変換
// ============================================================

function rgbToHsv1(r, g, b) {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const d = max - min;
  let h;
  const s = max === 0 ? 0 : Math.min(d / max, 1);
  const v = max;
  if (max === min) {
    h = 0;
  } else {
    if (max === r) {
      h = (g - b) / d;
      if (g < b) h += 6;
    } else if (max === g) {
      h = (b - r) / d + 2;
    } else {
      h = (r - g) / d + 4;
    }
    h *= Math.PI / 3;
  }
  state.hAfter1 = h;
  state.sAfter1 = s;
  state.vAfter1 = v;
}

function rgbToHsv2(r, g, b) {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const d = max - min;
  let h;
  const s = max === 0 ? 0 : Math.min(d / max, 1);
  const v = max;
  if (max === min) {
    h = 0;
  } else {
    if (max === r) {
      h = (g - b) / d;
      if (g < b) h += 6;
    } else if (max === g) {
      h = (b - r) / d + 2;
    } else {
      h = (r - g) / d + 4;
    }
    h *= Math.PI / 3;
  }
  state.hAfter2 = h;
  state.sAfter2 = s;
  state.vAfter2 = v;
}

// ============================================================
// 画像クラスタリング処理
// ============================================================

function applyMedianFilter() {
  state.img2.loadPixels();
  const newPixels = [...state.img2.pixels];
  for (let y = 1; y < state.img2.height - 1; y++) {
    for (let x = 1; x < state.img2.width - 1; x++) {
      const index = (x + y * state.img2.width) * 4;
      const neighbors = [];
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          const nIndex = (x + dx + (y + dy) * state.img2.width) * 4;
          neighbors.push(state.img2.pixels[nIndex]);
        }
      }
      neighbors.sort((a, b) => a - b);
      newPixels[index] = neighbors[4];
      newPixels[index + 1] = neighbors[4];
      newPixels[index + 2] = neighbors[4];
    }
  }
  state.img2.pixels = newPixels;
  state.img2.updatePixels();
}

function detectEdges(thresholda) {
  state.edgePixels = new Array(state.img2.width * state.img2.height).fill(false);
  const threshold = thresholda;
  for (let y = 1; y < state.img2.height - 1; y++) {
    for (let x = 1; x < state.img2.width - 1; x++) {
      const sobelX = [-1, 0, 1, -2, 0, 2, -1, 0, 1];
      const sobelY = [-1, -2, -1, 0, 0, 0, 1, 2, 1];
      let gx = 0, gy = 0, idx = 0;
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          const nx = x + dx;
          const ny = y + dy;
          const nIndex = (nx + ny * state.img2.width) * 4;
          const intensity =
            (state.img2.pixels[nIndex] +
              state.img2.pixels[nIndex + 1] +
              state.img2.pixels[nIndex + 2]) /
            3;
          gx += intensity * sobelX[idx];
          gy += intensity * sobelY[idx];
          idx++;
        }
      }
      const magnitude = Math.sqrt(gx * gx + gy * gy);
      if (magnitude > threshold) {
        state.edgePixels[x + y * state.img2.width] = true;
      }
    }
  }
}

function dilateEdges() {
  const newEdgePixels = [...state.edgePixels];
  for (let y = state.dilationSize; y < state.img2.height - state.dilationSize; y++) {
    for (let x = state.dilationSize; x < state.img2.width - state.dilationSize; x++) {
      const index = x + y * state.img2.width;
      if (!state.edgePixels[index]) {
        for (let dy = -state.dilationSize; dy <= state.dilationSize; dy++) {
          for (let dx = -state.dilationSize; dx <= state.dilationSize; dx++) {
            const nIndex = x + dx + (y + dy) * state.img2.width;
            if (state.edgePixels[nIndex]) {
              newEdgePixels[index] = true;
            }
          }
        }
      }
    }
  }
  state.edgePixels = newEdgePixels;
}

function distSq(a, b) {
  return (a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2 + (a[2] - b[2]) ** 2;
}

function kmeans(data, k) {
  const centroids = [];
  centroids.push(data[Math.floor(Math.random() * data.length)]);
  for (let i = 1; i < k; i++) {
    const distances = data.map((point) =>
      Math.min(...centroids.map((c) => distSq(point, c)))
    );
    const sumDist = distances.reduce((a, b) => a + b, 0);
    let r = Math.random() * sumDist;
    let acc = 0;
    for (let j = 0; j < distances.length; j++) {
      acc += distances[j];
      if (acc >= r) {
        centroids.push(data[j]);
        break;
      }
    }
  }
  const labels = new Array(data.length).fill(0);
  let changed = true;
  while (changed) {
    changed = false;
    for (let i = 0; i < data.length; i++) {
      let minDist = Infinity, label = 0;
      for (let j = 0; j < k; j++) {
        const dist = distSq(data[i], centroids[j]);
        if (dist < minDist) { minDist = dist; label = j; }
      }
      if (labels[i] !== label) { labels[i] = label; changed = true; }
    }
    const sums = Array.from({ length: k }, () => [0, 0, 0, 0]);
    for (let i = 0; i < data.length; i++) {
      const label = labels[i];
      sums[label][0] += data[i][0];
      sums[label][1] += data[i][1];
      sums[label][2] += data[i][2];
      sums[label][3] += 1;
    }
    for (let j = 0; j < k; j++) {
      if (sums[j][3] > 0) {
        centroids[j] = [
          sums[j][0] / sums[j][3],
          sums[j][1] / sums[j][3],
          sums[j][2] / sums[j][3],
        ];
      }
    }
  }
  const clusterSizes = Array(k).fill(0);
  for (let i = 0; i < labels.length; i++) clusterSizes[labels[i]]++;
  const sortedClusters = Array.from({ length: k }, (_, i) => i).sort(
    (a, b) => clusterSizes[b] - clusterSizes[a]
  );
  const newLabelMap = {};
  for (let i = 0; i < k; i++) newLabelMap[sortedClusters[i]] = i;
  for (let i = 0; i < labels.length; i++) labels[i] = newLabelMap[labels[i]];
  return labels;
}

function smoothLabels() {
  for (let iter = 0; iter < state.iterations; iter++) {
    const newLabels = [...state.labels];
    for (let y = 0; y < state.img2.height; y++) {
      for (let x = 0; x < state.img2.width; x++) {
        const index = x + y * state.img2.width;
        if (state.edgePixels[index]) continue;
        const currentLabel = state.labels[index];
        const neighborLabels = [];
        for (let dy = -Math.floor(state.n / 2); dy <= Math.floor(state.n / 2); dy++) {
          for (let dx = -Math.floor(state.n / 2); dx <= Math.floor(state.n / 2); dx++) {
            const nx = x + dx;
            const ny = y + dy;
            if (nx >= 0 && nx < state.img2.width && ny >= 0 && ny < state.img2.height) {
              neighborLabels.push(state.labels[nx + ny * state.img2.width]);
            }
          }
        }
        const maxCount = neighborLabels.filter((l) => l === currentLabel).length;
        if (maxCount > neighborLabels.length / 2) {
          newLabels[index] = currentLabel;
        }
      }
    }
    state.labels = [...newLabels];
  }
}

function processClustering(rAfter1a, gAfter1a, bAfter1a, thresholda) {
  state.img2 = state.copyimg.get();
  state.img2.loadPixels();
  applyMedianFilter();
  detectEdges(thresholda);
  dilateEdges();
  smoothLabels();
  state.img2.loadPixels();
  for (let y = 0; y < state.img2.height; y++) {
    for (let x = 0; x < state.img2.width; x++) {
      const index = (x + y * state.img2.width) * 4;
      if (state.edgePixels[x + y * state.img2.width]) {
        state.img2.pixels[index] = 255;
        state.img2.pixels[index + 1] = 255;
        state.img2.pixels[index + 2] = 255;
      } else {
        state.img2.pixels[index] = rAfter1a;
        state.img2.pixels[index + 1] = gAfter1a;
        state.img2.pixels[index + 2] = bAfter1a;
      }
    }
  }
  state.img2.updatePixels();
}

function colabNum1_filledimage(p) {
  if (state.colabNum == 1) {
    p.frameRate(5);
    let check = 0;
    for (let n = 1; n <= state.colabNum; n++) {
      const numInputValue = parseInt(document.getElementById("numInput-" + n).value);
      const rotateInputValue = parseFloat(document.getElementById("rotateInput-" + n).value);
      const optInputValue = parseFloat(
        document.getElementById("opdInput-" + n)?.value || "270"
      );
      const nowpolarizer = state.polarizerSelect.value();
      if (numInputValue !== state.last_otherCellophaneNums[n - 2]) {
        check++;
        state.last_otherCellophaneNums[n - 2] = numInputValue;
      }
      if (rotateInputValue !== state.last_targetAngles[n - 2]) {
        check++;
        state.last_targetAngles[n - 2] = rotateInputValue;
      }
      if (optInputValue !== state.last_opt[n - 2]) {
        check++;
        state.last_opt[n - 2] = optInputValue;
      }
      if (nowpolarizer !== state.last_polarizer) {
        check++;
        state.last_polarizer = nowpolarizer;
      }
    }
    if (state.lasthreshold !== state.thresholds) {
      state.lasthreshold = state.thresholds;
      check++;
    }
    if (check >= 1) {
      state.Cluster1isDead = false;
    }
    const numInputEl = document.getElementById("numInput-1");
    const rotateInputEl = document.getElementById("rotateInput-1");
    let z = 0;
    createCellophane(p, parseInt(numInputEl.value), parseFloat(rotateInputEl.value), z, state.angle_1);
    if (!state.Cluster1isDead) {
      afterColorCalculate1();
      processClustering(state.rAfter1, state.gAfter1, state.bAfter1, state.thresholds);
      rgbToHsv1(state.rAfter1, state.gAfter1, state.bAfter1);
      state.Cluster1isDead = true;
    }
    state.x_1 = state.sAfter1 * Math.cos(state.hAfter1);
    state.y_1 = state.sAfter1 * Math.sin(state.hAfter1);
    const gp = document.getElementById("mainSpectrumGraphParent");
    const gp0 = document.getElementById("mainSpectrumGraphParent0");
    if (gp) gp.style.display = "none";
    if (gp0) gp0.style.display = "block";
    drawGraph2_1(state.x_1, state.y_1);
  }
}

function prefilledimage(p) {
  p.frameRate(60);
  state.tape_angle = new Array(state.colabNum).fill(0);
  state.tape_angle_cal = new Array(state.colabNum).fill(0);
  state.tape_number_cal = new Array(state.colabNum).fill(0);
  state.thresholds = state.edgieSlider ? state.edgieSlider.value() : 50;
  state.angle_1 = Math.atan2(100, state.slider.value());
  state.angle_2 = Math.PI - Math.atan2(100, state.slider.value());
  state.angle_3 = Math.PI + Math.atan2(100, state.slider.value());
  state.angle_4 = 2 * Math.PI - Math.atan2(100, state.slider.value());
  p.rotateY((180 * Math.PI) / 180);
  p.background(200);
  p.push();
  p.translate(-100, -100);
  p.image(state.img2, 0, 0, 200, 200);
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

function colabNum2_filledimage(p) {
  if (state.colabNum !== state.lastCluster) {
    if (state.last_otherCellophaneNums.length !== state.colabNum) {
      state.last_otherCellophaneNums = new Array(state.colabNum).fill(0);
    }
    if (state.last_targetAngles.length !== state.colabNum) {
      state.last_targetAngles = new Array(state.colabNum).fill(0);
    }
    state.clusterCount = 0;
    state.labels = [];
    state.lastCluster = state.colabNum;
    return colabNum2_filledimage(p);
  }
  if (state.colabNum >= 2) {
    if (state.clusterCount == 0) {
      state.lastCluster = state.colabNum;
      state.img2 = state.copyimg.get();
      state.img2.loadPixels();
      applyMedianFilter();
      const data = [];
      for (let i = 0; i < state.img2.pixels.length; i += 4) {
        data.push([state.img2.pixels[i], state.img2.pixels[i + 1], state.img2.pixels[i + 2]]);
      }
      detectEdges(state.thresholds);
      dilateEdges();
      state.labels = kmeans(data, state.lastCluster);
      state.clusterCount = 1;
    }
    if (state.clusterCount == 1) {
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
      let check = false;
      for (let n = 0; n < state.colabNum; n++) {
        const numInputValue2 = parseInt(document.getElementById("numInput-" + (n + 1)).value);
        const rotateInputValue2 = parseFloat(document.getElementById("rotateInput-" + (n + 1)).value);
        if (numInputValue2 !== state.last_otherCellophaneNums[n]) {
          state.last_otherCellophaneNums[n] = numInputValue2;
          check = true;
        }
        if (rotateInputValue2 !== state.last_targetAngles[n]) {
          state.last_targetAngles[n] = rotateInputValue2;
          check = true;
        }
      }
      if (check) {
        state.BisDead = false;
        state.CisDead = false;
        state.Bcount = 0;
        state.Bdraw = 0;
        state.DrawisDead = false;
        state.drawT = 0;
        state.drawCount = 0;
        state.calculate = 0;
      }
      let z = 0;
      for (let i = 0; i < state.colabNum; i++) {
        const num = i + 1;
        const numInputEl = document.getElementById("numInput-" + num);
        const rotateInputEl = document.getElementById("rotateInput-" + num);
        createCellophane(p, parseInt(numInputEl.value), parseFloat(rotateInputEl.value), z, state.angle_1);
        z += parseInt(numInputEl.value);
      }
      if (!state.BisDead) {
        state.Bdraw++;
        if (state.Bcount == 0) {
          state.rAfterak = new Array(state.colabNum).fill(0);
          state.gAfterak = new Array(state.colabNum).fill(0);
          state.bAfterak = new Array(state.colabNum).fill(0);
          state.hAfterak = new Array(state.colabNum).fill(0);
          state.sAfterak = new Array(state.colabNum).fill(0);
          state.vAfterak = new Array(state.colabNum).fill(0);
          state.xdata = new Array(state.colabNum).fill(0);
          state.ydata = new Array(state.colabNum).fill(0);
          state.Bcount += 1;
        }
        p.push();
        p.fill(255, 0, 0);
        p.ellipse(0, 0, p.frameRate() * 8, p.frameRate() * 8);
        p.pop();
        for (let i = 1; i <= state.colabNum; i++) {
          let binaryString;
          if (i == 1) {
            binaryString = (0).toString(2).padStart(state.colabNum, "0");
          } else {
            binaryString = (Math.pow(2, i - 1) - 1).toString(2).padStart(state.colabNum, "0");
          }
          afterColorCalculates(binaryString);
          rgbToHsv2(state.rAfter2, state.gAfter2, state.bAfter2);
          state.rAfterak[i - 1] = state.rAfter2;
          state.gAfterak[i - 1] = state.gAfter2;
          state.bAfterak[i - 1] = state.bAfter2;
          state.hAfterak[i - 1] = state.hAfter2;
          state.sAfterak[i - 1] = state.sAfter2;
          state.vAfterak[i - 1] = state.vAfter2;
        }
        state.BisDead = true;
        p.push();
        p.fill(0, 255, 0);
        p.ellipse(0, 0, p.frameRate() * 8, p.frameRate() * 8);
        p.pop();
      }
      if (state.BisDead == true) {
        if (!state.CisDead) {
          smoothLabels();
          state.img2.loadPixels();
          for (let y = 0; y < state.img2.height; y++) {
            for (let x = 0; x < state.img2.width; x++) {
              const index = (x + y * state.img2.width) * 4;
              if (state.edgePixels[x + y * state.img2.width]) {
                state.img2.pixels[index] = 255;
                state.img2.pixels[index + 1] = 255;
                state.img2.pixels[index + 2] = 255;
              } else {
                const clusterIndex = state.labels[x + y * state.img2.width];
                state.img2.pixels[index] = state.rAfterak[clusterIndex];
                state.img2.pixels[index + 1] = state.gAfterak[clusterIndex];
                state.img2.pixels[index + 2] = state.bAfterak[clusterIndex];
              }
            }
          }
          state.img2.updatePixels();
          state.CisDead = true;
        } else {
          for (let i = 0; i < state.colabNum; i++) {
            state.xdata[i] = state.sAfterak[i] * Math.cos(state.hAfterak[i]);
            state.ydata[i] = state.sAfterak[i] * Math.sin(state.hAfterak[i]);
          }
          const gp = document.getElementById("mainSpectrumGraphParent");
          const gp0 = document.getElementById("mainSpectrumGraphParent0");
          if (gp) gp.style.display = "none";
          if (gp0) gp0.style.display = "block";
          drawGraph2();
        }
      }
      for (let i = 0; i < state.colabNum; i++) {
        p.push();
        p.stroke(0);
        p.translate(0, 0, -50);
        p.strokeWeight(2);
        p.fill(state.rAfterak[i], state.gAfterak[i], state.bAfterak[i]);
        p.rect(-100, 80 - 20 * i, 10, 10);
        p.pop();
      }
    }
  }
}
