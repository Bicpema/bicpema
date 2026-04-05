import { state } from "./state.js";
import {
  onMaterialAChange,
  onMaterialBChange,
  onMassAChange,
  onMassBChange,
  onToggleModal,
  onCloseModal,
} from "./element-function.js";

export const FPS = 60;

/** 比熱 [J/(kg·K)] — アルミ, 鉄, 銅, 銀, 水銀 */
export const SPECIFIC_HEAT = [901, 448, 386, 236, 140];

export const MATERIAL_NAMES = ["アルミニウム", "鉄", "銅", "銀", "水銀"];

/** 比熱の表示文字列 [J/(g·K)] */
export const SPECIFIC_HEAT_LABELS = [
  "0.901",
  "0.448",
  "0.386",
  "0.236",
  "0.140",
];

/** 質量選択値 [kg] — index 0=大(0.3kg), 1=小(0.1kg) */
export const MASS_VALUES = [0.3, 0.1];

/**
 * シミュレーションの初期設定
 * @param {*} p p5インスタンス
 * @param {*} canvasController BicpemaCanvasControllerインスタンス
 */
export function settingInit(p, canvasController) {
  canvasController.fullScreen(p);
  p.frameRate(FPS);
  p.textAlign(p.CENTER, p.CENTER);
}

/**
 * DOM要素の取得とイベントハンドラ登録
 * @param {*} p p5インスタンス
 */
export function elCreate(p) {
  state.materialSelectA = p.select("#materialSelectA");
  state.materialSelectB = p.select("#materialSelectB");
  state.massSelectA = p.select("#massSelectA");
  state.massSelectB = p.select("#massSelectB");

  state.materialSelectA.changed(onMaterialAChange);
  state.materialSelectB.changed(onMaterialBChange);
  state.massSelectA.changed(onMassAChange);
  state.massSelectB.changed(onMassBChange);

  p.select("#toggleModal").mousePressed(onToggleModal);
  p.select("#closeModal").mousePressed(onCloseModal);
}

/**
 * state の初期値をDOM要素から読み込む
 * @param {*} p p5インスタンス
 */
export function initValue(p) {
  state.materialA = parseInt(state.materialSelectA.value());
  state.materialB = parseInt(state.materialSelectB.value());
  state.massA = parseInt(state.massSelectA.value());
  state.massB = parseInt(state.massSelectB.value());
}
