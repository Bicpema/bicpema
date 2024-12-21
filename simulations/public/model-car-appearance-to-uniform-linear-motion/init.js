/**
 * DOM要素の静的な設定を行う。
 */
const elInit = () => {
  /** シミュレーション設定ボタンのbutton要素 */
  const MODAL_BUTTON = createButton("車の速度の設定")
    .class("btn btn-primary")
    .id("modalButton")
    .parent(select("#p5Container"))
    .attribute("data-bs-toggle", "modal")
    .attribute("data-bs-target", "#modal");
  const MOVE_BUTTON = createButton("動かす")
    .class("btn btn-primary")
    .id("moveButton")
    .parent(select("#p5Container"))
    .mousePressed(moveButtonFunction);
  const RESET_BUTTON = createButton("リセット")
    .class("btn btn-secondary")
    .id("resetButton")
    .parent(select("#p5Container"))
    .mousePressed(initValue);
  const modalWindow = createDiv(
    `
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h1 class="modal-title fs-5" id="modalLabel">車の速度の設定</h1>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
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
      `
  )
    .class("modal fade")
    .id("modal")
    .parent(select("#p5Container"))
    .attribute("tabindex", "-1")
    .attribute("aria-labelledby", "modalLabel")
    .attribute("aria-hidden", "true");

  select("#yellowCarSpeedInput").changed(initValue);
  select("#redCarSpeedInput").changed(initValue);
};

/**
 * DOM要素の動的に変化する設定を行う。
 */
const elSetting = () => {
  const MODAL_BUTTON = select("#modalButton").position(windowWidth / 2 - this.width / 2, 60 + this.height + 10);
  const MOVE_BUTTON = select("#moveButton").position(MODAL_BUTTON.x + MODAL_BUTTON.width + 10, 60 + this.height + 10);
  const RESET_BUTTON = select("#resetButton").position(MOVE_BUTTON.x + MOVE_BUTTON.width + 10, 60 + this.height + 10);
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

  YELLOW_CAR = new CAR(0, CANVAS_HEIGHT / 2 - YELLOW_CAR_IMG.height - 50, YELLOW_CAR_IMG, YELLOW_CAR_SPEED, [], []);
  RED_CAR = new CAR(0, CANVAS_HEIGHT - RED_CAR_IMAGE.height - 50, RED_CAR_IMAGE, RED_CAR_SPEED, [], []);

  for (let i = 0; i <= carNum; i++) {
    YELLOW_CAR.xarr.push({ x: i, y: YELLOW_CAR.speed * i });
    RED_CAR.xarr.push({ x: i, y: RED_CAR.speed * i });
    YELLOW_CAR.varr.push({ x: i, y: YELLOW_CAR.speed });
    RED_CAR.varr.push({ x: i, y: RED_CAR.speed });
  }
  moveIs = false;
};

const moveButtonFunction = () => {
  const MOVE_BUTTON = select("#moveButton");
  if (moveIs) {
    moveIs = false;
    MOVE_BUTTON.html("動かす");
  } else {
    moveIs = true;
    MOVE_BUTTON.html("止める");
  }
};
