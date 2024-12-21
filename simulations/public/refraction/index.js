let lightRotateTheta = 0;
let pg;
let n1 = 0;
let n2 = 0;
let n12 = 0;
let theta1 = 0;
let theta2 = 0;
let raysX = 0;
let raysY = 0;
let raysX2 = 0;
let raysY2 = 0;
let raysSpeed = 0;
let raysSpeedX = 0;
let raysSpeedY = 0;
let count = 0;
let rotateRemocon;
let nRemocon;
let boundary = 0;
let simulationMode;
function preload() {
    rotateRemocon = loadImage("https://live.staticflickr.com/65535/52105031535_0269fdf1ed_o.png");
    nRemocon = loadImage("https://live.staticflickr.com/65535/52112262666_9cf575b5a6_o.png");
}

function setup() {
    fullScreen();
    lightRotateTheta = 0;
    pg = createGraphics(width, height);
    n1 = 1;
    n2 = 1.5;
    n12 = n2 / n1;
    theta1 = radians(lightRotateTheta);
    theta2 = asin(sin(theta1) / n12);
    raysX = width / 2 - (height / 2 - height / 6) * sin(theta1);
    raysY = height / 2 + (height / 2 - height / 6) * cos(theta1);
    raysX2 = width / 2;
    raysY2 = height / 2;
    raysSpeed = 5;
    raysSpeedX = raysSpeed * cos(theta1 + PI / 2);
    raysSpeedY = raysSpeed * sin(theta1 + PI / 2);
    count = 0;
    rotateRemocon.resize(width / 6, 0);
    nRemocon.resize(width / 6, 0);
    textAlign(CENTER);
    textSize(width / 50);
    boundary = sin(theta1) / n12;
    simulationMode = "lineMax";
}

function draw() {
    background(0);
    if (simulationMode == "animation") {
        animationRays();
        animationBackgroundSetting();
        animationOperation();
        animationCalculate();
    }
    if (simulationMode == "line") {
        lineRays();
        lineBackgroundSetting();
        lineOperation();
        lineCalculate();
    }
    if (simulationMode == "animationMax") {
        animationMaxRays();
        animationMaxBackgroundSetting();
        animationMaxOperation();
        animationMaxCalculate();
    }
    if (simulationMode == "lineMax") {
        lineMaxRays();
        lineMaxBackgroundSetting();
        lineMaxOperation();
        lineMaxCalculate();
    }
    lightResource();
    noFill();
    stroke(255);
    for (let i = 0; i < 4; i++) {
        fill(100);
        stroke(255);
        rect(width - (4 - i) * width / 8, 0, width / 8, height / 20, 100);
        fill(255);
        noStroke();
        if (i == 0) {
            text("animation", width - (4 - i) * width / 8, 0, width / 8, height / 20);
        }
        if (i == 1) {
            text("animationMax", width - (4 - i) * width / 8, 0, width / 8, height / 20);
        }
        if (i == 2) {
            text("line", width - (4 - i) * width / 8, 0, width / 8, height / 20);
        }
        if (i == 3) {
            text("lineMax", width - (4 - i) * width / 8, 0, width / 8, height / 20);
        }
    }
}

function mousePressed() {
    theta1 = radians(lightRotateTheta);
    theta2 = asin(sin(theta1) / n12);
    n12 = n2 / n1;
    if (dist(width - rotateRemocon.width + 9 * rotateRemocon.width / 10, height - rotateRemocon.height + 3 * rotateRemocon.height / 10, mouseX, mouseY) < rotateRemocon.width / 20 && lightRotateTheta < 90) {
        lightRotateTheta += 0.1;
        raysX = width / 2 - (height / 2 - height / 6) * sin(theta1);
        raysY = height / 2 + (height / 2 - height / 6) * cos(theta1);
        raysX2 = width / 2;
        raysY2 = height / 2;
        if (lightRotateTheta > 90) {
            lightRotateTheta = 90;
        }
    }
    if (dist(width - rotateRemocon.width + 9 * rotateRemocon.width / 10, height - rotateRemocon.height + 7 * rotateRemocon.height / 10, mouseX, mouseY) < rotateRemocon.width / 20 && lightRotateTheta > -90) {
        lightRotateTheta -= 0.1;
        raysX = width / 2 - (height / 2 - height / 6) * sin(theta1);
        raysY = height / 2 + (height / 2 - height / 6) * cos(theta1);
        raysX2 = width / 2;
        raysY2 = height / 2;
        if (lightRotateTheta < -90) {
            lightRotateTheta = -90;
        }
    }
    if (dist(9 * nRemocon.width / 10, height / 2 + 3 * nRemocon.height / 10, mouseX, mouseY) < nRemocon.width / 20) {
        n1 += 0.1;
        raysX = width / 2 - (height / 2 - height / 6) * sin(theta1);
        raysY = height / 2 + (height / 2 - height / 6) * cos(theta1);
        raysX2 = width / 2;
        raysY2 = height / 2;
    }
    if (dist(9 * nRemocon.width / 10, height / 2 + 7 * nRemocon.height / 10, mouseX, mouseY) < nRemocon.width / 20 && n1 > 0.1) {
        n1 -= 0.1;
        if (n1 < 0.1) {
            n1 = 0.1;
        }
        raysX = width / 2 - (height / 2 - height / 6) * sin(theta1);
        raysY = height / 2 + (height / 2 - height / 6) * cos(theta1);
        raysX2 = width / 2;
        raysY2 = height / 2;
    }
    if (dist(9 * nRemocon.width / 10, height / 2 - nRemocon.height + 3 * nRemocon.height / 10, mouseX, mouseY) < nRemocon.width / 20) {
        n2 += 0.1;
        raysX = width / 2 - (height / 2 - height / 6) * sin(theta1);
        raysY = height / 2 + (height / 2 - height / 6) * cos(theta1);
        raysX2 = width / 2;
        raysY2 = height / 2;
    }
    if (dist(9 * nRemocon.width / 10, height / 2 - nRemocon.height + 7 * nRemocon.height / 10, mouseX, mouseY) < nRemocon.width / 20 && n2 > 0.1) {
        n2 -= 0.1;
        if (n2 < 0.1) {
            n2 = 0.1;
        }
        raysX = width / 2 - (height / 2 - height / 6) * sin(theta1);
        raysY = height / 2 + (height / 2 - height / 6) * cos(theta1);
        raysX2 = width / 2;
        raysY2 = height / 2;
    }
    for (let i = 0; i < 4; i++) {
        if (width - (4 - i) * width / 8 < mouseX && mouseX < width - (4 - i - 1) * width / 8 && 0 < mouseY && mouseY < height / 20) {
            if (i == 0) {
                simulationMode = "animation";
            }
            if (i == 1) {
                simulationMode = "animationMax";
            }
            if (i == 2) {
                simulationMode = "line";
            }
            if (i == 3) {
                simulationMode = "lineMax";
            }
        }
    }
}

