import p5 from "p5";
import { hideLoadingSpinner } from "../../../js/bicpema-loading-spinner.js";
import "../../../css/tailwind.css";
import {
  computeOpticalPathDifference,
  computeTransmittance,
} from "./physics.js";
import { createLazyImporter } from "../../../js/bicpema-lazy-import.js";
import {
  HEADER_HEIGHT,
  CANVAS_WIDTH_NUMERATOR,
  CANVAS_WIDTH_DENOMINATOR,
  CANVAS_HEIGHT_NUMERATOR,
  CANVAS_HEIGHT_DENOMINATOR,
  RIGHT_PANEL_ROW_COUNT,
  GRAPH_HEIGHT_ROWS,
  CMF_GRAPH_TOP_OFFSET_ROWS,
  MAX_PIXEL_DENSITY,
  FPS,
  INCIDENT_LIGHT_CSS_COLOR,
  RAYS_PER_COLOR,
  RAY_Z_START,
  RAY_Z_RANGE,
  RAY_Z_LIMIT,
  POLARIZER_Z,
  POLARIZER_SIZE,
  ANGULAR_VELOCITY_R,
  ANGULAR_VELOCITY_RATIO_G,
  ANGULAR_VELOCITY_RATIO_B,
  OPD_PER_SHEET_R,
  OPD_PER_SHEET_G,
  OPD_PER_SHEET_B,
  WAVELENGTH_R,
  WAVELENGTH_G,
  WAVELENGTH_B,
  WAVE_AMPLITUDE,
  WAVE_POINT_RADIUS,
  FULL_OPACITY,
  DIM_OPACITY,
  DIM_STROKE_WEIGHT,
  RED_COLOR,
  GREEN_COLOR,
  BLUE_COLOR,
} from "./constants.js";

// Chart.jsの動的importをモジュール読み込み時に開始する。p5のpreload()による
// CSVの取得と並行して読み込まれるため、setup()到達時には解決済みになる想定。
const loadChart = createLazyImporter(() =>
  import("chart.js/auto").then((module) => module.default)
);

// ボタンの色をJS側で動的に切り替えるため、Bootstrapのbtn-*相当の
// スタイルをTailwindユーティリティクラスの文字列として定義しておく。
// addClass/removeClassは常にこの定数を使うことで、確実に対応する
// クラスの追加・削除ができるようにする。
const BTN_PRIMARY =
  "rounded bg-blue-600 px-3 py-2 text-white hover:bg-blue-500";
const BTN_DANGER = "rounded bg-red-600 px-3 py-2 text-white hover:bg-red-500";
const BTN_SECONDARY =
  "rounded bg-neutral-600 px-3 py-2 text-white hover:bg-neutral-500";
