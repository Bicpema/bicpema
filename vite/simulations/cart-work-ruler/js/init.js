// init.jsは初期処理専用のファイルです。

/** フレームレート */
const FPS = 60;

/** キャンバスコントローラ */
let canvasController;

/** フォント */
let font;

// --- DOM 要素 ---
let massInput, velocityInput, forceInput;
let resetButton, playPauseButton, toggleModal, closeModal, settingsModal;

// --- シミュレーションパラメータ ---
/** 台車の質量 (kg) */
let mass_kg;
/** 初速度 (m/s) */
let v0_ms;
/** 抵抗力 (N) */
let force_N;

// --- シミュレーション状態 ---
/** 接近フェーズでの台車左端x座標 (px) */
let approachX_px;
/** 現在の速度 (m/s) */
let velocity_ms;
/** めり込み距離 (m) */
let penetration_m;
/** フェーズ: 'idle' | 'approach' | 'contact' | 'stopped' */
let phase;
/** シミュレーション実行中フラグ */
let isRunning;

/**
 * シミュレーション全体の設定を行う
 */
function settingInit() {
  canvasController = new BicpemaCanvasController(true, false);
  canvasController.fullScreen();
  frameRate(FPS);
  textAlign(CENTER, CENTER);
  textFont(font);
  textSize(16);
}

/**
 * DOM 要素の参照を取得する
 */
function elementSelectInit() {
  massInput = select("#massInput");
  velocityInput = select("#velocityInput");
  forceInput = select("#forceInput");
  resetButton = select("#resetButton");
  playPauseButton = select("#playPauseButton");
  toggleModal = select("#toggleModal");
  closeModal = select("#closeModal");
  settingsModal = select("#settingsModal");
}

/**
 * DOM 要素のイベントリスナーを設定する
 */
function elementPositionInit() {
  resetButton.mousePressed(onReset);
  playPauseButton.mousePressed(onPlayPause);
  toggleModal.mousePressed(onToggleModal);
  closeModal.mousePressed(onCloseModal);
}

/**
 * パラメータと状態を初期化する
 */
function valueInit() {
  // パラメータを入力フォームから読み込む
  mass_kg = parseFloat(massInput.value());
  v0_ms = parseFloat(velocityInput.value());
  force_N = parseFloat(forceInput.value());

  // 状態をリセット
  approachX_px = CART_START_X;
  velocity_ms = v0_ms;
  penetration_m = 0;
  phase = "idle";
  isRunning = false;

  playPauseButton.html("▶ 開始");
  playPauseButton.removeAttribute("disabled");
}
