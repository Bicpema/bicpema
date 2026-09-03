import p5 from "p5";
import "../../../css/tailwind.css";
import Chart from "chart.js/auto";
import {
  computeOpticalPathDifference,
  computeTransmittance,
} from "./physics.js";

// ボタンの色をJS側で動的に切り替えるため、Bootstrapのbtn-*相当の
// スタイルをTailwindユーティリティクラスの文字列として定義しておく。
// addClass/removeClassは常にこの定数を使うことで、確実に対応する
// クラスの追加・削除ができるようにする。
const BTN_PRIMARY = "rounded bg-blue-600 px-3 py-2 text-white hover:bg-blue-500";
const BTN_DANGER = "rounded bg-red-600 px-3 py-2 text-white hover:bg-red-500";
const BTN_SECONDARY =
  "rounded bg-neutral-600 px-3 py-2 text-white hover:bg-neutral-500";
const BTN_SUCCESS = "rounded bg-green-600 px-3 py-2 text-white hover:bg-green-500";

const state = {
  spectrumSheet: null,
  //セロハンの枚数毎のRGB値
  rgbSheet: null,
  //等色関数の強度分布
  cmfSheet: null,
  //光源の強度分布;
  lightSourceSpectrumSheet: null,
};

const sketch = (p) => {
  p.preload = () => {
    state.spectrumSheet = p.loadTable(
      "https://dl.dropboxusercontent.com/s/vqd8bojsw5z5zxz/spectrumSheet.csv"
    );
    state.rgbSheet = p.loadTable(
      "https://dl.dropboxusercontent.com/s/a2o8jwq7b7234ul/rgbSheet.csv"
    );
    state.cmfSheet = p.loadTable(
      "https://dl.dropboxusercontent.com/s/t00y963w7hitfho/cmfSheet.csv"
    );
    state.lightSourceSpectrumSheet = p.loadTable(
      "https://dl.dropboxusercontent.com/s/bsoxh313yvv6wuv/lightSourceSpectrumSheet.csv"
    );
  };

  p.setup = () => {
    fullScreen(p);
    elCreate(p);
    elInit(p);
    initValue(p);
    csvDataLoad();

    initGraph();
    initCmfGraph();
    incidentColor.style("background", "rgb(144,181,130)");
    transmittedColor.style(
      "background",
      "rgb(" +
        rgb[cellophaneCountSlider.value() - 1][0] +
        "," +
        rgb[cellophaneCountSlider.value() - 1][1] +
        "," +
        rgb[cellophaneCountSlider.value() - 1][2] +
        ")"
    );
  };

  p.draw = () => {
    p.orbitControl(10, 10, 10);
    //背景色
    p.background(100);
    for (let i = 0; i < rays_number; i++) {
      r_rays[i]._draw(p);
      g_rays[i]._draw(p);
      b_rays[i]._draw(p);
    }
    main(p);
  };

  p.windowResized = () => {
    p.resizeCanvas((2 * p.windowWidth) / 3, (8 * usableHeight(p)) / 9);
    elInit(p);
    initValue(p);
    incidentColor.style("background", "rgb(144,181,130)");
    transmittedColor.style(
      "background",
      "rgb(" +
        rgb[cellophaneCountSlider.value() - 1][0] +
        "," +
        rgb[cellophaneCountSlider.value() - 1][1] +
        "," +
        rgb[cellophaneCountSlider.value() - 1][2] +
        ")"
    );
  };
};

new p5(sketch);

// ヘッダー(60px固定)を除いた、実際に使用できる高さ
function usableHeight(p) {
  return p.windowHeight - 60;
}

function fullScreen(p) {
  let canvas = p.createCanvas(
    (2 * p.windowWidth) / 3,
    (8 * usableHeight(p)) / 9,
    p.WEBGL
  );
  canvas.parent(document.getElementById("p5Container"));
}

