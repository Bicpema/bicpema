/** 全体の動きを制御する変数 */
export let moveIs = false;

/**
 * シミュレーションそのものの設定を行う関数
 * @param {p5instance} p
 * @param {font} font
 */
export function settingInit(p, font) {
  p.frameRate(60);
  p.textAlign(p.CENTER, p.CENTER);
  p.textFont(font);
  p.textSize(16);
}

/**
 * 仮想DOMを読み込むための関数
 * @param {p5instance} p p5インスタンス
 */
export function elementSelectInit(p) {
  const SHIP_VELOCITY_PARENT = p
    .createDiv(
      `
<span class="input-group-text" id="inputGroup-sizing-default">船の速度</span>
<input type="number" class="form-control" value="-1" id="shipVelocityInput">
<span class="input-group-text" id="inputGroup-sizing-default">m/s</span>
  `
    )
    .class("input-group mb-3")
    .id("shipVelocityParent");
  const WAVE_VELOCITY_PARENT = p
    .createDiv(
      `
  <span class="input-group-text" id="inputGroup-sizing-default">波の速度</span>
  <input type="number" class="form-control" value="1" id="waveVelocityInput">
  <span class="input-group-text" id="inputGroup-sizing-default">m/s</span>
    `
    )
    .class("input-group mb-3")
    .id("waveVelocityParent");

  const MOVE_BUTTON = p
    .createButton("動かす")
    .class("btn btn-primary")
    .id("moveButton")
    .parent(p.select("#p5Container"))
    .mousePressed(() => moveButtonFunction(p));
}

/**
 * 仮想DOMの場所や実行関数を設定するための関数
 * @param {p5instance} p p5インスタンス
 */
export function elementPositionInit(p) {
  const SHIP_VELOCITY_INPUT = p
    .select("#shipVelocityParent")
    .position((p.windowWidth - p.width) / 2, (3 * p.height) / 4 + 70)
    .size(200, p.AUTO);
  const WAVE_VELOCITY_INPUT = p
    .select("#waveVelocityParent")
    .position(SHIP_VELOCITY_INPUT.x + SHIP_VELOCITY_INPUT.width + 10, (3 * p.height) / 4 + 70)
    .size(200, p.AUTO);
  const MOVE_BUTTON = p
    .select("#moveButton")
    .position(WAVE_VELOCITY_INPUT.x + WAVE_VELOCITY_INPUT.width + 10, (3 * p.height) / 4 + 70);
}

/**
 * 動きを制御するボタンの関数です。
 * @param {p5instance} p p5インスタンス
 */
const moveButtonFunction = (p) => {
  const MOVE_BUTTON = p.select("#moveButton");
  if (moveIs) {
    moveIs = false;
    MOVE_BUTTON.html("動かす");
  } else {
    moveIs = true;
    MOVE_BUTTON.html("止める");
  }
};
