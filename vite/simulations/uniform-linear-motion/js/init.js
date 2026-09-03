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
  p.createDiv(`<canvas id="graphCanvas"></canvas>`)
    .id("graph")
    .parent(p.select("#p5Container"))
    .class("rounded border bg-white");

  p.createDiv(
    `<button type="button" class="rounded bg-neutral-600 px-3 py-2 text-white hover:bg-neutral-500" id="graphButton">グラフの切り替え</button>`
  )
    .id("graphButtonParent")
    .parent(p.select("#p5Container"));

  p.createDiv(
    '<button type="button" class="m-1 rounded bg-green-600 px-3 py-2 text-white hover:bg-green-500" id="playButton">一時停止</button><button type="button" class="m-1 rounded bg-neutral-600 px-3 py-2 text-white hover:bg-neutral-500" id="resetButton">リセット</button>'
  )
    .id("motionControls")
    .parent(p.select("#p5Container"))
    .class("fixed bottom-0 left-0 z-[1100]");

  p.createButton("シミュレーション設定")
    .class(
      "settings-modal-open fixed top-[72px] right-4 z-[1100] rounded bg-blue-600 px-3 py-2 text-white hover:bg-blue-500"
    )
    .id("modalButton")
    .parent(p.select("#p5Container"));

  p.createDiv(
    `<div class="w-full max-w-lg rounded bg-white p-4 text-neutral-900">
        <div class="mb-3 flex items-center justify-between border-b border-neutral-200 pb-2">
          <h1 class="text-lg font-semibold" id="modalLabel">シミュレーション設定</h1>
          <button type="button" class="modal-close text-xl leading-none text-neutral-500 hover:text-neutral-700" aria-label="Close">&times;</button>
        </div>
        <div>
          <div class="mb-4 flex items-center gap-2" id="scaleCheckBoxParent">
            <input class="h-4 w-4 accent-blue-600" type="checkbox" id="scaleCheckBox" checked>
            <label class="text-sm" for="scaleCheckBox">スケールの表示・非表示</label>
          </div>
          <div class="mb-3 mt-3 flex">
            <span class="inline-flex items-center whitespace-nowrap rounded-l border border-r-0 border-neutral-300 bg-neutral-100 px-3 text-sm text-neutral-700" id="yellowCarSpeedLabel">黄色い車の速度</span>
            <input type="number" min="1" max="20" class="min-w-0 flex-1 border border-neutral-300 bg-white px-3 py-1.5 text-neutral-900" placeholder="cm/s" aria-describedby="yellowCarSpeedLabel" id="yellowCarSpeedInput" value="3"/>
            <span class="inline-flex items-center whitespace-nowrap rounded-r border border-l-0 border-neutral-300 bg-neutral-100 px-3 text-sm text-neutral-700">cm/s</span>
          </div>
          <div class="mb-3 mt-3 flex">
            <span class="inline-flex items-center whitespace-nowrap rounded-l border border-r-0 border-neutral-300 bg-neutral-100 px-3 text-sm text-neutral-700" id="redCarSpeedLabel">赤い車の速度</span>
            <input type="number" min="1" max="20" class="min-w-0 flex-1 border border-neutral-300 bg-white px-3 py-1.5 text-neutral-900" placeholder="cm/s" aria-describedby="redCarSpeedLabel" id="redCarSpeedInput" value="2"/>
            <span class="inline-flex items-center whitespace-nowrap rounded-r border border-l-0 border-neutral-300 bg-neutral-100 px-3 text-sm text-neutral-700">cm/s</span>
          </div>
        </div>
        <div class="flex justify-end border-t border-neutral-200 pt-2">
          <button type="button" class="modal-close rounded border border-neutral-400 px-3 py-1.5 hover:bg-neutral-100">閉じる</button>
        </div>
    </div>`
  )
    .class("fixed inset-0 z-[1100] hidden flex items-center justify-center bg-black/50")
    .id("modal")
    .attribute("role", "dialog")
    .attribute("aria-modal", "true")
    .attribute("aria-labelledby", "modalLabel")
    .attribute("aria-hidden", "true")
    .attribute("tabindex", "-1")
    .parent(p.select("#p5Container"));

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
