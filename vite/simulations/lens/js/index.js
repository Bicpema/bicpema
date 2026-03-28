//画像のオブジェクト
let headImg,
    convexLensImg,
    concaveLensImg,
    candleImg,
    fImg,
    ledImg;

//画像の読み込み
function preload() {
    headImg = loadImage("../../assets/img/headImg.png");
    convexLensImg = loadImage("../../assets/img/convexLensImg.png");
    concaveLensImg = loadImage("../../assets/img/concaveLensImg.png")
    candleImg = loadImage("../../assets/img/candleImg.png");
    fImg = loadImage("../../assets/img/fImg.png");
    ledImg = loadImage("../../assets/img/ledImg.png");
}

//フルスクリーン
function fullScreen() {
    createCanvas(windowWidth, 9*windowHeight/10, P2D);
}

//ボタン
let objectXSlider,
    screenXSlider,
    focusLengthSlider,
    lensSelect,
    objectSelect;

//ボタンの生成
function buttonCreation() {
    objectXSlider = createSlider(0, 4 * width / 10, 0)
    screenXSlider = createSlider(0, 4 * width / 10, 4 * width / 10)
    focusLengthSlider = createSlider(0, 4 * width / 10, 2 * width / 10)
    lensSelect = createSelect()
    lensOptionArr = ["凸レンズ", "凹レンズ", "半分の凸レンズ", "縞々のスリットの凸レンズ"]
    for (let i = 0; i < lensOptionArr.length; i++)lensSelect.option(lensOptionArr[i])
    objectSelect = createSelect()
    objectOptionArr = ["F", "LED", "ろうそく"]
    for (let i = 0; i < objectOptionArr.length; i++)objectSelect.option(objectOptionArr[i])
}
//ボタンの初期設定
function buttonSettings() {
    objectXSlider.size(4 * width / 10, 2).position(width / 10, windowHeight/10+3 * height / 4).attribute("max", 4 * width / 10)
    screenXSlider.size(4 * width / 10, 2).position(width / 2, windowHeight/10+3 * height / 4).attribute("max", 4 * width / 10)
    focusLengthSlider.size(4 * width / 10, 2).position(width / 10, windowHeight/10+6 * height / 10).attribute("max", 4 * width / 10)
    lensSelect.size(4 * width / 10, height / 16).position(width / 10, windowHeight-height/16)
    objectSelect.size(4 * width / 10, height / 16).position(width / 2, windowHeight-height/16)
}

//変数の設定
let lensWidth,
    lensHeight,
    screenWidth,
    screenHeight,
    objectY,
    blurValue,
    imgWidth,
    imgHeight,
    pg;

//初期設定
function initSettings() {
    lensWidth = width / 48;
    lensHeight = 7 * lensWidth;
    screenWidth = lensWidth / 3;
    screenHeight = lensHeight;
    headImg.resize(width / 10, 0);
    convexLensImg.resize(lensWidth, lensHeight);
    concaveLensImg.resize(lensWidth, lensHeight);
    candleImg.resize(0, height / 8);
    fImg.resize(0, height / 8);
    ledImg.resize(0, height / 8);
    objectY = height / 2 - candleImg.height;
    blurValue = 0;
    imgWidth = fImg.width;
    imgHeight = fImg.height;
    pg = createGraphics(screenHeight, screenHeight / 2); pg = createGraphics(screenHeight, screenHeight / 2);
    noFill();
    stroke(255);
    strokeWeight(3);
    textSize(width / 75);
    textAlign(CENTER, CENTER);
}


//setup関数
function setup() {
    fullScreen();
    buttonCreation()
    initSettings()
    buttonSettings()
}

