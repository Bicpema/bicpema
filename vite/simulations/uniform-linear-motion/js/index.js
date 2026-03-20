import { CAR, BicpemaCanvasController } from './class.js';
import { drawScale } from './function.js';

const CANVAS_WIDTH = 1000;
const CANVAS_HEIGHT = (1000 * 9) / 16;

let YELLOW_CAR_IMG;
let RED_CAR_IMAGE;
let graphData = true;
let graphChart;
let CANVAS_CONTROLLER;
let YELLOW_CAR;
let RED_CAR;

function initValue() {
  const YELLOW_CAR_SPEED = select('#yellowCarSpeedInput').value();
  const RED_CAR_SPEED = select('#redCarSpeedInput').value();
  const yMin = min([YELLOW_CAR_SPEED, RED_CAR_SPEED]);
  let carNum = 10;
  if (Math.floor(20 / yMin) > 10) carNum = Math.floor(20 / yMin);

  YELLOW_CAR = new CAR(0, CANVAS_HEIGHT / 2 - YELLOW_CAR_IMG.height - 50, YELLOW_CAR_IMG, YELLOW_CAR_SPEED, [], []);
  RED_CAR = new CAR(0, CANVAS_HEIGHT - RED_CAR_IMAGE.height - 50, RED_CAR_IMAGE, RED_CAR_SPEED, [], []);

  for (let i = 0; i <= carNum; i++) {
    YELLOW_CAR.xarr.push({ x: i, y: YELLOW_CAR.speed * i });
    RED_CAR.xarr.push({ x: i, y: RED_CAR.speed * i });
    YELLOW_CAR.varr.push({ x: i, y: YELLOW_CAR.speed });
    RED_CAR.varr.push({ x: i, y: RED_CAR.speed });
  }
}

function graphButtonFunction() {
  graphData = !graphData;
}

function elInit() {
  const GRAPH = createDiv('<canvas id="graphCanvas"></canvas>').id('graph').parent(select('#p5Container')).class('rounded border border-1');
  const GRAPH_BUTTON_PARENT = createDiv('<button type="button" class="btn btn-secondary" id="graphButton">グラフの切り替え</button>').id('graphButtonParent').parent(select('#p5Container'));
  select('#graphButton').mousePressed(graphButtonFunction);
  const MODAL_BUTTON = createButton('シミュレーション設定').class('btn btn-primary').id('modalButton').parent(select('#p5Container')).attribute('data-bs-toggle', 'modal').attribute('data-bs-target', '#modal');

  const modalWindow = createDiv(`
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="modalLabel">Modal title</h1>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div class="form-check" id="scaleCheckBoxParent">
            <input class="form-check-input" type="checkbox" id="scaleCheckBox" checked>
            <label class="form-check-label" for="scaleCheckBox">スケールの表示・非表示</label>
          </div>
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
  `).class('modal fade').id('modal').parent(select('#p5Container')).attribute('tabindex', '-1').attribute('aria-labelledby', 'modalLabel').attribute('aria-hidden', 'true');

  select('#yellowCarSpeedInput').changed(initValue);
  select('#redCarSpeedInput').changed(initValue);
}

function elSetting() {
  const GRAPH = select('#graph');
  const GRAPH_BUTTON_PARENT = select('#graphButtonParent');
  if (width <= 992) {
    GRAPH.position((windowWidth - width) / 2, height + 125).size(width, width);
    GRAPH_BUTTON_PARENT.position((windowWidth - width) / 2, height + width + 140);
  } else {
    GRAPH.position(windowWidth / 2 - width / 4, height + 125).size(width / 2, width / 2);
    GRAPH_BUTTON_PARENT.position(windowWidth / 2 - width / 4, height + width / 2 + 140);
  }
  select('#modalButton').position(windowWidth / 2 - width / 2, 60 + height + 10);
}

function imgInit() {
  YELLOW_CAR_IMG.resize(100, 0);
  RED_CAR_IMAGE.resize(100, 0);
}

