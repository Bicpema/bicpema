// init.jsは初期処理専用のファイルです。

/////////////////////////// 以上の記述は不必要であれば削除してください。/////////////////////////////////

// settingInit関数
// シミュレーションそのものの設定を行う関数
const FPS = 30;
let canvasController;
function settingInit() {
  canvasController = new BicpemaCanvasController(true, false);
  canvasController.fullScreen();
  frameRate(FPS);
  textAlign(CENTER, CENTER);
  textFont(font);
  textSize(16);
}

// elementSelectInit関数
// 仮想DOMを読み込むための関数
// グラフを利用する際には、graph,graphCanvasのコメントアウトをはずしてください。
//   let graph, graphCanvas;
function elementSelectInit() {
  //   graph = select("#graph");
  //   graphCanvas = select("#graphCanvas");
}

// elementPositionInit関数
// 仮想DOMの場所や実行関数を設定するための関数
function elementPositionInit() {
  // 本を追加するボタンを作成
  if (!addButton) {
    addButton = createButton("本を追加");
    addButton.position(20, 70);
    addButton.mousePressed(addBook);
    addButton.style("padding", "10px 20px");
    addButton.style("font-size", "16px");
    addButton.style("background-color", "#4CAF50");
    addButton.style("color", "white");
    addButton.style("border", "none");
    addButton.style("border-radius", "5px");
    addButton.style("cursor", "pointer");
  }
}

// valueInit関数
// 初期値を設定するための関数
let books = [];
let tableY = 450;
let addButton;

function valueInit() {
  // 初期の本を1冊配置
  books.push(new Book(400, tableY - 20, 1.0));
}
