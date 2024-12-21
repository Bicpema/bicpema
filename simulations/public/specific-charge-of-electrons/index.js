//フルスクリーンの手続き
function fullScreen() {
    createCanvas(windowWidth, windowHeight);
}

//ボタンインスタンス等
let switchButton,
    scaleButton,
    electronBeamButton,
    radiusButton,
    magneticFieldDirectionButton,
    geomagnetismDirectionButton,
    voltageSlider,
    ampereSlider;


//ボタン等を生成する手続き
function buttonCreation() {
    //電源を制御するボタン
    switchButton = createButton("スイッチ")
    //スケールの表示を制御するボタン
    scaleButton = createButton("スケール")
    //電子線の中の線を制御するボタン
    electronBeamButton = createButton("電子線の真ん中の線")
    //半径の値の表示を制御するボタン
    radiusButton = createButton("直径")
    //磁場方向の表示を制御するボタン
    magneticFieldDirectionButton = createButton("磁場の方向の表示")
    //地磁気の方向を制御するボタン
    geomagnetismDirectionButton = createButton("地磁気の方向切り替え")
    //電圧を制御するスライダー
    voltageSlider = createSlider(0.0, 400.0, 0.0, 0.1)
    //電流を制御するスライダー
    ampereSlider = createSlider(0.0, 3.0, 1.5, 0.01)
}

//制御する変数等
let switchIs,
    scaleIs,
    electronBeamIs,
    magneticFieldDirections,
    geomagnetismDirections,
    radiuIs;

//それぞれのボタンで制御される手続き
//電源を制御する手続き
function switchFunction() {
    if (switchIs == true) {
        switchIs = false
        switchButton.removeClass('btn btn-danger').addClass('btn btn-primary')
    }
    else {
        switchIs = true
        switchButton.removeClass('btn  btn-primary').addClass('btn btn-danger')
    }
}

//スケールの表示を制御する手続き
function scaleFunction() {
    if (scaleIs == true) {
        scaleIs = false
        scaleButton.removeClass('btn btn-danger').addClass('btn btn-primary')
    }
    else {
        scaleIs = true
        scaleButton.removeClass('btn  btn-primary').addClass('btn btn-danger')
    }
}

//電子線の中の線を制御する手続き
function electronBeamFunction() {
    if (electronBeamIs == true) {
        electronBeamIs = false
        electronBeamButton.removeClass('btn btn-danger').addClass('btn btn-primary')
    }
    else {
        electronBeamIs = true
        electronBeamButton.removeClass('btn  btn-primary').addClass('btn btn-danger')
    }
}

//直径の値の表示を制御する手続き
function radiusFunction() {
    if (radiuIs == true) {
        radiuIs = false
        radiusButton.removeClass('btn btn-danger').addClass('btn btn-primary')
    }
    else {
        radiuIs = true
        radiusButton.removeClass('btn  btn-primary').addClass('btn btn-danger')
    }
}

//磁場方向の表示を制御する手続き
function magneticFieldDirectionFunction() {
    if (magneticFieldDirections == true) {
        magneticFieldDirections = false
        magneticFieldDirectionButton.removeClass('btn btn-danger').addClass('btn btn-primary')
    }
    else {
        magneticFieldDirections = true
        magneticFieldDirectionButton.removeClass('btn  btn-primary').addClass('btn btn-danger')
    }
}

//地磁気の方向を制御する手続き
function geomagnetismDirectionFunction() {
    if (geomagnetismDirections == true) {
        geomagnetismDirections = false
        geomagnetismDirectionButton.removeClass('btn btn-danger').addClass('btn btn-primary')
    }
    else {
        geomagnetismDirections = true
        geomagnetismDirectionButton.removeClass('btn  btn-primary').addClass('btn btn-danger')
    }
}

