var sc;
var x2, x3, x4, x5, y2, y3, y4, y5, p;
var i, n = 100;                     //ボールの個数
var start, reset, change, change0, locus, radr;
let balls = [];

function setup() {
    wscale();
    createCanvas(1500 * sc, 800 * sc);
    background(200);
    translate(500 * sc, 350 * sc);
    noStroke();
    fill(162, 231, 255, 230);
    ellipse(0, 0, 600 * sc, 600 * sc);
    for (i = 0; i < n; i++) {
        balls[i] = new Ball(i);
    }
    initialvalue();
    normalvalue();
    bottans();
    korioribottans();
    kiatubottans();
    numberbottans();
    locusbottans();
    framespeed();
    frameRate(fps);
}

function draw() {
    translate(500 * sc, 350 * sc);
    if (start == true && locus == false) {
        noStroke();
        fill(162, 231, 255, 230);
        ellipse(0, 0, 600 * sc, 600 * sc);

    }

    if (wa == ko) {                                             //コリオリの力あり
        move();
        allspin();
    } else if (wa == 0) {                                           //コリオリの力なし
        notcori();
    }

    for (i = 0; i < n; i++) {

        balls[i].spin();                        //複数のボールを回転させて配置
        balls[i].display();                     //ボールの描写
        balls[i].resetbottan();                 //リセット機能
    }
}

class Ball {
    constructor(radr) {
        this.r = radr;
    }



    spin() {
        rotate(-this.r * 2 * PI / n);
    }

    display() {
        if (start == true) {
            fill(255);
            noStroke();
            ellipse(x, y, 10 * sc, 10 * sc);
            if (locus == false) {
                ellipse(x2, y2, 10 * sc, 10 * sc);
                ellipse(x3, y3, 10 * sc, 10 * sc);
                ellipse(x4, y4, 10 * sc, 10 * sc);
                ellipse(x5, y5, 10 * sc, 10 * sc);
            }
            stroke(0);
            rotate(this.r * 2 * PI / n);
        }
    }

    resetbottan() {      //リセット動作
        if (reset == true) {
            initialvalue();
            normalvalue();
            noStroke();
            fill(162, 231, 255, 255);
            ellipse(0, 0, 600 * sc, 600 * sc);
            fill(162, 231, 255, 230);
            ellipse(0, 0, 600 * sc, 600 * sc);
            kiatubottans();
            korioribottans();
            numberbottans();
            locusbottans();
            framespeed();
        }
    }
}

function wscale() {
    if (windowWidth / 1500 <= windowHeight / 800) {
        sc = windowWidth / 1500;
    }
    if (windowWidth / 1500 > windowHeight / 800) {
        sc = windowHeight / 800;
    }
}

function move() {
    if (start == true) {
        x5 = x4 - (y5 - y4) * cos(w * PI / 180);
        y5 = y4;
        x4 = x3 - (y4 - y3) * cos(w * PI / 180);
        y4 = y3;
        x3 = x2 - (y3 - y2) * cos(w * PI / 180);
        y3 = y2;
        x2 = x - (y2 - y) * cos(w * PI / 180);
        y2 = y;
        if (x > 1 || y > 1 && vy > 0 && change0 == false) {
            w += 0;
            wb = wb + 0.3;
            d = dist(x, y, 0, 0);
            g = ga / d;
            vy = vy;
            y = y - vy * sc;
            if (wb > 1) {
                change0 = true;
                wb = 0;
            }
        }
        else if (x > 1 || y > 1 && vy > 0 && change == true && change0 == true) {                   //初期コリオリ y速度の減少と回転角度の増加


            w += wb;
            wb = wb + 0.1;
            d = dist(x, y, 0, 0);
            g = ga / d;
            vy = vy - g;
            y = y - vy * sc;
            if (w > 40 * p) {
                change = false;
            }
        } else if (x > 30 * sc || y > 30 * sc) {                             //渦巻状に変化後の動作
            w += wb;
            d = dist(x, y, 0, 0);
            g = gb / d;
            vy = vy + g;
            y = y - vy * sc;
        }
        else if (x <= 30 * sc && y <= 30 && locus == false) {
            noStroke();
            fill(162, 231, 255, 230);
            ellipse(0, 0, 600 * sc, 600 * sc);
            fill(162, 231, 255, 230);
            ellipse(0, 0, 600 * sc, 600 * sc);
            normalvalue();
            start = true;
        }
    }
}


function allspin() {
    rotate(-w * PI / 180);
}

function notcori() {
    if (start == true) {
        if (x > 30 * sc || y > 30 * sc) {
            d = dist(x, y, 0, 0);
            g = gb / d;
            vy = vy + g;
            y = y - (vy / 2 * sc);
        }
    }
}

