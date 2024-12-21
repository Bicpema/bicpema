function fullScreen() {
    let parent = document.getElementById("p5Canvas");
    let canvas = createCanvas(windowWidth, 9 * windowHeight / 10);
    canvas.parent(parent)
}

function preload() {
}

function elCreate() {
}

function elInit() {
}

// 床の大きさ floorLength
let floorLength;
function initValue() {
    floorLength = 2*width/4
    strokeWeight(5)
}

function setup() {
    fullScreen();
    elCreate();
    elInit();
    initValue();
}

function draw() {
    background(255)
    push()
    translate(width/2-floorLength/2,height-2*floorLength/3)
    line(2*floorLength/3,0,2*floorLength/3,2*floorLength/3)
    line(2*floorLength/3,0,floorLength,0)
    pop()
}

function windowResized() {
    fullScreen();
    elInit();
    initValue();
}
