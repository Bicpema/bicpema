let head;
let light;
let dataArray;

function preload() {
    head = loadImage("https://live.staticflickr.com/65535/51575428715_f441600187_o.png");
    light = loadImage("https://live.staticflickr.com/65535/51575428680_03dd6f8be3_o.png");
    dataArray = loadTable("https://dl.dropboxusercontent.com/s/952h9n9b3hrfd4y/rgbData.csv", "header");
}

function fullScreen() {
    createCanvas(windowWidth, 9 * windowHeight / 10);
}

let r_slider;
let g_slider;
let b_slider;
let startButton;
let stopButton;
let resetButton;
let backgroundDiv;

function buttonCreation() {
    r_slider = createSlider(0, 255, 255)
    g_slider = createSlider(0, 255, 255)
    b_slider = createSlider(0, 255, 255)
    startButton = createButton("スタート")
    stopButton = createButton("ストップ")
    resetButton = createButton("リセット")
    backgroundDiv = createElement("div")
}

let clickedCount;
let resetCount;
let r_i_change;
let g_i_change;
let b_i_change;
let count;
let sketchRed;
let sketchGreen;
let sketchBlue;

function initSettings() {
    head.resize(8 * width / 18, 0);
    light.resize(5 * width / 18, height / 3 - 20);
    clickedCount = false;
    resetCount = true;
    count = 0;
    textSize(width / 100);
    textAlign(CENTER, CENTER);
    sketchRed = new Array();
    sketchGreen = new Array();
    sketchBlue = new Array();
}

function buttonSettings() {
    backgroundDiv.size(width, windowHeight / 10).style("background-color", "white")
    r_slider.size(8 * (5 * width / 18) / 10).position(width - 9 * (5 * width / 18) / 10, height - 5 * (height / 3) / 6)
    g_slider.size(8 * (5 * width / 18) / 10).position(width - 9 * (5 * width / 18) / 10, height - 3 * (height / 3) / 6)
    b_slider.size(8 * (5 * width / 18) / 10).position(width - 9 * (5 * width / 18) / 10, height - 1 * (height / 3) / 6)
    startButton.size(windowWidth / 2, windowHeight / 10).position(0, height).mousePressed(moveButtonAction).addClass("btn btn-outline-primary").parent(backgroundDiv)
    stopButton.size(windowWidth / 2, windowHeight / 10).position(0, height).hide().mousePressed(moveButtonAction).addClass("btn btn-outline-danger").parent(backgroundDiv)
    resetButton.size(windowWidth / 2, windowHeight / 10).position(windowWidth / 2, height).mousePressed(resetButtonAction).addClass("btn btn-outline-secondary").parent(backgroundDiv)
}

function moveButtonAction() {
    if (clickedCount == false) {
        clickedCount = true;
        resetCount = false;
        startButton.hide()
        stopButton.show()
    } else {
        clickedCount = false;
        startButton.show()
        stopButton.hide()
    }
}
function resetButtonAction() {
    initSettings()
    clickedCount = false;
    resetCount = true;
    startButton.show()
    stopButton.hide()
}

function backGround() {
    background(0);
    image(head, 0, (height - head.height) / 2);
    image(light, width - light.width, height / 2 - light.height / 2);
    if (resetCount == false) {
        fill(r_i_change, g_i_change, b_i_change);
        ellipse(head.width / 2 - 2 * head.width / 24, (height - head.height) / 2 + head.height / 4, 3 * head.width / 5, head.height / 3);
    }
}

function spectramDraw() {
    let c1 = color(176, 0, 212);
    let c2 = color(0, 0, 255);
    let c3 = color(0, 176, 212);
    let c4 = color(0, 212, 71);
    let c5 = color(255, 255, 0);
    let c6 = color(212, 71, 0);
    let c7 = color(255, 0, 0);
    let gradient = drawingContext.createLinearGradient(width / 2, height / 3, width, height / 3);
    gradient.addColorStop(0.0, c1);
    gradient.addColorStop(0.25, c2);
    gradient.addColorStop(0.3125, c3);
    gradient.addColorStop(0.4375, c4);
    gradient.addColorStop(0.58, c5);
    gradient.addColorStop(0.75, c6);
    gradient.addColorStop(1, c7);
    drawingContext.fillStyle = gradient;
    noStroke()
    rect(width / 2, height / 3, width / 2, height / 60);
}