//ボタン、スライダー、グラフのインスタンス
let backgroundDiv,
  waveRepresentationButton,
  cellophaneCountSlider,
  cellophaneCountSliderValue,
  rButton,
  gButton,
  bButton,
  switchButton,
  graph,
  graphCanvas,
  graphChart,
  cmfGraph,
  cmfGraphCanvas,
  cmfGraphChart,
  incidentColor,
  transmittedColor;
function elCreate(p) {
  incidentColor = p.createDiv("入射光");
  transmittedColor = p.createDiv("出射光");
  graph = p.createDiv();
  graphCanvas = p.createElement("canvas");
  cmfGraph = p.createDiv();
  cmfGraphCanvas = p.createElement("canvas");
  backgroundDiv = p.createDiv();
  waveRepresentationButton = p.createButton("波動表現の切り替え");
  cellophaneCountSlider = p.createSlider(1, 10, 1);
  cellophaneCountSliderValue = p.createDiv(
    "セロハンテープの枚数:" + cellophaneCountSlider.value() + "枚"
  );
  rButton = p.createButton("赤(600 nm)");
  gButton = p.createButton("緑(550 nm)");
  bButton = p.createButton("青(450 nm)");
  switchButton = p.createButton("ストップ");
}

//視点を規定する手続き
//viewPointButtonをクリックすると呼び出される
function waveRepresentationFunction(p) {
  if (waveRepresentation == "line") {
    waveRepresentation = "sphere";
    waveRepresentationButton.removeClass(BTN_DANGER).addClass(BTN_PRIMARY);
  } else if (waveRepresentation == "sphere") {
    waveRepresentation = "line";
    waveRepresentationButton.removeClass(BTN_PRIMARY).addClass(BTN_DANGER);
  }
}

//光線をredrawする手続き
//スライダーが動いた時に呼び出される
function cellophaneCountSliderFunction(p) {
  for (let i = 0; i < rays_number; i++) {
    r_rays[i] = new Ray(150 + i * (300 / rays_number), "r");
    g_rays[i] = new Ray(150 + i * (300 / rays_number), "g");
    b_rays[i] = new Ray(150 + i * (300 / rays_number), "b");
  }
  cellophaneCountSliderValue.html(
    "セロハンテープの枚数:" + cellophaneCountSlider.value() + "枚"
  );
  transmittedColor.style(
    "background",
    "rgb(" +
      rgb[cellophaneCountSlider.value() - 1][0] +
      "," +
      rgb[cellophaneCountSlider.value() - 1][1] +
      "," +
      rgb[cellophaneCountSlider.value() - 1][2] +
      ")"
  );
}

//動かすか止めるかを規定する手続き
//スイッチボタンをクリックすると呼び出される
function switchFunction(p) {
  if (switchIs == false) {
    switchIs = true;
    switchButton
      .removeClass(BTN_PRIMARY)
      .addClass(BTN_DANGER)
      .html("ストップ");
  } else {
    switchIs = false;
    switchButton
      .removeClass(BTN_DANGER)
      .addClass(BTN_PRIMARY)
      .html("スタート");
  }
}

//赤の光線を描画するか規定する手続き
function rButtonFunction(p) {
  if (rIs == true) {
    rIs = false;
    rButton.removeClass(BTN_DANGER).addClass(BTN_SECONDARY);
  } else {
    rIs = true;
    rButton.removeClass(BTN_SECONDARY).addClass(BTN_DANGER);
  }
}

//緑の光線を描画するか規定する手続き
function gButtonFunction(p) {
  if (gIs == true) {
    gIs = false;
    gButton.removeClass(BTN_SUCCESS).addClass(BTN_SECONDARY);
  } else {
    gIs = true;
    gButton.removeClass(BTN_SECONDARY).addClass(BTN_SUCCESS);
  }
}

//青の光線を描画するか規定する手続き
function bButtonFunction(p) {
  if (bIs == true) {
    bIs = false;
    bButton.removeClass(BTN_PRIMARY).addClass(BTN_SECONDARY);
  } else {
    bIs = true;
    bButton.removeClass(BTN_SECONDARY).addClass(BTN_PRIMARY);
  }
}

