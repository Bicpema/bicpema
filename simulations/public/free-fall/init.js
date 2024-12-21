// init.jsは初期処理専用のファイルです。

/////////////////////////// 以上の記述は不必要であれば削除してください。/////////////////////////////////

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

//   let graph, graphCanvas;

/**
 * 仮想DOMを読み込むための関数
 * グラフを利用する際には、graph,graphCanvasのコメントアウトをはずしてください。
 */
export function elementSelectInit() {
  //   graph = select("#graph");
  //   graphCanvas = select("#graphCanvas");
}

/**
 * 仮想DOMの場所や実行関数を設定するための関数
 */
export function elementPositionInit() {}

/**
 * 初期値を設定するための関数
 */
export function valueInit() {}
