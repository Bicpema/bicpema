import type p5 from "p5";
import { state } from "./state.js";
import {
  onMaterialAChange,
  onMaterialBChange,
  onMassAChange,
  onMassBChange
} from "./element-function.js";
import { initModal } from "../../../js/bicpema-modal-controller.js";
import type { BicpemaCanvasController } from "../../../js/bicpema-canvas-controller.js";

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
  "0.140"
];

/** 質量選択値 [kg] — index 0=大(0.3kg), 1=小(0.1kg) */
export const MASS_VALUES = [0.3, 0.1];

/**
 * シミュレーションの初期設定
 * @param {*} p p5インスタンス
 * @param {*} canvasController BicpemaCanvasControllerインスタンス
 */
export function settingInit(p: p5, canvasController: BicpemaCanvasController) {
  canvasController.fullScreen(p);
  p.frameRate(FPS);
  p.textAlign(p.CENTER, p.CENTER);
}

/**
 * DOM要素の取得とイベントハンドラ登録
 * @param {*} p p5インスタンス
 */
export function elCreate(p: p5) {
  state.materialSelectA = p.select("#materialSelectA");
  state.materialSelectB = p.select("#materialSelectB");
  state.massSelectA = p.select("#massSelectA");
  state.massSelectB = p.select("#massSelectB");

  state.materialSelectA.changed(onMaterialAChange);
  state.materialSelectB.changed(onMaterialBChange);
  state.massSelectA.changed(onMassAChange);
  state.massSelectB.changed(onMassBChange);

  initModal({
    openSelectors: "#toggleModal",
    modalSelector: "#settingsModal",
    closeSelectors: "#closeModal"
  });
}

/**
 * state の初期値をDOM要素から読み込む
 * @param {*} p p5インスタンス
 */
export function initValue(p: p5) {
  state.materialA = parseInt(state.materialSelectA.value(), 10);
  state.materialB = parseInt(state.materialSelectB.value(), 10);
  state.massA = parseInt(state.massSelectA.value(), 10);
  state.massB = parseInt(state.massSelectB.value(), 10);
}
