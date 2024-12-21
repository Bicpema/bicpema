var x0, y0, x, y, xx, yy, xr, xr2, xr3, xr4, yr, yr2, yr3, yr4, r, v, vv, vx, vy, s, w, wv, ww, x1, y1, xk, yk, R, d, sc;
var locate, way, start, reset;
function setup() {
    wscale();
    createCanvas(750 * sc, 400 * sc);
    background(150);
    initialvalue();
    bottans();
    spinwaybottans();
    spinspeedbottans();
    speedbottans();
    firstdisplay();
}

function draw() {
    if (start == true) {
        if (d <= r) {
            move();
            display();
        }
    }
    resetbottan();
}

function wscale() {
    if (windowWidth / 750 <= windowHeight / 400) {
        sc = 1 * windowWidth / 750;
    }
    if (windowWidth / 750 > windowHeight / 400) {
        sc = 1 * windowHeight / 400;
    }
}

function initialvalue() {

    x0 = 150 * sc;                        //左側の円の中心x座標
    y0 = 150 * sc;                        //左側の円の中心y座標
    x = 150 * sc;                         //左側直進する球の初期x
    xx = 200 * sc;
    y = 275 * sc;                         //左側直進する球の初期y
    yy = 325 * sc;
    r = 125 * sc;                         //左側円の半径
    xr = x0;                         //左側回転する球の初期x
    yr = r + y0;                       //左側回転する球の初期y

    x1 = 450 * sc;                        //右側円の中心x
    y1 = 150 * sc;                        //右側円の中心y
    xk = x1;                         //右側コリオリ球の初期x
    yk = r + y1;                       //右側コリオリ球の初期y

    vv = 0;                          //表示する速さ
    v = vv / 20;                       //直進する球の速さ
    s = 0;                           //回転角
    wv = 0;                          //表示する回転の速さ
    ww = -1;
    w = ww * wv / 20;                     //回転の速さ
    d = dist(x, y, x0, y0);


    frameRate(20);

    locate = true;
    way = false;
    start = false;
    reset = false;
}

function firstdisplay() {
    fill(255);
    noStroke();
    ellipse(150 * sc, 150 * sc, 2 * r, 2 * r);       //左側の円
    stroke(0);
    ellipse(450 * sc, 150 * sc, 2 * r, 2 * r);       //右側の円
    stroke(255, 0, 0);
    xr = r * sin(0) + x0;                                //台の回転
    yr = r * cos(0) + y0;
    xr2 = r * sin(PI / 2) + x0;
    yr2 = r * cos(PI / 2) + y0;
    xr3 = r * sin(PI) + x0;
    yr3 = r * cos(PI) + y0;
    xr4 = r * sin(3 * PI / 2) + x0;
    yr4 = r * cos(3 * PI / 2) + y0;
    line(xr, yr, x0, y0);              //左側十字
    stroke(0, 0, 255);
    line(xr2, yr2, x0, y0);
    stroke(0, 255, 0);
    line(xr3, yr3, x0, y0);
    stroke(0);
    line(xr4, yr4, x0, y0);
    stroke(0, 0, 255);
    line(x1, y1, x1 + r, y1);           //右側十字
    stroke(0, 255, 0);
    line(x1, y1, x1, y1 - r);
    stroke(0);
    line(x1, y1, x1 - r, y1);
    stroke(255, 0, 0);
    line(x1, y1, x1, y1 + r);
    stroke(0);

    line(x0 - r, 300 * sc, x0 + r, 300 * sc);     //サイズ感
    line(x0 - r, 290 * sc, x0 - r, 310 * sc);
    line(x0 + r, 290 * sc, x0 + r, 310 * sc);
    stroke(0);
    text("500m", x0, 315 * sc);
}