//ボタン等の設定をする手続き
function buttonSettings() {
    switchButton.mousePressed(switchFunction).position(0, 4 * height / 16).size(width / 5, height / 10).addClass('btn btn-danger').show().style("font-size", "3vw");
    scaleButton.mousePressed(scaleFunction).position(0, 6 * height / 16).size(width / 5, height / 10).addClass('btn btn-primary').show().style("font-size", "3vw");
    electronBeamButton.mousePressed(electronBeamFunction).position(0, 8 * height / 16).size(width / 5, height / 10).addClass('btn btn-primary').show().style("font-size", "2vw");
    radiusButton.mousePressed(radiusFunction).position(0, 10 * height / 16).size(width / 5, height / 10).addClass('btn btn-primary').show().style("font-size", "3vw");
    magneticFieldDirectionButton.mousePressed(magneticFieldDirectionFunction).position(0, 12 * height / 16).size(width / 5, height / 10).addClass('btn btn-primary').show().style("font-size", "2vw");
    geomagnetismDirectionButton.mousePressed(geomagnetismDirectionFunction).position(0, 14 * height / 16).size(width / 5, height / 10).addClass('btn btn-primary').show().style("font-size", "1.8vw");
    voltageSlider.position(4 * width / 5, 4 * height / 16).size(width / 5)
    ampereSlider.position(4 * width / 5, 6 * height / 16).size(width / 5)
}

//本シミュレーションで主に扱う変数
let deviceRadi,
    v,
    i,
    b,
    d,
    mm,
    r,
    RADI2,
    rad,
    posx,
    posy;

//シミュレーションの初期値を設定する手続き
function initSettings() {
    //比電荷測定装置の半径
    deviceRadi = height * 4.0 / 9.0;
    //電圧の変数
    v = 0;
    //電流の変数
    i = 0;
    //磁束密度の変数
    b = 0;
    //ガラス球の左端と電子銃の距離
    d = 0;
    //dを100等分した値
    mm = 0;
    //電子線の描く円の半径
    r = 0;
    //電子線の円の直径
    RADI2 = 0;
    //角速度
    rad = 0.0;
    //電子線のｘ座標を定義
    posx = 0;
    //電子線のｙ差票を定義
    posy = 0;
    //電源を制御する変数
    switchIs = true
    //スケールを制御する変数
    scaleIs = false
    //電子線の中の線を制御する変数
    electronBeamIs = false
    //直径の値の表示を制御する変数
    radiuIs = false
    //磁場方向の表示を制御する変数
    magneticFieldDirections = false
    //地磁気の方向の変数
    geomagnetismDirections = true
    textAlign(CENTER)
}

//setup関数
function setup() {
    fullScreen();
    buttonCreation()
    buttonSettings()
    initSettings()
}

//比電荷装置の描画をする手続き
function specificChargeDeviceDraw() {
    background(100);
    noStroke();
    strokeWeight(10);
    fill(0);
    ellipse(width / 2.0, height / 2.0, 2.0 * deviceRadi, 2.0 * deviceRadi);
    textAlign(CENTER)

}


//主な計算を行う手続き
function calculateFunction() {
    v = voltageSlider.value()
    i = ampereSlider.value();
    if (geomagnetismDirections == true) b = (7.8 * i / 10000.0 + 2.0 / 100000.0); //地磁気と磁場が同じ方向
    else b = (7.8 * i / 10000.0 - 2.0 / 100000.0); //地磁気と磁場が異なる方向
    d = dist((width - 2 * deviceRadi) / 2, height / 2.0, 32 * width / 50 + width / 26, height / 2.0);
    mm = (d) / 100.0;//1mmを定義
    r = (sqrt((v * 2.0 / (1.75881962 * pow(10.0, 11.0))))) / b * 1000.0;
    RADI2 = 2.0 * r * mm;
}