function animationCalculate() {
    theta1 = radians(lightRotateTheta);
    theta2 = asin(sin(theta1) / n12);
    n12 = n2 / n1;
    boundary = sin(theta1) / n12;
    if (-1 < boundary && boundary < 1) {
        if (theta1 != PI / 2 && theta1 != -PI / 2) {
            if (raysY > height / 2) {
                raysSpeedX = raysSpeed * cos(theta1 + PI / 2);
                raysSpeedY = raysSpeed * sin(theta1 + PI / 2);
            }
            else {
                raysSpeedX = raysSpeed * cos(theta2 + PI / 2);
                raysSpeedY = raysSpeed * sin(theta2 + PI / 2);
                raysX2 -= raysSpeed * cos(theta1 + PI / 2);
                raysY2 += raysSpeed * sin(theta1 + PI / 2);
            }
        }
        else {
            raysSpeedX = raysSpeed * cos(theta1 + PI / 2);
            raysSpeedY = raysSpeed * sin(theta1 + PI / 2);
        }
        raysX -= raysSpeedX;
        raysY -= raysSpeedY;
    }
    else {
        raysSpeedX = raysSpeed * cos(theta1 + PI / 2);
        raysSpeedY = raysSpeed * sin(theta1 + PI / 2);
        if (theta1 > 0) {
            if (raysX > width / 2) {
                raysX -= raysSpeedX;
                raysY += raysSpeedY;
            }
            else {
                raysX -= raysSpeedX;
                raysY -= raysSpeedY;
            }
        }
        if (theta1 < 0) {
            if (raysX > width / 2) {
                raysX -= raysSpeedX;
                raysY -= raysSpeedY;
            }
            else {
                raysX -= raysSpeedX;
                raysY += raysSpeedY;
            }
        }
    }
}

function animationOperation() {
    if (mouseIsPressed) {
        count++;
        if (dist(width - rotateRemocon.width + 9 * rotateRemocon.width / 10, height - rotateRemocon.height + 3 * rotateRemocon.height / 10, mouseX, mouseY) < rotateRemocon.width / 20 && lightRotateTheta < 90 && count > 10) {
            if (count > 30) {
                lightRotateTheta += 0.5;
            }
            else {
                lightRotateTheta += 0.1;
            }
            theta1 = radians(lightRotateTheta);
            theta2 = asin(sin(theta1) / n12);
            n12 = n2 / n1;
            raysX = width / 2 - (height / 2 - height / 6) * sin(theta1);
            raysY = height / 2 + (height / 2 - height / 6) * cos(theta1);
            raysX2 = width / 2;
            raysY2 = height / 2;
            if (lightRotateTheta > 90) {
                lightRotateTheta = 90;
            }
        }
        if (dist(width - rotateRemocon.width + 9 * rotateRemocon.width / 10, height - rotateRemocon.height + 7 * rotateRemocon.height / 10, mouseX, mouseY) < rotateRemocon.width / 20 && lightRotateTheta > -90 && count > 10) {
            if (count > 30) {
                lightRotateTheta -= 0.5;
            }
            else {
                lightRotateTheta -= 0.1;
            }
            theta1 = radians(lightRotateTheta);
            theta2 = asin(sin(theta1) / n12);
            n12 = n2 / n1;
            raysX = width / 2 - (height / 2 - height / 6) * sin(theta1);
            raysY = height / 2 + (height / 2 - height / 6) * cos(theta1);
            raysX2 = width / 2;
            raysY2 = height / 2;
            if (lightRotateTheta < -90) {
                lightRotateTheta = -90;
            }
        }
        theta1 = radians(lightRotateTheta);
        theta2 = asin(sin(theta1) / n12);
        n12 = n2 / n1;
    }
    else {
        count = 0;
    }
    fill(255);
    noStroke();
    image(rotateRemocon, width - rotateRemocon.width, height - rotateRemocon.height);
    text(nf(abs(lightRotateTheta), 1, 1) + "'", width - rotateRemocon.width + 5 * rotateRemocon.width / 12, height - rotateRemocon.height + rotateRemocon.height / 4, rotateRemocon.width / 3, rotateRemocon.height / 2);
    image(nRemocon, 0, height / 2 - nRemocon.height);
    text(nf(n2, 1, 1) + "'", 5 * nRemocon.width / 12, height / 2 - nRemocon.height + nRemocon.height / 4, nRemocon.width / 3, nRemocon.height / 2);
    image(nRemocon, 0, height / 2);
    text(nf(n1, 1, 1) + "'", 5 * nRemocon.width / 12, height / 2 + nRemocon.height / 4, nRemocon.width / 3, nRemocon.height / 2);
    stroke(255);
}

