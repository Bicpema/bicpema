import { state } from "./state.js";
import { CAR } from "./car.js";
import { CANVAS_HEIGHT } from "./constants.js";
import { graphButtonFunction } from "./element-function.js";

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
  p.createDiv(`<canvas id="graphCanvas"></canvas>`)
    .id("graph")
    .parent(p.select("#p5Container"))
    .class("rounded border border-1");

  p.createDiv(
    `<button type="button" class="btn btn-secondary" id="graphButton">グラフの切り替え</button>`
  )
    .id("graphButtonParent")
    .parent(p.select("#p5Container"));

  p.createButton("シミュレーション設定")
    .class("btn btn-primary")
    .id("modalButton")
    .parent(p.select("#p5Container"))
    .attribute("data-bs-toggle", "modal")
    .attribute("data-bs-target", "#modal");

  p.createDiv(
    `<div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="modalLabel">シミュレーション設定</h1>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div class="form-check" id="scaleCheckBoxParent">
            <input class="form-check-input" type="checkbox" id="scaleCheckBox" checked>
            <label class="form-check-label" for="scaleCheckBox">スケールの表示・非表示</label>
          </div>
          <div class="input-group mb-3 mt-3">
            <span class="input-group-text" id="yellowCarSpeedLabel">黄色い車の速度</span>
            <input type="number" min="1" class="form-control" placeholder="cm/s" aria-describedby="yellowCarSpeedLabel" id="yellowCarSpeedInput" value="3"/>
            <span class="input-group-text">cm/s</span>
          </div>
          <div class="input-group mb-3 mt-3">
            <span class="input-group-text" id="redCarSpeedLabel">赤い車の速度</span>
            <input type="number" min="1" class="form-control" placeholder="cm/s" aria-describedby="redCarSpeedLabel" id="redCarSpeedInput" value="2"/>
            <span class="input-group-text">cm/s</span>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">閉じる</button>
        </div>
      </div>
    </div>`
  )
    .class("modal fade")
    .id("modal")
    .parent(p.select("#p5Container"))
    .attribute("tabindex", "-1")
    .attribute("aria-labelledby", "modalLabel")
    .attribute("aria-hidden", "true");

  p.select("#graphButton").mousePressed(() => graphButtonFunction());
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

  p.select("#modalButton").position(
    p.windowWidth / 2 - p.width / 2,
    60 + p.height + 10
  );
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
