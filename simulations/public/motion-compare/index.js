// 必要な要素
// 速度や加速度の異なる球の運動を比較できるように
// 初速、加速度を入力できるようにする
// スタートボタンストップボタンを入れる
// 経過時間も入れる
// 進んだ距離を表示する

//全画面表示
function fullScreen() {
    createCanvas(3 * windowWidth / 4, 9 * windowHeight / (10 * 2))
}

// 外部ファイルの読み込み
function preload() {
}

// DOM要素の生成
let distGraphChart;
let velocityGraphChart;
function elCreate() {
    timer = createDiv("経過時間:0[s]").id("timer")
    b1VelocityIntro = createElement("label", "上のボールの初速[]").class('b1')
    b1Velocity = createInput(5, "number", 0.1).class('b1')
    b1AccelerationIntro = createElement("label", "上のボールの加速度[]").class('b1')
    b1Acceleration = createInput(10, "number", 0.1).class('b1')
    b2VelocityIntro = createElement("label", "下のボールの初速[]").class('b2')
    b2Velocity = createInput(10, "number", 0.1).class('b2')
    b2AccelerationIntro = createElement("label", "下のボールの加速度[]").class('b2')
    b2Acceleration = createInput(5, "number", 0.1).class('b2')
    moveButton = createButton("スタート/ストップ").class("btn btn-primary").mousePressed(buttonAction)
    resetButton = createButton("リセット").class("btn btn-secondary").mousePressed(resetAction)
    distGraph = createDiv().id("distGraph");
    distGraphCanvas = createElement("canvas").id("distGraphChart")
    velocityGraph = createDiv().id("velocityGraph");
    velocityGraphCanvas = createElement("canvas").id("velocityGraphChart")
}
function buttonAction() {
    if (moveIs == false) {
        moveIs = true
    } else {
        moveIs = false
    }
    if (count == 0) {
        b1 = new Ball(b1.posx, height / 2 - 2 * ballRadi, parseFloat(b1Velocity.value()), parseFloat(b1Acceleration.value()))
        b2 = new Ball(b2.posx, height - 2 * ballRadi, parseFloat(b2Velocity.value()), parseFloat(b2Acceleration.value()))
    }
}
function resetAction() {
    initValue()
    count = 0
    timer.html("経過時間:" + parseInt(count / fps) + "[s]")
}
// DOM要素の設定
function elInit() {
    let DOMarr = [timer, b1VelocityIntro, b1Velocity, b1AccelerationIntro, b1Acceleration, b2VelocityIntro, b2Velocity, b2AccelerationIntro, b2Acceleration, moveButton, resetButton]
    for (let i = 0; i < DOMarr.length; i++) {
        DOMarr[i].position(width, windowHeight / 10 + i * (9 * windowHeight / 10) / DOMarr.length).size(windowWidth / 4, (9 * windowHeight / 10) / DOMarr.length)
    }
    distGraph.size(3 * windowWidth / 8, height).position(0, height + windowHeight / 10);
    distGraphCanvas.size(0, 0).position(0, 0).parent(distGraph);
    velocityGraph.size(3 * windowWidth / 8, height).position(width / 2, height + windowHeight / 10);
    velocityGraphCanvas.size(0, 0).position(0, 0).parent(velocityGraph);
}

let ballRadi;
let b1, b2;
let fps;
let moveIs;
let count;
let countArr;
// 初期値やシミュレーションの設定
function initValue() {
    ballRadi = 15
    b1 = new Ball(ballRadi, height / 2 - 2 * ballRadi, parseFloat(b1Velocity.value()), parseFloat(b1Acceleration.value()))
    b2 = new Ball(ballRadi, height - 2 * ballRadi, parseFloat(b2Velocity.value()), parseFloat(b2Acceleration.value()))
    fps = 60
    moveIs = false
    count = 0
    countArr = []
    frameRate(fps)
    textSize(16)
    textAlign(CENTER)
}

// setup関数
function setup() {
    fullScreen()
    elCreate()
    elInit()
    initValue()
}

function backgroundSettings() {
    background(255)
    for (let x = 0; x < width; x += 10) {
        strokeWeight(1)
        if (x % 100 == 0) {
            strokeWeight(1.5)
        }
        line(x + ballRadi, 0, x + ballRadi, height)
    }

}

// draw関数
function draw() {
    backgroundSettings()
    if (moveIs == true) {
        count++
        if (count % fps == 0) countArr.push(parseInt(count / fps))
    }
    b1._draw()
    b2._draw()
    if (count % fps == 0) timer.html("経過時間:" + parseInt(count / fps) + "[s]")
    graphDraw()
}