//方眼の描画
function gridDraw() {

    //背景色
    background(0);

    //焦点の線の描画
    stroke(255, 255)
    line(width / 2 - (4 * width / 10 - focusLengthSlider.value()), height / 2 - 30, width / 2 - (4 * width / 10 - focusLengthSlider.value()), height / 2 + 30);
    line(width / 2 + (4 * width / 10 - focusLengthSlider.value()), height / 2 - 30, width / 2 + (4 * width / 10 - focusLengthSlider.value()), height / 2 + 30);

    //背景方眼の描画
    strokeWeight(3)
    //水平方向の軸
    line(width / 10, height / 2, 9 * width / 10, height / 2);
    //垂直方向の軸
    line(width / 10, height / 4, width / 10, height / 2)

    //水平方向の方眼
    for (let i = 0; i <= 75; i++) {
        if (i % 5 == 0) {
            noStroke()
            text(15 - i / 5, (width / 2 - width / 10) * i / 75 + width / 10, height / 2 + width / 75)
            text(i / 5, (width / 2 - width / 10) * i / 75 + width / 2, height / 2 + width / 75)
            stroke(255, 100)
            strokeWeight(1);
        } else {
            strokeWeight(0.5)
        }
        line((width / 2 - width / 10) * i / 75 + width / 10, height / 4, (width / 2 - width / 10) * i / 75 + width / 10, height / 2)
        line((width / 2 - width / 10) * i / 75 + width / 2, height / 4, (width / 2 - width / 10) * i / 75 + width / 2, height / 2)
    }

    //垂直方向の方眼
    for (let i = 0; i <= 20; i++) {
        if (i % 5 == 0) {
            noStroke()
            text(i / 5, width / 10 - width / 75, height / 2 - height / 4 * i / 20)
            stroke(255, 100)
            strokeWeight(1)
        } else {
            strokeWeight(0.5)
        }
        line(width / 10, height / 2 - height / 4 * i / 20, 9 * width / 10, height / 2 - height / 4 * i / 20)
    }
    stroke(255, 255)
}

//レンズの描画
function lensDraw() {
    if (lensSelect.value() == "凸レンズ") {
        image(convexLensImg, width / 2 - lensWidth / 2, height / 2 - lensHeight / 2);
    }
    else if (lensSelect.value() == "凹レンズ") {
        image(concaveLensImg, width / 2 - lensWidth / 2, height / 2 - lensHeight / 2);
    }
    else if (lensSelect.value() == "半分の凸レンズ") {
        image(convexLensImg, width / 2 - lensWidth / 2, height / 2 - lensHeight / 2);
    }
    else if (lensSelect.value() == "縞々のスリットの凸レンズ") {
        image(convexLensImg, width / 2 - lensWidth / 2, height / 2 - lensHeight / 2);
    }
}

//土台の描画
function baseDraw() {
    fill(0)
    rect(width / 10, 3 * height / 4, 4 * width / 5, height / 4)
    line(objectXSlider.value() + width / 10, height / 2, objectXSlider.value() + width / 10, 3 * height / 4);
    rect(objectXSlider.value() - 25 + width / 10, 3 * height / 4 - 25, 50, 25);
}

//点線の手続き
function dashedLine(aX, aY, bX, bY) {
    drawingContext.setLineDash([5, 5]);
    line(aX, aY, bX, bY);
    drawingContext.setLineDash([]);
}