//主な値の表示をする手続き
function valueDisplay() {
    //電圧の値の表示
    noStroke()
    fill(255, 250, 205)
    noStroke()
    rect(4 * width / 5, 4 * height / 16 + height / 40, width / 5, height / 15)
    stroke(0)
    strokeWeight(1)
    fill(0)
    textSize(width / 40)
    text(nf(v, 1, 1) + " V", 9 * width / 10, 4 * height / 16 + height / 13)

    //電流の値の表示
    fill(255, 250, 205)
    noStroke()
    rect(4 * width / 5, 6 * height / 16 + height / 40, width / 5, height / 15)
    stroke(0)
    strokeWeight(1)
    fill(0)
    textSize(width / 40)
    text(nf(i, 1, 2) + " A ", 9 * width / 10, 6 * height / 16 + height / 13)

    //磁束密度の値の表示
    fill(255, 250, 205)
    noStroke()
    rect(4 * width / 5, 8 * height / 16 + height / 40, width / 5, height / 15)
    stroke(0)
    strokeWeight(1)
    fill(0)
    textSize(20)
    textSize(width / 40)
    text(nf(b * 1000, 1, 2) + "×10⁻³ T ", 9 * width / 10, 8 * height / 16 + height / 13)//調整

    //直径の値の表示
    if (radiuIs == true) {
        noStroke()
        fill(255, 250, 205)
        noStroke()
        rect(4 * width / 5, 10 * height / 16 + height / 40, width / 5, height / 15)
        stroke(0)
        strokeWeight(1)
        fill(0)
        textSize(width / 40)
        if (v > 21.021) {
            text(nf(2 * r, 1, 2) + " mm", 9 * width / 10, 10 * height / 16 + height / 13)
        }
        else {
            text(" 0.0 mm", 9 * width / 10, 10 * height / 16 + height / 13)//問題点（０の時、NaNと出てしまう）
        }
    }

    //地磁気の方向の表示
    fill(255, 250, 205)
    noStroke()
    rect(4 * width / 5, 12 * height / 16 + height / 40, width / 5, height / 15)
    stroke(0)
    strokeWeight(1)
    fill(0)
    textSize(20)
    textSize(width / 60)
    if (geomagnetismDirections == true) text("コイル内の磁場と同じ", 9 * width / 10, 12 * height / 16 + height / 13)
    else text("コイル内の磁場と逆", 9 * width / 10, 12 * height / 16 + height / 13)
}

//スケールを表示する手続き
function scaleDraw() {
    if (scaleIs == true) {
        stroke(255);
        strokeWeight(1);
        fill(255);
        rect(width / 2 - deviceRadi - d / 4, height / 2, 3 * d / 2, height / 15);
        for (let i = 1; i <= 124; i += 1) {
            stroke(0);
            line(width / 2 - deviceRadi - d / 4 + d / 100 * i, height / 2, width / 2 - deviceRadi - d / 4 + d / 100 * i, height / 2 + height / 150);
        }
        for (let i = 1; i <= 24; i += 1) {
            stroke(0);
            line(width / 2 - deviceRadi - d / 4 + d / 20 * i, height / 2, width / 2 - deviceRadi - d / 4 + d / 20 * i, height / 2 + height / 90);
        }
        for (let i = 0; i <= 12; i += 1) {
            stroke(0);
            line(width / 2 - deviceRadi - d / 4 + d / 20 + d / 10 * i, height / 2, width / 2 - deviceRadi - d / 4 + d / 20 + d / 10 * i, height / 2 + height / 60);

        }
        for (let i = 0; i <= 12; i += 1) {
            fill(0)
            noStroke()
            textSize(width / 100)
            text(120 - i * 10, width / 2 - deviceRadi - d / 4 + d / 20 + d / 10 * i, height / 2 + height / 20)
        }
        text("(mm)", width / 2 - deviceRadi - d / 4 + d / 20 + d / 10 * 13, height / 2 + height / 20)
    }
}

//磁場方向を表示する手続き
function magneticFieldDirectionDraw() {
    if (magneticFieldDirections == true) {

        //磁場を発生させるヘルムホルツコイルを描く手続き
        stroke(124, 64, 46)
        strokeWeight(height / 15)
        fill(0, 0)
        ellipse(width / 2, height / 2, height * 1.5)
        if (height * 1.5 / 2 - height / 30 < (dist(mouseX, mouseY, width / 2, height / 2)) && (dist(mouseX, mouseY, width / 2, height / 2)) < height * 1.5 / 2 + height / 30) {
            stroke(255)
            strokeWeight(1)
            fill(255)
            textSize(width / 50)
            textAlign(CENTER)
            text("ヘルムホルツコイル", mouseX, mouseY)
        }

        if (i > 0) {
            stroke(255)//手前の場合
            strokeWeight(1)
            fill(255)
            ellipse(width / 2, height / 2, deviceRadi / 30)
            stroke(255)
            strokeWeight(2)
            fill(0, 0)
            ellipse(width / 2, height / 2, deviceRadi / 5)
            stroke(255)
            strokeWeight(1)
            fill(255)
            textSize(width / 40)
            textAlign(CENTER)
            text(" 磁場の方向 ", width / 2, height / 2 - height / 15)
        }
        else {
            stroke(255)
            strokeWeight(1)
            fill(255)
            textSize(width / 40)
            textAlign(CENTER)
            text("     磁場の方向  ×", width / 2, height / 2 - height / 15)
        }
    }
}

