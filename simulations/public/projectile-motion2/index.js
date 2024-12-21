// 全体表示のための関数
function fullScreen() {
    createCanvas(windowWidth, 9 * windowHeight / 10, WEBGL)
}

function elInit() {
}

function initValue() {
    posx = 0
    posy = 0
    posz = 0
    a = 0.05
    sy = 0
    x = []
    y = []
    count = 0
}

// setup関数
function setup() {
    fullScreen()
    elInit()
    initValue()
}

// draw関数
function draw() {
    background(0);
    stroke(255)
    line(-900, -300, 0, 900, -300, 0)
    line(-800, -400, 0, -800, 400, 0)
    ambientLight(50);
    pointLight(255, 255, 255, 1000, 1000, 3000);
    noStroke()
    fill(255, 255, 0);
    push()
    translate(posx - 800, -300 + posy, 0)
    sphere(30);
    pop()
    fill(255)
    push()
    translate(-850, -260, 0)
    box(100, 25, 50)
    pop()
    if (count % 25 == 0) {
        x.push(posx)
        y.push(posy)
    }
    fill(255, 255, 0, 2000);
    for (let i = 0; i < x.length; i++) {
        push()
        translate(x[i] - 800, -300 + y[i], 0)
        noStroke()
        sphere(30);
        pop()
        stroke(255)
        line(-900, -300 + y[i], 0, 900, -300 + y[i], 0)
        line(x[i] - 800, -400, 0, x[i] - 800, 400, 0)
    }
    count++;
    posx += 10
    sy += a
    posy += sy
}


// リサイズされた時の処理
function windowResized() {
    fullScreen()
    elInit()
    initValue()
}