//光線の描画
function opticalPathDisplay(img) {

    //変数の設定
    let a = 4 * width / 10 - objectXSlider.value(),
        b,
        m,
        theta_1,
        theta_2;

    //凸レンズの場合
    if (lensSelect.value() == "凸レンズ") {
        if (a > (4 * width / 10 - focusLengthSlider.value())) {
            b = a * (4 * width / 10 - focusLengthSlider.value()) / (a - (4 * width / 10 - focusLengthSlider.value()));
            m = b / a;
            theta_1 = atan((img.height * m + img.height) / b);
            theta_2 = atan(img.height / a);
            line(objectXSlider.value() + width / 10, objectY, width / 2, objectY);
            line(width / 2, objectY, width - headImg.width, objectY + (width / 2 - headImg.width) * tan(theta_1));
            let theta_3 = atan((img.height / 2 + img.height * m) / b);
            line(objectXSlider.value() + width / 10, objectY, width / 2, objectY + img.height / 2);
            line(width / 2, objectY + img.height / 2, width - headImg.width, (width / 2 - headImg.width) * tan(theta_3) + objectY + img.height / 2);
            line(objectXSlider.value() + width / 10, objectY, width - headImg.width, objectY + (a + width / 2 - headImg.width) * tan(theta_2));
            let theta_4 = atan((img.height * m - img.height / 2) / b);
            line(objectXSlider.value() + width / 10, objectY, width / 2, height / 2 + img.height / 2);
            line(width / 2, height / 2 + img.height / 2, width - headImg.width, (width / 2 - headImg.width) * tan(theta_4) + height / 2 + img.height / 2);
            if (img.height * m < lensHeight / 2) {
                line(objectXSlider.value() + width / 10, objectY, width / 2, height / 2 + img.height * m);
                line(width / 2, height / 2 + img.height * m, width - headImg.width, height / 2 + img.height * m);
            }
        }
        if (a <= (4 * width / 10 - focusLengthSlider.value())) {
            b = a * (4 * width / 10 - focusLengthSlider.value()) / ((4 * width / 10 - focusLengthSlider.value()) - a);
            m = b / a;
            theta_1 = atan(img.height / (4 * width / 10 - focusLengthSlider.value()));
            theta_2 = atan(img.height / a);
            dashedLine(headImg.width, height / 2 - (width / 2 - headImg.width) * tan(theta_1) - img.height, width / 2, objectY);
            dashedLine(headImg.width, height / 2 - (width / 2 - headImg.width) * tan(theta_2), objectXSlider.value() + width / 10, objectY);
            line(objectXSlider.value() + width / 10, objectY, width / 2, objectY);
            line(width / 2, objectY, width - headImg.width, objectY + (width / 2 - headImg.width) * tan(theta_1));
            line(objectXSlider.value() + width / 10, objectY, width - headImg.width, objectY + (a + width / 2 - headImg.width) * tan(theta_2));
        }
    }

    //凹レンズの場合
    if (lensSelect.value() == "凹レンズ") {
        b = a * (4 * width / 10 - focusLengthSlider.value()) / (a + (4 * width / 10 - focusLengthSlider.value()));
        m = b / a;
        theta_1 = atan(img.height / (4 * width / 10 - focusLengthSlider.value()));
        theta_2 = atan(img.height * m / (4 * width / 10 - focusLengthSlider.value()));
        line(objectXSlider.value() + width / 10, objectY, width / 2, objectY);
        dashedLine(width / 2 - (4 * width / 10 - focusLengthSlider.value()), height / 2, width / 2, height / 2 - ((4 * width / 10 - focusLengthSlider.value())) * tan(theta_1));
        line(width / 2, objectY, width - headImg.width, height / 2 - (width / 2 - headImg.width) * tan(theta_1) - img.height);
        line(objectXSlider.value() + width / 10, objectY, width / 2, height / 2 - img.height * m);
        line(width / 2, height / 2 - img.height * m, width - headImg.width, height / 2 - img.height * m);
        dashedLine(width / 2 - b, height / 2 - img.height * m, width / 2, height / 2 - img.height * m);
        dashedLine(width / 2, height / 2 - img.height * m, width - headImg.width, height / 2 + (width / 2 - headImg.width) * tan(theta_2) - img.height * m);
        let theta_3 = atan(img.height / a);
        line(objectXSlider.value() + width / 10, objectY, width - headImg.width, height / 2 + (width / 2 - headImg.width) * tan(theta_3));
    }

    //半分の凸レンズの場合
    if (lensSelect.value() == "半分の凸レンズ") {
        if (a > focusLengthSlider.value()) {
            b = a * (4 * width / 10 - focusLengthSlider.value()) / (a - (4 * width / 10 - focusLengthSlider.value()));
            m = b / a;
            theta_1 = atan((img.height * m + img.height) / b);
            theta_2 = atan(img.height / a);
            line(objectXSlider.value() + width / 10, objectY, width / 2, objectY);
            line(width / 2, objectY, width - headImg.width, objectY + (width / 2 - headImg.width) * tan(theta_1));
            let theta_3 = atan((img.height / 2 + img.height * m) / b);
            line(objectXSlider.value() + width / 10, objectY, width / 2, objectY + img.height / 2);
            line(width / 2, objectY + img.height / 2, width - headImg.width, (width / 2 - headImg.width) * tan(theta_3) + objectY + img.height / 2);
            line(objectXSlider.value() + width / 10, objectY, width - headImg.width, objectY + (a + width / 2 - headImg.width) * tan(theta_2));
            line(objectXSlider.value() + width / 10, objectY, width / 2, height / 2 + img.height / 2);
            if (img.height * m < lensHeight / 2) {
                line(objectXSlider.value() + width / 10, objectY, width / 2, height / 2 + img.height * m);
            }
        }
        if (a <= focusLengthSlider.value()) {
            b = a * focusLengthSlider.value() / (focusLengthSlider.value() - a);
            m = b / a;
            theta_1 = atan(img.height / focusLengthSlider.value());
            theta_2 = atan(img.height / a);
            dashedLine(headImg.width, height / 2 - (width / 2 - headImg.width) * tan(theta_1) - img.height, width / 2, objectY);
            dashedLine(headImg.width, height / 2 - (width / 2 - headImg.width) * tan(theta_2), objectXSlider.value() + width / 10, objectY);
            line(objectXSlider.value() + width / 10, objectY, width / 2, objectY);
            line(width / 2, objectY, width - headImg.width, objectY + (width / 2 - headImg.width) * tan(theta_1));
            line(objectXSlider.value() + width / 10, objectY, width - headImg.width, objectY + (a + width / 2 - headImg.width) * tan(theta_2));
        }
        fill(100);
        stroke(100);
        rect(width / 2 - lensWidth / 2, height / 2, lensWidth / 2, lensHeight / 2);
        stroke(255);
    }

    //縞々のスリットを入れた凸レンズの場合
    if (lensSelect.value() == "縞々のスリットの凸レンズ") {
        if (a > (4 * width / 10 - focusLengthSlider.value())) {
            b = a * (4 * width / 10 - focusLengthSlider.value()) / (a - (4 * width / 10 - focusLengthSlider.value()));
            m = b / a;
            theta_1 = atan((img.height * m + img.height) / b);
            theta_2 = atan(img.height / a);
            line(objectXSlider.value() + width / 10, objectY, width / 2, objectY);
            let theta_3 = atan((img.height / 2 + img.height * m) / b);
            line(objectXSlider.value() + width / 10, objectY, width / 2, objectY + img.height / 2);
            line(width / 2, objectY + img.height / 2, width - headImg.width, (width / 2 - headImg.width) * tan(theta_3) + objectY + img.height / 2);
            line(objectXSlider.value() + width / 10, objectY, width / 2, height / 2);
            let theta_4 = atan((img.height * m - img.height / 2) / b);
            line(objectXSlider.value() + width / 10, objectY, width / 2, height / 2 + img.height / 2);
            line(width / 2, height / 2 + img.height / 2, width - headImg.width, (width / 2 - headImg.width) * tan(theta_4) + height / 2 + img.height / 2);
            if (img.height * m < lensHeight / 2) {
                line(objectXSlider.value() + width / 10, objectY, width / 2, height / 2 + img.height * m);
                if (height / 2 + img.height * m < height / 2 + candleImg.height - lensHeight / 12 || height / 2 + img.height * m > height / 2 + candleImg.height + lensHeight / 12) {
                    line(width / 2, height / 2 + img.height * m, width - headImg.width, height / 2 + img.height * m);
                }
            }
        }
        if (a <= (4 * width / 10 - focusLengthSlider.value())) {
            b = a * (4 * width / 10 - focusLengthSlider.value()) / ((4 * width / 10 - focusLengthSlider.value()) - a);
            m = b / a;
            theta_1 = atan(img.height / (4 * width / 10 - focusLengthSlider.value()));
            theta_2 = atan(img.height / a);
            dashedLine(headImg.width, height / 2 - (width / 2 - headImg.width) * tan(theta_1) - img.height, width / 2, objectY);
            dashedLine(headImg.width, height / 2 - (width / 2 - headImg.width) * tan(theta_2), objectXSlider.value() + width / 10, objectY);
            line(objectXSlider.value() + width / 10, objectY, width / 2, objectY);
            line(width / 2, objectY, width - headImg.width, objectY + (width / 2 - headImg.width) * tan(theta_1));
            line(objectXSlider.value() + width / 10, objectY, width - headImg.width, objectY + (a + width / 2 - headImg.width) * tan(theta_2));
        }
        fill(100);
        stroke(100);
        rect(width / 2 - lensWidth / 2, height / 2 - lensHeight / 12, lensWidth / 2, lensHeight / 6);
        rect(width / 2 - lensWidth / 2, height / 2 - candleImg.height - lensHeight / 12, lensWidth / 2, lensHeight / 6);
        rect(width / 2 - lensWidth / 2, height / 2 + candleImg.height - lensHeight / 12, lensWidth / 2, lensHeight / 6);
        stroke(255);
    }
}

