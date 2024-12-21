let springImg,
    ballImg;
function preload() {
    springImg = loadImage("/assets/img/springImg.png");
    ballImg = loadImage("/assets/img/metalBallImg.png");
}

let startButton,
    stopButton,
    resetButton,
    konstantButton1,
    konstantButton2,
    combiButton1,
    combiButton2,
    weightButton1,
    weightButton2,
    amplitudeButton1,
    amplitudeButton2;
function buttonCreation() {
    startButton = select("#startButton")
    stopButton = select("#stopButton")
    resetButton = select("#resetButton")
    konstantButton1 = select("#konstantButton1")
    konstantButton2 = select("#konstantButton2")
    combiButton1 = select("#combiButton1")
    combiButton2 = select("#combiButton2")
    weightButton1 = select("#weightButton1")
    weightButton2 = select("#weightButton2")
    amplitudeButton1 = select("#amplitudeButton1")
    amplitudeButton2 = select("#amplitudeButton2")
}

let clickedCount,
    resetCount;
function moveButtonAction() {
    if (clickedCount == false) {
        clickedCount = true;
        resetCount = false;
    } else {
        clickedCount = false;
    }
}
function resetButtonAction() {
    initSettings()
}
function buttonSettings() {
    startButton.mousePressed(moveButtonAction)
    stopButton.mousePressed(moveButtonAction)
    resetButton.mousePressed(resetButtonAction)
}

let countData,
    data1,
    data2,
    fps,
    count,
    spring1,
    spring2;
function initSettings() {
    springImg.resize(width / 20, height / 4);
    ballImg.resize(height / 15, 0);
    countData = new Array();
    countData.push(0)
    data1 = new Array();
    data2 = new Array();
    clickedCount = false;
    resetCount = true;
    fps = 60;
    count = 0;
    frameRate(fps);
    spring1 = new Spring(konstantButton1.value(), weightButton1.value(), combiButton1.value(), amplitudeButton1.value(), 1);
    spring2 = new Spring(konstantButton2.value(), weightButton2.value(), combiButton2.value(), amplitudeButton2.value(), 2);
}

function setup() {
    fullScreen();
    buttonCreation()
    buttonSettings()
    initSettings()
    graphCreation()
    graphSettings()
}

function draw() {
    background(255)
    spring1._draw();
    spring2._draw();
    if (clickedCount == true) {
        count++;
        if (count % 6 == 0) {
            countData.push(count / 60)
            data1.push(height / 4 - spring1.posy)
            data2.push(height / 4 - spring2.posy)
        }
    }
    graphDraw()
    line(0, height / 2, width, height / 2)
}


let graph1,
    graph2,
    graphCanvas1,
    graphCanvas2,
    chart1,
    chart2;
function graphCreation() {
    graph1 = createElement("div")
    graph2 = createElement("div")
    graphCanvas1 = createElement("canvas")
    graphCanvas2 = createElement("canvas")
    graphCanvas1.parent(graph1)
    graphCanvas2.parent(graph2)
}

function graphSettings() {
    graph1.size(width / 2, height / 2).position(width / 2, windowHeight / 10)
    graphCanvas1.size(0, 0).id("chart1")
    graph2.size(width / 2, height / 2).position(width / 2, windowHeight / 10 + height / 2)
    graphCanvas2.size(0, 0).id("chart2")
}

function graphDraw() {
    if (typeof chart1 !== 'undefined' && chart1) {
        chart1.destroy();
    }
    if (typeof chart2 !== 'undefined' && chart2) {
        chart2.destroy();
    }
    var ctx1 = document.getElementById('chart1').getContext('2d');
    chart1 = new Chart(ctx1, {
        type: 'line',
        data: {
            labels: countData,
            datasets: [{
                label: "ばね１の位置の時間変化",
                data: data1,
                backgroundColor: "rgb(255,0,0)",
                borderColor: "rgb(255,0,0)",
            }]
        },
        options: {
            animation: false
        }
    });
    var ctx2 = document.getElementById('chart2').getContext('2d');
    chart2 = new Chart(ctx2, {
        type: 'line',
        data: {
            labels: countData,
            datasets: [{
                label: "ばね２の位置の時間変化",
                data: data2,
                backgroundColor: "rgb(0,0,255)",
                borderColor: "rgb(0,0,255)",
            }]
        },
        options: {
            animation: false
        }
    });
}

