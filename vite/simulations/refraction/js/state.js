// state.js はシミュレーションの共有可変状態を管理するファイルです。

export const state = {
  /** 光源の回転角（度） */
  lightRotateTheta: 0,
  /** animation/animationMaxモードで使う軌跡描画用オフスクリーングラフィックス */
  pg: null,
  /** 入射側の媒質の屈折率 */
  n1: 1,
  /** 屈折側の媒質の屈折率 */
  n2: 1.5,
  /** 相対屈折率 (n2/n1) */
  n12: 1.5,
  /** 入射角（ラジアン） */
  theta1: 0,
  /** 屈折角（ラジアン） */
  theta2: 0,
  /** 入射光線の起点x座標 */
  raysX: 0,
  /** 入射光線の起点y座標 */
  raysY: 0,
  /** 屈折光線の起点x座標 */
  raysX2: 0,
  /** 屈折光線の起点y座標 */
  raysY2: 0,
  /** 光線（animation系）の移動速度 */
  raysSpeed: 5,
  /** 光線の移動速度x成分 */
  raysSpeedX: 0,
  /** 光線の移動速度y成分 */
  raysSpeedY: 0,
  /** マウス長押しのフレームカウント */
  count: 0,
  /** 光源の回転操作リモコン画像 */
  rotateRemocon: null,
  /** 屈折率操作リモコン画像 */
  nRemocon: null,
  /** スネルの法則によるsin(θ2)相当の値（全反射判定に使用） */
  boundary: 0,
  /** 表示モード: "animation" | "animationMax" | "line" | "lineMax" */
  simulationMode: "lineMax",
};