const BTN_SUCCESS =
  "rounded bg-green-600 px-3 py-2 text-white hover:bg-green-500";

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
    incidentColor.style("background", INCIDENT_LIGHT_CSS_COLOR);
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

  let isFirstDraw = true;

  p.draw = () => {
    if (isFirstDraw) {
      isFirstDraw = false;
      hideLoadingSpinner();
    }

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
    p.resizeCanvas(canvasWidth(p), canvasHeight(p));
    elInit(p);
    initValue(p);
    incidentColor.style("background", INCIDENT_LIGHT_CSS_COLOR);
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

// ヘッダー(HEADER_HEIGHT px固定)を除いた、実際に使用できる高さ
function usableHeight(p) {
  return p.windowHeight - HEADER_HEIGHT;
}

// setup()とwindowResized()で共通して使うキャンバスの幅・高さ。
// 詳細はdocs/docs/simulation/index.mdの「パフォーマンス方針」を参照。
function canvasWidth(p) {
  return (CANVAS_WIDTH_NUMERATOR * p.windowWidth) / CANVAS_WIDTH_DENOMINATOR;
}
function canvasHeight(p) {
  return (
    (CANVAS_HEIGHT_NUMERATOR * usableHeight(p)) / CANVAS_HEIGHT_DENOMINATOR
  );
}

function fullScreen(p) {
  p.pixelDensity(Math.min(p.displayDensity(), MAX_PIXEL_DENSITY));
  let canvas = p.createCanvas(canvasWidth(p), canvasHeight(p), p.WEBGL);
  canvas.parent(p.select("#p5Container"));
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
  buildRays();
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
    switchButton.removeClass(BTN_PRIMARY).addClass(BTN_DANGER).html("ストップ");
  } else {
    switchIs = false;
    switchButton.removeClass(BTN_DANGER).addClass(BTN_PRIMARY).html("スタート");
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
  backgroundDiv
    .size(p.windowWidth, contentHeight / 9)
    .position(0, HEADER_HEIGHT + canvasHeight(p));
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
    .size(
      p.windowWidth / 3,
      (GRAPH_HEIGHT_ROWS * p.height) / RIGHT_PANEL_ROW_COUNT
    )
    .position(canvasWidth(p), HEADER_HEIGHT + p.height / RIGHT_PANEL_ROW_COUNT)
    .style("background-color", "white");
  graphCanvas.position(0, 0).id("graphChart").parent(graph);
  cmfGraph
    .size(
      p.windowWidth / 3,
      (GRAPH_HEIGHT_ROWS * p.height) / RIGHT_PANEL_ROW_COUNT
    )
    .position(
      canvasWidth(p),
      HEADER_HEIGHT +
        (CMF_GRAPH_TOP_OFFSET_ROWS * p.height) / RIGHT_PANEL_ROW_COUNT
    )
    .style("background-color", "white");
  cmfGraphCanvas.position(0, 0).id("cmfGraphChart").parent(cmfGraph);
  let lh = p.height / RIGHT_PANEL_ROW_COUNT;
  incidentColor
    .size(p.windowWidth / 6, p.height / RIGHT_PANEL_ROW_COUNT)
    .position(canvasWidth(p), HEADER_HEIGHT)
    .style("background", "white")
    .style("text-align", "center")
    .style("font-size", "3vh")
    .style("line-height", lh + "px")
    .addClass("font-bold");
  transmittedColor
    .size(p.windowWidth / 6, p.height / RIGHT_PANEL_ROW_COUNT)
    .position(canvasWidth(p) + p.windowWidth / 6, HEADER_HEIGHT)
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

//光線(r_rays/g_rays/b_rays)を初期分布で生成し直す手続き
//initValue()とcellophaneCountSliderFunction()の両方から呼ばれる
function buildRays() {
  for (let i = 0; i < rays_number; i++) {
    r_rays[i] = new Ray(RAY_Z_START + i * (RAY_Z_RANGE / rays_number), "r");
    g_rays[i] = new Ray(RAY_Z_START + i * (RAY_Z_RANGE / rays_number), "g");
    b_rays[i] = new Ray(RAY_Z_START + i * (RAY_Z_RANGE / rays_number), "b");
  }
}

function initValue(p) {
  rays_number = RAYS_PER_COLOR;
  r_rays = new Array(rays_number);
  g_rays = new Array(rays_number);
  b_rays = new Array(rays_number);
  buildRays();
  p.camera(300, 0, 0, 0, 0, 0, 0, 1, 0);
  waveRepresentation = "sphere";
  switchIs = true;
  rIs = true;
  gIs = true;
  bIs = true;
  opdr = OPD_PER_SHEET_R;
  opdg = OPD_PER_SHEET_G;
  opdb = OPD_PER_SHEET_B;
  p.frameRate(FPS);
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
  createPolarizer(p, POLARIZER_SIZE, 0, 0, POLARIZER_Z, 0);

  //ゴール寄りの偏光板
  createPolarizer(p, POLARIZER_SIZE, 0, 0, -POLARIZER_Z, 1);

  p.strokeWeight(1);
  //光の進行方向の軸
  //長さはRAY_Z_RANGE(px)
  p.fill(0);
  p.stroke(0);
  p.push();
  p.rotateX(p.PI / 2);
  p.cylinder(1, RAY_Z_RANGE, 8, 8);
  p.pop();
  p.push();
  p.rotateX(-p.PI / 2);
  p.translate(0, RAY_Z_LIMIT, 0);
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
//Chart.jsを動的importしてから生成する。読み込みに失敗した場合は初期化を中断する。
async function initGraph() {
  let Chart;
  try {
    Chart = await loadChart();
  } catch (error) {
    console.error(
      "Chart.jsの読み込みに失敗したため、グラフを初期化できませんでした。",
      error
    );
    return;
  }
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
  if (!graphChart) return;
  const index = cellophaneCountSlider.value() - 1;

  graphChart.data.datasets[1].label =
    "出射光（セロハンテープが" + (index + 1) + "枚の時）";

  graphChart.data.datasets[1].data = intensity[index];

  graphChart.data.datasets[1].backgroundColor = `rgba(${rgb[index][0]},${rgb[index][1]},${rgb[index][2]},0.5)`;

  graphChart.data.datasets[1].borderColor = `rgba(${rgb[index][0]},${rgb[index][1]},${rgb[index][2]},1)`;

  graphChart.update();
}

//Chart.jsを動的importしてから生成する。読み込みに失敗した場合は初期化を中断する。
async function initCmfGraph() {
  let Chart;
  try {
    Chart = await loadChart();
  } catch (error) {
    console.error(
      "Chart.jsの読み込みに失敗したため、グラフを初期化できませんでした。",
      error
    );
    return;
  }
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
      this.w = ANGULAR_VELOCITY_R;
      this.opd = computeOpticalPathDifference(
        cellophaneCountSlider.value(),
        opdr
      );
      this.wl = WAVELENGTH_R;
      this.magnification = computeTransmittance(this.opd, this.wl);
    }
    if (this.clr == "g") {
      this.w = ANGULAR_VELOCITY_R * ANGULAR_VELOCITY_RATIO_G;
      this.opd = computeOpticalPathDifference(
        cellophaneCountSlider.value(),
        opdg
      );
      this.wl = WAVELENGTH_G;
      this.magnification = computeTransmittance(this.opd, this.wl);
    }
    if (this.clr == "b") {
      this.w = ANGULAR_VELOCITY_R * ANGULAR_VELOCITY_RATIO_B;
      this.opd = computeOpticalPathDifference(
        cellophaneCountSlider.value(),
        opdb
      );
      this.wl = WAVELENGTH_B;
      this.magnification = computeTransmittance(this.opd, this.wl);
    }
    if (switchIs == true) {
      if (this.posz <= RAY_Z_LIMIT) {
        this.t += this.w;
      }
      this.posz -= 1;
    }
    if (this.posz < -RAY_Z_LIMIT) {
      this.posz = RAY_Z_LIMIT;
      this.t = 0;
    }
    if (POLARIZER_Z < this.posz && this.posz < RAY_Z_LIMIT) {
      this.x = true;
      this.y = true;
      this.z = true;
      this.posx = WAVE_AMPLITUDE * p.sin(p.radians(this.t));
      this.posy = -WAVE_AMPLITUDE * p.sin(p.radians(this.t));
    } else if (
      cellophaneCountSlider.value() < this.posz &&
      this.posz < POLARIZER_Z
    ) {
      this.x = false;
      this.y = false;
      this.z = true;
      this.posx = WAVE_AMPLITUDE * p.sin(p.radians(this.t));
      this.posy = -WAVE_AMPLITUDE * p.sin(p.radians(this.t));
    } else if (
      -POLARIZER_Z < this.posz &&
      this.posz < -cellophaneCountSlider.value()
    ) {
      this.x = false;
      this.y = false;
      this.z = true;
      this.posx =
        WAVE_AMPLITUDE *
        p.sin(p.radians(this.t) + (this.opd / this.wl) * (2 * p.PI));
      this.posy = -WAVE_AMPLITUDE * p.sin(p.radians(this.t));
    } else if (-RAY_Z_LIMIT < this.posz && this.posz < -POLARIZER_Z) {
      this.x = false;
      this.y = false;
      this.z = true;
      this.posx =
        p.sqrt(this.magnification) *
        WAVE_AMPLITUDE *
        p.sin(p.radians(this.t) + (this.opd / this.wl) * (2 * p.PI));
      this.posy =
        p.sqrt(this.magnification) *
        WAVE_AMPLITUDE *
        p.sin(p.radians(this.t) + (this.opd / this.wl) * (2 * p.PI));
    } else {
      this.x = false;
      this.y = false;
      this.z = false;
    }
    if (waveRepresentation == "line") {
      if (this.clr == "r") {
        p.stroke(...RED_COLOR);
        if (rIs == true) {
          p.strokeWeight(1);
        } else {
          p.strokeWeight(DIM_STROKE_WEIGHT);
        }
      }
      if (this.clr == "g") {
        p.stroke(...GREEN_COLOR);
        if (gIs == true) {
          p.strokeWeight(1);
        } else {
          p.strokeWeight(DIM_STROKE_WEIGHT);
        }
      }
      if (this.clr == "b") {
        p.stroke(...BLUE_COLOR);
        if (bIs == true) {
          p.strokeWeight(1);
        } else {
          p.strokeWeight(DIM_STROKE_WEIGHT);
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
          p.fill(...RED_COLOR, FULL_OPACITY);
        } else {
          p.fill(...RED_COLOR, DIM_OPACITY);
        }
      }
      if (this.clr == "g") {
        if (gIs == true) {
          p.fill(...GREEN_COLOR, FULL_OPACITY);
        } else {
          p.fill(...GREEN_COLOR, DIM_OPACITY);
        }
      }
      if (this.clr == "b") {
        if (bIs == true) {
          p.fill(...BLUE_COLOR, FULL_OPACITY);
        } else {
          p.fill(...BLUE_COLOR, DIM_OPACITY);
        }
      }
      //x方向の波
      p.push();
      p.translate(this.posx, 0, this.posz);
      if (this.x == true) {
        p.sphere(WAVE_POINT_RADIUS);
      }
      p.pop();
      //y方向の波
      p.push();
      p.translate(0, this.posy, this.posz);
      if (this.y == true) {
        p.sphere(WAVE_POINT_RADIUS);
      }
      p.pop();
      //z方向の波
      p.push();
      p.translate(this.posx, this.posy, this.posz);

      if (this.z == true) {
        p.sphere(WAVE_POINT_RADIUS);
      }
      p.pop();
    }
  }
}