function animationBackgroundSetting() {
    noFill();
    strokeWeight(5);
    stroke(255);
    if (-1 < boundary && boundary < 1) {
        if (raysY <= height / 2) {
            if (theta1 >= 0 && raysX >= width / 2) {
                stroke(255, 0, 255);
                arc(width / 2, height / 2, height / 10, height / 10, PI / 2, theta1 + PI / 2);
                stroke(0, 255, 255);
                arc(width / 2, height / 2, height / 10, height / 10, -theta1 + PI / 2, PI / 2);
                fill(255);
                noStroke();
                text(nf(abs(degrees(theta1)), 1, 1) + "'", width / 2 - 2 * width / 50, height / 2 + 4 * width / 50);
                text(nf(abs(degrees(theta1)), 1, 1) + "'", width / 2 + 2 * width / 50, height / 2 + 4 * width / 50);
                if (theta1 != PI / 2 && theta1 != -PI / 2) {
                    text(nf(abs(degrees(theta2)), 1, 1) + "'", width / 2 + 2 * width / 50, height / 2 - 4 * width / 50);
                }
                if (theta1 != PI / 2 && theta1 != -PI / 2) {
                    stroke(0, 255, 0);
                    noFill();
                    arc(width / 2, height / 2, height / 10, height / 10, 3 * PI / 2, theta2 + 3 * PI / 2);
                }
            }
            if (theta1 < 0 && raysX <= width / 2) {
                stroke(255, 0, 255);
                arc(width / 2, height / 2, height / 10, height / 10, theta1 + PI / 2, PI / 2);
                stroke(0, 255, 255);
                arc(width / 2, height / 2, height / 10, height / 10, PI / 2, -theta1 + PI / 2);
                fill(255);
                noStroke();
                text(nf(abs(degrees(theta1)), 1, 1) + "'", width / 2 - 2 * width / 50, height / 2 + 4 * width / 50);
                text(nf(abs(degrees(theta1)), 1, 1) + "'", width / 2 + 2 * width / 50, height / 2 + 4 * width / 50);
                if (theta1 != PI / 2 && theta1 != -PI / 2) {
                    text(nf(abs(degrees(theta2)), 1, 1) + "'", width / 2 + 2 * width / 50, height / 2 - 4 * width / 50);
                }
                if (theta1 != PI / 2 && theta1 != -PI / 2) {
                    stroke(0, 255, 0);
                    noFill();
                    arc(width / 2, height / 2, height / 10, height / 10, theta2 + 3 * PI / 2, 3 * PI / 2);
                }
            }
        }
    }
    else {
        if (theta1 >= 0) {
            if (raysX >= width / 2) {
                stroke(255, 0, 255);
                arc(width / 2, height / 2, height / 10, height / 10, PI / 2, theta1 + PI / 2);
                stroke(0, 255, 255);
                arc(width / 2, height / 2, height / 10, height / 10, -theta1 + PI / 2, PI / 2);
                fill(255);
                noStroke();
                text(nf(abs(degrees(theta1)), 1, 1) + "'", width / 2 - 2 * width / 50, height / 2 + 4 * width / 50);
                text(nf(abs(degrees(theta1)), 1, 1) + "'", width / 2 + 2 * width / 50, height / 2 + 4 * width / 50);
            }
        }
        else {
            if (raysX <= width / 2) {
                stroke(255, 0, 255);
                arc(width / 2, height / 2, height / 10, height / 10, theta1 + PI / 2, PI / 2);
                stroke(0, 255, 255);
                arc(width / 2, height / 2, height / 10, height / 10, PI / 2, -theta1 + PI / 2);
                fill(255);
                noStroke();
                text(nf(abs(degrees(theta1)), 1, 1) + "'", width / 2 - 2 * width / 50, height / 2 + 4 * width / 50);
                text(nf(abs(degrees(theta1)), 1, 1) + "'", width / 2 + 2 * width / 50, height / 2 + 4 * width / 50);
            }
        }
    }
    stroke(255, 100);
    strokeWeight(5);
    line(width / 2, 0, width / 2, height);
    line(0, height / 2, width, height / 2);
}

