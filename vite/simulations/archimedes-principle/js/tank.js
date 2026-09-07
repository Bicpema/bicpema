import { state } from "./state.js";

/** 水槽画像の上端の余白（縁を含めて表示するための調整値） */
const IMAGE_TOP_MARGIN = 50;
/** 水槽画像の高さ方向の余白（上下の縁を含めて表示するための調整値） */
const IMAGE_HEIGHT_MARGIN = 100;

/**
 * 水槽画像（元画像）内における、水面の手前側の縁のY座標範囲。
 * 水槽画像を実際に計測して求めた値で、この帯を円柱より後に再描画することで、
 * 水面の手前の線が物体より手前に見えるようにする（沈み込みの表現）。
 */
const WATER_LINE_SRC_Y_START = 288;
const WATER_LINE_SRC_Y_END = 312;

/**
 * Tankクラス
 * 水槽の描画と状態を保持する。
 */
export class Tank {
  /**
   * @param {number} cx 水槽中心X座標
   * @param {number} bottomY 水槽底面Y座標
   * @param {number} w 水槽幅
   * @param {number} h 水槽高さ
   * @param {number} d 水槽奥行き（未使用）
   */
  constructor(cx, bottomY, w, h, d) {
    this.cx = cx;
    this.bottomY = bottomY;
    this.w = w;
    this.h = h;
    this.d = d;
  }

  /**
   * 水槽を描画する。
   * @param {*} p p5インスタンス
   */
  draw(p) {
    const halfW = this.w / 2;
    const imgX = this.cx - halfW;
    const imgY = this.bottomY - this.h;

    p.push();
    p.imageMode(p.CORNER);
    p.image(
      state.tankImage,
      imgX,
      imgY - IMAGE_TOP_MARGIN,
      this.w,
      this.h + IMAGE_HEIGHT_MARGIN
    );
    p.pop();
  }

  /**
   * 水面の手前側の線だけを再描画する。
   * 円柱を描画した後に呼び出すことで、水面の手前の線が円柱より前面に表示され、
   * 円柱が水に沈み込んでいるように見せる。
   * @param {*} p p5インスタンス
   */
  drawWaterSurfaceLine(p) {
    const img = state.tankImage;
    if (!img) return;

    const halfW = this.w / 2;
    const imgX = this.cx - halfW;
    const imgY = this.bottomY - this.h;
    const dx = imgX;
    const dy = imgY - IMAGE_TOP_MARGIN;
    const dWidth = this.w;
    const dHeight = this.h + IMAGE_HEIGHT_MARGIN;
    const sw = img.width;
    const sh = img.height;

    const destY0 = dy + (WATER_LINE_SRC_Y_START / sh) * dHeight;
    const destY1 = dy + (WATER_LINE_SRC_Y_END / sh) * dHeight;

    p.push();
    p.imageMode(p.CORNER);
    p.image(
      img,
      dx,
      destY0,
      dWidth,
      destY1 - destY0,
      0,
      WATER_LINE_SRC_Y_START,
      sw,
      WATER_LINE_SRC_Y_END - WATER_LINE_SRC_Y_START
    );
    p.pop();
  }
}