// windowがリサイズされたときの処理
function windowResized() {
    fullScreen()
    elInit()
    initValue()
}

// ボールのクラス
class Ball {
    constructor(x, y, v_0, a) {
        this.posx = x
        this.posy = y
        this.velocity_0 = v_0
        this.acceleration = a
        this.arr = []
        this.vArr = []
    }
    _move() {
        if (moveIs == true) {
            this.posx += this.velocity_0 / fps
            this.velocity_0 += this.acceleration / fps
        }
    }
    _trajectory() {
        if (count % fps == 0 || this.arr.length == 0) {
            this.arr.push(this.posx - ballRadi)
            this.vArr.push(this.velocity_0)
        }
        fill(255, 100)
        for (let i = 0; i < this.arr.length; i++) {
            ellipse(this.arr[i] + ballRadi, this.posy, 2, 2)
            ellipse(this.arr[i] + ballRadi, this.posy, ballRadi * 2, ballRadi * 2)
        }
    }
    _draw() {
        this._move()
        this._trajectory()
        fill(255)
        rect(0, this.posy + ballRadi, width, ballRadi)
        rect(this.posx - ballRadi, this.posy - 3 * ballRadi, ballRadi * 2, ballRadi)
        ellipse(this.posx, this.posy, ballRadi * 2, ballRadi * 2)
        ellipse(this.posx, this.posy, 2, 2)
        fill(0)
        for (let x = 0; x < width; x += 100)text(x, x + ballRadi, this.posy + 2 * ballRadi)
        text(parseInt(this.posx - ballRadi), this.posx - ballRadi, this.posy - 3 * ballRadi + 2.5, ballRadi * 2, ballRadi)
    }
}

//グラフを描画する手続き
function graphDraw() {
    if (typeof distGraphChart !== 'undefined' && distGraphChart) {
        distGraphChart.destroy();
    }
    let ctx1 = document.getElementById('distGraphChart').getContext('2d');
    let data1 = {
        labels: countArr,
        datasets: [{
            label: "上のボール",
            data: b1.arr,
            borderColor: 'rgba(235,101,98)',
            lineTension: 0.3,
        }, {
            label: "下のボール",
            data: b2.arr,
            borderColor: 'rgba(5,180,185)',
            lineTension: 0.3,
        }
        ]
    }
    let options1 = {
        scales: {
            x: {
                display: true,
                title: {
                    display: true,
                    text: '経過時間[s]',
                    font: {
                        size: 16
                    }
                },
                min: 0,
            },
            y: {
                display: true,
                title: {
                    display: true,
                    text: '位置[px]',
                    font: {
                        size: 16
                    }
                },
                min: 0,
            },
        },
        plugins: {
            title: {
                display: true,
                text: 'x-tグラフ',
                font: {
                    size: 16
                }
            },
            legend: {
                labels: {
                    font: {
                        size: 16
                    }
                }
            }
        },
        animation: false,
    }
    distGraphChart = new Chart(ctx1, {
        type: 'line',
        data: data1,
        options: options1
    });

    if (typeof velocityGraphChart !== 'undefined' && velocityGraphChart) {
        velocityGraphChart.destroy();
    }
    let ctx2 = document.getElementById('velocityGraphChart').getContext('2d');
    let data2 = {
        labels: countArr,
        datasets: [{
            label: "上のボール",
            data: b1.vArr,
            borderColor: 'rgba(235,101,98)',
            lineTension: 0.3,
        }, {
            label: "下のボール",
            data: b2.vArr,
            borderColor: 'rgba(5,180,185)',
            lineTension: 0.3,
        }
        ]
    }
    let options2 = {
        scales: {
            x: {
                display: true,
                title: {
                    display: true,
                    text: '経過時間[s]',
                    font: {
                        size: 16
                    }
                },
                min: 0,
            },
            y: {
                display: true,
                title: {
                    display: true,
                    text: '速度[px/s]',
                    font: {
                        size: 16
                    }
                },
                min: 0,
            }
        },
        plugins: {
            title: {
                display: true,
                text: 'v-tグラフ',
                font: {
                    size: 16
                }
            },
            legend: {
                labels: {
                    font: {
                        size: 16
                    }
                }
            }
        },
        animation: false
    }
    velocityGraphChart = new Chart(ctx2, {
        type: 'line',
        data: data2,
        options: options2
    });
}