function display() {
    noStroke();
    fill(150);
    rect(0, 0, 300 * sc, 280 * sc);           //左側リセット
    fill(255);
    ellipse(x0, y0, 2 * r, 2 * r);     //新規左円

    stroke(255, 0, 0);
    line(xr, yr, x0, y0);              //左側十字
    stroke(0, 0, 255);
    line(xr2, yr2, x0, y0);
    stroke(0, 255, 0);
    line(xr3, yr3, x0, y0);
    stroke(0);
    line(xr4, yr4, x0, y0);

    ellipse(x, y, 10 * sc, 10 * sc);          //左側直進する球
    ellipse(xk, yk, 10 * sc, 10 * sc);        //右側コリオリによる球の働き

}

function move() {                                       //球の動きの制御
    xr = r * sin(s) + x0;                                //台の回転
    yr = r * cos(s) + y0;
    xr2 = r * sin(s + PI / 2) + x0;
    yr2 = r * cos(s + PI / 2) + y0;
    xr3 = r * sin(s + PI) + x0;
    yr3 = r * cos(s + PI) + y0;
    xr4 = r * sin(s + 3 * PI / 2) + x0;
    yr4 = r * cos(s + 3 * PI / 2) + y0;

    xk = (x - x0) * cos(s) - (y - y0) * sin(s) + x1;              //コリオリの力による球の動きの制御
    yk = (x - x0) * sin(s) + (y - y0) * cos(s) + y1;


    x = x + vx * sc;
    y = y + vy * sc;

    w = ww * wv / 20;
    s = s + w;                                         //回転速度の制御

    d = dist(x, y, x0, y0);
}

function resetbottan() {                            //リセット動作
    if (reset == true) {
        background(150);
        initialvalue();
        bottans();
        spinwaybottans();
        spinspeedbottans();
        speedbottans();
        move();
        firstdisplay();
    }
}

