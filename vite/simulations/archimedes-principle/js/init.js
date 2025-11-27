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
  // 物体追加ボタン
  if (!addObjectButton) {
    addObjectButton = createButton("物体を追加");
    addObjectButton.position(20, 70);
    addObjectButton.mousePressed(addNewObject);
    addObjectButton.style("padding", "10px 20px");
    addObjectButton.style("font-size", "16px");
    addObjectButton.style("background-color", "#4CAF50");
    addObjectButton.style("color", "white");
    addObjectButton.style("border", "none");
    addObjectButton.style("border-radius", "5px");
    addObjectButton.style("cursor", "pointer");
  }

  // 密度調整スライダー
  if (!densitySlider) {
    densitySlider = createSlider(0.1, 3.0, 1.0, 0.1);
    densitySlider.position(20, 110);
    densitySlider.style("width", "200px");
    densitySlider.hide(); // 初期は非表示

    densityLabel = createP("");
    densityLabel.position(20, 130);
    densityLabel.style("color", "white");
    densityLabel.style("font-size", "14px");
    densityLabel.hide(); // 初期は非表示
  }
}

// valueInit関数
// 初期値を設定するための関数
let objects = [];
let waterY = 300; // 水面の位置
let waterDensity = 1.0; // 水の密度 (g/cm³)
let densitySlider;
let densityLabel;
let addObjectButton;
let selectedObject = null;

function valueInit() {
  // 初期の物体を追加（密度が異なる3つ）
  objects.push(new FloatingObject(200, 200, 30, 0.5)); // 軽い（浮く）
  objects.push(new FloatingObject(400, 200, 30, 1.0)); // 水と同じ密度
  objects.push(new FloatingObject(600, 200, 30, 1.5)); // 重い（沈む）
}
