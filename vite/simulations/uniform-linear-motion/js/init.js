import { state } from "./state.js";
import { CAR } from "./car.js";
import { CANVAS_HEIGHT } from "./constants.js";
import { graphButtonFunction } from "./element-function.js";
import { initModal } from "../../../js/bicpema-modal-controller.js";

/**
 * 画像の初期化を行う。
 */
export function imgInit() {
  state.YELLOW_CAR_IMG.resize(100, 0);
  state.RED_CAR_IMAGE.resize(100, 0);
}

/**
 * DOM要素の動的な生成とイベントリスナーの設定を行う。
 * @param {p5} p p5インスタンス
 */
export function elCreate(p) {
  initModal({
    openSelectors: ".settings-modal-open",
    modalSelector: "#modal",
    closeSelectors: ".modal-close",
  });

  p.select("#graphButton").mousePressed(() => graphButtonFunction());
  p.select("#playButton").mousePressed(() => {
    state.isPlaying = !state.isPlaying;
    p.select("#playButton").html(state.isPlaying ? "一時停止" : "再開");
  });
  p.select("#resetButton").mousePressed(() => {
    state.isPlaying = true;
    p.select("#playButton").html("一時停止");
    initValue(p);
  });
  p.select("#yellowCarSpeedInput").changed(() => initValue(p));
  p.select("#redCarSpeedInput").changed(() => initValue(p));
}

/**
 * DOM要素の動的に変化する設定を行う。
 * @param {p5} p p5インスタンス
 */
export function elSetting(p) {
  const GRAPH = p.select("#graph");
  const GRAPH_BUTTON_PARENT = p.select("#graphButtonParent");

  if (p.width <= 992) {
    GRAPH.position((p.windowWidth - p.width) / 2, p.height + 125).size(
      p.width,
      p.width
    );
    GRAPH_BUTTON_PARENT.position(
      (p.windowWidth - p.width) / 2,
      p.height + p.width + 140
    );
  } else {
    GRAPH.position(p.windowWidth / 2 - p.width / 4, p.height + 125).size(
      p.width / 2,
      p.width / 2
    );
    GRAPH_BUTTON_PARENT.position(
      p.windowWidth / 2 - p.width / 4,
      p.height + p.width / 2 + 140
    );
  }

}

/**
 * 変数やオブジェクトの初期化を行う。
 * @param {p5} p p5インスタンス
 */
export function initValue(p) {
  const yellowInput = p.select("#yellowCarSpeedInput");
  const redInput = p.select("#redCarSpeedInput");
  if (!yellowInput || !redInput) return;

  const YELLOW_CAR_SPEED = parseFloat(yellowInput.value());
  const RED_CAR_SPEED = parseFloat(redInput.value());
  const minSpeed = Math.min(YELLOW_CAR_SPEED, RED_CAR_SPEED);
  let carNum = 10;
  if (Math.floor(20 / minSpeed) > 10) {
    carNum = Math.floor(20 / minSpeed);
  }

  state.YELLOW_CAR = new CAR(
    0,
    CANVAS_HEIGHT / 2 - state.YELLOW_CAR_IMG.height - 50,
    state.YELLOW_CAR_IMG,
    YELLOW_CAR_SPEED,
    [],
    []
  );
  state.RED_CAR = new CAR(
    0,
    CANVAS_HEIGHT - state.RED_CAR_IMAGE.height - 50,
    state.RED_CAR_IMAGE,
    RED_CAR_SPEED,
    [],
    []
  );

  for (let i = 0; i <= carNum; i++) {
    state.YELLOW_CAR.xarr.push({ x: i, y: state.YELLOW_CAR.speed * i });
    state.RED_CAR.xarr.push({ x: i, y: state.RED_CAR.speed * i });
    state.YELLOW_CAR.varr.push({ x: i, y: state.YELLOW_CAR.speed });
    state.RED_CAR.varr.push({ x: i, y: state.RED_CAR.speed });
  }
}