//メインの手続き
function main() {
    //switchのオン・オフ
    if (switchIs == true) {

        //加速電圧のみの場合
        if (i <= 0 && v > 0) {
            stroke(0, 197, 160);
            strokeWeight(15);
            fill(0, 197, 160);
            line(32 * width / 50 + width / 26, height / 4, 32 * width / 50 + width / 26, height / 2)
            if (electronBeamIs == true) {
                stroke(0, 0, 255);
                strokeWeight(1);
                fill(0, 0, 255);
                line(32 * width / 50 + width / 26, height / 4, 32 * width / 50 + width / 26, height / 2)
            }
        } else {
            //最初の点をなくすため
            if (i > 0 && v > 0) {

                //電子線がガラス管の中で収まるとき
                if (RADI2 < 32 * width / 50 + width / 26 - (width - (2 * deviceRadi)) / 2) {

                    for (let i = 0 * PI; i <= 2.0 * PI; i += 0.015) {
                        posx = RADI2 / 2.0 * cos(i);
                        posy = RADI2 / 2.0 * (-sin(i));
                        stroke(0, 197, 160, 255 - i * 30);
                        strokeWeight(10);
                        fill(0, 197, 160, 255 - i * 30);
                        ellipse(32 * width / 50 + width / 26 - RADI2 / 2.0 + posx, height / 2.0 + posy, deviceRadi / 100.0, deviceRadi / 100.0);

                    }

                    //電子線の中の線
                    if (electronBeamIs == true) {
                        beginShape();
                        for (let i = 0 * PI; i <= 2.0 * PI; i += 0.05) {
                            posx = RADI2 / 2.0 * cos(i);
                            posy = RADI2 / 2.0 * (-sin(i));
                            stroke(0, 0, 255);
                            strokeWeight(1);
                            fill(0, 0);
                            vertex(32 * width / 50 + width / 26 - RADI2 / 2.0 + posx, height / 2.0 + posy)
                        }
                        endShape();
                    }
                }

                //電子線がガラス管の中で収まらないとき
                else {
                    beginShape();
                    for (let i = 0 * PI; i <= PI; i += 0.003) {
                        posx = RADI2 / 2.0 * cos(i);
                        posy = RADI2 / 2.0 * (-sin(i));
                        if (dist(32 * width / 50 + width / 26 - RADI2 / 2.0 + posx, height / 2.0 + posy, width / 2, height / 2) < deviceRadi) {
                            stroke(0, 197, 160);
                            strokeWeight(15);
                            fill(0);

                            vertex(32 * width / 50 + width / 26 - RADI2 / 2.0 + posx, height / 2.0 + posy)
                        }
                    }
                    endShape();
                    if (electronBeamIs == true) {
                        beginShape();
                        for (let i = 0 * PI; i <= PI; i += 0.01) {//外に出る時
                            posx = RADI2 / 2.0 * cos(i);
                            posy = RADI2 / 2.0 * (-sin(i));
                            if (dist(32 * width / 50 + width / 26 - RADI2 / 2.0 + posx, height / 2.0 + posy, width / 2, height / 2) < deviceRadi) {
                                stroke(0, 0, 255);//電子線の中の線
                                strokeWeight(1);
                                fill(0, 0);
                                vertex(32 * width / 50 + width / 26 - RADI2 / 2.0 + posx, height / 2.0 + posy)
                            }
                        }
                        endShape();
                    }

                }
            }
        }
        strokeWeight(1);
        fill(255, 215, 0, 200);
        stroke(255, 215, 0, 200);
        rect(32 * width / 50 + width / 26 - width / 40 / 2, height / 2 + height / 40, width / 40, height / 40)
    } else {
        strokeWeight(1);
        fill(125, 200);
        stroke(125, 200);
        rect(32 * width / 50 + width / 26 - width / 40 / 2, height / 2 + height / 40, width / 40, height / 40)
    }
    stroke(125, 200);
    strokeWeight(1);
    fill(125, 200);
    rect(32 * width / 50, height / 2 + height / 20, width / 13, height / 30);
    rect(32 * width / 50 + width / 26 - width / 40 / 2, height / 2 - height / 40, width / 40, height / 20)
}

