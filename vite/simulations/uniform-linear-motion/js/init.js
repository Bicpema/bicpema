import { state } from "./state.js";
import { CAR } from "./car.js";
import {
  CANVAS_HEIGHT,
  CAR_IMAGE_WIDTH,
  ROAD_AREA_HEIGHT,
  RESPONSIVE_BREAKPOINT,
  GRAPH_TOP_OFFSET,
  GRAPH_BUTTON_TOP_OFFSET,
  DEFAULT_SIMULATION_DURATION,
  CAR_TRAJECTORY_DISTANCE_THRESHOLD,
} from "./constants.js";
import { graphButtonFunction, onPlayPause } from "./element-function.js";
import { initModal } from "../../../js/bicpema-modal-controller.js";
import { bindToggleControls } from "../../../js/bicpema-controls-controller.js";

/**
 * 画像の初期化を行う。
 */
export function imgInit() {
  state.YELLOW_CAR_IMG.resize(CAR_IMAGE_WIDTH, 0);
  state.RED_CAR_IMAGE.resize(CAR_IMAGE_WIDTH, 0);
}

/**
 * リセットボタンが押されたときの処理。
 * @param {p5} p p5インスタンス
 */
function onReset(p) {
  state.isPlaying = true;
  state.playButton.html("一時停止");
  initValue(p);
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

  const { toggleButton } = bindToggleControls(p, {
    toggleSelector: "#playButton",
    resetSelector: "#resetButton",
    onToggle: onPlayPause,
    onReset: () => onReset(p),
  });
  state.playButton = toggleButton;

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

  if (p.width <= RESPONSIVE_BREAKPOINT) {
    GRAPH.position(
      (p.windowWidth - p.width) / 2,
      p.height + GRAPH_TOP_OFFSET
    ).size(p.width, p.width);
    GRAPH_BUTTON_PARENT.position(
      (p.windowWidth - p.width) / 2,
      p.height + p.width + GRAPH_BUTTON_TOP_OFFSET
    );
  } else {
    GRAPH.position(
      p.windowWidth / 2 - p.width / 4,
      p.height + GRAPH_TOP_OFFSET
    ).size(p.width / 2, p.width / 2);
    GRAPH_BUTTON_PARENT.position(
      p.windowWidth / 2 - p.width / 4,
      p.height + p.width / 2 + GRAPH_BUTTON_TOP_OFFSET
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

  const YELLOW_CAR_SPEED = parseFloat(String(yellowInput.value()));
  const RED_CAR_SPEED = parseFloat(String(redInput.value()));
  const minSpeed = Math.min(YELLOW_CAR_SPEED, RED_CAR_SPEED);
  let carNum = DEFAULT_SIMULATION_DURATION;
  if (
    Math.floor(CAR_TRAJECTORY_DISTANCE_THRESHOLD / minSpeed) >
    DEFAULT_SIMULATION_DURATION
  ) {
    carNum = Math.floor(CAR_TRAJECTORY_DISTANCE_THRESHOLD / minSpeed);
  }

  state.YELLOW_CAR = new CAR(
    0,
    CANVAS_HEIGHT / 2 - state.YELLOW_CAR_IMG.height - ROAD_AREA_HEIGHT,
    state.YELLOW_CAR_IMG,
    YELLOW_CAR_SPEED,
    [],
    []
  );
  state.RED_CAR = new CAR(
    0,
    CANVAS_HEIGHT - state.RED_CAR_IMAGE.height - ROAD_AREA_HEIGHT,
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
