// element-function.tsはイベントハンドラー専用のファイルです。

import p5 from "p5";
import { state } from "./state.js";
import { initValue } from "./init.js";
import { LENGTH_INPUT_SCALE } from "./constants.js";
import type { Ball } from "./class.js";

/**
 * スタートボタンが押されたときの処理
 */
export function onStartClick() {
  state.clickedCount = true;
}

/**
 * ストップボタンが押されたときの処理
 */
export function onStopClick() {
  state.clickedCount = false;
}

/**
 * リセットボタンが押されたときの処理
 * @param p - p5インスタンス
 */
export function onResetClick(p: p5) {
  initValue(p);
}

/**
 * グリッド表示ボタンが押されたときの処理
 */
export function onGridClick() {
  state.gridIs = !state.gridIs;
}

/**
 * 入力欄の値を数値として読み取る。空欄や数値でない場合はnullを返す。
 * @param input - 入力欄の要素
 * @returns 入力値（無効な場合はnull）
 */
function readNumber(input: p5.Element) {
  const raw = String(input.value()).trim();
  const value = Number(raw);
  return raw === "" || !Number.isFinite(value) ? null : value;
}

/**
 * 振れ角度・紐の長さの入力が変更されたときの処理。
 * 経過時間を引き継いだまま周期や振幅を変えるとおもりが瞬間移動するため、
 * 条件を変更したら両方の振り子を初期位置に戻して停止する。
 * 入力途中の空欄・0以下の長さなど無効な値は反映しない。
 */
export function onInputChange() {
  const settings: [Ball, p5.Element, p5.Element][] = [
    [state.leftPendulum!, state.leftAngleInput!, state.leftLengthInput!],
    [state.rightPendulum!, state.rightAngleInput!, state.rightLengthInput!]
  ];
  for (const [pendulum, angleInput, lengthInput] of settings) {
    const angle = readNumber(angleInput);
    const length = readNumber(lengthInput);
    if (angle !== null) pendulum.theta0 = angle;
    if (length !== null && length > 0) {
      pendulum.stringLength = length * LENGTH_INPUT_SCALE;
    }
  }
  state.count = 0;
  state.clickedCount = false;
}