//ばねのクラス
class Spring {
    constructor(k, w, c, a, n) {
        this.posx = 0;
        this.posy = 0;
        this.konstant = k;
        this.weight = w;
        this.combination = c;
        this.amplitude = a;
        this.number = n;
    }
    _draw() {
        let s_konstant;
        if (this.combination == 1) {
            s_konstant = this.konstant;
        }
        else if (this.combination == 2) {
            s_konstant = 2 * this.konstant;
        }
        else {
            s_konstant = sq(this.konstant) / (2 * this.konstant);
        }
        this.posx = this.amplitude * -cos(sqrt(s_konstant / this.weight) * (count / fps) + PI / 2);
        this.posy = this.amplitude * sin(sqrt(s_konstant / this.weight) * (count / fps) + PI / 2) + height / 4;
        console.log(this.posx)
        let d;
        if (this.number == 1) {
            d = 0;
        }
        else {
            d = height / 2;
        }
        if (this.combination == 1) {
            line(((width / 4)) / 2, d, ((width / 4)) / 2, 10 + d);
            image(springImg, ((width / 4)) / 2 - springImg.width / 2, 10 + d, springImg.width, this.posy - 20 - ballImg.height / 2);
            line(((width / 4)) / 2, this.posy - 10 - ballImg.height / 2 + d, ((width / 4)) / 2, this.posy - ballImg.height / 2 + d);
        }
        if (this.combination == 2) {
            line(((width / 4)) / 2, d, ((width / 4)) / 2, 10 + d);
            line(((width / 4)) / 4, 10 + d, 3 * ((width / 4)) / 4, 10 + d);
            line(((width / 4)) / 4, 10 + d, ((width / 4)) / 4, 15 + d);
            line(3 * ((width / 4)) / 4, 10 + d, 3 * ((width / 4)) / 4, 15 + d);
            image(springImg, ((width / 4)) / 4 - springImg.width / 2, 15 + d, springImg.width, this.posy - 30 - ballImg.height / 2);
            image(springImg, 3 * ((width / 4)) / 4 - springImg.width / 2, 15 + d, springImg.width, this.posy - 30 - ballImg.height / 2);
            line(((width / 4)) / 4, this.posy - 15 - ballImg.height / 2 + d, ((width / 4)) / 4, this.posy - 10 - ballImg.height / 2 + d);
            line(3 * ((width / 4)) / 4, this.posy - 15 - ballImg.height / 2 + d, 3 * ((width / 4)) / 4, this.posy - 10 - ballImg.height / 2 + d);
            line(((width / 4)) / 4, this.posy - 10 - ballImg.height / 2 + d, 3 * ((width / 4)) / 4, this.posy - 10 - ballImg.height / 2 + d);
            line(((width / 4)) / 2, this.posy - 10 - ballImg.height / 2 + d, ((width / 4)) / 2, this.posy - ballImg.height / 2 + d);
        }
        if (this.combination == 3) {
            line(((width / 4)) / 2, d, ((width / 4)) / 2, 10 + d);
            image(springImg, ((width / 4)) / 2 - springImg.width / 2, 10 + d, springImg.width, (this.posy - 30 - ballImg.height / 2) / 2);
            line(((width / 4)) / 2, (this.posy - 30 - ballImg.height / 2) / 2 + 10 + d, ((width / 4)) / 2, (this.posy - 30 - ballImg.height / 2) / 2 + 20 + d);
            image(springImg, ((width / 4)) / 2 - springImg.width / 2, (this.posy - 30 - ballImg.height / 2) / 2 + 20 + d, springImg.width, (this.posy - 30 - ballImg.height / 2) / 2);
            line(((width / 4)) / 2, this.posy - 10 - ballImg.height / 2 + d, ((width / 4)) / 2, this.posy - ballImg.height / 2 + d);
        }
        image(ballImg, ((width / 4)) / 2 - ballImg.width / 2, this.posy - ballImg.height / 2 + d);
        noFill();
        ellipse((width / 4) + ((width / 4)) / 2, height / 4 + d, this.amplitude * 2, this.amplitude * 2);
        line((width / 4) + ((width / 4)) / 2, height / 4 + d, (width / 4) + ((width / 4)) / 2 + this.posx, this.posy + d);
        image(ballImg, (width / 4) + ((width / 4)) / 2 - ballImg.width / 2 + this.posx, this.posy - ballImg.height / 2 + d);
        stroke(0, 100);
    }
}

function windowResized() {
    fullScreen();
    initSettings()
    buttonSettings()
    graphSettings()
    clickedCount = false;
    resetCount = true;
}

function fullScreen() {
    let p5Canvas = document.getElementById("p5Canvas")
    let canvas = createCanvas(windowWidth, 9 * windowHeight / 10)
    canvas.parent(p5Canvas)
}