function mousePressed() {                           //マウスクリック判定
    if (locate == true && dist(mouseX, mouseY, x0, y0) <= r) {        //直進する玉スタート地点決定
        x = mouseX;
        y = mouseY;

        fill(255);
        stroke(0);
        ellipse(x, y, 10 * sc, 10 * sc);
        locate = false;
        way = true;
        d = dist(x, y, x0, y0);
    }
    else if (way == true && dist(mouseX, mouseY, x0, y0) <= r) {     //直進する玉の方向性決定
        xx = mouseX;
        yy = mouseY;
        R = dist(xx, yy, x, y);
        v = vv / 20;
        vx = (xx - x) * v / R;
        vy = (yy - y) * v / R;
        stroke(255, 0, 0);
        strokeWeight(4 * sc);
        line((xx - x) * 20 * sc / R + x, (yy - y) * 20 * sc / R + y, x, y);
        translate((xx - x) * 10 * sc / R + x, (yy - y) * 10 * sc / R + y);
        rotate(atan2(yy - y, xx - x) + PI / 2);
        line(5 * sc, 0, 0, -10 * sc);
        line(-5 * sc, 0, 0, -10 * sc);
        stroke(0);
        strokeWeight(1);
        resetMatrix();
        way = false;
    }

    if (dist(mouseX, mouseY, 625 * sc, 300 * sc) < 37 * sc) {//start判定
        start = true;
        reset = false;
    }
    if (dist(mouseX, mouseY, 700 * sc, 300 * sc) < 37 * sc) {//reset判定
        reset = true;
        start = false;
    }
    if (dist(mouseX, mouseY, 662 * sc, 375 * sc) < 32 * sc) {//一時停止判定
        start = false;
    }

    //球の速度変化
    if (dist(mouseX, mouseY, 616 * sc, 105 * sc) < 12 * sc) {
        vv += -10;
        v = vv / 20;
        vx = (xx - x) * v / R;
        vy = (yy - y) * v / R;
        fill(230);
        stroke(0);
        rect(637 * sc, 70 * sc, 50 * sc, 20 * sc);
        fill(0);
        textSize(10 * sc);
        noStroke();
        text(vv, 662 * sc, 80 * sc);
    }
    if (dist(mouseX, mouseY, 647 * sc, 105 * sc) < 12 * sc) {
        vv += -1;
        v = vv / 20;
        vx = (xx - x) * v / R;
        vy = (yy - y) * v / R;
        fill(230);
        stroke(0);
        rect(637 * sc, 70 * sc, 50 * sc, 20 * sc);
        fill(0);
        textSize(10 * sc);
        noStroke();
        text(vv, 662 * sc, 80 * sc);
    }
    if (dist(mouseX, mouseY, 678 * sc, 105 * sc) < 12 * sc) {
        vv += +1;
        v = vv / 20;
        vx = (xx - x) * v / R;
        vy = (yy - y) * v / R;
        fill(230);
        stroke(0);
        rect(637 * sc, 70 * sc, 50 * sc, 20 * sc);
        fill(0);
        textSize(10 * sc);
        noStroke();
        text(vv, 662 * sc, 80 * sc);
    }
    if (dist(mouseX, mouseY, 709 * sc, 105 * sc) < 12 * sc) {
        vv += +10;
        v = vv / 20;
        vx = (xx - x) * v / R;
        vy = (yy - y) * v / R;
        fill(230);
        stroke(0);
        rect(637 * sc, 70 * sc, 50 * sc, 20 * sc);
        fill(0);
        textSize(10 * sc);
        noStroke();
        text(vv, 662 * sc, 80 * sc);
    }

    //回転速度の変化
    if (dist(mouseX, mouseY, 616 * sc, 185 * sc) < 12 * sc) {
        wv += -1;
        fill(230);
        stroke(0);
        rect(637 * sc, 150 * sc, 50 * sc, 20 * sc);
        fill(0);
        textSize(10 * sc);
        noStroke();
        text(wv, 662 * sc, 160 * sc);
    }
    if (dist(mouseX, mouseY, 647 * sc, 185 * sc) < 12 * sc) {
        wv += -0.1;
        wv *= 10;
        wv = Math.round(wv);
        wv /= 10;
        fill(230);
        stroke(0);
        rect(637 * sc, 150 * sc, 50 * sc, 20 * sc);
        fill(0);
        noStroke();
        textSize(10 * sc);
        text(wv, 662 * sc, 160 * sc);
    }
    if (dist(mouseX, mouseY, 678 * sc, 185 * sc) < 12 * sc) {
        wv += +0.1;
        wv *= 10;
        wv = Math.round(wv);
        wv /= 10;
        fill(230);
        fill(230);
        stroke(0);
        rect(637 * sc, 150 * sc, 50 * sc, 20 * sc);
        fill(0);
        noStroke();
        textSize(10 * sc);
        text(wv, 662 * sc, 160 * sc);
    }
    if (dist(mouseX, mouseY, 709 * sc, 185 * sc) < 12 * sc) {
        wv += +1;
        fill(230);
        stroke(0);
        rect(637 * sc, 150 * sc, 50 * sc, 20 * sc);
        fill(0);
        textSize(10 * sc);
        noStroke();
        text(wv, 662 * sc, 160 * sc);
    }

    //回転方向の決定
    if (605 * sc <= mouseX && mouseX <= 655 * sc && 222 * sc <= mouseY && mouseY <= 247 * sc) {
        ww = -1;
        spinwaybottans();
        fill(0, 255, 0, 100);
        stroke(0);
        rect(605 * sc, 222 * sc, 50 * sc, 25 * sc);
        fill(0);
        textSize(10 * sc);
        noStroke();
        text("時計回り", 630 * sc, 235 * sc);
    }
    if (670 * sc <= mouseX && mouseX <= 720 * sc && 222 * sc <= mouseY && mouseY <= 247 * sc) {
        ww = 1;
        spinwaybottans();
        fill(0, 255, 0, 100);
        stroke(0);
        rect(670 * sc, 222 * sc, 50 * sc, 25 * sc);
        fill(0);
        textSize(10 * sc);
        noStroke();
        text("反時計回り", 695 * sc, 235 * sc);
    }

}