function initialvalue() {  //初期値設定
    n = 16;
    fps = 20;
    ga = 10 * sc;//気圧傾度力
    gb = 50 * sc;
    p = 1;
    ko = 5;
    wa = ko;//コリオリの力
}

function normalvalue() {
    x = 0;
    y = 250 * sc;
    vx = 0;
    vy = 3;
    w = 0;
    d = 0;
    g = 0;
    wb = 0;
    start = false;
    reset = false;
    change = true;
    change0 = false;
    locus = true;
    x2 = 10000;
    x3 = 10000;
    x4 = 10000;
    x5 = 10000;
    y2 = 10000;
    y3 = 10000;
    y4 = 10000;
    y5 = 10000;
}





function bottans() {              //ボタンの生成
    textFont("Meiryo");
    textSize(35 * sc);
    textAlign(CENTER, CENTER);//文字の中央ぞろえ
    resetMatrix();
    stroke(0);
    fill(0, 0, 255);
    ellipse(1225 * sc, 660 * sc, 110 * sc, 110 * sc);//startボタン
    fill(255);
    noStroke();
    text("Start", 1225 * sc, 660 * sc);
    fill(255, 0, 0);
    stroke(0);
    ellipse(1375 * sc, 660 * sc, 110 * sc, 110 * sc);//resetボタン
    fill(255);
    noStroke();
    text("Reset", 1375 * sc, 660 * sc);
    fill(0, 255, 0);
    stroke(0);
    ellipse(1300 * sc, 740 * sc, 100 * sc, 100 * sc);//一時停止ボタン
    fill(0);
    textSize(20 * sc);
    noStroke();
    text("一時停止", 1300 * sc, 740 * sc);
}

function korioribottans() {
    resetMatrix();
    textSize(20 * sc);
    stroke(0);
    fill(255);
    rect(1150 * sc, 500 * sc, 300 * sc, 90 * sc);//コリオリの力ボックス
    fill(0);
    noStroke();
    text("コリオリの力", 1300 * sc, 520 * sc);


    fill(230);
    stroke(0);
    ellipse(1200 * sc, 550 * sc, 60 * sc, 60 * sc);//コリオリの力あり
    fill(0);
    noStroke();
    text("あり", 1200 * sc, 550 * sc);

    fill(230);
    stroke(0);
    ellipse(1400 * sc, 550 * sc, 60 * sc, 60 * sc);//コリオリの力なし
    fill(0);
    noStroke();
    text("なし", 1400 * sc, 550 * sc);
}

function kiatubottans() {
    resetMatrix();
    textSize(20 * sc);
    stroke(0);
    fill(255);
    rect(1150 * sc, 360 * sc, 300 * sc, 120 * sc);//気圧傾度力ボックス
    fill(0);
    noStroke();
    text("気圧傾度力", 1300 * sc, 380 * sc);

    textSize(50 * sc);
    fill(230);
    stroke(0);
    ellipse(1200 * sc, 435 * sc, 80 * sc, 80 * sc);//気圧傾度力小
    fill(0);
    noStroke();
    text("小", 1200 * sc, 435 * sc);

    fill(230);
    stroke(0);
    ellipse(1300 * sc, 435 * sc, 80 * sc, 80 * sc);//気圧傾度力中
    fill(0);
    noStroke();
    text("中", 1300 * sc, 435 * sc);

    fill(230);
    stroke(0);
    ellipse(1400 * sc, 435 * sc, 80 * sc, 80 * sc);//気圧傾度力大
    fill(0);
    noStroke();
    text("大", 1400 * sc, 435 * sc);
}

function numberbottans() { //雲の数
    resetMatrix();
    textSize(20 * sc);
    stroke(0);
    fill(255);
    rect(1150 * sc, 210 * sc, 300 * sc, 140 * sc); //フレーム
    fill(230);
    rect(1225 * sc, 250 * sc, 150 * sc, 40 * sc);  //表示ウィンドウ
    fill(255, 0, 0, 100);
    ellipse(1195 * sc, 320 * sc, 50 * sc, 50 * sc);
    ellipse(1265 * sc, 320 * sc, 50 * sc, 50 * sc);
    fill(0, 0, 255, 100);
    ellipse(1335 * sc, 320 * sc, 50 * sc, 50 * sc);
    ellipse(1405 * sc, 320 * sc, 50 * sc, 50 * sc);

    fill(0);
    textSize(20 * sc);
    noStroke();
    text("雲の数", 1300 * sc, 230 * sc);
    text(n, 1300 * sc, 270 * sc);
    text("組", 1400 * sc, 270 * sc);
    text("-10", 1195 * sc, 320 * sc);
    text("-1", 1265 * sc, 320 * sc);
    text("+1", 1335 * sc, 320 * sc);
    text("+10", 1405 * sc, 320 * sc);
}

