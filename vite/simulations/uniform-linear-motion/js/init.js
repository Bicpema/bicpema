/**
 * DOM要素の静的な設定を行う。
 */
const elInit = () => {
  /** グラフを描画するdiv要素 */
  const GRAPH = createDiv(
    `
        <canvas id="graphCanvas"></canvas>
      `,
  )
    .id("graph")
    .parent(select("#p5Container"))
    .class("rounded border border-1");

  /** グラフ切り替えボタンの親div要素 */
  const GRAPH_BUTTON_PARENT = createDiv(
    `
        <button type="button" class="btn btn-secondary" id="graphButton">
          グラフの切り替え
        </button>
      `,
  )
    .id("graphButtonParent")
    .parent(select("#p5Container"));

  /** グラフ切り替えボタンのbutton要素 */
  const GRAPH_BUTTON = select("#graphButton").mousePressed(graphButtonFunction);
  /** シミュレーション設定ボタンのbutton要素 */
  const MODAL_BUTTON = createButton("シミュレーション設定")
    .class("btn btn-primary")
    .id("modalButton")
    .parent(select("#p5Container"))
    .attribute("data-bs-toggle", "modal")
    .attribute("data-bs-target", "#modal");

  const modalWindow = createDiv(
    `
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h1 class="modal-title fs-5" id="modalLabel">Modal title</h1>
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
        </div>
      `,
  )
    .class("modal fade")
    .id("modal")
    .parent(select("#p5Container"))
    .attribute("tabindex", "-1")
    .attribute("aria-labelledby", "modalLabel")
    .attribute("aria-hidden", "true");

  const YELLOW_CAR_SPEED_INPUT = select("#yellowCarSpeedInput").changed(
    initValue,
  );
  const RED_CAR_SPEED_INPUT = select("#redCarSpeedInput").changed(initValue);
};

/**
 * DOM要素の動的に変化する設定を行う。
 */
const elSetting = () => {
  const GRAPH = select("#graph");
  const GRAPH_BUTTON_PARENT = select("#graphButtonParent");
  // リサイズ処理
  if (width <= 992) {
    GRAPH.position((windowWidth - width) / 2, height + 125).size(width, width);
    GRAPH_BUTTON_PARENT.position(
      (windowWidth - width) / 2,
      height + width + 140,
    );
  } else {
    GRAPH.position(windowWidth / 2 - width / 4, height + 125).size(
      width / 2,
      width / 2,
    );
    GRAPH_BUTTON_PARENT.position(
      windowWidth / 2 - width / 4,
      height + width / 2 + 140,
    );
  }
  const MODAL_BUTTON = select("#modalButton").position(
    windowWidth / 2 - width / 2,
    60 + height + 10,
  );
};

/**
 * 画像の初期化を行う。
 */
const imgInit = () => {
  YELLOW_CAR_IMG.resize(100, 0);
  RED_CAR_IMAGE.resize(100, 0);
};

let YELLOW_CAR;
let RED_CAR;
/**
 * 変数やオブジェクトの初期化を行う。
 */
const initValue = () => {
  const YELLOW_CAR_SPEED = select("#yellowCarSpeedInput").value();
  const RED_CAR_SPEED = select("#redCarSpeedInput").value();
  const yMin = min([YELLOW_CAR_SPEED, RED_CAR_SPEED]);
  let carNum = 10;
  if (Math.floor(20 / yMin) > 10) {
    carNum = Math.floor(20 / yMin);
  }

  YELLOW_CAR = new CAR(
    0,
    CANVAS_HEIGHT / 2 - YELLOW_CAR_IMG.height - 50,
    YELLOW_CAR_IMG,
    YELLOW_CAR_SPEED,
    [],
    [],
  );
  RED_CAR = new CAR(
    0,
    CANVAS_HEIGHT - RED_CAR_IMAGE.height - 50,
    RED_CAR_IMAGE,
    RED_CAR_SPEED,
    [],
    [],
  );

  for (let i = 0; i <= carNum; i++) {
    YELLOW_CAR.xarr.push({ x: i, y: YELLOW_CAR.speed * i });
    RED_CAR.xarr.push({ x: i, y: RED_CAR.speed * i });
    YELLOW_CAR.varr.push({ x: i, y: YELLOW_CAR.speed });
    RED_CAR.varr.push({ x: i, y: RED_CAR.speed });
  }
};
