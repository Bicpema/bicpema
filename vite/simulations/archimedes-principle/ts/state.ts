import { Tank } from "./tank.js";
import { Cylinder } from "./cylinder.js";

// グローバル状態管理オブジェクト
export const state: {
  /** 水槽オブジェクト */
  tank: Tank | null;
  /** 円柱オブジェクト */
  cylinder: Cylinder | null;
  /** 水面のY座標（基準座標系） */
  waterSurfaceY: number;
  /** 水槽画像（プリロードされたp5.Imageインスタンス） */
  tankImage: any;
  /** 沈む物体画像（プリロードされたp5.Imageインスタンス） */
  cylinderImage: any;
} = {
  /** 水槽オブジェクト */
  tank: null,
  /** 円柱オブジェクト */
  cylinder: null,
  /** 水面のY座標（基準座標系） */
  waterSurfaceY: 0,
  /** 水槽画像 */
  tankImage: null,
  /** 沈む物体画像 */
  cylinderImage: null
};