function elInit(p) {
  const contentHeight = usableHeight(p);
  const canvasHeight = (8 * contentHeight) / 9;
  backgroundDiv
    .size(p.windowWidth, contentHeight / 9)
    .position(0, 60 + canvasHeight);
  const barHeight = contentHeight / 9;
  waveRepresentationButton
    .mousePressed(() => waveRepresentationFunction(p))
    .size(p.windowWidth / 4, barHeight)
    .position(0, 0)
    .parent(backgroundDiv)
    .addClass(BTN_PRIMARY)
    .style("font-size", "3vh");
  cellophaneCountSlider
    .size(p.windowWidth / 4, (2 * barHeight) / 3)
    .position(p.windowWidth / 4, barHeight / 3)
    .parent(backgroundDiv)
    .input(() => {
      cellophaneCountSliderFunction(p);
      updateGraph();
    });
  cellophaneCountSliderValue
    .size(p.windowWidth / 4, barHeight / 2)
    .position(p.windowWidth / 4, 0)
    .parent(backgroundDiv)
    .style("font-size", "3vh");
  rButton
    .mousePressed(() => rButtonFunction(p))
    .size(p.windowWidth / 12, barHeight)
    .position((2 * p.windowWidth) / 4 + (0 * p.windowWidth) / 12, 0)
    .parent(backgroundDiv)
    .addClass(BTN_DANGER);
  gButton
    .mousePressed(() => gButtonFunction(p))
    .size(p.windowWidth / 12, barHeight)
    .position((2 * p.windowWidth) / 4 + (1 * p.windowWidth) / 12, 0)
    .parent(backgroundDiv)
    .addClass(BTN_SUCCESS);
  bButton
    .mousePressed(() => bButtonFunction(p))
    .size(p.windowWidth / 12, barHeight)
    .position((2 * p.windowWidth) / 4 + (2 * p.windowWidth) / 12, 0)
    .parent(backgroundDiv)
    .addClass(BTN_PRIMARY);
  switchButton
    .mousePressed(() => switchFunction(p))
    .size(p.windowWidth / 4, barHeight)
    .position((3 * p.windowWidth) / 4, 0)
    .parent(backgroundDiv)
    .addClass(BTN_DANGER)
    .style("font-size", "3vh");
  graph
    .size(p.windowWidth / 3, (4.5 * p.height) / 10)
    .position((2 * p.windowWidth) / 3, 60 + p.height / 10)
    .style("background-color", "white");
  graphCanvas.position(0, 0).id("graphChart").parent(graph);
  cmfGraph
    .size(p.windowWidth / 3, (4.5 * p.height) / 10)
    .position((2 * p.windowWidth) / 3, 60 + (5.5 * p.height) / 10)
    .style("background-color", "white");
  cmfGraphCanvas.position(0, 0).id("cmfGraphChart").parent(cmfGraph);
  let lh = p.height / 10;
  incidentColor
    .size(p.windowWidth / 6, p.height / 10)
    .position((2 * p.windowWidth) / 3, 60)
    .style("background", "white")
    .style("text-align", "center")
    .style("font-size", "3vh")
    .style("line-height", lh + "px")
    .addClass("font-bold");
  transmittedColor
    .size(p.windowWidth / 6, p.height / 10)
    .position((2 * p.windowWidth) / 3 + p.windowWidth / 6, 60)
    .style("background", "white")
    .style("text-align", "center")
    .style("font-size", "3vh")
    .style("line-height", lh + "px")
    .addClass("font-bold");
}

//csvファイル内のデータを格納する配列
let waveLength = [],
  intensity = [];
let rgb = [];
let cmfr = [],
  cmfg = [],
  cmfb = [];
let lightSourceIntensity = [];

