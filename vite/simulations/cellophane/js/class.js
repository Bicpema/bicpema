// class.jsは光線（Ray）クラスを定義するファイルです。

import { state } from "./state.js";
import {
  computeOpticalPathDifference,
  computeTransmittance,
} from "./physics.js";
import {
  computeAngularVelocity,
  OPD_PER_SHEET_R,
  OPD_PER_SHEET_G,
  OPD_PER_SHEET_B,
  WAVELENGTH_R,
  WAVELENGTH_G,
  WAVELENGTH_B,
  WAVE_AMPLITUDE,
  WAVE_POINT_RADIUS,
  FULL_OPACITY,
  DIM_OPACITY,
  DIM_STROKE_WEIGHT,
  RED_COLOR,
  GREEN_COLOR,
  BLUE_COLOR,
  RAYS_PER_COLOR,
  RAY_Z_RANGE,
  RAY_Z_START,
  RAY_Z_LIMIT,
  POLARIZER_Z,
} from "./constants.js";

/**
 * R/G/B各色の光線をRAYS_PER_COLOR本ずつ、z軸上に等間隔で生成し直す。
 * セロハンの枚数変更時など、光線の位置をリセットしたい場合に呼び出す。
 */
export function createRays() {
  state.rRays = [];
  state.gRays = [];
  state.bRays = [];
  for (let i = 0; i < RAYS_PER_COLOR; i++) {
    const z = RAY_Z_START + i * (RAY_Z_RANGE / RAYS_PER_COLOR);
    state.rRays[i] = new Ray(z, "r");
    state.gRays[i] = new Ray(z, "g");
    state.bRays[i] = new Ray(z, "b");
  }
}

/** 光線のクラス */
export class Ray {
  constructor(z, color) {
    this.posx = 0;
    this.posy = 0;
    this.posz = z;
    this.t = 0;
    this.x = true;
    this.y = true;
    this.z = true;
    this.clr = color;
    this.w = 0;
    this.opd = 0;
    this.wl = 0;
    this.magnification = 1;
  }

  _draw(p) {
    const cellophaneCount = state.cellophaneCountSlider.value();

    if (this.clr === "r") {
      this.wl = WAVELENGTH_R;
      this.w = computeAngularVelocity(this.wl);
      this.opd = computeOpticalPathDifference(cellophaneCount, OPD_PER_SHEET_R);
      this.magnification = computeTransmittance(this.opd, this.wl);
    }
    if (this.clr === "g") {
      this.wl = WAVELENGTH_G;
      this.w = computeAngularVelocity(this.wl);
      this.opd = computeOpticalPathDifference(cellophaneCount, OPD_PER_SHEET_G);
      this.magnification = computeTransmittance(this.opd, this.wl);
    }
    if (this.clr === "b") {
      this.wl = WAVELENGTH_B;
      this.w = computeAngularVelocity(this.wl);
      this.opd = computeOpticalPathDifference(cellophaneCount, OPD_PER_SHEET_B);
      this.magnification = computeTransmittance(this.opd, this.wl);
    }
    if (state.isRunning) {
      if (this.posz <= RAY_Z_LIMIT) {
        this.t += this.w;
      }
      this.posz -= 1;
    }
    if (this.posz < -RAY_Z_LIMIT) {
      this.posz = RAY_Z_LIMIT;
      this.t = 0;
    }
    if (POLARIZER_Z < this.posz && this.posz < RAY_Z_LIMIT) {
      this.x = true;
      this.y = true;
      this.z = true;
      this.posx = WAVE_AMPLITUDE * p.sin(p.radians(this.t));
      this.posy = -WAVE_AMPLITUDE * p.sin(p.radians(this.t));
    } else if (cellophaneCount < this.posz && this.posz < POLARIZER_Z) {
      this.x = false;
      this.y = false;
      this.z = true;
      this.posx = WAVE_AMPLITUDE * p.sin(p.radians(this.t));
      this.posy = -WAVE_AMPLITUDE * p.sin(p.radians(this.t));
    } else if (-POLARIZER_Z < this.posz && this.posz < -cellophaneCount) {
      this.x = false;
      this.y = false;
      this.z = true;
      this.posx =
        WAVE_AMPLITUDE *
        p.sin(p.radians(this.t) + (this.opd / this.wl) * (2 * p.PI));
      this.posy = -WAVE_AMPLITUDE * p.sin(p.radians(this.t));
    } else if (-RAY_Z_LIMIT < this.posz && this.posz < -POLARIZER_Z) {
      this.x = false;
      this.y = false;
      this.z = true;
      this.posx =
        p.sqrt(this.magnification) *
        WAVE_AMPLITUDE *
        p.sin(p.radians(this.t) + (this.opd / this.wl) * (2 * p.PI));
      this.posy =
        p.sqrt(this.magnification) *
        WAVE_AMPLITUDE *
        p.sin(p.radians(this.t) + (this.opd / this.wl) * (2 * p.PI));
    } else {
      this.x = false;
      this.y = false;
      this.z = false;
    }

    if (state.waveRepresentation === "line") {
      this._drawAsLine(p);
    } else {
      this._drawAsSphere(p);
    }
  }

  _drawAsLine(p) {
    if (this.clr === "r") {
      p.stroke(...RED_COLOR);
      p.strokeWeight(state.rIs ? 1 : DIM_STROKE_WEIGHT);
    }
    if (this.clr === "g") {
      p.stroke(...GREEN_COLOR);
      p.strokeWeight(state.gIs ? 1 : DIM_STROKE_WEIGHT);
    }
    if (this.clr === "b") {
      p.stroke(...BLUE_COLOR);
      p.strokeWeight(state.bIs ? 1 : DIM_STROKE_WEIGHT);
    }

    // x方向の波
    p.push();
    if (this.x === true) {
      p.line(0, 0, this.posz, this.posx, 0, this.posz);
    }
    p.pop();
    // y方向の波
    p.push();
    if (this.y === true) {
      p.line(0, 0, this.posz, 0, this.posy, this.posz);
    }
    p.pop();
    // z方向の波
    p.push();
    if (this.z === true) {
      p.line(0, 0, this.posz, this.posx, this.posy, this.posz);
    }
    p.pop();
  }

  _drawAsSphere(p) {
    p.noStroke();
    if (this.clr === "r") {
      p.fill(...RED_COLOR, state.rIs ? FULL_OPACITY : DIM_OPACITY);
    }
    if (this.clr === "g") {
      p.fill(...GREEN_COLOR, state.gIs ? FULL_OPACITY : DIM_OPACITY);
    }
    if (this.clr === "b") {
      p.fill(...BLUE_COLOR, state.bIs ? FULL_OPACITY : DIM_OPACITY);
    }

    // x方向の波
    p.push();
    p.translate(this.posx, 0, this.posz);
    if (this.x === true) {
      p.sphere(WAVE_POINT_RADIUS);
    }
    p.pop();
    // y方向の波
    p.push();
    p.translate(0, this.posy, this.posz);
    if (this.y === true) {
      p.sphere(WAVE_POINT_RADIUS);
    }
    p.pop();
    // z方向の波
    p.push();
    p.translate(this.posx, this.posy, this.posz);
    if (this.z === true) {
      p.sphere(WAVE_POINT_RADIUS);
    }
    p.pop();
  }
}