function locusbottans() {
    resetMatrix();
    textSize(20 * sc);
    stroke(0);
    fill(255);
    rect(1150 * sc, 110 * sc, 300 * sc, 90 * sc);//軌跡ボックス
    fill(0);
    noStroke();
    text("雲の軌跡", 1300 * sc, 130 * sc);


    fill(230);
    stroke(0);
    ellipse(1200 * sc, 160 * sc, 60 * sc, 60 * sc);//軌跡あり
    fill(0);
    noStroke();
    text("あり", 1200 * sc, 160 * sc);

    fill(230);
    stroke(0);
    ellipse(1400 * sc, 160 * sc, 60 * sc, 60 * sc);//軌跡なし
    fill(0);
    noStroke();
    text("なし", 1400 * sc, 160 * sc);
}

function framespeed() {
    resetMatrix();
    textSize(20 * sc);
    stroke(0);
    fill(255);
    rect(1150 * sc, 10 * sc, 300 * sc, 90 * sc); //フレーム
    fill(230);
    rect(1250 * sc, 20 * sc, 150 * sc, 30 * sc);  //表示ウィンドウ
    fill(255, 0, 0, 100);
    ellipse(1195 * sc, 75 * sc, 40 * sc, 40 * sc);
    ellipse(1265 * sc, 75 * sc, 40 * sc, 40 * sc);
    fill(0, 0, 255, 100);
    ellipse(1335 * sc, 75 * sc, 40 * sc, 40 * sc);
    ellipse(1405 * sc, 75 * sc, 40 * sc, 40 * sc);

    fill(0);
    textSize(18 * sc);
    noStroke();
    text("描画速度", 1200 * sc, 35 * sc);
    text(fps, 1325 * sc, 35 * sc);
    text("fps", 1425 * sc, 35 * sc);
    text("-10", 1195 * sc, 75 * sc);
    text("-1", 1265 * sc, 75 * sc);
    text("+1", 1335 * sc, 75 * sc);
    text("+10", 1405 * sc, 75 * sc);

}