function graphDraw() {
    fill(255)
    noStroke()
    for (let i = 0; i < 9; i++) {
        text(350 + 50 * i, (width / 2) + i * (width / 2) / 8, (height / 3) + 1.5 * width / 100);
    }
    for (let i = 0; i < 5; i++) {
        text(nf(0.5 * i, 1, 1), (width / 2) - 2 * width / 100, (height / 3) - i * (height / 3) / 4);
    }
    text("強度", width / 2 - 4 * width / 100, width / 200);
    text("波長[nm]", width - 3 * width / 100, height / 3 - 2 * width / 100);

    stroke(255)
    for (let i = 0; i < 9; i++) {
        line((width / 2) + i * (width / 2) / 8, (height / 3), (width / 2) + i * (width / 2) / 8, 0);
    }
    for (let i = 0; i < 5; i++) {
        line((width / 2), (height / 3) - i * (height / 3) / 4, width, (height / 3) - i * (height / 3) / 4);
    }
    for (let i = 0; i < dataArray.getRowCount(); i++) {
        let red = dataArray.getNum(i, 1) * (r_i_change / 255);
        let green = dataArray.getNum(i, 2) * (g_i_change / 255);
        let blue = dataArray.getNum(i, 3) * (b_i_change / 255);
        noStroke();
        fill(r_i_change, g_i_change, b_i_change);
        ellipse(width - (width / 2) + (i + 30) * (width / 2) / 400, (height / 3) - (red + green + blue) * (height / 3) / 2, 5, 5);
        fill(255, 0, 0);
        ellipse(width - (width / 2) + (i + 30) * (width / 2) / 400, (height / 3) - red * (height / 3) / 2, 5, 5);
        fill(0, 255, 0);
        ellipse(width - (width / 2) + (i + 30) * (width / 2) / 400, (height / 3) - green * (height / 3) / 2, 5, 5);
        fill(0, 0, 255);
        ellipse(width - (width / 2) + (i + 30) * (width / 2) / 400, (height / 3) - blue * (height / 3) / 2, 5, 5);
    }
}

function remocon() {
    fill(50)
    rect(width - (5 * width / 18), height - (height / 3), 5 * width / 18, height / 3, 30);
    fill(255);
    stroke(0);
    text(int(r_i_change), width - 9 * (5 * width / 18) / 10 + (r_i_change / 255) * 8 * (5 * width / 18) / 10, height - 5 * (height / 3) / 6 - 1.5 * width / 200);
    text("R", width - 9 * (5 * width / 18) / 10, height - 5 * (height / 3) / 6 + 3 * width / 200);
    text(int(g_i_change), width - 9 * (5 * width / 18) / 10 + (g_i_change / 255) * 8 * (5 * width / 18) / 10, height - 3 * (height / 3) / 6 - 1.5 * width / 200);
    text("G", width - 9 * (5 * width / 18) / 10, height - 3 * (height / 3) / 6 + 3 * width / 200);
    text(int(b_i_change), width - 9 * (5 * width / 18) / 10 + (b_i_change / 255) * 8 * (5 * width / 18) / 10, height - 1 * (height / 3) / 6 - 1.5 * width / 200);
    text("B", width - 9 * (5 * width / 18) / 10, height - 1 * (height / 3) / 6 + 3 * width / 200);
}

function lightOutput() {
    if (clickedCount == true) {
        if (count % round(255 / r_i_change) == 0) {
            sketchRed.push(new Light(height / 2 - width / 50, 'R'));
        }
        if (count % round(255 / g_i_change) == 0) {
            sketchBlue.push(new Light(height / 2, 'G'));
        }
        if (count % round(255 / b_i_change) == 0) {
            sketchGreen.push(new Light(height / 2 + width / 50, 'B'));
        }
    }
    if (resetCount == true) {
        for (let i = 0; i < sketchRed.length; i++) {
            sketchRed.length = 0;
        }
        for (let i = 0; i < sketchGreen.length; i++) {
            sketchGreen.length = 0;
        }
        for (let i = 0; i < sketchBlue.length; i++) {
            sketchBlue.length = 0;
        }
    }
    else {
        for (let i = 0; i < sketchRed.length; i++) {
            if (sketchRed[i].posx < head.width - width / 25) {
                sketchRed.splice(i, 1)[0];
            }
        }
        for (let i = 0; i < sketchGreen.length; i++) {
            if (sketchGreen[i].posx < head.width - width / 25) {
                sketchGreen.splice(i, 1)[0];
            }
        }
        for (let i = 0; i < sketchBlue.length; i++) {
            if (sketchBlue[i].posx < head.width - width / 25) {
                sketchBlue.splice(i, 1)[0];
            }
        }
    }
}

function setup() {
    fullScreen();
    buttonCreation()
    initSettings()
    buttonSettings()
}

function draw() {
    if (clickedCount == true) {
        count++;
    }
    backGround();
    graphDraw();
    spectramDraw();
    remocon();
    lightOutput();
    for (let i = 0; i < sketchRed.length; i++) {
        sketchRed[i]._draw();
    }
    for (let i = 0; i < sketchGreen.length; i++) {
        sketchGreen[i]._draw();
    }
    for (let i = 0; i < sketchBlue.length; i++) {
        sketchBlue[i]._draw();
    }
    r_i_change = r_slider.value()
    g_i_change = g_slider.value()
    b_i_change = b_slider.value()
}

function windowResized() {
    fullScreen();
    initSettings()
    buttonSettings()
    clickedCount = false;
    startButton.show()
    stopButton.hide()
}

class Light {
    constructor(y, t) {
        this.clr = 0;
        this.intensity = 0;
        this.posx = width - light.width;
        this.posy = y;
        this.type = t;
    }
    _draw() {
        noStroke();
        if (this.type == 'R') {
            fill(255, 0, 0, 90);
        }
        else if (this.type == 'G') {
            fill(0, 255, 0, 90);
        }
        else {
            fill(0, 0, 255, 90);
        }
        if (clickedCount == true) {
            this.posx -= 10;
        }
        ellipse(this.posx, this.posy, width / 50, width / 50);
    }
}

