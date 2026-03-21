import { state } from "./state.js";
import { ReflectingWave } from "./reflecting-wave.js";

/**
 * 入射波を表すクラス。
 * - 入射波の高さやタイプ（sin波/矩形波）を管理し、描画時に配列を更新していく。
 * - 波が反射点に到達した際の反射波の生成ロジックも含む。
 */
export class IncidenceWave {
  /**
   * IncidenceWaveクラスのコンストラクタ。
   * @param {*} h 波の高さ。
   * @param {*} t 波のタイプ（"sin波" または "矩形波"）。
   * @param {*} p p5インスタンス。
   */
  constructor(h, t, p) {
    this.arr = [];
    this.p = p;
    let max_time = 60 * Math.floor(p.width / 60);
    for (let i = 60; i < max_time; i++) this.arr.push(0);
    this.count = 0;
    this.height = h;
    this.judge = false;
    this.waveType = t === "sin波" ? -1 : 1;
  }

  /**
   * 入射波の描画を行う関数。
   */
  _draw() {
    const p = this.p;
    let max_time = 60 * Math.floor(p.width / 60);
    if (max_time + 360 > this.count) {
      this.count += 1;
      if (this.count <= 360) {
        this.arr[0] =
          this.height *
          Math.sin((this.waveType * 2 * Math.PI * this.count) / 360);
      }
      for (let i = this.arr.length - 1; i > 0; i--) {
        this.arr[i] = this.arr[i - 1];
      }
    }
    if (this.arr[this.arr.length - 1] != 0 && this.judge == false) {
      state.waveArr.push(new ReflectingWave(this.height, this.waveType, p));
      this.judge = true;
    }
  }
}