//物体と虚像の描画
function objectAndVirtualImageDisplay(img) {

    //変数の設定
    let a = 4 * width / 10 - objectXSlider.value();
    let b;
    let m;

    //物体の描画
    noFill();
    image(img, objectXSlider.value() - img.width / 2 + width / 10, objectY);
    stroke(255, 0, 0);
    rect(objectXSlider.value() - img.width / 2 + width / 10, objectY, img.width, img.height);
    noStroke()
    fill(255)
    text("レンズからの距離:" + str((15 * (1 - objectXSlider.value() / (4 * width / 10))).toFixed(1)) + " cm", objectXSlider.value() + width / 10, 3 * height / 4 + 1.5*width / 75)
    stroke(255);
    noFill();

    //虚像の描画

    //凸レンズの場合
    if (lensSelect.value() == "凸レンズ") {
        if (a <= (4 * width / 10 - focusLengthSlider.value())) {
            b = a * (4 * width / 10 - focusLengthSlider.value()) / ((4 * width / 10 - focusLengthSlider.value()) - a);
            m = b / a;
            image(img, width / 2 - b - img.width * m / 2, height / 2 - img.height * m, img.width * m, img.height * m);
            stroke(0, 0, 255);
            stroke(255);
            push();
            translate(width - headImg.width, height / 2 - img.height + (width / 2 - headImg.width) * tan(atan(img.height / (4 * width / 10 - focusLengthSlider.value()))));
            rotate(PI / 10);
            image(headImg, 0, 0);
            pop();
        }
    }

    //凹レンズの場合
    if (lensSelect.value() == "凹レンズ") {
        b = a * (4 * width / 10 - focusLengthSlider.value()) / (a + (4 * width / 10 - focusLengthSlider.value()));
        m = b / a;
        image(img, width / 2 - b - img.width * m / 2, height / 2 - img.height * m, img.width * m, img.height * m);
        stroke(0, 0, 255);
        rect(width / 2 - b - img.width * m / 2, height / 2 - img.height * m, img.width * m, img.height * m);
        stroke(255);
        push();
        translate(width - headImg.width, height / 2 - (width / 2 - headImg.width) * tan(atan(img.height / (4 * width / 10 - focusLengthSlider.value()))) - img.height);
        rotate(-PI / 10);
        image(headImg, 0, 0);
        pop();
    }

    //半分の凸レンズの場合
    if (lensSelect.value() == "半分の凸レンズ") {
        if (a <= (4 * width / 10 - focusLengthSlider.value())) {
            b = a * (4 * width / 10 - focusLengthSlider.value()) / ((4 * width / 10 - focusLengthSlider.value()) - a);
            m = b / a;
            image(img, width / 2 - b - img.width * m / 2, height / 2 - img.height * m, img.width * m, img.height * m);
            stroke(0, 0, 255);
            rect(width / 2 - b - img.width * m / 2, height / 2 - img.height * m, img.width * m, img.height * m);
            stroke(255);
            push();
            translate(width - headImg.width, height / 2 - img.height + (width / 2 - headImg.width) * tan(atan(img.height / (4 * width / 10 - focusLengthSlider.value()))));
            rotate(PI / 10);
            image(headImg, 0, 0);
            pop();
        }
    }

    //縞々の凸レンズの場合
    if (lensSelect.value() == "縞々のスリットの凸レンズ") {
        if (a <= (4 * width / 10 - focusLengthSlider.value())) {
            b = a * (4 * width / 10 - focusLengthSlider.value()) / ((4 * width / 10 - focusLengthSlider.value()) - a);
            m = b / a;
            image(img, width / 2 - b - img.width * m / 2, height / 2 - img.height * m, img.width * m, img.height * m);
            stroke(0, 0, 255);
            rect(width / 2 - b - img.width * m / 2, height / 2 - img.height * m, img.width * m, img.height * m);
            stroke(255);
            push();
            translate(width - headImg.width, height / 2 - img.height + (width / 2 - headImg.width) * tan(atan(img.height / (4 * width / 10 - focusLengthSlider.value()))));
            rotate(PI / 10);
            image(headImg, 0, 0);
            pop();
        }
    }
}