function animationRays() {
    let s = sq((n1 * cos(theta1) - n2 * cos(theta2)) / (n1 * cos(theta1) + n2 * cos(theta2)));
    let p = sq((n1 * cos(theta2) - n2 * cos(theta1)) / (n1 * cos(theta2) + n2 * cos(theta1)));
    let strength = (s + p) / 2;
    // beginDraw() and endDraw() is not supportet in p5.js, and or often not needed;
    pg.noStroke();
    pg.fill(255, 0, 0);
    if (raysY < height / 2) {
        pg.fill(255, 0, 0, 255 * (1 - strength));
    }
    pg.ellipse(raysX, raysY, 5, 5);
    if (-1 < boundary && boundary < 1 && raysY < height / 2) {
        pg.fill(255, 0, 0, 255 * strength);
        pg.ellipse(raysX2, raysY2, 5, 5);
    }
    if (mouseIsPressed) {
        if (dist(width - rotateRemocon.width + 9 * rotateRemocon.width / 10, height - rotateRemocon.height + 3 * rotateRemocon.height / 10, mouseX, mouseY) < rotateRemocon.width / 20 || dist(width - rotateRemocon.width + 9 * rotateRemocon.width / 10, height - rotateRemocon.height + 7 * rotateRemocon.height / 10, mouseX, mouseY) < rotateRemocon.width / 20) {
            raysX = width / 2 - (height / 2 - height / 6) * sin(theta1);
            raysY = height / 2 + (height / 2 - height / 6) * cos(theta1);
            raysX2 = width / 2;
            raysY2 = height / 2;
            pg.background(0);
        }
        if (dist(9 * nRemocon.width / 10, height / 2 + 3 * nRemocon.height / 10, mouseX, mouseY) < nRemocon.width / 20 || dist(9 * nRemocon.width / 10, height / 2 + 7 * nRemocon.height / 10, mouseX, mouseY) < nRemocon.width / 20 || dist(9 * nRemocon.width / 10, height / 2 - nRemocon.height + 3 * nRemocon.height / 10, mouseX, mouseY) < nRemocon.width / 20 || dist(9 * nRemocon.width / 10, height / 2 - nRemocon.height + 7 * nRemocon.height / 10, mouseX, mouseY) < nRemocon.width / 20) {
            raysX = width / 2 - (height / 2 - height / 6) * sin(theta1);
            raysY = height / 2 + (height / 2 - height / 6) * cos(theta1);
            raysX2 = width / 2;
            raysY2 = height / 2;
            pg.background(0);
        }
        for (let i = 0; i < 4; i++) {
            if (width - (4 - i) * width / 8 < mouseX && mouseX < width - (4 - i - 1) * width / 8 && 0 < mouseY && mouseY < height / 20) {
                raysX = width / 2 - (height / 2 - height / 6) * sin(theta1);
                raysY = height / 2 + (height / 2 - height / 6) * cos(theta1);
                raysX2 = width / 2;
                raysY2 = height / 2;
                pg.background(0);
            }
        }
    }
    // beginDraw() and endDraw() is not supportet in p5.js, and or often not needed;
    image(pg, 0, 0);
}

function animationMaxCalculate() {
    theta1 = radians(lightRotateTheta);
    theta2 = asin(sin(theta1) / n12);
    n12 = n2 / n1;
    boundary = sin(theta1) / n12;
    if (-1 < boundary && boundary < 1) {
        if (theta1 != PI / 2 && theta1 != -PI / 2) {
            if (raysY > height / 2) {
                raysSpeedX = raysSpeed * cos(theta1 + PI / 2);
                raysSpeedY = raysSpeed * sin(theta1 + PI / 2);
            }
            else {
                raysSpeedX = raysSpeed * cos(theta2 + PI / 2);
                raysSpeedY = raysSpeed * sin(theta2 + PI / 2);
                raysX2 -= raysSpeed * cos(theta1 + PI / 2);
                raysY2 += raysSpeed * sin(theta1 + PI / 2);
            }
        }
        else {
            raysSpeedX = raysSpeed * cos(theta1 + PI / 2);
            raysSpeedY = raysSpeed * sin(theta1 + PI / 2);
        }
        raysX -= raysSpeedX;
        raysY -= raysSpeedY;
    }
    else {
        raysSpeedX = raysSpeed * cos(theta1 + PI / 2);
        raysSpeedY = raysSpeed * sin(theta1 + PI / 2);
        if (theta1 > 0) {
            if (raysX > width / 2) {
                raysX -= raysSpeedX;
                raysY += raysSpeedY;
            }
            else {
                raysX -= raysSpeedX;
                raysY -= raysSpeedY;
            }
        }
        if (theta1 < 0) {
            if (raysX > width / 2) {
                raysX -= raysSpeedX;
                raysY -= raysSpeedY;
            }
            else {
                raysX -= raysSpeedX;
                raysY += raysSpeedY;
            }
        }
    }
}

