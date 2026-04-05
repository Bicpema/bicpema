// logic.js はシミュレーションの中心的なロジックを定義するファイルです。

import { state, MEDIUM_QUANTITY } from "./state.js";
import { IncidentWave } from "./incident-wave.js";
import { ReflectedWave } from "./reflected-wave.js";

/**
 * シミュレーションを描画する。
 * @param {*} p - p5 インスタンス。
 */
export function drawSimulation(p) {
  p.background(100);

  if (state.buttonClickedIs) {
    for (let i = 0; i < state.incidentWaves.length; i++) {
      state.incidentWaves[i].calculate();
    }
    for (let i = 0; i < state.reflectedWaves.length; i++) {
      state.reflectedWaves[i].calculate();
    }
    for (let i = 0; i < MEDIUM_QUANTITY; i++) {
      state.mediums[i].calculate();
    }
  }

  for (let i = 0; i < MEDIUM_QUANTITY; i++) {
    state.mediums[i].display();
  }

  buttonFunction(p);
  stopperFunction(p);
  imageFunction(p);
}

/**
 * ボタンの処理を行う。
 * @param {*} p - p5 インスタンス。
 */
function buttonFunction(p) {
  if (p.mouseIsPressed) {
    if (
      state.buttonClickedIs &&
      p.dist(100, p.height / 2 + state.button.height, p.mouseX, p.mouseY) <
        state.button.height / 2
    ) {
      for (let i = 0; i < MEDIUM_QUANTITY; i++) {
        state.incidentWaves.push(
          new IncidentWave(
            p,
            (i * (p.width - 200)) / MEDIUM_QUANTITY,
            100,
            state.incidentWaves.length,
            i,
            true
          )
        );
      }
      for (let i = 0; i < MEDIUM_QUANTITY; i++) {
        state.reflectedWaves.push(
          new ReflectedWave(
            p,
            (i * (p.width - 200)) / MEDIUM_QUANTITY,
            100,
            state.reflectedWaves.length,
            MEDIUM_QUANTITY - i - 2,
            true
          )
        );
      }
    }
  }
}

/**
 * ストッパーの処理を行う。
 * @param {*} p - p5 インスタンス。
 */
function stopperFunction(p) {
  if (
    state.stopperX > p.width - 100 - state.stopper.width &&
    state.stopperY > p.height / 2 - state.stopper.height / 4 &&
    state.stopperY < p.height / 2 + state.stopper.height / 4
  ) {
    state.stopperX =
      p.width - state.stopper.width - 5 - (p.width - 200) / MEDIUM_QUANTITY;
    state.stopperY = p.height / 2 - state.stopper.height / 8;
    state.fixedIs = true;
  } else {
    state.fixedIs = false;
  }

  if (p.mouseIsPressed) {
    if (
      state.stopperX < p.mouseX &&
      p.mouseX < state.stopperX + state.stopper.width &&
      state.stopperY < p.mouseY &&
      p.mouseY < state.stopperY + state.stopper.height
    ) {
      state.stopperX = p.mouseX - state.stopper.width / 2;
      state.stopperY = p.mouseY - state.stopper.height / 2;
    }
  }
}

/**
 * 画像の処理を行う。
 * @param {*} p - p5 インスタンス。
 */
function imageFunction(p) {
  p.tint(255);
  if (
    p.mouseIsPressed &&
    p.dist(100, p.height / 2 + state.button.height, p.mouseX, p.mouseY) <
      state.button.height / 2
  ) {
    p.tint(255, 200, 200, 200);
  }
  p.image(
    state.button,
    100 - state.button.width / 2,
    p.height / 2 + state.button.height / 2
  );
  p.tint(255);
  p.image(state.stopper, state.stopperX, state.stopperY);
}
