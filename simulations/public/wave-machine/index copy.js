let MEDIUM_QUANTITY = 100;
let speed = 0;
let stopperX = 0;
let stopperY = 0;
let sliderPos = 0;
let stopper;
let startButton;
let stopButton;
let resetButton;
let button;
let slider;
let clickedCount;
let fixedCount;
let incidentWaves;
let reflectedWaves;
let mediums;
function preload() {
    mediums = new Array(MEDIUM_QUANTITY);
    stopper = loadImage("https://live.staticflickr.com/65535/51764210494_f754e87f6f_o.png");
    startButton = loadImage("https://live.staticflickr.com/65535/51673047512_5eeef070b7_o.png");
    stopButton = loadImage("https://live.staticflickr.com/65535/51674520944_fec8f44a10_o.png");
    resetButton = loadImage("https://live.staticflickr.com/65535/51674724605_d816b9c9f2_o.png");
    button = loadImage("https://live.staticflickr.com/65535/51768013151_dc94307cc0_o.png");
}

function setup() {
    fullScreen();
    speed = 1;
    stopper.resize(100, 0);
    startButton.resize(5 * width / 72, 0);
    stopButton.resize(5 * width / 72, 0);
    resetButton.resize(5 * width / 72, 0);
    button.resize(100, 100);
    clickedCount = true;
    fixedCount = true;
    incidentWaves = new Array();
    reflectedWaves = new Array();
    for (let i = 0; i < MEDIUM_QUANTITY; i++) {
        mediums[i] = new Medium(i * (width - 200) / MEDIUM_QUANTITY, 0, i);
    }
    stopperX = width - stopper.width - 5 - (width - 200) / MEDIUM_QUANTITY;
    stopperY = height / 2 - stopper.height / 8;
    slider = createSlider(0, 1, 1, 0.01)
    slider.size(width / 5);
    slider.position(100 - button.width / 2, height / 2 + 3 * button.height)
}

function draw() {
    background(100);
    if (clickedCount == true) {
        for (let i = 0; i < incidentWaves.length; i++) {
            incidentWaves[i].calculate();
        }
        for (let i = 0; i < reflectedWaves.length; i++) {
            reflectedWaves[i].calculate();
        }
        for (let i = 0; i < MEDIUM_QUANTITY; i++) {
            mediums[i].calculate();
        }
    }
    for (let i = 0; i < MEDIUM_QUANTITY; i++) {
        mediums[i].display();
    }
    clicked_function();
    image_display();
    speed = slider.value()
}

function clicked_function() {
    if (stopperX > width - 100 - stopper.width && stopperY > height / 2 - stopper.height / 4 && stopperY < height / 2 + stopper.height / 4) {
        stopperX = width - stopper.width - 5 - (width - 200) / MEDIUM_QUANTITY;
        stopperY = height / 2 - stopper.height / 8;
        fixedCount = true;
    }
    else {
        fixedCount = false;
    }
    if (mouseIsPressed) {
        if (clickedCount == true && dist(100, height / 2 + button.height / 2, mouseX, mouseY) < button.height) {
            for (let i = 0; i < MEDIUM_QUANTITY; i++) {
                incidentWaves.push(new IncidentWave(i * (width - 200) / MEDIUM_QUANTITY, 100, incidentWaves.length, i, true));
            }
            for (let i = 0; i < MEDIUM_QUANTITY; i++) {
                reflectedWaves.push(new ReflectedWave(i * (width - 200) / MEDIUM_QUANTITY, 100, reflectedWaves.length, MEDIUM_QUANTITY - i - 2, true));
            }
        }
        if (stopperX < mouseX && mouseX < stopperX + stopper.width && stopperY < mouseY && mouseY < stopperY + stopper.height) {
            stopperX = mouseX - stopper.width / 2;
            stopperY = mouseY - stopper.height / 2;
        }
    }
}