function animationMaxOperation() {
    if (mouseIsPressed) {
        count++;
        if (dist(width - rotateRemocon.width + 9 * rotateRemocon.width / 10, height - rotateRemocon.height + 3 * rotateRemocon.height / 10, mouseX, mouseY) < rotateRemocon.width / 20 && lightRotateTheta < 90 && count > 10) {
            if (count > 30) {
                lightRotateTheta += 0.5;
            }
            else {
                lightRotateTheta += 0.1;
            }
            theta1 = radians(lightRotateTheta);
            theta2 = asin(sin(theta1) / n12);
            n12 = n2 / n1;
            raysX = width / 2 - (height / 2 - height / 6) * sin(theta1);
            raysY = height / 2 + (height / 2 - height / 6) * cos(theta1);
            raysX2 = width / 2;
            raysY2 = height / 2;
            if (lightRotateTheta > 90) {
                lightRotateTheta = 90;
            }
        }
        if (dist(width - rotateRemocon.width + 9 * rotateRemocon.width / 10, height - rotateRemocon.height + 7 * rotateRemocon.height / 10, mouseX, mouseY) < rotateRemocon.width / 20 && lightRotateTheta > -90 && count > 10) {
            if (count > 30) {
                lightRotateTheta -= 0.5;
            }
            else {
                lightRotateTheta -= 0.1;
            }
            theta1 = radians(lightRotateTheta);
            theta2 = asin(sin(theta1) / n12);
            n12 = n2 / n1;
            raysX = width / 2 - (height / 2 - height / 6) * sin(theta1);
            raysY = height / 2 + (height / 2 - height / 6) * cos(theta1);
            raysX2 = width / 2;
            raysY2 = height / 2;
            if (lightRotateTheta < -90) {
                lightRotateTheta = -90;
            }
        }
        theta1 = radians(lightRotateTheta);
        theta2 = asin(sin(theta1) / n12);
        n12 = n2 / n1;
    }
    else {
        count = 0;
    }
    fill(255);
    image(rotateRemocon, width - rotateRemocon.width, height - rotateRemocon.height);
    noStroke();
    text(nf(abs(lightRotateTheta), 1, 1) + "'", width - rotateRemocon.width + 5 * rotateRemocon.width / 12, height - rotateRemocon.height + rotateRemocon.height / 4, rotateRemocon.width / 3, rotateRemocon.height / 2);
    image(nRemocon, 0, height / 2 - nRemocon.height);
    text(nf(n2, 1, 1) + "'", 5 * nRemocon.width / 12, height / 2 - nRemocon.height + nRemocon.height / 4, nRemocon.width / 3, nRemocon.height / 2);
    image(nRemocon, 0, height / 2);
    text(nf(n1, 1, 1) + "'", 5 * nRemocon.width / 12, height / 2 + nRemocon.height / 4, nRemocon.width / 3, nRemocon.height / 2);
    stroke(255);
}

function animationMaxBackgroundSetting() {
    noFill();
    strokeWeight(5);
    stroke(255);
    if (-1 < boundary && boundary < 1) {
        if (raysY <= height / 2) {
            if (theta1 >= 0 && raysX >= width / 2) {
                stroke(255, 0, 255);
                arc(width / 2, height / 2, height / 10, height / 10, PI / 2, theta1 + PI / 2);
                stroke(0, 255, 255);
                arc(width / 2, height / 2, height / 10, height / 10, -theta1 + PI / 2, PI / 2);
                fill(255);
                noStroke();
                text(nf(abs(degrees(theta1)), 1, 1) + "'", width / 2 - 2 * width / 50, height / 2 + 4 * width / 50);
                text(nf(abs(degrees(theta1)), 1, 1) + "'", width / 2 + 2 * width / 50, height / 2 + 4 * width / 50);
                if (theta1 != PI / 2 && theta1 != -PI / 2) {
                    text(nf(abs(degrees(theta2)), 1, 1) + "'", width / 2 + 2 * width / 50, height / 2 - 4 * width / 50);
                }
                if (theta1 != PI / 2 && theta1 != -PI / 2) {
                    stroke(0, 255, 0);
                    noFill();
                    arc(width / 2, height / 2, height / 10, height / 10, 3 * PI / 2, theta2 + 3 * PI / 2);
                }
            }
            if (theta1 < 0 && raysX <= width / 2) {
                stroke(255, 0, 255);
                arc(width / 2, height / 2, height / 10, height / 10, theta1 + PI / 2, PI / 2);
                stroke(0, 255, 255);
                arc(width / 2, height / 2, height / 10, height / 10, PI / 2, -theta1 + PI / 2);
                fill(255);
                noStroke();
                text(nf(abs(degrees(theta1)), 1, 1) + "'", width / 2 - 2 * width / 50, height / 2 + 4 * width / 50);
                text(nf(abs(degrees(theta1)), 1, 1) + "'", width / 2 + 2 * width / 50, height / 2 + 4 * width / 50);
                if (theta1 != PI / 2 && theta1 != -PI / 2) {
                    text(nf(abs(degrees(theta2)), 1, 1) + "'", width / 2 + 2 * width / 50, height / 2 - 4 * width / 50);
                }
                if (theta1 != PI / 2 && theta1 != -PI / 2) {
                    stroke(0, 255, 0);
                    noFill();
                    arc(width / 2, height / 2, height / 10, height / 10, theta2 + 3 * PI / 2, 3 * PI / 2);
                }
            }
        }
    }
    else {
        if (theta1 >= 0) {
            if (raysX >= width / 2) {
                stroke(255, 0, 255);
                arc(width / 2, height / 2, height / 10, height / 10, PI / 2, theta1 + PI / 2);
                stroke(0, 255, 255);
                arc(width / 2, height / 2, height / 10, height / 10, -theta1 + PI / 2, PI / 2);
                fill(255);
                noStroke();
                text(nf(abs(degrees(theta1)), 1, 1) + "'", width / 2 - 2 * width / 50, height / 2 + 4 * width / 50);
                text(nf(abs(degrees(theta1)), 1, 1) + "'", width / 2 + 2 * width / 50, height / 2 + 4 * width / 50);
            }
        }
        else {
            if (raysX <= width / 2) {
                stroke(255, 0, 255);
                arc(width / 2, height / 2, height / 10, height / 10, theta1 + PI / 2, PI / 2);
                stroke(0, 255, 255);
                arc(width / 2, height / 2, height / 10, height / 10, PI / 2, -theta1 + PI / 2);
                fill(255);
                noStroke();
                text(nf(abs(degrees(theta1)), 1, 1) + "'", width / 2 - 2 * width / 50, height / 2 + 4 * width / 50);
                text(nf(abs(degrees(theta1)), 1, 1) + "'", width / 2 + 2 * width / 50, height / 2 + 4 * width / 50);
            }
        }
    }
    stroke(255, 100);
    strokeWeight(5);
    line(width / 2, 0, width / 2, height);
    line(0, height / 2, width, height / 2);
}

