///全画面表示
function fullScreen() {
    createCanvas(windowWidth, 9 * windowHeight / 10)
}

let reflectSelect,
    startButton,
    stopButton,
    restartButton,
    resetButton,
    waveSelect,
    speedInput,
    amplitudeInput;
// DOM要素の生成
function startButtonFunction() {
    waveArr.push(new incidenceWave(60 * amplitudeInput.value(), waveSelect.value()))
    moveIs = true
}
function stopButtonFunction() {
    moveIs = false
}
function restartButtonFunction() {
    moveIs = true
}
function resetButtonFunction() {
    initValue()
}
function elCreate() {
    reflectSelect = select("#reflectSelect")
    startButton = select("#startButton").mousePressed(startButtonFunction)
    stopButton = select("#stopButton").mousePressed(stopButtonFunction)
    restartButton = select("#restartButton").mousePressed(restartButtonFunction)
    resetButton = select("#resetButton").mousePressed(resetButtonFunction)
    waveSelect = select("#waveSelect")
    speedInput = select("#speedInput")
    amplitudeInput = select("#amplitudeInput")
}
let mediumWave;
let waveArr;
let moveIs;
// 初期値やシミュレーションの設定

function initValue() {
    textAlign(CENTER)
    textSize(20)
    let max_time = 60 * Math.floor(width / 60)
    mediumWave = [];
    waveArr = []
    moveIs = false
    for (let i = 60; i < max_time - 60; i++)mediumWave.push(0);

}

// setup関数
function setup() {
    fullScreen()
    elCreate()
    initValue()
}

function backgroundSetting() {
    fill(0)
    background(255)
    // 方眼の描画
    strokeWeight(1)
    stroke(68, 122, 191)
    let max_amp = 60 * ((Math.floor(height / 60)) / 2)
    let max_time = 60 * Math.floor(width / 60)

    for (let x = 60; x <= max_time; x += 60)line(x, 0, x, height)
    for (let y = height / 2; y > 0; y -= 60)line(60, y, max_time, y)
    for (let y = height / 2; y < height; y += 60)line(60, y, max_time, y)
    noStroke()

    for (let x = 300; x <= max_time; x += 300)text(x / 60, x + 60, height / 2 + 20)
    for (let y = height / 2 - 60; y > 0; y -= 60)text(int((height / 2 - y) / 60), 30, y + 8)
    for (let y = height / 2 + 60; y < height; y += 60)text(int((height / 2 - y) / 60), 30, y + 8)
    text("O", 60 - 30, height / 2 + 7)
    text("y", 60 - 30, 20)
    text("x", max_time - 15, height / 2 + 30)

    stroke(0)
    strokeWeight(3)
    line(max_time, height / 2, max_time - 12, height / 2 - 12)
    line(max_time, height / 2, max_time - 12, height / 2 + 12)
    line(60, height / 2 - max_amp, 48, height / 2 - max_amp + 12)
    line(60, height / 2 - max_amp, 72, height / 2 - max_amp + 12)
    line(60, height / 2 - max_amp, 60, height / 2 + max_amp)
    line(60, height / 2, max_time, height / 2)
}
// draw関数
function draw() {
    stroke(0)
    strokeWeight(1)
    backgroundSetting()
    let max_time = 60 * Math.floor(width / 60)
    if (moveIs) {
        for (let speed = 0; speed < speedInput.value(); speed++) {
            for (let i = 0; i < waveArr.length; i++) {
                waveArr[i]._draw()
            }
        }

    }
    stroke(68, 122, 191)
    strokeWeight(5)
    noFill()
    beginShape()
    for (let i = 60; i < max_time; i++) {
        let y = 0
        for (let j = 0; j < waveArr.length; j++) y += waveArr[j].arr[i - 60]
        vertex(i, y + height / 2)
    }
    endShape()
}

// windowがリサイズされたときの処理
function windowResized() {
    fullScreen()
    initValue()
}

class incidenceWave {
    constructor(h, t) {
        this.arr = []
        let max_time = 60 * Math.floor(width / 60)
        for (let i = 60; i < max_time; i++)this.arr.push(0)
        this.count = 0
        this.height = h
        this.judge = false
        if (t == "sin波") {
            this.waveType = -1
        } else {
            this.waveType = 1
        }
    }
    _draw() {
        let max_time = 60 * Math.floor(width / 60)
        if (max_time + 360 > this.count) {

            this.count += 1
            if (this.count <= 360) {
                this.arr[0] = this.height * sin(this.waveType * 2 * PI * this.count / 360)
            }
            for (let i = this.arr.length - 1; i > 0; i--) {
                this.arr[i] = this.arr[i - 1]
            }

        }
        if (this.arr[this.arr.length - 1] != 0 && this.judge == false) {
            waveArr.push(new reflectingWave(this.height, this.waveType))
            this.judge = true
        }
    }
}
class reflectingWave {
    constructor(h, t) {
        this.arr = []
        let max_time = 60 * Math.floor(width / 60)
        for (let i = 60; i < max_time; i++)this.arr.push(0)
        this.count = 0
        this.height = h
        this.waveType = t
    }
    _draw() {
        let reflectType;
        if (reflectSelect.value() == "固定端反射") {
            reflectType = -1
        } else {
            reflectType = 1
        }
        let max_time = 60 * Math.floor(width / 60)
        if (max_time + 360 > this.count) {
            this.count += 1
            if (this.count <= 360) {
                this.arr[this.arr.length - 1] = this.height * sin(this.waveType * reflectType * 2 * PI * this.count / 360)
            }
            for (let i = 0; i < this.arr.length - 1; i++) {
                this.arr[i] = this.arr[i + 1]
            }

        }
    }
}