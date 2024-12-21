let dataArray;
let weight;
let stop_watch;
let stop_button;
let start_button;
let hm = 100;
let balls;
let gravity = 0;
let count = 0;
let clicked_count;

function preload() {
    balls = new Array(hm);
    weight = loadImage("/assets/img/metalBallImg.png");
    // stop_watch = loadImage("https://live.staticflickr.com/65535/51690867829_8f5dbb4793_o.png");
    // stop_button = loadImage("https://live.staticflickr.com/65535/51690183358_0389d79046_o.png");
    // start_button = loadImage("https://live.staticflickr.com/65535/51690597879_33e64e02d9_o.png");
    dataArray = loadTable("https://dl.dropboxusercontent.com/s/a4mwnazwmgqmn87/pendulumData.csv", "header");
}

function setup() {
    fullScreen();
    weight.resize(width / 50, 0);
    // stop_watch.resize(4 * width / 18, 0);
    // stop_button.resize(3 * stop_watch.width / 10, 0);
    // start_button.resize(3 * stop_watch.width / 10, 0);
    for (let i = 0; i < hm; i++) {
        balls[i] = new Ball(dataArray.getNum(i, 3), asin(100 / dataArray.getNum(i, 3)));
    }
    gravity = 9.8;
    count = 0;
    clicked_count = false;
    textSize(width / 25);
}

function draw() {
    background(255);
    for (let i = 0; i < hm; i++) {
        balls[i].move();
        balls[i].display();
    }
    timer();
}

function mousePressed() {
    if (width - 4 * stop_watch.width / 5 < mouseX && mouseX < width - 4 * stop_watch.width / 5 + start_button.width && height - stop_watch.height + 11 * stop_watch.height / 20 < mouseY && mouseY < height - stop_watch.height + 11 * stop_watch.height / 20 + start_button.height) {
        if (clicked_count == false) {
            clicked_count = true;
        } else {
            clicked_count = false;
        }
    }
    if (width - 4 * stop_watch.width / 5 + start_button.width < mouseX && mouseX < width - 4 * stop_watch.width / 5 + 2 * start_button.width && height - stop_watch.height + 11 * stop_watch.height / 20 < mouseY && mouseY < height - stop_watch.height + 11 * stop_watch.height / 20 + start_button.height) {
        for (let i = 0; i < hm; i++) {
            balls[i] = new Ball(dataArray.getNum(i, 3), asin(100 / dataArray.getNum(i, 3)));
        }
        clicked_count = false;
        count = 0;
    }
}

function timer() {
    // image(stop_watch, width - stop_watch.width, height - stop_watch.height);
    if (clicked_count == false) {
        // image(start_button, width - 4 * stop_watch.width / 5, height - stop_watch.height + 11 * stop_watch.height / 20);
    }
    if (clicked_count == true) {
        // image(stop_button, width - 4 * stop_watch.width / 5, height - stop_watch.height + 11 * stop_watch.height / 20);
        count++;
    }
    count++;
    text(nf(count / 60, 1, 2) + "s", 100, 100);
}

class Ball {
    constructor(L, t0) {
        this.posx = 0;
        this.posy = 0;
        this.speed = 0;
        this.theta = 0;
        this.Long = L;
        this.theta0 = t0;
    }

    move() {
        this.theta = this.theta0 * sin(sqrt(gravity / (this.Long * (0.25 / 300))) * count / 60);
        this.posx = width / 2 + this.Long * sin(this.theta);
        this.posy = 100 + this.Long * cos(this.theta);
    }

    display() {
        line(width / 2, 100, this.posx, this.posy);
        image(weight, this.posx - weight.width / 2, this.posy - weight.height / 2);
    }

}
function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}
function fullScreen() {
    createCanvas(windowWidth, windowHeight);
}