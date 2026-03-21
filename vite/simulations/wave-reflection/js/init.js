import { state } from "./state.js";
import {
  startButtonFunction,
  stopButtonFunction,
  restartButtonFunction,
  resetButtonFunction,
} from "./element-function.js";
/**
 * シミュレーションの初期化を行う関数。
 * @param {*} p p5インスタンス。
 */
export function initValue(p) {
  p.textAlign(p.CENTER);
  p.textSize(20);
  let max_time = 60 * Math.floor(p.width / 60);
  state.mediumWave = [];
  state.waveArr = [];
  state.moveIs = false;
  for (let i = 60; i < max_time - 60; i++) state.mediumWave.push(0);
}

/**
 * UI要素の生成とイベントリスナーの設定を担当する関数。
 * 各UI要素は、グローバル状態管理オブジェクトであるstateに格納される。
 * これにより、他のモジュールからUI要素にアクセスしやすくなり、シミュレーションの状態管理が容易になる。
 * @param {*} p p5インスタンス。
 */
export function elCreate(p) {
  state.reflectSelect = p.select("#reflectSelect");
  state.startButton = p
    .select("#startButton")
    .mousePressed(() => startButtonFunction(p));
  state.stopButton = p.select("#stopButton").mousePressed(stopButtonFunction);
  state.restartButton = p
    .select("#restartButton")
    .mousePressed(restartButtonFunction);
  state.resetButton = p
    .select("#resetButton")
    .mousePressed(() => resetButtonFunction(p));
  state.waveSelect = p.select("#waveSelect");
  state.speedInput = p.select("#speedInput");
  state.amplitudeInput = p.select("#amplitudeInput");
}