function mousePressed() {
    if (width - 3 * width / 18 + width / (24 * 6) < mouseX && mouseX < width - 3 * width / 18 + startButton.width + width / (24 * 6) && height - startButton.height - width / (24 * 6) < mouseY && mouseY < height - width / (24 * 6)) {
        if (clickedCount == true) {
            clickedCount = false;
        }
        else {
            clickedCount = true;
        }
    }
    if (width - 3 * width / 18 + 3 * width / (24 * 6) + startButton.width < mouseX && mouseX < width - 3 * width / 18 + 3 * width / (24 * 6) + startButton.width + resetButton.width && height - resetButton.height - width / (24 * 6) < mouseY && mouseY < height - width / (24 * 6)) {
        clickedCount = true;
        for (let i = 0; i < incidentWaves.length; i++) {
            incidentWaves.length = 0;
        }
        for (let i = 0; i < reflectedWaves.length; i++) {
            reflectedWaves.length = 0;
        }
        for (let i = 0; i < MEDIUM_QUANTITY; i++) {
            mediums[i] = new Medium(i * (width - 200) / MEDIUM_QUANTITY, 0, i);
        }
        stopperX = width - stopper.width - 5 - (width - 200) / MEDIUM_QUANTITY;
        stopperY = height / 2 - stopper.height / 8;
    }
}

function image_display() {
    tint(255);
    if (mousePressed && dist(100, height / 2 + button.height / 2, mouseX, mouseY) < button.height) {
        tint(255, 200, 200, 200);
    }
    image(button, 100 - button.width / 2, height / 2 + button.height / 2);
    tint(255);
    image(stopper, stopperX, stopperY);
    if (clickedCount == false) {
        image(startButton, width - 3 * width / 18 + width / (24 * 6), height - startButton.height - width / (24 * 6));
    }
    else {
        image(stopButton, width - 3 * width / 18 + width / (24 * 6), height - startButton.height - width / (24 * 6));
    }
    image(resetButton, width - 3 * width / 18 + 3 * width / (24 * 6) + startButton.width, height - resetButton.height - width / (24 * 6));
}

class IncidentWave {
    constructor(x, y, t, n, f) {
        this.time = 0;
        this.posx = x;
        this.posy = y;
        this.theta = t;
        this.number = n;
        this.fixed = f;
    }

    calculate() {
        if (this.number < this.time) {
            if (this.theta > -30) {
                this.theta--;
            }
        }
        else {
            this.theta = 0;
        }
        this.time += speed;
        this.posy = (height / 100) * sin(radians(6 * this.theta));
    }

}

class ReflectedWave {
    constructor(x, y, t, n, f) {
        this.time = 0;
        this.posx = x;
        this.posy = y;
        this.theta = t;
        this.number = n;
        this.fixed = f;
    }

    calculate() {
        if (this.number < this.time - MEDIUM_QUANTITY) {
            if (fixedCount == false) {
                if (this.theta > -30) {
                    this.theta--;
                }
            }
            else {
                if (this.theta < 30) {
                    this.theta++;
                }
            }
        }
        else {
            this.theta = 0;
        }
        this.time += speed;
        this.posy = (height / 100) * sin(radians(6 * this.theta));
    }

}

class Medium {
    constructor(x, y, n) {
        this.posx = x;
        this.posy = y;
        this.number = n;
    }

    calculate() {
        let sum = 0;
        for (let i = 0; i < incidentWaves.length; i++) {
            if (i % MEDIUM_QUANTITY == this.number) {
                sum += incidentWaves[i].posy;
            }
        }
        for (let i = 0; i < reflectedWaves.length; i++) {
            if (i % MEDIUM_QUANTITY == this.number) {
                sum += reflectedWaves[i].posy;
            }
        }
        this.posy = sum;
    }

    display() {
        strokeWeight(5);
        stroke(0);
        line(this.posx + 100, this.posy + height / 2, this.number * (width - 200) / MEDIUM_QUANTITY + 100, height / 2);
        strokeWeight(1);
        noStroke();
        fill(255, 255, 0);
        ellipse(this.posx + 100, this.posy + height / 2, 10, 10);
    }

}
function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    speed = 1;
    stopper.resize(100, 0);
    startButton.resize(5 * width / 72, 0);
    stopButton.resize(5 * width / 72, 0);
    resetButton.resize(5 * width / 72, 0);
    button.resize(100, 100);
    clickedCount = true;
    fixedCount = true;
    incidentWaves = new Array();
    reflectedWaves = new Array();
    for (let i = 0; i < MEDIUM_QUANTITY; i++) {
        mediums[i] = new Medium(i * (width - 200) / MEDIUM_QUANTITY, 0, i);
    }
    stopperX = width - stopper.width - 5 - (width - 200) / MEDIUM_QUANTITY;
    stopperY = height / 2 - stopper.height / 8;
}
function fullScreen() {
    let parent = document.getElementById("p5Canvas")
    let p5Canvas = createCanvas(windowWidth, 8 * windowHeight / 10);
    p5Canvas.parent(parent)
}