//csvファイルないのデータを配列に格納する手続き
function csvDataLoad() {
  let rowCount = state.spectrumSheet.getRowCount();
  for (let i = 0; i < 10; i++) {
    intensity[i] = [];
    rgb[i] = [];
    for (let j = 1; j < rowCount; j++) {
      intensity[i][j] = state.spectrumSheet.getNum(j, i) / 1000;
    }
    for (let j = 0; j < 3; j++) {
      rgb[i][j] = state.rgbSheet.getNum(i + 1, j + 1);
    }
  }
  for (let i = 1; i < rowCount; i++) {
    waveLength[i] = state.cmfSheet.getNum(i, 0);
    cmfr[i] = state.cmfSheet.getNum(i, 1);
    cmfg[i] = state.cmfSheet.getNum(i, 2);
    cmfb[i] = state.cmfSheet.getNum(i, 3);
    lightSourceIntensity[i] =
      state.lightSourceSpectrumSheet.getNum(i, 1) / 1000;
  }
}

//初期値に関する変数
let rays_number,
  r_rays,
  g_rays,
  b_rays,
  waveRepresentation,
  switchIs,
  rIs,
  gIs,
  bIs,
  //波長600 nmのセロハン一枚当たりの位相差
  opdr,
  //波長550 nmのセロは一枚当たりの位相差
  opdg,
  //波長450 nmのセロハン一枚当たりの位相差
  opdb;

function initValue(p) {
  rays_number = 300;
  r_rays = new Array(rays_number);
  g_rays = new Array(rays_number);
  b_rays = new Array(rays_number);
  for (let i = 0; i < rays_number; i++) {
    r_rays[i] = new Ray(150 + i * (300 / rays_number), "r");
    g_rays[i] = new Ray(150 + i * (300 / rays_number), "g");
    b_rays[i] = new Ray(150 + i * (300 / rays_number), "b");
  }
  p.camera(300, 0, 0, 0, 0, 0, 0, 1, 0);
  waveRepresentation = "sphere";
  switchIs = true;
  rIs = true;
  gIs = true;
  bIs = true;
  opdr = 212.596704;
  opdg = 213.5303046;
  opdb = 215.5841246;
  p.frameRate(30);
}

//偏光板を描画する関数
function createPolarizer(p, size, x, y, z, pattern) {
  p.push();
  p.translate(x, y, z);
  p.noFill();
  p.strokeWeight(2);
  p.stroke(0, 50);
  p.box(size, size, 0);
  if (pattern == 0) {
    for (let i = 0; i < size; i += 5) {
      p.line(size / 2 - i, -size / 2, 0, -size / 2, size / 2 - i, 0);
      p.line(size / 2, -size / 2 + i, 0, -size / 2 + i, size / 2, 0);
    }
  } else if (pattern == 1) {
    for (let i = 0; i < size; i += 5) {
      p.line(-size / 2, -size / 2 + i, 0, size / 2 - i, size / 2, 0);
      p.line(-size / 2 + i, -size / 2, 0, size / 2, size / 2 - i, 0);
    }
  }
  p.pop();
}

//背景のデザインを規定する手続き
function main(p) {
  //スタート寄りの偏光板
  createPolarizer(p, 125, 0, 0, 100, 0);

  //ゴール寄りの偏光板
  createPolarizer(p, 125, 0, 0, -100, 1);

  p.strokeWeight(1);
  //光の進行方向の軸
  //長さは300px
  p.fill(0);
  p.stroke(0);
  p.push();
  p.rotateX(p.PI / 2);
  p.cylinder(1, 300, 8, 8);
  p.pop();
  p.push();
  p.rotateX(-p.PI / 2);
  p.translate(0, 150, 0);
  p.cone(4, 7, 10, 10, true);
  p.pop();

  //セロハンの描画
  p.fill(0, 255, 255, 15);
  p.strokeWeight(1);
  p.push();
  p.translate(0, 0, cellophaneCountSlider.value());
  for (let i = 0; i < cellophaneCountSlider.value(); i++) {
    p.push();
    p.translate(0, 0, -2 * i);
    p.box(50, 100, 2);
    p.pop();
  }
  p.pop();
}

