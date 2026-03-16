// init.js - 初期処理専用のファイルです。

/** フレームレート */
const FPS = 30;

/** キャンバスコントローラー */
let canvasController;

/** シミュレーション状態 */
let isPlaying = false;

/** 記録テープのマーク（各記録時刻の変位 m） */
let tapeMarks = [];

/** v-tグラフのデータ */
let vtData = [];

/** 斜面角度 (度) */
let slopeDeg = 30;

/** 記録間隔 (s) */
let recInterval = 0.1;

/** グラフの表示状態 */
let graphVisible = false;

/** グラフ Chart.js インスタンス */
let graphChart = null;

/** DOM要素 */
let resetButton,
  playPauseButton,
  toggleModal,
  closeModal,
  settingsModal,
  angleInput,
  intervalInput;

/** 台車オブジェクト */
let cart;

// ──────────────────────────────────────────────────────────────

/**
 * シミュレーション設定を行う
 */
function settingInit() {
  canvasController = new BicpemaCanvasController(true, false);
  canvasController.fullScreen();
  frameRate(FPS);
  textAlign(CENTER, CENTER);
  if (typeof font !== "undefined" && font) {
    textFont(font);
  }
  textSize(15);
}

/**
 * DOM要素の初期化（作成 + 参照取得）
 */
function elementSelectInit() {
  // ボタン・入力の参照
  resetButton = select("#resetButton");
  playPauseButton = select("#playPauseButton");
  toggleModal = select("#toggleModal");
  closeModal = select("#closeModal");
  settingsModal = select("#settingsModal");
  angleInput = select("#angleInput");
  intervalInput = select("#intervalInput");

  // グラフトグルボタン
  const graphToggleParent = createDiv()
    .id("graphToggleParent")
    .parent(select("#p5Container"));

  createButton("v-tグラフを表示")
    .id("graphToggleButton")
    .parent(graphToggleParent)
    .class("btn btn-secondary mt-2")
    .mousePressed(onToggleGraph);

  // グラフ用 div
  createDiv('<canvas id="graphCanvas"></canvas>')
    .id("graph")
    .parent(select("#p5Container"))
    .class("rounded border border-1")
    .style("display", "none")
    .style("background-color", "white");
}

/**
 * DOM要素の位置・サイズを設定する（リサイズ時も呼ばれる）
 */
function elementPositionInit() {
  resetButton.mousePressed(onReset);
  playPauseButton.mousePressed(onPlayPause);
  toggleModal.mousePressed(onToggleModal);
  closeModal.mousePressed(onCloseModal);

  const graphToggleParent = select("#graphToggleParent");
  const graphDiv = select("#graph");

  // グラフをキャンバス幅に合わせて配置
  const gx = (windowWidth - width) / 2;
  const gy = height + 10;

  if (width <= 992) {
    graphToggleParent.position(gx, gy);
    graphDiv.position(gx, gy + 46).size(width, width * 0.6);
  } else {
    graphToggleParent.position(windowWidth / 2 - width / 4, gy);
    graphDiv
      .position(windowWidth / 2 - width / 4, gy + 46)
      .size(width / 2, width * 0.3);
  }
}

/**
 * シミュレーション変数を初期化する
 */
function valueInit() {
  cart = new SlopeCart(slopeDeg, SLOPE_LENGTH_M);
  tapeMarks = [];
  vtData = [];
}