function bottans() {              //ボタンの生成
    textFont("Meiryo");
    textSize(20 * sc);
    stroke(0);
    textAlign(CENTER, CENTER);//文字の中央ぞろえ
    fill(0, 0, 255);
    ellipse(625 * sc, 300 * sc, 75 * sc, 75 * sc);//startボタン
    fill(255);
    noStroke();
    text("Start", 625 * sc, 300 * sc);
    fill(255, 0, 0);
    stroke(0);
    ellipse(700 * sc, 300 * sc, 75 * sc, 75 * sc);//resetボタン
    fill(255);
    noStroke();
    text("Reset", 700 * sc, 300 * sc);
    fill(0, 255, 0);
    stroke(0);
    ellipse(662 * sc, 360 * sc, 65 * sc, 65 * sc);//一時停止ボタン
    textSize(15 * sc);
    fill(255);
    noStroke();
    text("一時停止", 662 * sc, 360 * sc);
    fill(0);
    text("静止系から見た球の動き", x0, y0 + 200 * sc);
    text("回転系から見た球の軌跡", x1, y1 + 200 * sc);

}

function spinwaybottans() {                     //回転方向のボタン
    stroke(0);
    fill(255);
    rect(600 * sc, 205 * sc, 125 * sc, 45 * sc);
    fill(230);
    rect(605 * sc, 222 * sc, 50 * sc, 25 * sc);
    rect(670 * sc, 222 * sc, 50 * sc, 25 * sc);
    fill(0);
    noStroke();
    textSize(10 * sc);
    text("回転方向", 662 * sc, 212 * sc);
    text("時計回り", 630 * sc, 235 * sc);
    text("反時計回り", 695 * sc, 235 * sc);
}

function spinspeedbottans() {                 //回転速度のボタン
    stroke(0);
    fill(255);
    rect(600 * sc, 130 * sc, 125 * sc, 70 * sc);
    fill(230);
    rect(637 * sc, 150 * sc, 50 * sc, 20 * sc);
    fill(255, 0, 0, 100);
    ellipse(616 * sc, 185 * sc, 25 * sc, 25 * sc);
    ellipse(647 * sc, 185 * sc, 25 * sc, 25 * sc);
    fill(0, 0, 255, 100);
    ellipse(678 * sc, 185 * sc, 25 * sc, 25 * sc);
    ellipse(709 * sc, 185 * sc, 25 * sc, 25 * sc);
    fill(0);
    textSize(10 * sc);
    noStroke();
    text("回転速度", 662 * sc, 140 * sc);
    text(wv, 662 * sc, 160 * sc);
    text("rad/s", 705 * sc, 160 * sc);
    text("-1", 616 * sc, 185 * sc);
    text("-0,1", 647 * sc, 185 * sc);
    text("+0,1", 678 * sc, 185 * sc);
    text("+1", 709 * sc, 185 * sc);
}

function speedbottans() {                       //球の速度
    stroke(0);
    fill(255);
    rect(600 * sc, 50 * sc, 125 * sc, 70 * sc);
    fill(230);
    rect(637 * sc, 70 * sc, 50 * sc, 20 * sc);
    fill(255, 0, 0, 100);
    ellipse(616 * sc, 105 * sc, 25 * sc, 25 * sc);
    ellipse(647 * sc, 105 * sc, 25 * sc, 25 * sc);
    fill(0, 0, 255, 100);
    ellipse(678 * sc, 105 * sc, 25 * sc, 25 * sc);
    ellipse(709 * sc, 105 * sc, 25 * sc, 25 * sc);
    fill(0);
    textSize(10 * sc);
    noStroke();
    text("球の速度", 662 * sc, 60 * sc);
    text(vv, 662 * sc, 80 * sc);
    text("m/s", 705 * sc, 80 * sc);
    text("-10", 616 * sc, 105 * sc);
    text("-1", 647 * sc, 105 * sc);
    text("+1", 678 * sc, 105 * sc);
    text("+10", 709 * sc, 105 * sc);
}