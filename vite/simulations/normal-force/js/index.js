let backgroundDiv,
    startButton,
    stopButton,
    resetButton,
    slopeAngleButtonLabel,
    slopeAngleButton,
    weightButtonLabel,
    weightButton,
    gravityButtonLabel,
    gravityButton,
    sortButton1,
    sortButton2,
    sortButton3;
let count = 0;
let SLOPE_WID = 0;
let GROUND_HEI = 0;
let MATERIAL_WID = 0;
let MATERIAL_HEI = 0;
let REFERENCE_POINT = 0;
let MINIMUM_UNIT = 0;
let clickedCount;
let resetCount;
let material;
function buttonCreation() {
    backgroundDiv = createElement("div")
    startButton = createButton("スタート")
    stopButton = createButton("ストップ")
    resetButton = createButton("リセット")
    slopeAngleButtonLabel = createElement("label", "坂の角度[°]")
    slopeAngleButton = createInput(20, "number")
    weightButtonLabel = createElement("label", "質量[kg]")
    weightButton = createInput(15, "number")
    gravityButtonLabel = createElement("label", "重力加速度[m/ss]")
    gravityButton = createInput(9.8, "number")
    sortButton1 = createButton(1).mousePressed(sortButtonAction1)
    sortButton2 = createButton(2).mousePressed(sortButtonAction2)
    sortButton3 = createButton(3).mousePressed(sortButtonAction3)
}
function materialSet() {
    material = new Material(weightButton.value(), 1);
}
function buttonSettings() {
    backgroundDiv.size(width, windowHeight / 10).style("background-color", "white")
    startButton.mousePressed(moveButtonAction).size(windowWidth / 8, windowHeight / 10).position(0, height+windowHeight/10).addClass("btn btn-outline-primary").parent(backgroundDiv)
    stopButton.mousePressed(moveButtonAction).size(windowWidth / 8, windowHeight / 10).position(0, height+windowHeight/10).addClass("btn btn-outline-danger").hide().parent(backgroundDiv)
    resetButton.mousePressed(resetButtonAction).size(windowWidth / 8, windowHeight / 10).position(windowWidth / 8, height+windowHeight/10).addClass("btn btn-outline-secondary").parent(backgroundDiv)
    slopeAngleButtonLabel.size(windowWidth / 8, windowHeight / 10).position(2 * windowWidth / 8, height+windowHeight/10).parent(backgroundDiv).addClass("btn btn-light")
    slopeAngleButton.size(windowWidth / 8, windowHeight / 10).position(3 * windowWidth / 8, height+windowHeight/10).parent(backgroundDiv).addClass("btn btn-light").attribute("min", 0).attribute("max", 89.9).attribute("step", 0.1)
    weightButtonLabel.size(windowWidth / 8, windowHeight / 10).position(4 * windowWidth / 8, height+windowHeight/10).parent(backgroundDiv).addClass("btn btn-light")
    weightButton.size(windowWidth / 8, windowHeight / 10).position(5 * windowWidth / 8, height+windowHeight/10).parent(backgroundDiv).addClass("btn btn-light").attribute("min", 0).attribute("max", 20).attribute("step", 0.1)
    gravityButtonLabel.size(windowWidth / 8, windowHeight / 10).position(6 * windowWidth / 8, height+windowHeight/10).parent(backgroundDiv).addClass("btn btn-light")
    gravityButton.size(windowWidth / 8, windowHeight / 10).position(7 * windowWidth / 8, height+windowHeight/10).parent(backgroundDiv).addClass("btn btn-light").attribute("min", 0).attribute("max", 20).attribute("step", 0.1)
    sortButton1.mousePressed(sortButtonAction1).size(windowWidth / 8, windowHeight / 10).position(width - 3 * windowWidth / 8, windowHeight/10).addClass("btn btn-outline-secondary")
    sortButton2.mousePressed(sortButtonAction2).size(windowWidth / 8, windowHeight / 10).position(width - 2 * windowWidth / 8, windowHeight/10).addClass("btn btn-outline-secondary")
    sortButton3.mousePressed(sortButtonAction3).size(windowWidth / 8, windowHeight / 10).position(width - windowWidth / 8, windowHeight/10).addClass("btn btn-outline-secondary")
}
function sortButtonAction1() {
    material.sort = 1;
}
function sortButtonAction2() {
    material.sort = 2;
}
function sortButtonAction3() {
    material.sort = 3;
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
    materialSet()
    clickedCount = false;
    resetCount = true;
    startButton.show()
    stopButton.hide()
}
function setup() {
    fullScreen();
    buttonCreation()
    initSettings()
    materialSet()
    buttonSettings()
}
function draw() {
    background(255);
    slope();
    calculate();
    material.materialWeight = weightButton.value()
    material._draw();
}
function arrow(a, b, n) {
    if (n == "gravity") {
        triangle(a, b, a - MINIMUM_UNIT / 2, b - MINIMUM_UNIT / 2, a + MINIMUM_UNIT / 2, b - MINIMUM_UNIT / 2);
    }
    else if (n == "vertical") {
        triangle(a, b, a + MINIMUM_UNIT / 2 * (sin(radians(slopeAngleButton.value())) - cos(radians(slopeAngleButton.value()))), b - MINIMUM_UNIT / 2 * (cos(radians(slopeAngleButton.value())) + sin(radians(slopeAngleButton.value()))), a + MINIMUM_UNIT / 2 * (sin(radians(slopeAngleButton.value())) + cos(radians(slopeAngleButton.value()))), b + MINIMUM_UNIT / 2 * (-cos(radians(slopeAngleButton.value())) + sin(radians(slopeAngleButton.value()))));
    }
    else if (n == "holizonal") {
        triangle(a, b, a - MINIMUM_UNIT / 2 * (sin(radians(slopeAngleButton.value())) + cos(radians(slopeAngleButton.value()))), b + MINIMUM_UNIT / 2 * (cos(radians(slopeAngleButton.value())) - sin(radians(slopeAngleButton.value()))), a - MINIMUM_UNIT / 2 * (-sin(radians(slopeAngleButton.value())) + cos(radians(slopeAngleButton.value()))), b - MINIMUM_UNIT / 2 * (cos(radians(slopeAngleButton.value())) + sin(radians(slopeAngleButton.value()))));
    }
    else if (n == "normal") {
        triangle(a, b, a - MINIMUM_UNIT / 2 * (sin(radians(slopeAngleButton.value())) + cos(radians(slopeAngleButton.value()))), b + MINIMUM_UNIT / 2 * (cos(radians(slopeAngleButton.value())) - sin(radians(slopeAngleButton.value()))), a + MINIMUM_UNIT / 2 * (cos(radians(slopeAngleButton.value())) - sin(radians(slopeAngleButton.value()))), b + MINIMUM_UNIT / 2 * (sin(radians(slopeAngleButton.value())) + cos(radians(slopeAngleButton.value()))));
    }
}
function calculate() {
    if (clickedCount == true) {
        count++;
    }
    material.materialY = GROUND_HEI - (5 * width / 6 - material.materialX) * tan(radians(slopeAngleButton.value()));
}
function dashedLine(aX, aY, bX, bY, w) {
    stroke(0);
    strokeWeight(w);
    drawingContext.setLineDash([10, 5, 2, 5]);
    line(aX, aY, bX, bY);
    drawingContext.setLineDash([]);
    strokeWeight(5);
}
function rectMaterial(a, b, sort, w) {
    stroke(0);
    fill(255);
    quad(a, b, a + MATERIAL_HEI * sin(radians(slopeAngleButton.value())), b - MATERIAL_HEI * cos(radians(slopeAngleButton.value())), a + MATERIAL_WID * cos(radians(slopeAngleButton.value())) + MATERIAL_HEI * sin(radians(slopeAngleButton.value())), b + MATERIAL_WID * sin(radians(slopeAngleButton.value())) - MATERIAL_HEI * cos(radians(slopeAngleButton.value())), a + MATERIAL_WID * cos(radians(slopeAngleButton.value())), b + MATERIAL_WID * sin(radians(slopeAngleButton.value())));
    fill(0);
    let ARROW_LENGTH = w * gravityButton.value();
    if (sort == 1) {
        dashedLine(a + (MATERIAL_WID * cos(radians(slopeAngleButton.value())) + MATERIAL_HEI * sin(radians(slopeAngleButton.value()))) / 2, b + (MATERIAL_WID * sin(radians(slopeAngleButton.value())) - MATERIAL_HEI * cos(radians(slopeAngleButton.value()))) / 2, a + (MATERIAL_WID * cos(radians(slopeAngleButton.value())) + MATERIAL_HEI * sin(radians(slopeAngleButton.value()))) / 2, b + (MATERIAL_WID * sin(radians(slopeAngleButton.value())) - MATERIAL_HEI * cos(radians(slopeAngleButton.value()))) / 2 + ARROW_LENGTH, 1);
        arrow(a + (MATERIAL_WID * cos(radians(slopeAngleButton.value())) + MATERIAL_HEI * sin(radians(slopeAngleButton.value()))) / 2, b + (MATERIAL_WID * sin(radians(slopeAngleButton.value())) - MATERIAL_HEI * cos(radians(slopeAngleButton.value()))) / 2 + ARROW_LENGTH, "gravity");
        dashedLine(a + (MATERIAL_WID * cos(radians(slopeAngleButton.value())) + MATERIAL_HEI * sin(radians(slopeAngleButton.value()))) / 2, b + (MATERIAL_WID * sin(radians(slopeAngleButton.value())) - MATERIAL_HEI * cos(radians(slopeAngleButton.value()))) / 2 + ARROW_LENGTH, a + (MATERIAL_WID * cos(radians(slopeAngleButton.value())) + MATERIAL_HEI * sin(radians(slopeAngleButton.value()))) / 2 - ARROW_LENGTH * sin(radians(slopeAngleButton.value())) * cos(radians(slopeAngleButton.value())), b + (MATERIAL_WID * sin(radians(slopeAngleButton.value())) - MATERIAL_HEI * cos(radians(slopeAngleButton.value()))) / 2 + ARROW_LENGTH * sq(cos(radians(slopeAngleButton.value()))), 1);
        dashedLine(a + (MATERIAL_WID * cos(radians(slopeAngleButton.value())) + MATERIAL_HEI * sin(radians(slopeAngleButton.value()))) / 2, b + (MATERIAL_WID * sin(radians(slopeAngleButton.value())) - MATERIAL_HEI * cos(radians(slopeAngleButton.value()))) / 2 + ARROW_LENGTH, a + (MATERIAL_WID * cos(radians(slopeAngleButton.value())) + MATERIAL_HEI * sin(radians(slopeAngleButton.value()))) / 2 + ARROW_LENGTH * sin(radians(slopeAngleButton.value())) * cos(radians(slopeAngleButton.value())), b + (MATERIAL_WID * sin(radians(slopeAngleButton.value())) - MATERIAL_HEI * cos(radians(slopeAngleButton.value()))) / 2 + ARROW_LENGTH * sq(sin(radians(slopeAngleButton.value()))), 1);
        line(a + (MATERIAL_WID * cos(radians(slopeAngleButton.value())) + MATERIAL_HEI * sin(radians(slopeAngleButton.value()))) / 2, b + (MATERIAL_WID * sin(radians(slopeAngleButton.value())) - MATERIAL_HEI * cos(radians(slopeAngleButton.value()))) / 2, a + (MATERIAL_WID * cos(radians(slopeAngleButton.value())) + MATERIAL_HEI * sin(radians(slopeAngleButton.value()))) / 2 - ARROW_LENGTH * sin(radians(slopeAngleButton.value())) * cos(radians(slopeAngleButton.value())), b + (MATERIAL_WID * sin(radians(slopeAngleButton.value())) - MATERIAL_HEI * cos(radians(slopeAngleButton.value()))) / 2 + ARROW_LENGTH * sq(cos(radians(slopeAngleButton.value()))));
        arrow(a + (MATERIAL_WID * cos(radians(slopeAngleButton.value())) + MATERIAL_HEI * sin(radians(slopeAngleButton.value()))) / 2 - ARROW_LENGTH * sin(radians(slopeAngleButton.value())) * cos(radians(slopeAngleButton.value())), b + (MATERIAL_WID * sin(radians(slopeAngleButton.value())) - MATERIAL_HEI * cos(radians(slopeAngleButton.value()))) / 2 + ARROW_LENGTH * sq(cos(radians(slopeAngleButton.value()))), "vertical");
        line(a + (MATERIAL_WID * cos(radians(slopeAngleButton.value())) + MATERIAL_HEI * sin(radians(slopeAngleButton.value()))) / 2, b + (MATERIAL_WID * sin(radians(slopeAngleButton.value())) - MATERIAL_HEI * cos(radians(slopeAngleButton.value()))) / 2, a + (MATERIAL_WID * cos(radians(slopeAngleButton.value())) + MATERIAL_HEI * sin(radians(slopeAngleButton.value()))) / 2 + ARROW_LENGTH * sin(radians(slopeAngleButton.value())) * cos(radians(slopeAngleButton.value())), b + (MATERIAL_WID * sin(radians(slopeAngleButton.value())) - MATERIAL_HEI * cos(radians(slopeAngleButton.value()))) / 2 + ARROW_LENGTH * sq(sin(radians(slopeAngleButton.value()))));
        arrow(a + (MATERIAL_WID * cos(radians(slopeAngleButton.value())) + MATERIAL_HEI * sin(radians(slopeAngleButton.value()))) / 2 + ARROW_LENGTH * sin(radians(slopeAngleButton.value())) * cos(radians(slopeAngleButton.value())), b + (MATERIAL_WID * sin(radians(slopeAngleButton.value())) - MATERIAL_HEI * cos(radians(slopeAngleButton.value()))) / 2 + ARROW_LENGTH * sq(sin(radians(slopeAngleButton.value()))), "holizonal");
    }
    if (sort == 2) {
        dashedLine(a + (MATERIAL_WID * cos(radians(slopeAngleButton.value())) + MATERIAL_HEI * sin(radians(slopeAngleButton.value()))) / 2, b + (MATERIAL_WID * sin(radians(slopeAngleButton.value())) - MATERIAL_HEI * cos(radians(slopeAngleButton.value()))) / 2, a + (MATERIAL_WID * cos(radians(slopeAngleButton.value())) + MATERIAL_HEI * sin(radians(slopeAngleButton.value()))) / 2 - ARROW_LENGTH * sin(radians(slopeAngleButton.value())) * cos(radians(slopeAngleButton.value())), b + (MATERIAL_WID * sin(radians(slopeAngleButton.value())) - MATERIAL_HEI * cos(radians(slopeAngleButton.value()))) / 2 + ARROW_LENGTH * sq(cos(radians(slopeAngleButton.value()))), 1);
        dashedLine(a + (MATERIAL_WID * cos(radians(slopeAngleButton.value())) + MATERIAL_HEI * sin(radians(slopeAngleButton.value()))) / 2, b + (MATERIAL_WID * sin(radians(slopeAngleButton.value())) - MATERIAL_HEI * cos(radians(slopeAngleButton.value()))) / 2, a + (MATERIAL_WID * cos(radians(slopeAngleButton.value())) + MATERIAL_HEI * sin(radians(slopeAngleButton.value()))) / 2 + ARROW_LENGTH * sin(radians(slopeAngleButton.value())) * cos(radians(slopeAngleButton.value())), b + (MATERIAL_WID * sin(radians(slopeAngleButton.value())) - MATERIAL_HEI * cos(radians(slopeAngleButton.value()))) / 2 + ARROW_LENGTH * sq(sin(radians(slopeAngleButton.value()))), 1);
        arrow(a + (MATERIAL_WID * cos(radians(slopeAngleButton.value())) + MATERIAL_HEI * sin(radians(slopeAngleButton.value()))) / 2 + ARROW_LENGTH * sin(radians(slopeAngleButton.value())) * cos(radians(slopeAngleButton.value())), b + (MATERIAL_WID * sin(radians(slopeAngleButton.value())) - MATERIAL_HEI * cos(radians(slopeAngleButton.value()))) / 2 + ARROW_LENGTH * sq(sin(radians(slopeAngleButton.value()))), "holizonal");
        arrow(a + (MATERIAL_WID * cos(radians(slopeAngleButton.value())) + MATERIAL_HEI * sin(radians(slopeAngleButton.value()))) / 2 - ARROW_LENGTH * sin(radians(slopeAngleButton.value())) * cos(radians(slopeAngleButton.value())), b + (MATERIAL_WID * sin(radians(slopeAngleButton.value())) - MATERIAL_HEI * cos(radians(slopeAngleButton.value()))) / 2 + ARROW_LENGTH * sq(cos(radians(slopeAngleButton.value()))), "vertical");
        line(a + (MATERIAL_WID * cos(radians(slopeAngleButton.value())) + MATERIAL_HEI * sin(radians(slopeAngleButton.value()))) / 2, b + (MATERIAL_WID * sin(radians(slopeAngleButton.value())) - MATERIAL_HEI * cos(radians(slopeAngleButton.value()))) / 2, a + (MATERIAL_WID * cos(radians(slopeAngleButton.value())) + MATERIAL_HEI * sin(radians(slopeAngleButton.value()))) / 2, b + (MATERIAL_WID * sin(radians(slopeAngleButton.value())) - MATERIAL_HEI * cos(radians(slopeAngleButton.value()))) / 2 + ARROW_LENGTH);
        arrow(a + (MATERIAL_WID * cos(radians(slopeAngleButton.value())) + MATERIAL_HEI * sin(radians(slopeAngleButton.value()))) / 2, b + (MATERIAL_WID * sin(radians(slopeAngleButton.value())) - MATERIAL_HEI * cos(radians(slopeAngleButton.value()))) / 2 + ARROW_LENGTH, "gravity");
        dashedLine(a + (MATERIAL_WID * cos(radians(slopeAngleButton.value())) + MATERIAL_HEI * sin(radians(slopeAngleButton.value()))) / 2, b + (MATERIAL_WID * sin(radians(slopeAngleButton.value())) - MATERIAL_HEI * cos(radians(slopeAngleButton.value()))) / 2 + ARROW_LENGTH, a + (MATERIAL_WID * cos(radians(slopeAngleButton.value())) + MATERIAL_HEI * sin(radians(slopeAngleButton.value()))) / 2 - ARROW_LENGTH * sin(radians(slopeAngleButton.value())) * cos(radians(slopeAngleButton.value())), b + (MATERIAL_WID * sin(radians(slopeAngleButton.value())) - MATERIAL_HEI * cos(radians(slopeAngleButton.value()))) / 2 + ARROW_LENGTH * sq(cos(radians(slopeAngleButton.value()))), 1);
        dashedLine(a + (MATERIAL_WID * cos(radians(slopeAngleButton.value())) + MATERIAL_HEI * sin(radians(slopeAngleButton.value()))) / 2, b + (MATERIAL_WID * sin(radians(slopeAngleButton.value())) - MATERIAL_HEI * cos(radians(slopeAngleButton.value()))) / 2 + ARROW_LENGTH, a + (MATERIAL_WID * cos(radians(slopeAngleButton.value())) + MATERIAL_HEI * sin(radians(slopeAngleButton.value()))) / 2 + ARROW_LENGTH * sin(radians(slopeAngleButton.value())) * cos(radians(slopeAngleButton.value())), b + (MATERIAL_WID * sin(radians(slopeAngleButton.value())) - MATERIAL_HEI * cos(radians(slopeAngleButton.value()))) / 2 + ARROW_LENGTH * sq(sin(radians(slopeAngleButton.value()))), 1);
    }
    if (sort == 3) {
        line(a + (MATERIAL_WID * cos(radians(slopeAngleButton.value())) + MATERIAL_HEI * sin(radians(slopeAngleButton.value()))) / 2, b + (MATERIAL_WID * sin(radians(slopeAngleButton.value())) - MATERIAL_HEI * cos(radians(slopeAngleButton.value()))) / 2, a + (MATERIAL_WID * cos(radians(slopeAngleButton.value())) + MATERIAL_HEI * sin(radians(slopeAngleButton.value()))) / 2, b + (MATERIAL_WID * sin(radians(slopeAngleButton.value())) - MATERIAL_HEI * cos(radians(slopeAngleButton.value()))) / 2 + ARROW_LENGTH);
        arrow(a + (MATERIAL_WID * cos(radians(slopeAngleButton.value())) + MATERIAL_HEI * sin(radians(slopeAngleButton.value()))) / 2, b + (MATERIAL_WID * sin(radians(slopeAngleButton.value())) - MATERIAL_HEI * cos(radians(slopeAngleButton.value()))) / 2 + ARROW_LENGTH, "gravity");
    }
    stroke(255, 0, 0);
    fill(255, 0, 0);
    line(a + (MATERIAL_WID * cos(radians(slopeAngleButton.value())) + MATERIAL_HEI * sin(radians(slopeAngleButton.value()))) / 2 - MATERIAL_HEI / 2 * sin(radians(slopeAngleButton.value())) - MINIMUM_UNIT / 2 * cos(radians(slopeAngleButton.value())), b + (MATERIAL_WID * sin(radians(slopeAngleButton.value())) - MATERIAL_HEI * cos(radians(slopeAngleButton.value()))) / 2 + MATERIAL_HEI / 2 * cos(radians(slopeAngleButton.value())) - MINIMUM_UNIT / 2 * sin(radians(slopeAngleButton.value())), a + (MATERIAL_WID * cos(radians(slopeAngleButton.value())) + MATERIAL_HEI * sin(radians(slopeAngleButton.value()))) / 2 - MATERIAL_HEI / 2 * sin(radians(slopeAngleButton.value())) - MINIMUM_UNIT / 2 * cos(radians(slopeAngleButton.value())) + ARROW_LENGTH * cos(radians(slopeAngleButton.value())) * sin(radians(slopeAngleButton.value())), b + (MATERIAL_WID * sin(radians(slopeAngleButton.value())) - MATERIAL_HEI * cos(radians(slopeAngleButton.value()))) / 2 + MATERIAL_HEI / 2 * cos(radians(slopeAngleButton.value())) - MINIMUM_UNIT / 2 * sin(radians(slopeAngleButton.value())) - ARROW_LENGTH * sq(cos(radians(slopeAngleButton.value()))));
    arrow(a + (MATERIAL_WID * cos(radians(slopeAngleButton.value())) + MATERIAL_HEI * sin(radians(slopeAngleButton.value()))) / 2 - MATERIAL_HEI / 2 * sin(radians(slopeAngleButton.value())) - MINIMUM_UNIT / 2 * cos(radians(slopeAngleButton.value())) + ARROW_LENGTH * cos(radians(slopeAngleButton.value())) * sin(radians(slopeAngleButton.value())), b + (MATERIAL_WID * sin(radians(slopeAngleButton.value())) - MATERIAL_HEI * cos(radians(slopeAngleButton.value()))) / 2 + MATERIAL_HEI / 2 * cos(radians(slopeAngleButton.value())) - MINIMUM_UNIT / 2 * sin(radians(slopeAngleButton.value())) - ARROW_LENGTH * sq(cos(radians(slopeAngleButton.value()))), "normal");
}
function initSettings() {
    count = 0;
    SLOPE_WID = 2 * width / 3;
    GROUND_HEI = 9 * height / 10;
    MATERIAL_WID = width / 12;
    MATERIAL_HEI = height / 8;
    REFERENCE_POINT = (width - SLOPE_WID) / 2;
    MINIMUM_UNIT = width / 100;
    clickedCount = false;
    resetCount = true;
    textSize(2 * MINIMUM_UNIT);
    textAlign(CENTER);
    strokeWeight(5);
}
function slope() {
    fill(255);
    stroke(0);
    triangle(REFERENCE_POINT, GROUND_HEI - SLOPE_WID * tan(radians(slopeAngleButton.value())), REFERENCE_POINT, GROUND_HEI, REFERENCE_POINT + SLOPE_WID, GROUND_HEI);
    fill(0);
    strokeWeight(2);
    text(nf(slopeAngleButton.value(), 1, 1), REFERENCE_POINT + SLOPE_WID - SLOPE_WID / 10, GROUND_HEI - 5);
    noFill();
    strokeWeight(5);
    arc(REFERENCE_POINT + SLOPE_WID, GROUND_HEI, SLOPE_WID / 10, SLOPE_WID / 10, PI, PI + radians(slopeAngleButton.value()));
    line(REFERENCE_POINT + SLOPE_WID, GROUND_HEI, REFERENCE_POINT + SLOPE_WID + 2 * MATERIAL_HEI * sin(radians(slopeAngleButton.value())), GROUND_HEI - 2 * MATERIAL_HEI * cos(radians(slopeAngleButton.value())));
}
class Material {
    constructor(m_w, s) {
        this.materialX = REFERENCE_POINT;
        this.materialY = GROUND_HEI - SLOPE_WID * tan(radians(slopeAngleButton.value()));
        this.materialWeight = m_w;
        this.sort = s;
    }
    _draw() {
        if (clickedCount == true) {
            this.materialX += gravityButton.value() * sin(radians(slopeAngleButton.value())) * cos(radians(slopeAngleButton.value())) * (count / 60);
            this.materialY += gravityButton.value() * sq(sin(radians(slopeAngleButton.value()))) * (count / 60);
        }
        if (this.materialX >= REFERENCE_POINT + SLOPE_WID - ((MATERIAL_WID) * cos(radians(slopeAngleButton.value())))) {
            this.materialX = REFERENCE_POINT + SLOPE_WID - ((MATERIAL_WID) * cos(radians(slopeAngleButton.value())));
            this.materialY = GROUND_HEI - (MATERIAL_WID * sin(radians(slopeAngleButton.value())));
        }
        rectMaterial(this.materialX, this.materialY, this.sort, this.materialWeight);
    }
}
function windowResized() {
    fullScreen();
    initSettings()
    materialSet()
    buttonSettings()
    clickedCount = false;
    resetCount = true;
    startButton.show()
    stopButton.hide()
}
function fullScreen() {
    createCanvas(windowWidth, 8 * windowHeight / 10);
}