function animationMaxRays() {
    // beginDraw() and endDraw() is not supportet in p5.js, and or often not needed;
    pg.noStroke();
    pg.fill(255, 0, 0);
    pg.ellipse(raysX, raysY, 5, 5);
    if (-1 < boundary && boundary < 1 && raysY < height / 2) {
        pg.ellipse(raysX2, raysY2, 5, 5);
    }
    if (mouseIsPressed) {
        if (dist(width - rotateRemocon.width + 9 * rotateRemocon.width / 10, height - rotateRemocon.height + 3 * rotateRemocon.height / 10, mouseX, mouseY) < rotateRemocon.width / 20 || dist(width - rotateRemocon.width + 9 * rotateRemocon.width / 10, height - rotateRemocon.height + 7 * rotateRemocon.height / 10, mouseX, mouseY) < rotateRemocon.width / 20) {
            raysX = width / 2 - (height / 2 - height / 6) * sin(theta1);
            raysY = height / 2 + (height / 2 - height / 6) * cos(theta1);
            raysX2 = width / 2;
            raysY2 = height / 2;
            pg.background(0);
        }
        if (dist(9 * nRemocon.width / 10, height / 2 + 3 * nRemocon.height / 10, mouseX, mouseY) < nRemocon.width / 20 || dist(9 * nRemocon.width / 10, height / 2 + 7 * nRemocon.height / 10, mouseX, mouseY) < nRemocon.width / 20 || dist(9 * nRemocon.width / 10, height / 2 - nRemocon.height + 3 * nRemocon.height / 10, mouseX, mouseY) < nRemocon.width / 20 || dist(9 * nRemocon.width / 10, height / 2 - nRemocon.height + 7 * nRemocon.height / 10, mouseX, mouseY) < nRemocon.width / 20) {
            raysX = width / 2 - (height / 2 - height / 6) * sin(theta1);
            raysY = height / 2 + (height / 2 - height / 6) * cos(theta1);
            raysX2 = width / 2;
            raysY2 = height / 2;
            pg.background(0);
        }
        for (let i = 0; i < 4; i++) {
            if (width - (4 - i) * width / 8 < mouseX && mouseX < width - (4 - i - 1) * width / 8 && 0 < mouseY && mouseY < height / 20) {
                raysX = width / 2 - (height / 2 - height / 6) * sin(theta1);
                raysY = height / 2 + (height / 2 - height / 6) * cos(theta1);
                raysX2 = width / 2;
                raysY2 = height / 2;
                pg.background(0);
            }
        }
    }
    // beginDraw() and endDraw() is not supportet in p5.js, and or often not needed;
    image(pg, 0, 0);
}

function lightResource() {
    strokeWeight(1);
    push();
    translate(width / 2, height / 2);
    fill(0);
    stroke(255);
    rotate(radians((lightRotateTheta)));
    rect(-width / 48, height / 2 - height / 6, width / 24, height / 6);
    pop();
}

function lineCalculate() {
    theta1 = radians(lightRotateTheta);
    theta2 = asin(sin(theta1) / n12);
    n12 = n2 / n1;
    boundary = sin(theta1) / n12;
}

function lineOperation() {
    if (mouseIsPressed) {
        count++;
        if (dist(width - rotateRemocon.width + 9 * rotateRemocon.width / 10, height - rotateRemocon.height + 3 * rotateRemocon.height / 10, mouseX, mouseY) < rotateRemocon.width / 20 && lightRotateTheta < 90 && count > 10) {
            if (count > 30) {
                lightRotateTheta += 0.5;
            }
            else {
                lightRotateTheta += 0.1;
            }
            theta1 = radians(lightRotateTheta);
            theta2 = asin(sin(theta1) / n12);
            n12 = n2 / n1;
            if (lightRotateTheta > 90) {
                lightRotateTheta = 90;
            }
        }
        if (dist(width - rotateRemocon.width + 9 * rotateRemocon.width / 10, height - rotateRemocon.height + 7 * rotateRemocon.height / 10, mouseX, mouseY) < rotateRemocon.width / 20 && lightRotateTheta > -90 && count > 10) {
            if (count > 30) {
                lightRotateTheta -= 0.5;
            }
            else {
                lightRotateTheta -= 0.1;
            }
            theta1 = radians(lightRotateTheta);
            theta2 = asin(sin(theta1) / n12);
            n12 = n2 / n1;
            if (lightRotateTheta < -90) {
                lightRotateTheta = -90;
            }
        }
        theta1 = radians(lightRotateTheta);
        theta2 = asin(sin(theta1) / n12);
        n12 = n2 / n1;
    }
    else {
        count = 0;
    }
    fill(255);
    noStroke();
    image(rotateRemocon, width - rotateRemocon.width, height - rotateRemocon.height);
    text(nf(abs(lightRotateTheta), 1, 1) + "'", width - rotateRemocon.width + 5 * rotateRemocon.width / 12, height - rotateRemocon.height + rotateRemocon.height / 4, rotateRemocon.width / 3, rotateRemocon.height / 2);
    image(nRemocon, 0, height / 2 - nRemocon.height);
    text(nf(n2, 1, 1) + "'", 5 * nRemocon.width / 12, height / 2 - nRemocon.height + nRemocon.height / 4, nRemocon.width / 3, nRemocon.height / 2);
    image(nRemocon, 0, height / 2);
    text(nf(n1, 1, 1) + "'", 5 * nRemocon.width / 12, height / 2 + nRemocon.height / 4, nRemocon.width / 3, nRemocon.height / 2);
}