//グラフを描画する手続き
function initGraph() {
  const ctx1 = document.getElementById("graphChart").getContext("2d");

  graphChart = new Chart(ctx1, {
    type: "line",
    data: {
      labels: waveLength,
      datasets: [
        {
          label: "入射光",
          data: lightSourceIntensity,
          borderColor: "rgba(0, 0, 0 ,1)",
          lineTension: 0.3,
        },
        {
          label: "出射光",
          data: intensity[0],
          fill: true,
          backgroundColor: "rgba(0,0,0,0.5)",
          borderColor: "rgba(0,0,0,1)",
          lineTension: 0.3,
        },
      ],
    },
    options: {
      scales: {
        x: {
          display: true,
          title: { display: true, text: "波長(nm)" },
        },
        y: {
          display: true,
          title: { display: true, text: "強度(a.u.)" },
          min: 0,
        },
      },
      plugins: {
        title: { display: true, text: "スペクトル" },
      },
      animation: false,
    },
  });
}

function updateGraph() {
  const index = cellophaneCountSlider.value() - 1;

  graphChart.data.datasets[1].label =
    "出射光（セロハンテープが" + (index + 1) + "枚の時）";

  graphChart.data.datasets[1].data = intensity[index];

  graphChart.data.datasets[1].backgroundColor = `rgba(${rgb[index][0]},${rgb[index][1]},${rgb[index][2]},0.5)`;

  graphChart.data.datasets[1].borderColor = `rgba(${rgb[index][0]},${rgb[index][1]},${rgb[index][2]},1)`;

  graphChart.update();
}

function initCmfGraph() {
  const ctx2 = document.getElementById("cmfGraphChart").getContext("2d");

  cmfGraphChart = new Chart(ctx2, {
    type: "line",
    data: {
      labels: waveLength,
      datasets: [
        { label: "x(λ)", data: cmfr, borderColor: "rgba(255,0,0,1)" },
        { label: "y(λ)", data: cmfg, borderColor: "rgba(0,255,0,1)" },
        { label: "z(λ)", data: cmfb, borderColor: "rgba(0,0,255,1)" },
      ],
    },
    options: {
      scales: {
        x: {
          display: true,
          title: { display: true, text: "波長(nm)" },
        },
        y: {
          display: true,
          title: { display: true, text: "強度(a.u.)" },
          min: 0,
        },
      },
      plugins: {
        title: { display: true, text: "測色標準観測者の等色関数" },
      },
      animation: false,
    },
  });
}