//スクリーンの描画
function screenDisplay(img) {
    let a = 4 * width / 10 - objectXSlider.value();
    let b = a * (4 * width / 10 - focusLengthSlider.value()) / (a - (4 * width / 10 - focusLengthSlider.value()));
    let m = b / a;
    fill(255)
    noStroke()
    text("レンズからの距離:" + str((15 * (screenXSlider.value() / (4 * width / 10))).toFixed(1)) + " cm", screenXSlider.value() + 5 * width / 10, 3 * height / 4 + 1.5*width / 75)
    stroke(255)
    if (lensSelect.value() != "凹レンズ") {
        if (a > (4 * width / 10 - focusLengthSlider.value())) {
            blurValue = map(abs(b - screenXSlider.value()), screenXSlider.value(), 0, 10, 0);
            if (abs(blurValue) > 10) {
                blurValue = 10;
            }
            // beginDraw() and endDraw() is not supportet in p5.js, and or often not needed;
            pg.background(0);
            pg.push();
            pg.translate(screenHeight / 2 - img.width * m / 2, 0);
            pg.scale(-1, -1);
            if (lensSelect.value() == "半分の凸レンズ") {
                pg.tint(255, 100);
            }
            if (lensSelect.value() == "縞々のスリットの凸レンズ") {
                pg.tint(255, 75);
                if (height / 2 + img.height * m < height / 2 + candleImg.height - lensHeight / 12 || height / 2 + img.height * m > height / 2 + candleImg.height + lensHeight / 12) {
                    pg.tint(255, 100);
                }
            }
            pg.image(img, -img.width * m, -img.height * m, img.width * m, img.height * m);
            pg.tint(255, 255);
            pg.pop();
            pg.filter(BLUR, abs(blurValue));
            // beginDraw() and endDraw() is not supportet in p5.js, and or often not needed;
            image(pg, screenXSlider.value() + width / 2 - screenHeight / 2 + screenWidth / 2, height / 2 - screenHeight - 10);
            noFill();
            stroke(0, 255, 0);
            rect(screenXSlider.value() + width / 2 - screenHeight / 2 + screenWidth / 2, height / 2 - 3 * screenHeight / 2 - 10, screenHeight, screenHeight);
            stroke(255);
            dashedLine(screenXSlider.value() + width / 2 - screenHeight / 2 + screenWidth / 2, height / 2 - screenHeight - 10, screenXSlider.value() + width / 2 + screenHeight / 2 + screenWidth / 2, height / 2 - screenHeight - 10);
            fill(255, 150);
            rect(screenXSlider.value() + width / 2, height / 2 - screenHeight / 2, screenWidth, screenHeight);
            stroke(0, 255, 0);
            line(screenXSlider.value() + width / 2, height / 2 - screenHeight / 2, screenXSlider.value() + width / 2, height / 2 + screenHeight / 2);
            stroke(255);
            line(screenXSlider.value() + width / 2, height / 2 + lensHeight / 2, screenXSlider.value() + width / 2, 3 * height / 4);
            fill(100);
            rect(screenXSlider.value() + width / 2 - 25, 3 * height / 4 - 25, 50, 25);
            strokeWeight(1);
            fill(255);
            for (let i = 0; i <= (screenHeight / 2 / (height / (4 * 20))); i++) {
                if (i % 5 == 0) {
                    stroke(255, 255);
                    line(screenXSlider.value() + width / 2 - screenHeight / 2 + screenWidth / 2, height / 2 - screenHeight + (height / (4 * 20)) * i - 10, screenXSlider.value() + width / 2 + screenHeight / 2 + screenWidth / 2 + 7, height / 2 - screenHeight + + (height / (4 * 20)) * i - 10);
                    stroke(255, 50);
                    line(screenXSlider.value() + width / 2 - screenHeight / 2 + screenWidth / 2, height / 2 - screenHeight + (height / (4 * 20)) * i - 10, screenXSlider.value() + width / 2 + screenHeight / 2 + screenWidth / 2, height / 2 - screenHeight + (height / (4 * 20)) * i - 10);
                    text(i / 5, screenXSlider.value() + width / 2 + screenHeight / 2 + screenWidth / 2 + width / 50, height / 2 - screenHeight + (height / (4 * 20)) * i - 10);
                }
                stroke(255, 50);
                line(screenXSlider.value() + width / 2 - screenHeight / 2 + screenWidth / 2, height / 2 - screenHeight + (height / (4 * 20)) * i - 10, screenXSlider.value() + width / 2 + screenHeight / 2 + screenWidth / 2, height / 2 - screenHeight + (height / (4 * 20)) * i - 10);
            }
            strokeWeight(3);
            stroke(255, 0, 0);
            noFill();
            rect(screenXSlider.value() + width / 2 + screenWidth / 2 - img.width / 2, height / 2 - screenHeight - 10, img.width, img.height);
            stroke(255, 255);
        }
    }
}