function lineBackgroundSetting() {
    noFill();
    strokeWeight(5);
    stroke(255);
    if (-1 < boundary && boundary < 1) {
        if (theta1 > 0) {
            stroke(255, 0, 255);
            arc(width / 2, height / 2, height / 10, height / 10, PI / 2, theta1 + PI / 2);
            stroke(0, 255, 255);
            arc(width / 2, height / 2, height / 10, height / 10, -theta1 + PI / 2, PI / 2);
            if (theta1 != PI / 2 && theta1 != -PI / 2) {
                stroke(0, 255, 0);
                arc(width / 2, height / 2, height / 10, height / 10, 3 * PI / 2, theta2 + 3 * PI / 2);
            }
        }
        else {
            stroke(255, 0, 255);
            arc(width / 2, height / 2, height / 10, height / 10, theta1 + PI / 2, PI / 2);
            stroke(0, 255, 255);
            arc(width / 2, height / 2, height / 10, height / 10, PI / 2, -theta1 + PI / 2);
            if (theta1 != PI / 2 && theta1 != -PI / 2) {
                stroke(0, 255, 0);
                arc(width / 2, height / 2, height / 10, height / 10, theta2 + 3 * PI / 2, 3 * PI / 2);
            }
        }
        fill(255);
        noStroke();
        text(nf(abs(degrees(theta1)), 1, 1) + "'", width / 2 - 2 * width / 50, height / 2 + 4 * width / 50);
        text(nf(abs(degrees(theta1)), 1, 1) + "'", width / 2 + 2 * width / 50, height / 2 + 4 * width / 50);
        if (theta1 != PI / 2 && theta1 != -PI / 2) {
            text(nf(abs(degrees(theta2)), 1, 1) + "'", width / 2 + 2 * width / 50, height / 2 - 4 * width / 50);
        }
    }
    else {
        if (theta1 > 0) {
            stroke(255, 0, 255);
            arc(width / 2, height / 2, height / 10, height / 10, PI / 2, theta1 + PI / 2);
            stroke(0, 255, 255);
            arc(width / 2, height / 2, height / 10, height / 10, -theta1 + PI / 2, PI / 2);
            fill(255);
            noStroke();
            text(nf(abs(degrees(theta1)), 1, 1) + "'", width / 2 - 2 * width / 50, height / 2 + 4 * width / 50);
            text(nf(abs(degrees(theta1)), 1, 1) + "'", width / 2 + 2 * width / 50, height / 2 + 4 * width / 50);
        }
        else {
            stroke(255, 0, 255);
            arc(width / 2, height / 2, height / 10, height / 10, theta1 + PI / 2, PI / 2);
            stroke(0, 255, 255);
            arc(width / 2, height / 2, height / 10, height / 10, PI / 2, -theta1 + PI / 2);
            fill(255);
            noStroke();
            text(nf(abs(degrees(theta1)), 1, 1) + "'", width / 2 - 2 * width / 50, height / 2 + 4 * width / 50);
            text(nf(abs(degrees(theta1)), 1, 1) + "'", width / 2 + 2 * width / 50, height / 2 + 4 * width / 50);
        }
    }
    stroke(255, 100);
    strokeWeight(5);
    line(width / 2, 0, width / 2, height);
    line(0, height / 2, width, height / 2);
}

function lineRays() {
    let s = sq((n1 * cos(theta1) - n2 * cos(theta2)) / (n1 * cos(theta1) + n2 * cos(theta2)));
    let p = sq((n1 * cos(theta2) - n2 * cos(theta1)) / (n1 * cos(theta2) + n2 * cos(theta1)));
    let strength = (s + p) / 2;
    strokeWeight(5);
    stroke(255, 0, 0);
    line(width / 2, height / 2, width / 2 - (height / 2 - height / 6) * sin(theta1), height / 2 + (height / 2 - height / 6) * cos(theta1));
    if (-1 < boundary && boundary < 1) {
        stroke(255, 0, 0, 255 * strength);
    }
    else {
        stroke(255, 0, 0);
    }
    line(width / 2, height / 2, width / 2 + (width) * sin(theta1), height / 2 + (width) * cos(theta1));
    stroke(255, 0, 0, 255 * (1 - strength));
    line(width / 2, height / 2, width / 2 + (width) * sin(theta2), height / 2 - (width) * cos(theta2));
}

function lineMaxCalculate() {
    theta1 = radians(lightRotateTheta);
    theta2 = asin(sin(theta1) / n12);
    n12 = n2 / n1;
    boundary = sin(theta1) / n12;
}