//光線のクラス
class Ray {
  constructor(z, color) {
    this.posx = 0;
    this.posy = 0;
    this.posz = z;
    this.t = 0;
    this.x = true;
    this.y = true;
    this.z = true;
    this.clr = color;
    this.w = 0;
    this.opd = 0;
    this.wl = 0;
    this.magnification = 1;
  }
  _draw(p) {
    //波長700 nmの１フレーム当たりの角速度
    //単位は (°)
    if (this.clr == "r") {
      this.w = (2 * 180) / 25;
      this.opd = computeOpticalPathDifference(
        cellophaneCountSlider.value(),
        opdr
      );
      this.wl = 600;
      this.magnification = computeTransmittance(this.opd, this.wl);
    }
    if (this.clr == "g") {
      this.w = ((2 * 180) / 25) * 0.78;
      this.opd = computeOpticalPathDifference(
        cellophaneCountSlider.value(),
        opdg
      );
      this.wl = 550;
      this.magnification = computeTransmittance(this.opd, this.wl);
    }
    if (this.clr == "b") {
      this.w = ((2 * 180) / 25) * 0.62214285714;
      this.opd = computeOpticalPathDifference(
        cellophaneCountSlider.value(),
        opdb
      );
      this.wl = 450;
      this.magnification = computeTransmittance(this.opd, this.wl);
    }
    if (switchIs == true) {
      if (this.posz <= 150) {
        this.t += this.w;
      }
      this.posz -= 1;
    }
    if (this.posz < -150) {
      this.posz = 150;
      this.t = 0;
    }
    if (100 < this.posz && this.posz < 150) {
      this.x = true;
      this.y = true;
      this.z = true;
      this.posx = 25 * p.sin(p.radians(this.t));
      this.posy = -25 * p.sin(p.radians(this.t));
    } else if (cellophaneCountSlider.value() < this.posz && this.posz < 100) {
      this.x = false;
      this.y = false;
      this.z = true;
      this.posx = 25 * p.sin(p.radians(this.t));
      this.posy = -25 * p.sin(p.radians(this.t));
    } else if (-100 < this.posz && this.posz < -cellophaneCountSlider.value()) {
      this.x = false;
      this.y = false;
      this.z = true;
      this.posx =
        25 * p.sin(p.radians(this.t) + (this.opd / this.wl) * (2 * p.PI));
      this.posy = -25 * p.sin(p.radians(this.t));
    } else if (-150 < this.posz && this.posz < -100) {
      this.x = false;
      this.y = false;
      this.z = true;
      this.posx =
        p.sqrt(this.magnification) *
        25 *
        p.sin(p.radians(this.t) + (this.opd / this.wl) * (2 * p.PI));
      this.posy =
        p.sqrt(this.magnification) *
        25 *
        p.sin(p.radians(this.t) + (this.opd / this.wl) * (2 * p.PI));
    } else {
      this.x = false;
      this.y = false;
      this.z = false;
    }
    if (waveRepresentation == "line") {
      if (this.clr == "r") {
        p.stroke(255, 0, 0);
        if (rIs == true) {
          p.strokeWeight(1);
        } else {
          p.strokeWeight(0.1);
        }
      }
      if (this.clr == "g") {
        p.stroke(0, 255, 0);
        if (gIs == true) {
          p.strokeWeight(1);
        } else {
          p.strokeWeight(0.1);
        }
      }
      if (this.clr == "b") {
        p.stroke(0, 0, 255);
        if (bIs == true) {
          p.strokeWeight(1);
        } else {
          p.strokeWeight(0.1);
        }
      }
      //x方向の波
      p.push();
      if (this.x == true) {
        p.line(0, 0, this.posz, this.posx, 0, this.posz);
      }
      p.pop();
      //y方向の波
      p.push();
      if (this.y == true) {
        p.line(0, 0, this.posz, 0, this.posy, this.posz);
      }
      p.pop();
      //z方向の波
      p.push();

      if (this.z == true) {
        p.line(0, 0, this.posz, this.posx, this.posy, this.posz);
      }
      p.pop();
    } else {
      p.noStroke();
      if (this.clr == "r") {
        if (rIs == true) {
          p.fill(255, 0, 0, 255);
        } else {
          p.fill(255, 0, 0, 50);
        }
      }
      if (this.clr == "g") {
        if (gIs == true) {
          p.fill(0, 255, 0, 255);
        } else {
          p.fill(0, 255, 0, 50);
        }
      }
      if (this.clr == "b") {
        if (bIs == true) {
          p.fill(0, 0, 255, 255);
        } else {
          p.fill(0, 0, 255, 50);
        }
      }
      //x方向の波
      p.push();
      p.translate(this.posx, 0, this.posz);
      if (this.x == true) {
        p.sphere(1.5);
      }
      p.pop();
      //y方向の波
      p.push();
      p.translate(0, this.posy, this.posz);
      if (this.y == true) {
        p.sphere(1.5);
      }
      p.pop();
      //z方向の波
      p.push();
      p.translate(this.posx, this.posy, this.posz);

      if (this.z == true) {
        p.sphere(1.5);
      }
      p.pop();
    }
  }
}
