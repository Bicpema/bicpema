///全画面表示
function fullScreen() {
    createCanvas(windowWidth, 8 * windowHeight / 10)
}

// DOM要素の生成
function elCreate() {
    startButton = createButton("音の入力開始")
    stopButton = createButton("一時停止")
    restartButton = createButton("再開")
    switchButton = createButton("表示の切り替え")
}

function startButtonFunction() {
    userStartAudio();
}
function stopButtonFunction() {
    paused = true
}
function restartButtonFunction() {
    paused = false
}
function switchButtonFunction() {
    if (displaySwitch) {
        displaySwitch = false
    } else {
        displaySwitch = true
    }
}
// DOM要素の設定
function elInit() {
    startButton.mousePressed(startButtonFunction)
    stopButton.mousePressed(stopButtonFunction)
    restartButton.mousePressed(restartButtonFunction)
    switchButton.mousePressed(switchButtonFunction)
}

let mic, fft;
let paused;
let displaySwitch;
// 初期値やシミュレーションの設定
function initValue() {
    mic = new p5.AudioIn();
    mic.start();
    fft = new p5.FFT();
    fft.setInput(mic);
    paused = false
    displaySwitch = true
    textSize(width / 50)
}

// setup関数
function setup() {
    fullScreen()
    elCreate()
    elInit()
    initValue()
    userStartAudio();
}

// draw関数
let waveform;
let spectrum;
function draw() {
    background(18, 154, 169);
    noStroke()
    fill(0)
    text("音の入力を開始する際には、左下部の「音の入力開始」ボタンをクリックしてください。", 50, 50)
    stroke(0)
    strokeWeight(1.5)
    for (let i = -width / 2; i < width / 2; i += 50)line(width / 2 + i, 0, width / 2 + i, height)
    for (let i = height / 2; i > 0; i -= 50)line(0, i, width, i)
    for (let i = height / 2; i < height; i += 50)line(0, i, width, i)
    strokeWeight(3);
    noFill();
    stroke(163, 254, 245)
    if (displaySwitch) {
        if (!paused) waveform = fft.waveform();
        beginShape();
        for (let i = 0; i < waveform.length; i++) {
            let x = map(i, 0, waveform.length, 0, width);
            let y = map(waveform[i], -1, 1, 0, height);
            vertex(x, y);
        }
        endShape();
    } else {
        if (!paused) spectrum = fft.analyze();
        beginShape();
        for (i = 0; i < spectrum.length; i++) {
            let x = map(i, 0, spectrum.length, 0, width);
            let y = map(spectrum[i], 0, 255, height - 5, 0)
            vertex(x, y);
        }
        endShape();
    }
}

// windowがリサイズされたときの処理
function windowResized() {
    fullScreen()
    elInit()
    initValue()
}
