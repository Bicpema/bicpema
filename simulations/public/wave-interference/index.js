let waves1;
let waves2;
let count = 0;
let fps = 0;
function setup() {
    fullScreen();
    waves1 = new Array();
    waves2 = new Array();
    count = 0;
    fps = 60;
    frameRate(fps);
    textSize(width / 100);
    textAlign(CENTER, CENTER);
}

function draw() {
    time_count();
    backGround();
    wave_output();
    for (let i = 0; i < waves1.length; i++) {
        waves1[i].posx = mouseX;
        waves1[i].posy = mouseY;
        waves1[i].display();
    }
    for (let i = 0; i < waves2.length; i++) {
        waves2[i].display();
    }
}

function time_count() {
    count++;
}

function backGround() {
    background(0);
    stroke(255, 50);
    fill(255);
    for (let i = 0; i < height / 2; i += 10) {
        if (i % 100 == 0) {
            strokeWeight(3);
            text(i, width / 2 - width / 100, height / 2 + i);
            text(i, width / 2 - width / 100, height / 2 - i);
        }
        else {
            strokeWeight(1);
        }
        line(0, height / 2 - i, width, height / 2 - i);
        line(0, height / 2 + i, width, height / 2 + i);
    }
    for (let i = 0; i < width / 2; i += 10) {
        if (i % 100 == 0) {
            strokeWeight(3);
            text(i, width / 2 + i, height / 2 + width / 100);
            text(i, width / 2 - i, height / 2 + width / 100);
        }
        else {
            strokeWeight(1);
        }
        line(width / 2 - i, 0, width / 2 - i, height);
        line(width / 2 + i, 0, width / 2 + i, height);
    }
}

function wave_output() {
    if (count % fps == 0) {
        waves1.push(new WAVE(mouseX, mouseY, 0));
        waves2.push(new WAVE(width / 2, height / 2, 0));
    }
    for (let i = 0; i < waves1.length; i++) {
        if (waves1[i].radi > dist(0, 0, width, height)) waves1.splice(i, 1)[0];
    }
    for (let i = 0; i < waves2.length; i++) {
        if (waves2[i].radi > dist(0, 0, width / 2, height / 2)) waves2.splice(i, 1)[0];
    }
}
class WAVE {
    constructor(x, y, r) {
        this.posx = x;
        this.posy = y;
        this.radi = r;
    }

    display() {
        this.radi++;
        noFill();
        for (let i = 0; i < 10; i++) {
            strokeWeight(50 - 5 * i);
            stroke(0, height/10, 0, 30);
            ellipse(this.posx, this.posy, this.radi * 2, this.radi * 2);
        }
    }
}


function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}
function fullScreen() {
    createCanvas(windowWidth, windowHeight);
}