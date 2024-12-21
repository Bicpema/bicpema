// init.jsは初期処理専用のファイルです。

/////////////////////////// 以上の記述は不必要であれば削除してください。/////////////////////////////////

// settingInit関数
// シミュレーションそのものの設定を行う関数
const FPS = 60;
let canvasController, deviceJudge;

function settingInit() {
  canvasController = new BicpemaCanvasController(true, false);
  deviceJudge = new BicpemaDeviceJudge();
  frameRate(FPS);
  textAlign(CENTER, CENTER);
  //textFont(font);
  textSize(16);
}

// elementSelectInit関数
// 仮想DOMを読み込むための関数
// グラフを利用する際には、graph,graphCanvasのコメントアウトをはずしてください。

function elementSelectInit() {
}

// elementPositionInit関数
// 仮想DOMの場所や実行関数を設定するための関数
function elementPositionInit() {
}

// valueInit関数
// 初期値を設定するための関数
//let angles = [];   // 各円の回転角度を格納する配列
let changebutton;
let resetbutton;
let ellipseButton;
let ellipseSize = true
let input
let kinouChange = true
let mininumTicks = 12;
let bignumTicks = 24;
let x1 = []
let x2 = []
let y2 = []
let y1 = []
let myDiv
let yourDiv
let angleslider
let reflactiveindex
let mediumradio
let reflactiveindex_slider
let reflactiveDiv
let reflactivenumberDiv
let chanmuki = true
let isRadioChanged = true
let angle
let changebuttontext = "空気中から媒質中に変える"
let resetbuttontext = "リセット"
let ellipseButtontext = "円を大きく"
let suuzibuttontext = "決定"
let mouse_buttontext = "スライダー操作に戻る"



function valueInit() {
  //angles.push(0); //初期角度の設定(０度から)
  let centerX = 500;
  let centerY = 500 * 9 / 16;
  textSize(32)

  //切り替え
  changebutton = createButton("空気中から媒質中に変える");
  //radio.position(0,windowHeight)
  let changebuttontextwidth = textWidth(changebuttontext)
  changebutton.size(changebuttontextwidth + 2, 30);
  changebutton.position(windowWidth * 9 / 16, height + 20)
  changebutton.mousePressed(changemuki)
  //リセットボタン
  resetbutton = createButton(resetbuttontext)
  let resetbuttontextwidth = textWidth(resetbuttontext)
  resetbutton.size(resetbuttontextwidth + 10, 30);
  resetbutton.mousePressed(resetAngle);
  resetbutton.position((windowWidth - width) / 2, height + 70)
  //円の大きさを変えるボタン
  ellipseButton = createButton(ellipseButtontext);
  let ellipsebuttontextwidth = textWidth(ellipseButtontext)
  ellipseButton.size(ellipsebuttontextwidth + 10, 30)
  ellipseButton.mousePressed(ellipseChange)
  ellipseButton.position(resetbutton.x + resetbutton.width, height + 70)

  //入力フィールド
  input = createInput()
  input.size(1.2 * width / 16, 25);
  input.position((windowWidth - width) / 2 + 150, height + 102)
  let suuzibutton = createButton("決定")
  let suuzibuttontextwidth = textWidth(suuzibuttontext)
  suuzibutton.size(suuzibuttontextwidth + 10, 30)
  suuzibutton.position(input.width + input.x, height + 100)
  suuzibutton.mousePressed(clicked);
  let labelDiv = createDiv('');
  labelDiv.html('<span>入射光の角度(0～90)</span>');  // ボタンの横にテキスト
  labelDiv.position((windowWidth - width) / 2, height + 105);  // ボタンの横に配置
  labelDiv.style('color', 'white')
  input.input(handleInputChange)


  //スライダー操作に戻るボタン
  let mouse_button = createButton("スライダー操作に戻る");
  let mouse_buttontextwidth = textWidth(mouse_buttontext)
  mouse_button.size(mouse_buttontextwidth + 2, 30);
  mouse_button.mousePressed(modoru)
  mouse_button.position(ellipseButton.x + ellipseButton.width, height + 70)

  //angleのスライダー
  angleslider = createSlider(-90, 90, 0, 0.1)
  angleslider.position((windowWidth - width) / 2 + width * 3 / 50 + textWidth("分度器の回転"), height + 25)
  angleslider.style('width', '200px')

  //強度の表示
  myDiv = createDiv('')
  myDiv.position(windowWidth / 2, height + 115);
  myDiv.style('font-size', '28px');
  myDiv.style('color', 'white')
  yourDiv = createDiv('')
  yourDiv.position(windowWidth / 2, height + 145)
  yourDiv.style('font-size', '28px');
  yourDiv.style('color', 'white');

  //物質を変える
  mediumradio = createRadio();
  mediumradio.position((windowWidth - width) / 2, height + 130)
  mediumradio.option("水");
  mediumradio.option("エタノール")
  mediumradio.option("石英ガラス")
  mediumradio.option("水晶");
  mediumradio.option("ダイヤモンド");
  mediumradio.selected("水")
  mediumradio.changed(handleRadioChange);
  mediumradio.style('color', 'white');

  //屈折率のスライダー
  reflactiveindex_slider = createSlider(1, 3, 1.333, 0.001);
  reflactiveindex_slider.position((windowWidth - width) / 2 + 160, height + 160);
  reflactiveindex_slider.style('width', '200px');

  //屈折率の表示
  reflactiveDiv = createDiv('')
  reflactiveDiv.position((windowWidth - width) / 2, height + 150)
  reflactiveDiv.style('font-size', '23px');
  reflactiveDiv.style('color', 'white')

  //屈折率の値の表示
  reflactivenumberDiv = createDiv('');
  reflactivenumberDiv.position((windowWidth - width) / 2 + 362, height + 150)
  reflactivenumberDiv.style('font-size', '23px')
  reflactivenumberDiv.style('color', 'white')

  //枠組み
  //p5Canvas.style('border', '10px solid #9E9E9E')

}

function windowResized() {
  valueInit()
}