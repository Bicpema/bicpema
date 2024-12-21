let raysx,
    raysy,
    raysxy;
let rays_number = 1000;

function preload() {
    raysx = new Array(rays_number);
    raysy = new Array(rays_number);
    raysxy = new Array(rays_number);
}

function fullScreen() {
    createCanvas(windowWidth, 4 * windowHeight / 5, WEBGL)
}

let t;
let count;
let cameraSwitch;
function initSettings() {
    for (let i = 0; i < rays_number; i++) {
        raysx[i] = new Ray(1000 * i / rays_number, 'x');
        raysy[i] = new Ray(1000 * i / rays_number, 'y');
        raysxy[i] = new Wave(1000 * i / rays_number, i);
    }
    t = 0;
    count = true;
    cameraSwitch = "free";
}

let backgroundDiv,
    greenFrequencySliderLabel,
    greenFrequencySlider,
    greenFrequencySliderValue,
    greenDeviationSliderLabel,
    greenDeviationSlider,
    greenDeviationSliderValue,
    redFrequencySliderLabel,
    redFrequencySlider,
    redFrequencySliderValue,
    redDeviationSliderLabel,
    redDeviationSlider,
    redDeviationSliderValue,
    paraCameraButton,
    freeCameraButton,
    switchButton;

function buttonCreation() {
    backgroundDiv = createElement("div")
    greenFrequencySliderLabel = createElement("label", "緑色の波の周波数")
    greenFrequencySlider = createSlider(1, 20, 1);
    greenDeviationSliderLabel = createElement("label", "緑色の波の位相のずれ");
    greenDeviationSlider = createSlider(0, 4, 0);
    redFrequencySliderLabel = createElement("label", "赤色の波の周波数")
    redFrequencySlider = createSlider(1, 20, 1);
    redDeviationSliderLabel = createElement("label", "赤色の波の位相のずれ");
    redDeviationSlider = createSlider(0, 4, 0);
    paraCameraButton = createButton("並行視点");
    freeCameraButton = createButton("自由視点");
    switchButton = createButton("RUN!");
}
function buttonSettings() {
    backgroundDiv.size(width, windowHeight / 5).position(0, 4 * windowHeight / 5).style("background-color", "white")
    greenFrequencySliderLabel.position(0, 0).size(width / 4, windowHeight / 10).parent(backgroundDiv).addClass("bg-success fw-bold").style("font-size", "2rem")
    greenFrequencySlider.position(0, 0).size(width / 4, windowHeight / 10).parent(backgroundDiv)
    greenDeviationSliderLabel.position(0, windowHeight / 10).size(width / 4, windowHeight / 10).parent(backgroundDiv).addClass("bg-success fw-bold").style("font-size", "2rem")
    greenDeviationSlider.position(0, windowHeight / 10).size(width / 4, windowHeight / 10).parent(backgroundDiv)
    redFrequencySliderLabel.position(width / 4, 0).size(width / 4, windowHeight / 10).parent(backgroundDiv).addClass("bg-danger fw-bold").style("font-size", "2rem")
    redFrequencySlider.position(width / 4, 0).size(width / 4, windowHeight / 10).parent(backgroundDiv)
    redDeviationSliderLabel.position(width / 4, windowHeight / 10).size(width / 4, windowHeight / 10).parent(backgroundDiv).addClass("bg-danger fw-bold").style("font-size", "2rem")
    redDeviationSlider.position(width / 4, windowHeight / 10).size(width / 4, windowHeight / 10).parent(backgroundDiv);
    paraCameraButton.position(width - 3 * windowWidth / 6, height).size(windowWidth / 6, windowHeight / 5).mousePressed(paraCameraButtonFunc).addClass("btn btn-secondary").style("font-size", "2rem");
    freeCameraButton.position(width - 2 * windowWidth / 6, height).size(windowWidth / 6, windowHeight / 5).mousePressed(freeCameraButtonFunc).addClass("btn btn-secondary").style("font-size", "2rem");
    switchButton.position(width - windowWidth / 6, height).size(windowWidth / 6, windowHeight / 5).mousePressed(runFunc).addClass("btn btn-secondary").style("font-size", "2rem");
}



