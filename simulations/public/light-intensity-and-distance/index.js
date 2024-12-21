// 全画面表示
function fullScreen() {

  // canvasの親要素を取得
  let p5Canvas = select("#p5Canvas");

  // 取得した親要素内にcanvasを生成し追加
  let canvas = createCanvas(windowWidth / 2, 9 * windowHeight / 20, WEBGL);
  canvas.parent(p5Canvas);

}

// データが入力されたときの処理
function inputFunction() {
  dataArr = []
  for (let i = 0; i < dataNum; i++) {
    let targetInput1 = select("#lengthInput-" + str(i + 1))
    let targetInput2 = select("#intensityInput-" + str(i + 1))
    dataArr.push({ "x": targetInput1.value(), "y": targetInput2.value() })
  }
  dataArr.sort((a, b) => {
    return a.x - b.x
  })
}

// プロットする実測値データの数
let dataNum = 0;
// 実測値の生データ
let data = [];
// 実際にグラフにプロットする際の実測値データ
let dataArr = []
// 追加ボタンを押したときの処理
function dataAddButtonFunctioon() {

  dataNum += 1;
  data.push(new DOM(dataNum));
  inputFunction();

}

// 削除ボタンを押したときの処理
function dataRemoveButtonFunction() {

  // データが存在する場合に実行
  if (dataNum > 0) {

    let target = select("#data-" + dataNum).remove();
    dataNum -= 1;
    inputFunction();

  }
}

// 理論値のスケールを変えるスライダーを動かしたときの処理
function scaleRangeFunction() {

  // 理論値を格納する配列を初期化
  theoreticalArr = [];

  // スライダーで指定した倍の理論値を配列に追加
  for (let x = 1; x < 41; x += 0.01) {

    let y = scaleRange.value() * 1275 / sq(x);
    theoreticalArr.push({ "x": x, "y": y });

  }
}



let dataAddButton,
  dataRemoveButton,
  scaleRange;
// DOM要素の生成
function elCreate() {
  dataAddButton = select("#dataAddButton").mousePressed(dataAddButtonFunctioon);
  dataRemoveButton = select("#dataRemoveButton").mousePressed(dataRemoveButtonFunction);
  scaleRange = select("#scaleRange").input(scaleRangeFunction);
}

let theoreticalArr = [],
  coordinateArr = [];
// 初期値やシミュレーションの設定
function initValue() {

  // 配列の初期化
  theoreticalArr = [];
  coordinateArr = [];

  // 理論値の計算結果の追加
  for (let x = 1; x < 41; x += 0.01) {
    let y = 50 * 1275 / sq(x);
    theoreticalArr.push({ "x": x, "y": y });
  }

  // シミュレーションの光線の回転座標系の追加
  for (let i = 0; i < 200; i++) {
    coordinateArr.push([random(-180, 180), random(-180, 180), random(-180, 180)]);
  }
}

// setup関数
function setup() {
  fullScreen();
  elCreate();
  initValue();
}

function lightDraw() {

  // 中心の光源の描画
  noStroke();
  fill(200, 200, 0);
  sphere(20);

  // 光線の描画
  stroke(255);
  strokeWeight(0.5);
  for (i = 0; i < 200; i++) {
    push();
    rotateX(radians(coordinateArr[i][0]));
    rotateY(radians(coordinateArr[i][1]));
    rotateZ(radians(coordinateArr[i][2]));
    line(-400, 0, 0, 400, 0, 0);
    pop();
  }


  // 光の拡散の目安となる赤線の描画
  strokeWeight(1)
  stroke(255, 0, 0)

  push()
  rotateZ(PI / 12)
  push()
  rotateY(PI / 12)
  line(-400, 0, 0, 400, 0, 0)
  pop()
  push()
  rotateY(-PI / 12)
  line(-400, 0, 0, 400, 0, 0)
  pop()
  pop()

  push()
  rotateZ(-PI / 12)
  push()
  rotateY(PI / 12)
  line(-400, 0, 0, 400, 0, 0)
  pop()
  push()
  rotateY(-PI / 12)
  line(-400, 0, 0, 400, 0, 0)
  pop()
  pop()


  // 拡散の目安となる平面の描画
  strokeWeight(1)
  stroke(100, 100, 100, 10)
  push()
  rotateY(PI / 2)

  fill(100)
  push()
  translate(0, 0, 100)
  plane(55)
  pop()

  push()
  translate(0, 0, 150)
  plane(81)
  pop()

  push()
  translate(0, 0, 200)
  plane(108)
  pop()
}

// 実測値をプロットするグラフの設定
let mainChartObj
function drawGraph() {

  if (typeof mainChartObj !== 'undefined' && mainChartObj) {
    mainChartObj.destroy();
  }

  let mainData = {
    datasets: [
      {
        label: "理論値",
        data: theoreticalArr,
        backgroundColor: "rgba(0,0,0,0.5)",
        borderColor: "rgba(0,0,0,1)",
        pointRadius: 0,
        showLine: true

      }, {
        label: "実測値",
        data: dataArr,
        backgroundColor: "rgba(255,0,0,0.5)",
        borderColor: "rgba(255,0,0,1)",
        pointRadius: 0,
        showLine: true

      },
    ],
  };

  //グラフの表示設定
  let mainOptions = {
    legend: {
      labels: {
        fontSize: 16
      }
    },
    title: {
      display: true,
      fontSize: 20,
      text: '光の強度と距離の関係'
    },
    scales: {
      xAxes: [
        {
          scaleLabel: {
            display: true,
            labelString: '光源との距離[cm]',
            fontSize: 16
          },
          ticks: {
            min: 1,
            max: 40,
            fontSize: 14
          }
        },
      ],
      yAxes: [
        {
          scaleLabel: {
            display: true,
            labelString: '光の強度[a.u.]',
            fontSize: 16
          },
          ticks: {
            min: 0,
            max: 255 * 5,
            fontSize: 14
          }
        },
      ],
    },
    responsive: true,
    maintainAspectRatio: false,
    animation: false,
  };

  let mainChartsetup = {
    type: "scatter",
    data: mainData,
    options: mainOptions,
  };

  let mainCtx = document.getElementById("plotGraph");
  mainChartObj = new Chart(mainCtx, mainChartsetup);

}

// draw関数
function draw() {

  // オービットコントロール
  orbitControl();

  // 背景色の規定
  background(0);

  // 光源の描画
  lightDraw();

  // 実測値プロット用のグラフの追加
  drawGraph();
}

// windowがリサイズされたときの処理
function windowResized() {
  fullScreen()
  initValue()
}

// DOM要素のクラス
class DOM {
  constructor(n) {
    this.number = n
    let parentDiv = createDiv().parent("#dataRedisterParent").id("data-" + this.number).class("mb-1 pb-1")
    let inputGroup = createDiv().parent(parentDiv).class("input-group")
    let numSpan = createSpan("データ" + this.number).parent(inputGroup).class("input-group-text")
    let lengthSpan = createSpan("光源からの距離[cm]").parent(inputGroup).class("input-group-text")
    let lengthInput = createInput(1, "number").parent(inputGroup).class("form-control").attribute("min", 0).id("lengthInput-" + this.number).input(inputFunction)
    let intensitySpan = createSpan("光の強度").parent(inputGroup).class("input-group-text")
    let intensityInput = createInput(1, "number").parent(inputGroup).class("form-control").id("intensityInput-" + this.number).input(inputFunction)
  }
}