function mousePressed() {    //マウスリック判定
    if (dist(mouseX, mouseY, 1225 * sc, 660 * sc) < 55 * sc) {//start判定
        start = true;
        reset = false;
    }
    if (dist(mouseX, mouseY, 1375 * sc, 660 * sc) < 55 * sc) {//reset判定
        reset = true;
        start = false;
    }
    if (dist(mouseX, mouseY, 1300 * sc, 740 * sc) < 50 * sc) {//一時停止判定
        start = false;
    }

    if (dist(mouseX, mouseY, 1200 * sc, 550 * sc) < 30 * sc) {//コリオリの力あり判定
        ko = 5;
        korioribottans();
        fill(0, 200, 100, 200);
        stroke(0);
        ellipse(1200 * sc, 550 * sc, 60 * sc, 60 * sc);//コリオリの力あり
        fill(0);
        noStroke();
        textSize(20 * sc);
        text("あり", 1200 * sc, 550 * sc);
    }
    if (dist(mouseX, mouseY, 1400 * sc, 550 * sc) < 30 * sc) {//コリオリの力なし判定
        wa = 0;
        korioribottans();
        fill(0, 200, 100, 200);
        stroke(0);
        ellipse(1400 * sc, 550 * sc, 60 * sc, 60 * sc);//コリオリの力なし
        fill(0);
        noStroke();
        textSize(20 * sc);
        text("なし", 1400 * sc, 550 * sc);
    }
    if (dist(mouseX, mouseY, 1200 * sc, 435 * sc) < 40 * sc) {//気圧傾度力小
        ga = 10 * sc;
        gb = 0.1 * sc;
        p = 1.5;

        kiatubottans();
        fill(220, 255, 0, 200);
        stroke(0);
        ellipse(1200 * sc, 435 * sc, 80 * sc, 80 * sc);//気圧傾度力小
        fill(0);
        noStroke();
        textSize(50 * sc);
        text("小", 1200 * sc, 435 * sc);
    }
    if (dist(mouseX, mouseY, 1300 * sc, 435 * sc) < 40 * sc) {//気圧傾度力中
        ga = 10 * sc;
        gb = 50 * sc;
        p = 1;

        kiatubottans();
        stroke(0);
        fill(220, 255, 0, 200);
        ellipse(1300 * sc, 435 * sc, 80 * sc, 80 * sc);//気圧傾度力中
        fill(0);
        textSize(50 * sc);
        noStroke();
        text("中", 1300 * sc, 435 * sc);
    }
    if (dist(mouseX, mouseY, 1400 * sc, 435 * sc) < 40 * sc) {//気圧傾度力大
        ga = 10 * sc;
        gb = 200 * sc;
        p = 0.2;

        kiatubottans();
        stroke(0);
        fill(220, 255, 0, 200);
        ellipse(1400 * sc, 435 * sc, 80 * sc, 80 * sc);//気圧傾度力大
        fill(0);
        textSize(50 * sc);
        noStroke();
        text("大", 1400 * sc, 435 * sc);
    }

    if (dist(mouseX, mouseY, 1195 * sc, 320 * sc) < 25 * sc && n >= 10) {//雲の数変更
        n += -10;
        resetMatrix();
        stroke(0);
        fill(230);
        rect(1225 * sc, 250 * sc, 150 * sc, 40 * sc);
        fill(0);
        textSize(20 * sc);
        noStroke();
        text(n, 1300 * sc, 270 * sc);
        for (i = 0; i < n; i++) {
            balls[i] = new Ball(i);
        }

    }
    if (dist(mouseX, mouseY, 1265 * sc, 320 * sc) < 25 * sc && n >= 1) {
        n += -1;
        resetMatrix();
        stroke(0);
        fill(230);
        rect(1225 * sc, 250 * sc, 150 * sc, 40 * sc);
        fill(0);
        textSize(20 * sc);
        noStroke();
        text(n, 1300 * sc, 270 * sc);
        for (i = 0; i < n; i++) {
            balls[i] = new Ball(i);
        }

    }
    if (dist(mouseX, mouseY, 1335 * sc, 320 * sc) < 25 * sc && n <= 99) {
        n += 1;
        resetMatrix();
        stroke(0);
        fill(230);
        rect(1225 * sc, 250 * sc, 150 * sc, 40 * sc);
        fill(0);
        textSize(20 * sc);
        noStroke();
        text(n, 1300 * sc, 270 * sc);
        for (i = 0; i < n; i++) {
            balls[i] = new Ball(i);
        }

    }
    if (dist(mouseX, mouseY, 1405 * sc, 320 * sc) < 25 * sc && n <= 90) {
        n += 10;
        resetMatrix();
        stroke(0);
        fill(230);
        rect(1225 * sc, 250 * sc, 150 * sc, 40 * sc);
        fill(0);
        textSize(20 * sc);
        noStroke();
        text(n, 1300 * sc, 270 * sc);
        for (i = 0; i < n; i++) {
            balls[i] = new Ball(i);
        }

    }

    if (dist(mouseX, mouseY, 1200 * sc, 160 * sc) < 30 * sc) {//軌跡あり判定
        locus = true;
        locusbottans();
        fill(0, 200, 100, 200);
        stroke(0);
        ellipse(1200 * sc, 160 * sc, 60 * sc, 60 * sc);//コリオリの力あり
        fill(0);
        textSize(20 * sc);
        noStroke();
        text("あり", 1200 * sc, 160 * sc);
    }
    if (dist(mouseX, mouseY, 1400 * sc, 160 * sc) < 30 * sc) {//軌跡なし判定
        locus = false;
        locusbottans();
        stroke(0);
        fill(0, 200, 100, 200);
        ellipse(1400 * sc, 160 * sc, 60 * sc, 60 * sc);//コリオリの力なし
        fill(0);
        textSize(20 * sc);
        noStroke();
        text("なし", 1400 * sc, 160 * sc);
    }

    if (dist(mouseX, mouseY, 1195 * sc, 75 * sc) < 20 * sc && n >= 10) {//描画速度増減
        fps += -10;
        frameRate(fps);
        resetMatrix();
        stroke(0);
        fill(230);
        rect(1250 * sc, 20 * sc, 150 * sc, 30 * sc);
        fill(0);
        textSize(20 * sc);
        noStroke();
        text(fps, 1325 * sc, 35 * sc);
    }
    if (dist(mouseX, mouseY, 1265 * sc, 75 * sc) < 20 * sc && n >= 1) {
        fps += -1;
        frameRate(fps);
        resetMatrix();
        stroke(0);
        fill(230);
        rect(1250 * sc, 20 * sc, 150 * sc, 30 * sc);
        fill(0);
        textSize(20 * sc);
        noStroke();
        text(fps, 1325 * sc, 35 * sc);
    }
    if (dist(mouseX, mouseY, 1335 * sc, 75 * sc) < 20 * sc) {
        fps += 1;
        frameRate(fps);
        resetMatrix();
        stroke(0);
        fill(230);
        rect(1250 * sc, 20 * sc, 150 * sc, 30 * sc);
        fill(0);
        textSize(20 * sc);
        noStroke();
        text(fps, 1325 * sc, 35 * sc);
    }
    if (dist(mouseX, mouseY, 1405 * sc, 75 * sc) < 20 * sc) {
        fps += 10;
        frameRate(fps);
        resetMatrix();
        stroke(0);
        fill(230);
        rect(1250 * sc, 20 * sc, 150 * sc, 30 * sc);
        fill(0);
        textSize(20 * sc);
        noStroke();
        text(fps, 1325 * sc, 35 * sc);
    }
}