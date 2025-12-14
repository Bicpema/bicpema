const FPS = 60;

let train;
let graph, graphCanvas;
let controlPanel;
let accelerationSlider, accelerationValue;
let resetButton;
let velocityDisplay, timeDisplay;

function settingInit() {
  // キャンバスを上半分に配置（高さを50%に）
  const P5_CANVAS = select("#p5Canvas");
  const NAV_BAR = select("#navBar");
  const w = windowWidth;
  const h = (windowHeight - NAV_BAR.height) / 2;
  
  const canvas = createCanvas(w, h);
  canvas.parent(P5_CANVAS).class("rounded border border-1");
  
  frameRate(FPS);
  textAlign(CENTER, CENTER);
  textFont(font);
  textSize(16);
}

function elementSelectInit() {
  graph = select("#graph");
  graphCanvas = select("#graphCanvas");
  
  // コントロールパネルを作成
  controlPanel = createDiv('')
    .id('controlPanel')
    .parent(select('#p5Canvas'))
    .style('position', 'absolute')
    .style('top', '10px')
    .style('left', '10px')
    .style('background-color', 'rgba(255, 255, 255, 0.9)')
    .style('padding', '15px')
    .style('border-radius', '8px')
    .style('box-shadow', '0 2px 8px rgba(0,0,0,0.3)')
    .style('font-family', 'sans-serif')
    .style('z-index', '10');
  
  // 加速度スライダー
  createDiv('<label for="accelerationSlider" style="font-weight: bold; color: #333;">加速度: <span id="accelerationValue">1.0</span> m/s²</label>')
    .parent(controlPanel);
  
  accelerationSlider = createSlider(-3, 3, 1, 0.1)
    .parent(controlPanel)
    .style('width', '200px')
    .id('accelerationSlider')
    .input(() => {
      const value = accelerationSlider.value();
      select('#accelerationValue').html(value.toFixed(1));
      if (train) {
        train.setAcceleration(parseFloat(value));
      }
    });
  
  createDiv('').parent(controlPanel).style('height', '10px');
  
  // リセットボタン
  resetButton = createButton('リセット')
    .parent(controlPanel)
    .style('padding', '8px 16px')
    .style('background-color', '#007bff')
    .style('color', 'white')
    .style('border', 'none')
    .style('border-radius', '4px')
    .style('cursor', 'pointer')
    .style('font-weight', 'bold')
    .mousePressed(() => {
      train.reset(parseFloat(accelerationSlider.value()));
    });
  
  createDiv('').parent(controlPanel).style('height', '15px');
  
  // 速度表示
  velocityDisplay = createDiv('速度: 0.0 m/s')
    .parent(controlPanel)
    .style('font-size', '14px')
    .style('color', '#333')
    .style('margin-top', '5px');
  
  // 時間表示
  timeDisplay = createDiv('経過時間: 0.0 s')
    .parent(controlPanel)
    .style('font-size', '14px')
    .style('color', '#333')
    .style('margin-top', '5px');
}

function elementPositionInit() {
  // グラフの位置とサイズを設定
  if (graph) {
    graph.position(0, height);
  }
}

function valueInit() {
  const NAV_BAR = select("#navBar");
  const h = (windowHeight - NAV_BAR.height) / 2;
  train = new Train(50, h / 2 - 30, parseFloat(accelerationSlider.value()));
}
