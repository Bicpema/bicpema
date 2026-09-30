import { PISTON_Y_TOP } from "./constants.js";

export const state: {
  stage: number;
  weightOn: boolean;
  t: number;
  pistonY: number;
  img_flame: any;
  img_weight: any;
  img_ice: any;
  isPlaying: boolean;
  /** p.select()が返すp5.Elementインスタンス（再生/一時停止 トグルボタン） */
  playButton: any;
} = {
  stage: 0,
  weightOn: true,
  t: 0,
  pistonY: PISTON_Y_TOP,
  img_flame: null,
  img_weight: null,
  img_ice: null,
  isPlaying: true,
  playButton: null
};
