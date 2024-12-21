///全画面表示
function fullScreen() {
    createCanvas(2 * windowWidth / 3, 9 * windowHeight / 10, WEBGL)
}

// 外部ファイルの読み込み
function preload() {

}

// DOM要素の生成
function elCreate() {
    parentDiv = createDiv()
    voltageSlider = createSlider(150, 300,150)
}

// DOM要素の設定
function elInit() {
    parentDiv.position(width, windowHeight / 10).size(windowWidth / 3, height).style("background-color: black;")
    voltageSlider.parent(parentDiv).position(0,0).size(windowWidth/3,windowHeight/10).style("background-color: white;")
}

let voltageValue;
// 初期値やシミュレーションの設定
function initValue() {
    voltageValue = voltageSlider.value()
    camera(400, -150, 400, 0, 250, 0, 0, 1, 0);
    const v = createVector(0, 1, -1);
    directionalLight(255, 255, 0, v);
    ambientMaterial(255, 255, 0);
    ambientLight(255);
}

// setup関数
function setup() {
    fullScreen()
    elCreate()
    elInit()
    initValue()

}
// モデルの概形の描画
function drawFoundation() {
    fill(255)
    noStroke()
    beginShape()
    vertex(0, 0, 0)
    vertex(150, 0, 0)
    vertex(150, 0, 50)
    vertex(0, 0, 50)
    endShape()

    beginShape()
    vertex(100, 0, 0)
    vertex(150, 0, 0)
    vertex(150, 0, 150)
    vertex(100, 0, 150)
    endShape()

    beginShape()
    vertex(0, 0, 0)
    vertex(50, 0, 0)
    vertex(50, 0, 100)
    vertex(0, 0, 100)
    endShape()

    beginShape()
    vertex(0, 0, 100)
    vertex(0, voltageValue, 200)
    vertex(50, voltageValue, 200)
    vertex(50, 0, 100)
    endShape()

    beginShape()
    vertex(0, voltageValue, 200)
    vertex(0, voltageValue, 300)
    vertex(50, voltageValue, 300)
    vertex(50, voltageValue, 200)
    endShape()

    beginShape()
    vertex(50, voltageValue, 300)
    vertex(150, voltageValue, 300)
    vertex(150, voltageValue, 250)
    vertex(50, voltageValue, 250)
    endShape()

    beginShape()
    vertex(100, voltageValue, 250)
    vertex(100, voltageValue, 100)
    vertex(150, voltageValue, 100)
    vertex(150, voltageValue, 250)
    endShape()

    stroke(0)
    beginShape()
    vertex(0, 0, 0)
    vertex(150, 0, 0)
    vertex(150, -25, 0)
    vertex(0, -25, 0)
    endShape()

    beginShape()
    vertex(150, 0, 0)
    vertex(150, 0, 150)
    vertex(150, -25, 150)
    vertex(150, -25, 0)
    endShape()

    beginShape()
    vertex(150, 0, 150)
    vertex(100, 0, 150)
    vertex(100, -25, 150)
    vertex(150, -25, 150)
    endShape()

    beginShape()
    vertex(150, 0, 150)
    vertex(100, 0, 150)
    vertex(100, -25, 150)
    vertex(150, -25, 150)
    endShape()

    beginShape()
    vertex(100, 0, 150)
    vertex(100, 0, 50)
    vertex(100, -25, 50)
    vertex(100, -25, 150)
    endShape()

    beginShape()
    vertex(100, 0, 50)
    vertex(50, 0, 50)
    vertex(50, -25, 50)
    vertex(100, -25, 50)
    endShape()

    beginShape()
    vertex(0, 0, 0)
    vertex(0, 0, 100)
    vertex(0, -25, 100)
    vertex(0, -25, 0)
    endShape()

    beginShape()
    vertex(50, 0, 50)
    vertex(50, 0, 100)
    vertex(50, -25, 100)
    vertex(50, -25, 50)
    endShape()

    beginShape()
    vertex(50, 0, 100)
    vertex(50, voltageValue, 200)
    vertex(50, voltageValue - 25, 200)
    vertex(50, -25, 100)
    endShape()

    beginShape()
    vertex(0, 0, 100)
    vertex(0, voltageValue, 200)
    vertex(0, voltageValue - 25, 200)
    vertex(0, -25, 100)
    endShape()

    beginShape()
    vertex(50, voltageValue, 200)
    vertex(50, voltageValue, 250)
    vertex(50, voltageValue - 25, 250)
    vertex(50, voltageValue - 25, 200)
    endShape()

    beginShape()
    vertex(50, voltageValue, 250)
    vertex(100, voltageValue, 250)
    vertex(100, voltageValue - 25, 250)
    vertex(50, voltageValue - 25, 250)
    endShape()

    beginShape()
    vertex(100, voltageValue, 250)
    vertex(100, voltageValue, 100)
    vertex(100, voltageValue - 25, 100)
    vertex(100, voltageValue - 25, 250)
    endShape()

    beginShape()
    vertex(100, voltageValue, 100)
    vertex(150, voltageValue, 100)
    vertex(150, voltageValue - 25, 100)
    vertex(100, voltageValue - 25, 100)
    endShape()

    beginShape()
    vertex(150, voltageValue, 300)
    vertex(150, voltageValue, 100)
    vertex(150, voltageValue - 25, 100)
    vertex(150, voltageValue - 25, 300)
    endShape()

    beginShape()
    vertex(0, voltageValue, 300)
    vertex(150, voltageValue, 300)
    vertex(150, voltageValue - 25, 300)
    vertex(0, voltageValue - 25, 300)
    endShape()

    beginShape()
    vertex(0, voltageValue, 300)
    vertex(0, voltageValue, 200)
    vertex(0, voltageValue - 25, 200)
    vertex(0, voltageValue - 25, 300)
    endShape()

    // ポンプと電源を繋いでいる部分
    push()
    noStroke()
    fill(200)
    translate(125, voltageValue / 2, 125)
    cylinder(5, voltageValue, 10, 1, false, false)
    pop()

    // 電源
    push()
    translate(125, voltageValue / 2, 125)
    fill(225, 237, 179, 200)
    box(50)
    pop()
}

// 水流の描画
function drawWaterFlow() {
    noStroke()
    fill(0, 255, 255, 100)

    push()
    translate(75, -19.5, 25)
    box(149, 1, 49)
    pop()

    push()
    translate(125, -19.5, 99)
    box(49, 1, 100)
    pop()

    push()
    translate(25, -19.5, 74)
    box(49, 1, 50)
    pop()

    beginShape()
    vertex(0, -20, 100)
    vertex(50, -20, 100)
    vertex(50, voltageValue - 20, 200)
    vertex(0, voltageValue - 20, 200)
    endShape()

    push()
    translate(25, voltageValue - 20, 250)
    box(49, 1, 99)
    pop()

    push()
    translate(99.9, voltageValue - 20, 275)
    box(100, 1, 49)
    pop()

    push()
    translate(125, voltageValue - 20, 175)
    box(49.9, 1, 149.9)
    pop()
}

// draw関数
function draw() {
    background(255)
    voltageValue = voltageSlider.value()
    drawFoundation()
    drawWaterFlow()
}

// windowがリサイズされたときの処理
function windowResized() {
    fullScreen()
    elInit()
    initValue()
}

// class Sample{

// }