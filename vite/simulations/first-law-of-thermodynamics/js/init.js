// init.js は初期処理専用のファイルです。

import { state } from "./state.js";
import { Molecule } from "./class.js";
import {
  onResetButtonClick,
  onToggleModalClick,
  onCloseModalClick,
  onQRadioChange,
} from "./element-function.js";

const PISTON_INIT_X = 512;
const CYL_LEFT = 183;

/**
 * 値の初期化を行う。
 * @param {object} p - p5 インスタンス
 */
export function initValue(p) {
  state.pistonX = PISTON_INIT_X;
  state.pistonX_target = PISTON_INIT_X;
  state.gasWidth = PISTON_INIT_X - CYL_LEFT;
  state.T = state.T0;
  state.step = 0;
  state.Q = 0;
  state.W = 0;
  state.dU = 0;

  state.molecules = [];
  for (let i = 0; i < state.N; i++) {
    state.molecules.push(
      new Molecule(
        p,
        p.random(201, PISTON_INIT_X - 27),
        p.random(146, 341),
        p.random(-1, 1),
        p.random(-1, 1)
      )
    );
  }

  const qRadios = document.querySelectorAll('input[name="qValue"]');
  qRadios.forEach((r) => {
    r.checked = r.value === "0";
  });
}

/**
 * DOM 要素のイベントリスナーを設定する。
 * @param {object} p - p5 インスタンス
 */
export function elCreate(p) {
  p.select("#resetButton").mousePressed(() => onResetButtonClick());
  p.select("#toggleModal").mousePressed(() => onToggleModalClick());
  p.select("#closeModal").mousePressed(() => onCloseModalClick());

  document.querySelectorAll('input[name="qValue"]').forEach((r) => {
    r.addEventListener("change", () => onQRadioChange());
  });
}