function textExplanation() {
    if (4 * width / 5 < mouseX && 4 * height / 16 + height / 40 < mouseY && mouseY < 4 * height / 16 + height / 40 + height / 15) {
        noStroke()
        fill(255)
        rect(7 * width / 10, 4 * height / 16 + height / 40, width / 10, height / 15)
        stroke(0)
        strokeWeight(1)
        fill(0)
        textSize(width / 50)
        textAlign(LEFT)
        text("加速電圧", 43 * width / 60, 4 * height / 16 + height / 13)
    }
    if (4 * width / 5 < mouseX && 6 * height / 16 + height / 40 < mouseY && mouseY < 6 * height / 16 + height / 40 + height / 15) {
        noStroke()
        fill(255)
        rect(3 * width / 5, 6 * height / 16 + height / 40, width / 5, height / 15)
        stroke(0)
        strokeWeight(1)
        fill(0)
        textSize(width / 50)
        textAlign(CENTER)
        text("コイルに流れる電流", 7 * width / 10, 6 * height / 16 + height / 13)
    }
    if (4 * width / 5 < mouseX && 8 * height / 16 + height / 40 < mouseY && mouseY < 8 * height / 16 + height / 40 + height / 15) {
        noStroke()
        fill(255)
        rect(3 * width / 5, 8 * height / 16 + height / 40, width / 5, height / 15)
        stroke(0)
        strokeWeight(1)
        fill(0)
        textSize(width / 75)
        textAlign(CENTER)
        text("コイルと地磁気による磁束密度", 7 * width / 10, 8 * height / 16 + height / 13)
    }
    if (radiuIs == true) {
        if (4 * width / 5 < mouseX && 10 * height / 16 + height / 40 < mouseY && mouseY < 10 * height / 16 + height / 40 + height / 15) {
            noStroke()
            fill(255)
            rect(3 * width / 5, 10 * height / 16 + height / 40, width / 5, height / 15)
            stroke(0)
            strokeWeight(1)
            fill(0)
            textSize(width / 50)
            textAlign(CENTER)
            text("電子線の直径", 7 * width / 10, 10 * height / 16 + height / 13)
        }
    }
    if (4 * width / 5 < mouseX && 12 * height / 16 + height / 40 < mouseY && mouseY < 12 * height / 16 + height / 40 + height / 15) {
        noStroke()
        fill(255)
        rect(3 * width / 5, 12 * height / 16 + height / 40, width / 5, height / 15)
        stroke(0)
        strokeWeight(1)
        fill(0)
        textSize(width / 50)
        textAlign(CENTER)
        text("地磁気の方向", 7 * width / 10, 12 * height / 16 + height / 13)
    }
    if (32 * width / 50 < mouseX && mouseX < 32 * width / 50 + width / 13 && height / 2 - height / 40 < mouseY && mouseY < height / 2 + height / 20 + height / 30) {
        stroke(255)
        strokeWeight(1)
        fill(255)
        textSize(width / 50)
        text("電子銃", 32 * width / 50 + width / 13, height / 2 - height / 20)
    } else if (dist(width / 2.0, height / 2.0, mouseX, mouseY) < deviceRadi) {
        stroke(255)
        strokeWeight(1)
        fill(255)
        textSize(width / 50)
        text("希薄なヘリウムガスが入っている管球", mouseX, mouseY)
    }
    stroke(0)
    strokeWeight(1)
    fill(0)
    textSize(width / 30)
    textAlign(LEFT)
    text("電子の比電荷(e/m)の測定", 0, height / 15)
}

//draw関数
function draw() {
    specificChargeDeviceDraw()
    magneticFieldDirectionDraw()
    calculateFunction()
    valueDisplay()
    main()
    scaleDraw()
    textExplanation()
}

//windowがリサイズされた時の関数
function windowResized() {
    fullScreen();
    buttonSettings()
    initSettings()
    scaleDraw()
}