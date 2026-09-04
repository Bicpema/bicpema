// init.tsは初期処理専用のファイルです。

import { initModal } from "../../../js/bicpema-modal-controller.js";

/** シミュレーションのフレームレートを設定します。*/
export const FPS = 30;
/**
 * シミュレーションそのものの設定を行います。
 * @param p p5インスタンス
 */
export function settingInit(p: p5): void {
  p.frameRate(FPS);
  p.textAlign(p.CENTER, p.CENTER);
  p.textSize(16);
}

/**
 * 仮想DOMを読み込みます。
 * 設定モーダルを利用する場合は、index.htmlのコメントアウトを外してください
 * （モーダルが存在しない場合、initModal()は何もしません）。
 * @param p p5インスタンス
 */
export function elementSelectInit(p: p5): void {
  initModal({
    openSelectors: ".settings-modal-open",
    modalSelector: "#simulationSettingModal",
    closeSelectors: ".modal-close",
  });
}

/**
 * 仮想DOMの場所や実行関数を設定します。
 * @param p p5インスタンス
 */
export function elementPositionInit(p: p5): void {}

/**
 * 初期値を設定します。
 * @param p p5インスタンス
 */
export function valueInit(p: p5): void {}