//焦点の描画
function focusDraw(img) {
    tint(255, 255);
    fill(255, 255);
    noStroke();
    text("focus", width / 2 - (4 * width / 10 - focusLengthSlider.value()), height / 2 + width / 50 + 1.5*width / 75);
    text("焦点距離:" + str(map(4 * width / 10 - focusLengthSlider.value(), 4 * width / 10, 0, 15, 0).toFixed(1)) + " cm", width / 2 - (4 * width / 10 - focusLengthSlider.value()), 6*height/10 + 1.5*width / 75);
    stroke(255);
}

//draw関数
function draw() {
    gridDraw()
    lensDraw()
    baseDraw()
    if (objectSelect.value() == "F") {
        opticalPathDisplay(fImg);
        objectAndVirtualImageDisplay(fImg);
        screenDisplay(fImg);
        focusDraw(fImg);
        imgWidth = fImg.width;
        imgHeight = fImg.height;
    }
    else if (objectSelect.value() == "LED") {
        opticalPathDisplay(ledImg);
        objectAndVirtualImageDisplay(ledImg);
        screenDisplay(ledImg);
        focusDraw(ledImg);
        imgWidth = ledImg.width;
        imgHeight = ledImg.height;
    }
    else if (objectSelect.value() == "ろうそく") {
        opticalPathDisplay(candleImg);
        objectAndVirtualImageDisplay(candleImg);
        screenDisplay(candleImg);
        focusDraw(candleImg);
        imgWidth = candleImg.width;
        imgHeight = candleImg.height;
    }
}

//ウィンドウをリサイズした時の手続き
function windowResized() {
    fullScreen();
    initSettings()
    buttonSettings()
}
