// class.ts はSpringクラス管理専用のファイルです。

import p5 from "p5";
import { state, FPS } from "./state.js";
import {
  computeEffectiveSpringConstant,
  computeSpringPosition
} from "./physics.js";

/** 天井・ばね・玉の間の取り付け線の長さ */
const MOUNT_LINE_LENGTH = 10;
/** 直列/並列分岐点からばね取り付け位置までの垂下量 */
const BRACKET_DROP = 5;
/** 分岐して1本のばねに繋がるまでのオフセット */
const BRACKET_ATTACH_OFFSET = MOUNT_LINE_LENGTH + BRACKET_DROP;
/** ばね1本(直列・combination=3)の上下取り付け線の合計長さ */
const SINGLE_MOUNT_GAP = 2 * MOUNT_LINE_LENGTH;
/** ばね2本並列(combination=2)の上下取り付け線の合計長さ */
const PARALLEL_MOUNT_GAP = 2 * BRACKET_ATTACH_OFFSET;

/**
 * ばね振り子（単独・直列・並列の組み合わせ）を表すクラス。
 */
export class Spring {
  posx: number;
  posy: number;
  konstant: number;
  weight: number;
  combination: number;
  amplitude: number;
  number: 1 | 2;

  /**
   * @param {number|string} k ばね定数
   * @param {number|string} w 質量
   * @param {number|string} c 組み合わせ（1: 単独, 2: 並列, 3: 直列）
   * @param {number|string} a 振幅
   * @param {1|2} n 上下どちらのばねか
   */
  constructor(
    k: number | string,
    w: number | string,
    c: number | string,
    a: number | string,
    n: 1 | 2
  ) {
    this.posx = 0;
    this.posy = 0;
    this.konstant = Number(k);
    this.weight = Number(w);
    this.combination = Number(c);
    this.amplitude = Number(a);
    this.number = n;
  }

  /**
   * ばねとおもりを描画する。
   * @param {*} p p5インスタンス
   */
  draw(p: p5) {
    const springImage = state.springImage!;
    const ballImage = state.ballImage!;
    const s_konstant = computeEffectiveSpringConstant(
      this.konstant,
      this.combination
    );
    const { x, y } = computeSpringPosition(
      s_konstant,
      this.weight,
      this.amplitude,
      state.count / FPS
    );
    this.posx = x;
    this.posy = y + p.height / 4;
    let d;
    if (this.number === 1) {
      d = 0;
    } else {
      d = p.height / 2;
    }
    if (this.combination === 1) {
      p.line(p.width / 4 / 2, d, p.width / 4 / 2, MOUNT_LINE_LENGTH + d);
      p.image(
        springImage,
        p.width / 4 / 2 - springImage.width / 2,
        MOUNT_LINE_LENGTH + d,
        springImage.width,
        this.posy - SINGLE_MOUNT_GAP - ballImage.height / 2
      );
      p.line(
        p.width / 4 / 2,
        this.posy - MOUNT_LINE_LENGTH - ballImage.height / 2 + d,
        p.width / 4 / 2,
        this.posy - ballImage.height / 2 + d
      );
    }
    if (this.combination === 2) {
      p.line(p.width / 4 / 2, d, p.width / 4 / 2, MOUNT_LINE_LENGTH + d);
      p.line(
        p.width / 4 / 4,
        MOUNT_LINE_LENGTH + d,
        (3 * (p.width / 4)) / 4,
        MOUNT_LINE_LENGTH + d
      );
      p.line(
        p.width / 4 / 4,
        MOUNT_LINE_LENGTH + d,
        p.width / 4 / 4,
        BRACKET_ATTACH_OFFSET + d
      );
      p.line(
        (3 * (p.width / 4)) / 4,
        MOUNT_LINE_LENGTH + d,
        (3 * (p.width / 4)) / 4,
        BRACKET_ATTACH_OFFSET + d
      );
      p.image(
        springImage,
        p.width / 4 / 4 - springImage.width / 2,
        BRACKET_ATTACH_OFFSET + d,
        springImage.width,
        this.posy - PARALLEL_MOUNT_GAP - ballImage.height / 2
      );
      p.image(
        springImage,
        (3 * (p.width / 4)) / 4 - springImage.width / 2,
        BRACKET_ATTACH_OFFSET + d,
        springImage.width,
        this.posy - PARALLEL_MOUNT_GAP - ballImage.height / 2
      );
      p.line(
        p.width / 4 / 4,
        this.posy - BRACKET_ATTACH_OFFSET - ballImage.height / 2 + d,
        p.width / 4 / 4,
        this.posy - MOUNT_LINE_LENGTH - ballImage.height / 2 + d
      );
      p.line(
        (3 * (p.width / 4)) / 4,
        this.posy - BRACKET_ATTACH_OFFSET - ballImage.height / 2 + d,
        (3 * (p.width / 4)) / 4,
        this.posy - MOUNT_LINE_LENGTH - ballImage.height / 2 + d
      );
      p.line(
        p.width / 4 / 4,
        this.posy - MOUNT_LINE_LENGTH - ballImage.height / 2 + d,
        (3 * (p.width / 4)) / 4,
        this.posy - MOUNT_LINE_LENGTH - ballImage.height / 2 + d
      );
      p.line(
        p.width / 4 / 2,
        this.posy - MOUNT_LINE_LENGTH - ballImage.height / 2 + d,
        p.width / 4 / 2,
        this.posy - ballImage.height / 2 + d
      );
    }
    if (this.combination === 3) {
      p.line(p.width / 4 / 2, d, p.width / 4 / 2, MOUNT_LINE_LENGTH + d);
      p.image(
        springImage,
        p.width / 4 / 2 - springImage.width / 2,
        MOUNT_LINE_LENGTH + d,
        springImage.width,
        (this.posy - PARALLEL_MOUNT_GAP - ballImage.height / 2) / 2
      );
      p.line(
        p.width / 4 / 2,
        (this.posy - PARALLEL_MOUNT_GAP - ballImage.height / 2) / 2 +
          MOUNT_LINE_LENGTH +
          d,
        p.width / 4 / 2,
        (this.posy - PARALLEL_MOUNT_GAP - ballImage.height / 2) / 2 +
          SINGLE_MOUNT_GAP +
          d
      );
      p.image(
        springImage,
        p.width / 4 / 2 - springImage.width / 2,
        (this.posy - PARALLEL_MOUNT_GAP - ballImage.height / 2) / 2 +
          SINGLE_MOUNT_GAP +
          d,
        springImage.width,
        (this.posy - PARALLEL_MOUNT_GAP - ballImage.height / 2) / 2
      );
      p.line(
        p.width / 4 / 2,
        this.posy - MOUNT_LINE_LENGTH - ballImage.height / 2 + d,
        p.width / 4 / 2,
        this.posy - ballImage.height / 2 + d
      );
    }
    p.image(
      ballImage,
      p.width / 4 / 2 - ballImage.width / 2,
      this.posy - ballImage.height / 2 + d
    );
    p.noFill();
    p.ellipse(
      p.width / 4 + p.width / 4 / 2,
      p.height / 4 + d,
      this.amplitude * 2,
      this.amplitude * 2
    );
    p.line(
      p.width / 4 + p.width / 4 / 2,
      p.height / 4 + d,
      p.width / 4 + p.width / 4 / 2 + this.posx,
      this.posy + d
    );
    p.image(
      ballImage,
      p.width / 4 + p.width / 4 / 2 - ballImage.width / 2 + this.posx,
      this.posy - ballImage.height / 2 + d
    );
    p.stroke(0, 100);
  }
}