let parallelCamera,
    perspectiveCamera;
function cameraCreation() {
    parallelCamera = createCamera()
    perspectiveCamera = createCamera()
}

function cameraSettings() {
    parallelCamera.setPosition(0, 0, 1500)
    parallelCamera.lookAt(0, 0, 0)
    parallelCamera.ortho()
    perspectiveCamera.setPosition(500, -250, 1500)
    perspectiveCamera.lookAt(0, 0, 500)
}

function setup() {
    fullScreen()
    initSettings()
    buttonCreation()
    buttonSettings()
    cameraCreation()
    cameraSettings()
}

function windowResized() {
    fullScreen()
    initSettings()
    buttonSettings()
    cameraCreation()
    cameraSettings()
}

function draw() {
    background(100);
    launcher();
    noStroke();
    for (let i = 0; i < rays_number; i++) {
        raysx[i]._draw();
        raysy[i]._draw();
        raysxy[i]._draw();
    }
    if (count == true) {
        t++
    }
    greenFrequencySliderLabel.html("緑色の波の周波数：" + greenFrequencySlider.value())
    greenDeviationSliderLabel.html("緑色の波の位相のずれ：" + greenDeviationSlider.value() + "×π/4")
    redFrequencySliderLabel.html("赤色の波の周波数：" + redFrequencySlider.value())
    redDeviationSliderLabel.html("赤色の波の位相のずれ：" + redDeviationSlider.value() + "×π/4")
    console.log(cameraSwitch)
    if (cameraSwitch == "free") {
        setCamera(perspectiveCamera)
        orbitControl()
    } else {
        setCamera(parallelCamera)
    }
}
function launcher() {


    noFill()
    stroke(0)
    push();
    rotateY(PI / 2)
    translate(-500, 0, 0)
    box(1000, height, 0);
    pop();

    push();
    rotateY(PI / 2);
    rotateX(PI / 2)
    translate(-500, 0, 0)
    box(1000, height, 0);
    pop()

    fill(0);
    push()
    rotateX(-PI / 2)
    cone(50, 200, 50, 50);
    translate(0, -500, 0)
    cylinder(10, 1000, 100, 100, true, false);
    pop()
}
function runFunc() {
    if (count == true) {
        count = false;
    } else {
        count = true;
    }
}

function freeCameraButtonFunc() {
    cameraSwitch = "free";
}
function paraCameraButtonFunc() {
    cameraSwitch = "para";
}

class Ray {
    constructor(z, d) {
        this.posx = 0;
        this.posy = 0;
        this.posz = z;
        this.direction = d;
    }
    _draw() {
        noFill();
        switch (this.direction) {
            case 'x':
                this.posx = height / 3 * sin(greenFrequencySlider.value() * 2 * PI * (this.posz / 500) + radians(t / redFrequencySlider.value()) + greenDeviationSlider.value() * (PI / 4));
                if (this.posz > 0) {
                    fill(0, 255, 0)
                }
                break;
            case 'y':
                this.posy = height / 3 * sin(redFrequencySlider.value() * 2 * PI * (this.posz / 500) + radians(t / greenFrequencySlider.value()) + redDeviationSlider.value() * (PI / 4));
                if (this.posz > 0) {
                    fill(255, 0, 0)
                }
                break;
        }
        push();
        translate(this.posx, this.posy, this.posz)
        sphere(10);
        pop();
    }
}

class Wave {
    constructor(z, i) {
        this.posx = 0;
        this.posy = 0;
        this.posz = z;
        this.index = i;
    }
    _draw() {
        this.posx = raysx[this.index].posx;
        this.posy = raysy[this.index].posy;
        fill(0, 0, 255)
        push();
        translate(this.posx, this.posy, this.posz)
        sphere(10);
        pop();
    }
}