function lineMaxOperation() {
    if (mouseIsPressed) {
        count++;
        if (dist(width - rotateRemocon.width + 9 * rotateRemocon.width / 10, height - rotateRemocon.height + 3 * rotateRemocon.height / 10, mouseX, mouseY) < rotateRemocon.width / 20 && lightRotateTheta < 90 && count > 10) {
            if (count > 30) {
                lightRotateTheta += 0.5;
            }
            else {
                lightRotateTheta += 0.1;
            }
            theta1 = radians(lightRotateTheta);
            theta2 = asin(sin(theta1) / n12);
            n12 = n2 / n1;
            if (lightRotateTheta > 90) {
                lightRotateTheta = 90;
            }
        }
        if (dist(width - rotateRemocon.width + 9 * rotateRemocon.width / 10, height - rotateRemocon.height + 7 * rotateRemocon.height / 10, mouseX, mouseY) < rotateRemocon.width / 20 && lightRotateTheta > -90 && count > 10) {
            if (count > 30) {
                lightRotateTheta -= 0.5;
            }
            else {
                lightRotateTheta -= 0.1;
            }
            theta1 = radians(lightRotateTheta);
            theta2 = asin(sin(theta1) / n12);
            n12 = n2 / n1;
            if (lightRotateTheta < -90) {
                lightRotateTheta = -90;
            }
        }
        theta1 = radians(lightRotateTheta);
        theta2 = asin(sin(theta1) / n12);
        n12 = n2 / n1;
    }
    else {
        count = 0;
    }
    fill(255);
    noStroke();
    image(rotateRemocon, width - rotateRemocon.width, height - rotateRemocon.height);
    text(nf(abs(lightRotateTheta), 1, 1) + "'", width - rotateRemocon.width + 5 * rotateRemocon.width / 12, height - rotateRemocon.height + rotateRemocon.height / 4, rotateRemocon.width / 3, rotateRemocon.height / 2);
    image(nRemocon, 0, height / 2 - nRemocon.height);
    text(nf(n2, 1, 1) + "'", 5 * nRemocon.width / 12, height / 2 - nRemocon.height + nRemocon.height / 4, nRemocon.width / 3, nRemocon.height / 2);
    image(nRemocon, 0, height / 2);
    text(nf(n1, 1, 1) + "'", 5 * nRemocon.width / 12, height / 2 + nRemocon.height / 4, nRemocon.width / 3, nRemocon.height / 2);
}

function lineMaxBackgroundSetting() {
    noFill();
    strokeWeight(5);
    stroke(255);
    if (-1 < boundary && boundary < 1) {
        if (theta1 > 0) {
            stroke(255, 0, 255);
            arc(width / 2, height / 2, height / 10, height / 10, PI / 2, theta1 + PI / 2);
            stroke(0, 255, 255);
            arc(width / 2, height / 2, height / 10, height / 10, -theta1 + PI / 2, PI / 2);
            if (theta1 != PI / 2 && theta1 != -PI / 2) {
                stroke(0, 255, 0);
                arc(width / 2, height / 2, height / 10, height / 10, 3 * PI / 2, theta2 + 3 * PI / 2);
            }
        }
        else {
            stroke(255, 0, 255);
            arc(width / 2, height / 2, height / 10, height / 10, theta1 + PI / 2, PI / 2);
            stroke(0, 255, 255);
            arc(width / 2, height / 2, height / 10, height / 10, PI / 2, -theta1 + PI / 2);
            if (theta1 != PI / 2 && theta1 != -PI / 2) {
                stroke(0, 255, 0);
                arc(width / 2, height / 2, height / 10, height / 10, theta2 + 3 * PI / 2, 3 * PI / 2);
            }
        }
        fill(255);
        noStroke();
        text(nf(abs(degrees(theta1)), 1, 1) + "'", width / 2 - 2 * width / 50, height / 2 + 4 * width / 50);
        text(nf(abs(degrees(theta1)), 1, 1) + "'", width / 2 + 2 * width / 50, height / 2 + 4 * width / 50);
        if (theta1 != PI / 2 && theta1 != -PI / 2) {
            text(nf(abs(degrees(theta2)), 1, 1) + "'", width / 2 + 2 * width / 50, height / 2 - 4 * width / 50);
        }
    }
    else {
        if (theta1 > 0) {
            stroke(255, 0, 255);
            arc(width / 2, height / 2, height / 10, height / 10, PI / 2, theta1 + PI / 2);
            stroke(0, 255, 255);
            arc(width / 2, height / 2, height / 10, height / 10, -theta1 + PI / 2, PI / 2);
            fill(255);
            noStroke();
            text(nf(abs(degrees(theta1)), 1, 1) + "'", width / 2 - 2 * width / 50, height / 2 + 4 * width / 50);
            text(nf(abs(degrees(theta1)), 1, 1) + "'", width / 2 + 2 * width / 50, height / 2 + 4 * width / 50);
        }
        else {
            stroke(255, 0, 255);
            arc(width / 2, height / 2, height / 10, height / 10, theta1 + PI / 2, PI / 2);
            stroke(0, 255, 255);
            arc(width / 2, height / 2, height / 10, height / 10, PI / 2, -theta1 + PI / 2);
            fill(255);
            noStroke();
            text(nf(abs(degrees(theta1)), 1, 1) + "'", width / 2 - 2 * width / 50, height / 2 + 4 * width / 50);
            text(nf(abs(degrees(theta1)), 1, 1) + "'", width / 2 + 2 * width / 50, height / 2 + 4 * width / 50);
        }
    }
    stroke(255, 100);
    strokeWeight(5);
    line(width / 2, 0, width / 2, height);
    line(0, height / 2, width, height / 2);
}

function lineMaxRays() {
    strokeWeight(5);
    stroke(255, 0, 0);
    line(width / 2, height / 2, width / 2 - (height / 2 - height / 6) * sin(theta1), height / 2 + (height / 2 - height / 6) * cos(theta1));
    stroke(255, 0, 0);
    line(width / 2, height / 2, width / 2 + (width) * sin(theta1), height / 2 + (width) * cos(theta1));
    line(width / 2, height / 2, width / 2 + (width) * sin(theta2), height / 2 - (width) * cos(theta2));
}


function fullScreen() {
    createCanvas(windowWidth, windowHeight);
}
function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}