function graphDraw() {
  let yellowCarData, redCarData;
  let title, verticalAxisLabel, yMax;
  const YELLOW_CAR_SPEED = select('#yellowCarSpeedInput').value();
  const RED_CAR_SPEED = select('#redCarSpeedInput').value();
  yMax = max([YELLOW_CAR_SPEED, RED_CAR_SPEED]);
  if (graphData) {
    yellowCarData = YELLOW_CAR.xarr; redCarData = RED_CAR.xarr;
    title = 'x-tグラフ'; verticalAxisLabel = '移動距離 x [cm]'; yMax *= 10;
  } else {
    yellowCarData = YELLOW_CAR.varr; redCarData = RED_CAR.varr;
    title = 'v-tグラフ'; verticalAxisLabel = '速度 v [cm/s]';
  }
  if (graphChart) graphChart.destroy();
  const ctx = document.getElementById('graphCanvas').getContext('2d');
  graphChart = new Chart(ctx, {
    type: 'scatter',
    data: {
      datasets: [
        { label: '黄色い車のデータ', showLine: true, data: yellowCarData, pointRadius: 0, fill: true, borderColor: 'rgb(200, 200, 50)' },
        { label: '赤い車のデータ', data: redCarData, showLine: true, pointRadius: 0, fill: true, borderColor: 'rgb(255, 0, 0)' },
      ],
    },
    options: {
      plugins: { title: { display: true, text: title, font: { size: 20 } }, legend: { labels: { font: { size: 16 } } } },
      scales: {
        x: { min: 0, max: 10, ticks: { display: true, font: { size: 14 } }, title: { display: true, text: '経過時間 t [s]', font: { size: 16 } } },
        y: { min: 0, max: yMax, ticks: { display: true, font: { size: 14 } }, title: { display: true, text: verticalAxisLabel, font: { size: 16 } } },
      },
      animation: false, maintainAspectRatio: false,
    },
  });
}

window.preload = function() {
  YELLOW_CAR_IMG = loadImage('https://firebasestorage.googleapis.com/v0/b/bicpema.firebasestorage.app/o/public%2Fassets%2Fimg%2Fcommon%2FyCar.png?alt=media&token=fa3ee043-5471-41d7-bb7f-93ac1eca46f1');
  RED_CAR_IMAGE = loadImage('https://firebasestorage.googleapis.com/v0/b/bicpema.firebasestorage.app/o/public%2Fassets%2Fimg%2Fcommon%2FrCar.png?alt=media&token=7caf11af-6f62-4437-89b8-d5787c7accb8');
}

window.setup = function() {
  CANVAS_CONTROLLER = new BicpemaCanvasController();
  CANVAS_CONTROLLER.fullScreen();
  elInit();
  elSetting();
  imgInit();
  initValue();
  textSize(14);
  textAlign(CENTER);
  frameRate(60);
  graphData = true;
}

window.draw = function() {
  scale(width / 1000);
  background(0);
  fill(30); noStroke();
  rect(0, CANVAS_HEIGHT / 2 - 50, 1000, 25);
  rect(0, CANVAS_HEIGHT - 50, 1000, 25);
  const SCALE_CHECK_BOX = select('#scaleCheckBox');
  if (SCALE_CHECK_BOX.checked()) {
    drawScale(0, CANVAS_HEIGHT / 2, CANVAS_WIDTH, 50);
    drawScale(0, CANVAS_HEIGHT, CANVAS_WIDTH, 50);
  }
  RED_CAR.update();
  YELLOW_CAR.update();
  RED_CAR.drawTrajectory();
  YELLOW_CAR.drawTrajectory();
  RED_CAR.drawCar();
  YELLOW_CAR.drawCar();
  graphDraw();
}

window.windowResized = function() {
  CANVAS_CONTROLLER.resizeScreen();
  elSetting();
  initValue();
}
