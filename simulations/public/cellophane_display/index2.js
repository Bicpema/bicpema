window.onload = function () {

    // screenshotButtonの設定
    document.getElementById('screenshotButton').addEventListener('click', () => {
        html2canvas(document.body).then((canvas) => {
            downloadImage(canvas.toDataURL());
        });
    });
    function downloadImage(dataUrl) {
        const name = 'screenshot.png';
        const a = document.createElement('a');
        a.href = dataUrl;
        a.download = name;
        a.click();
    }
};

// p5Canvasという要素を親要素にする
function fullScreen() {
    let p5Canvas = document.getElementById("p5Canvas")
    let canvas = createCanvas(p5Canvas.clientWidth, p5Canvas.clientHeight, WEBGL)
    canvas.parent("p5Canvas")
}

let cmfTable, osTable;
let img;
// 外部ファイルの読み込み
function preload() {
    cmfTable = loadTable("/simulations/cellophane_display/data/cmf.csv", "csv", "header") // 等色関数のデータ
    osTable = loadTable("/simulations/cellophane_display/data/os_PC.csv", "csv", "header") // 偏光板を一枚通したときの波長毎の強度分布
    dTable = loadTable("/simulations/cellophane_display/data/data_d_100.csv", "csv", "header")//光路差の分散特性(380nmで100に規格化)
    img = loadImage("/simulations/cellophane_display/white.png");
}


let polarizerSelect, // 偏光板の配置方法のselect要素
    opdInput, // 光路差のinput要素
    cellophaneAddButton, // セロハン追加のbutton要素
    cellophaneRemoveButton; // セロハン削除のbutton要素

// DOM要素の生成
function elCreate() {
    polarizerSelect = select("#polarizerSelect")
    opdInput = select("#opdInput")
    cellophaneAddButton = select("#cellophaneAddButton")
    cellophaneRemoveButton = select("#cellophaneRemoveButton")
}

// 追加ボタンを押したときの処理
function cellophaneAddButtonFunction() {
    colabNum += 1
    cellophaneArr.push(new Cellophane(colabNum))
}

// 削除ボタンを押したときの処理
function cellophaneRemoveButtonFunction() {
    if (colabNum > 0) {
        let targetDiv = select("#cellophane-" + colabNum)
        cellophaneArr.pop(-1)
        targetDiv.remove()
        colabNum -= 1
    }
}

// DOM要素の設定
function elInit() {
    cellophaneAddButton.mousePressed(cellophaneAddButtonFunction)
    cellophaneRemoveButton.mousePressed(cellophaneRemoveButtonFunction)
}

let cmfRowNum; // 等色関数のデータ行数
let osRowNum; // 強度分布のデータ行数
let dRowNum;//光路差のデータ行数
let waveLengthArr; // 波長の配列
let xLambda, yLambda, zLambda; // XYZ等色関数の配列
let osArr, osArrOrigin; // 強度データの配列
let dArr //光路差のデータの配列
let xArrAfter = [], yArrAfter = [], zArrAfter = []; // 一枚目の偏光板を透過したときのxyz要素
let xArrBefore = [], yArrBefore = [], zArrBefore = []; // 二枚目の偏光板を透過したときのxyz要素
let cellophaneNum; // セロハンの枚数
let cellophaneArr = []; // セロハンのデータ配列
let rBefore = 0, gBefore = 0, bBefore = 0; // 一枚目の偏光板を透過したときのrgb要素
let rAfter = 0, gAfter = 0, bAfter = 0; // 二枚目の偏光板を透過したときのrgb要素
let rAfter1 = 0, gAfter1 = 0, bAfter1 = 0; // 二枚目の偏光板を透過したときのrgb要素(※ セロハン1枚のみ)
let rAfter2 = 0, gAfter2 = 0, bAfter2 = 0; // 二枚目の偏光板を透過したときのrgb要素(※ セロハン2枚以上)
//分離軸判定で使用した変数の追加 2024.6.14
let centerX, centerY; // 判定で用いる座標の中心点
let x1, x2, x3, x4, y1, y2, y3, y4; //判定するテープの4隅の点座標
let tape_angle_get;
let radius = 111;
let precolabNum;
let rAftera;
let gAftera;
let bAftera;
let slider;

// 初期値やシミュレーションの設定
function initValue() {

    // テーブルからそれぞれのデータを取得
    cmfRowNum = cmfTable.getRowCount();
    waveLengthArr = cmfTable.getColumn("wave-length")
    waveLengthArr = waveLengthArr.map(str => parseInt(str, 10));
    xLambda = cmfTable.getColumn("x(lambda)")
    yLambda = cmfTable.getColumn("y(lambda)")
    zLambda = cmfTable.getColumn("z(lambda)")
    osRowNum = osTable.getRowCount();
    osArr = osTable.getColumn("optical-strength")
    osArrOrigin = osTable.getColumn("optical-strength")
    dArr = dTable.getColumn("d")
    dRowNum = dTable.getRowCount();

    // xyzを格納する配列の初期化
    for (let i = 0; i < osRowNum; i++) {
        xArrAfter.push(0);
        yArrAfter.push(0);
        zArrAfter.push(0);
        xArrBefore.push(0);
        yArrBefore.push(0);
        zArrBefore.push(0);
    }

    colabNum = 0
    precolabNum = colabNum;
    cellophaneNum = 0
}

// setup関数
function setup() {
    fullScreen()
    elCreate()
    elInit()
    initValue()
    rBefore, gBefore, bBefore = beforeColorCalculate()
    camera(0, 0, 300, 0, 0, 0, 0, 1, 0);
    img.resize(200, 200);
    centerX = 100;
    centerY = 100;
    //angle_1 = atan2(100, 50);
    //angle_2 = PI - atan2(100, 50);
    //angle_3 = PI + atan2(100, 50);
    //angle_4 = 2 * PI - atan2(100, 50);
    img.loadPixels();
    for (let i = 0; i < img.pixels.length; i += 4) {
        img.pixels[i] = 200;
        img.pixels[i + 1] = 200;
        img.pixels[i + 2] = 200;
        img.pixels[i + 3] = 255; // 7.13までは80
    }
    img.updatePixels();
    slider = createSlider(10, 100, 75);//テープの幅を決定するslider
    slider.position(110, 100);
}

// 偏光板を描画する処理
function createPolarizer(size, x, y, z, pattern) {
    push();
    translate(x, y, z);
    noFill();
    strokeWeight(0.1);
    stroke(0, 200);
    box(size, size, 0);
    if (pattern == 0) {
        for (let i = 0; i < size; i += 5) {
            line(-size / 2 + i, size / 2, 0, -size / 2 + i, -size / 2, 0);
        }
    } else {
        for (let i = 0; i < size; i += 5) {
            line(-size / 2, -size / 2 + i, 0, size / 2, -size / 2 + i, 0);
        }
    }
    pop();
}

// セロハンを描画する処理
function createCellophane(n, rAfter, a, angle_1) {
    // noStroke()
    push()
    rotateZ(rAfter * PI / 180)
    fill(255, 255, 255, 0) //2024.6.14 透明度を50から20へ変更 (157, 204, 224, 0) 
    for (let i = 0; i < n; i++) {
        push()
        translate(-0, 0, -0.1 * (i + a))
        box(2 * radius * cos(angle_1), 2 * radius * sin(angle_1), 0.1)
        pop()
    }
    pop()
}

// 回転行列R(theta)
function r_theta(theta) {
    return [[cos(theta), -sin(theta)], [sin(theta), cos(theta)]]
}

// 回転行列R(-theta)
function mai_r_theta(theta) {
    return [[cos(theta), sin(theta)], [-sin(theta), cos(theta)]]
}

// ジョーンズマトリクス
function jhons(theta) {
    return [
        [sin(theta) ** 2, -sin(theta) * cos(theta)],
        [-sin(theta) * cos(theta), cos(theta) ** 2]
    ]
}

// RGBへの変換
function toRGB(a) {
    if (a <= 0.0031308) {
        return 12.92 * a * 255
    } else {
        return (1.055 * a ** (1 / 2.4) - 0.055) * 255
    }
}

// セロハンの総数の数え上げをする処理
function numInputFunction() {
    cellophaneNum = 0
    for (let i = 0; i < colabNum; i++) {
        let num = i + 1
        let numInput = select("#numInput-" + num)
        cellophaneNum += int(numInput.value())
    }
    return cellophaneNum
}


// 偏光板１枚を透過したときの色の計算
function beforeColorCalculate() {

    // XYZ刺激値への変換（等色関数×スペクトル）
    for (let i = 380; i <= 750; i++) {
        xArrBefore[i - 380] = osArr[i - 380] * xLambda[i - 380]
        yArrBefore[i - 380] = osArr[i - 380] * yLambda[i - 380]
        zArrBefore[i - 380] = osArr[i - 380] * zLambda[i - 380]
    }

    // RGBへの変換
    xSumBefore = math.sum(xArrBefore)
    ySumBefore = math.sum(yArrBefore)
    zSumBefore = math.sum(zArrBefore)
    xNumBefore = map(xSumBefore, xSumBefore + ySumBefore + zSumBefore, 0, 1, 0)
    yNumBefore = map(ySumBefore, xSumBefore + ySumBefore + zSumBefore, 0, 1, 0)
    zNumBefore = map(zSumBefore, xSumBefore + ySumBefore + zSumBefore, 0, 1, 0)
    tosRGB = [
        [3.2406, -1.5372, -0.4986],
        [-0.9689, 1.8758, 0.0415],
        [0.0557, -0.2040, 1.0570]
    ]
    rgbBefore = math.multiply(tosRGB, [xNumBefore, yNumBefore, zNumBefore])
    rBefore = toRGB(rgbBefore[0])
    gBefore = toRGB(rgbBefore[1])
    bBefore = toRGB(rgbBefore[2])

    // 要素へのRGBの反映
    let beforeColor = select("#beforeColor")
    beforeColor.style("background-color:rgb(" + str(rBefore) + "," + str(gBefore) + "," + str(bBefore) + ")")
    return rBefore, gBefore, bBefore

}

// セロハン及び二枚目の偏光板を透過した時の処理
function afterColorCalculate() {

    // セロハンの組数が１枚以上ある場合
    if (colabNum >= 1) {

        // 計算には１組目のセロハンを基準とした相対角度を使う
        let referenceAngle = select("#rotateInput-1")
        let a = radians(-referenceAngle.value()) // 一組目のセロハンに対する偏光板一枚目の相対的な回転角
        let firstCellophaneNum = select("#numInput-1") // セロハン１組目の枚数
        E_1 = [[-sin(a)], [cos(a)]]

        // それぞれの波長毎に計算
        for (let i = 380; i <= 750; i++) {

            let l = i
            let delta = dArr[i - 380] * firstCellophaneNum.value() * 2 * opdInput.value() * PI / l / 100
            let cello = [[1, 0], [0, math.exp(math.complex(0, -delta))]]
            E_2 = math.multiply(cello, E_1)

            // セロハンの組数が2組以上の場合、それぞれのセロハンに関する計算を再帰的に行う
            if (colabNum >= 2) {
                for (let n = 2; n <= colabNum; n++) {
                    let otherCellophaneNum = select("#numInput-" + n)
                    let delta = dArr[i - 380] * otherCellophaneNum.value() * 2 * opdInput.value() * PI / l / 100
                    let cello = [[1, 0], [0, math.exp(math.complex(0, -delta))]]
                    let targetAngle = select("#rotateInput-" + n)
                    let b = radians(targetAngle.value() - referenceAngle.value())
                    E_2 = math.multiply(r_theta(b), math.multiply(cello, math.multiply(mai_r_theta(b), E_2)))
                }
            }


            let c
            if (polarizerSelect.value() == "平行ニコル配置") {
                c = radians(-referenceAngle.value())
            } else if (polarizerSelect.value() == "直交ニコル配置") {
                c = radians(-referenceAngle.value()) - radians(90)
            }

            E_3 = math.multiply(jhons(c), E_2)
            let relativeStrength = math.abs(math.abs(math.multiply(E_3[0], E_3[0])) + math.abs(math.multiply(E_3[1], E_3[1])))
            osArr[i - 380] = (relativeStrength * osArrOrigin[i - 380])
            xArrAfter[i - 380] = osArr[i - 380] * xLambda[i - 380]
            yArrAfter[i - 380] = osArr[i - 380] * yLambda[i - 380]
            zArrAfter[i - 380] = osArr[i - 380] * zLambda[i - 380]

        }

        xSumAfter = math.sum(xArrAfter)
        ySumAfter = math.sum(yArrAfter)
        zSumAfter = math.sum(zArrAfter)
        xNumAfter = map(xSumAfter, xSumAfter + ySumAfter + zSumAfter, 0, 1, 0)
        yNumAfter = map(ySumAfter, xSumAfter + ySumAfter + zSumAfter, 0, 1, 0)
        zNumAfter = map(zSumAfter, xSumAfter + ySumAfter + zSumAfter, 0, 1, 0)
        tosRGB = [
            [3.2406, -1.5372, -0.4986],
            [-0.9689, 1.8758, 0.0415],
            [0.0557, -0.2040, 1.0570]
        ]
        sRGB = math.multiply(tosRGB, [xNumAfter, yNumAfter, zNumAfter])
        rAfter = toRGB(sRGB[0])
        gAfter = toRGB(sRGB[1])
        bAfter = toRGB(sRGB[2])
    }

    // セロハンの組が0組の場合
    else {
        if (polarizerSelect.value() == "平行ニコル配置") {
            rAfter = rBefore
            gAfter = gBefore
            bAfter = bBefore
        } else if (polarizerSelect.value() == "直交ニコル配置") {
            rAfter = 0
            gAfter = 0
            bAfter = 0
            for (let i = 380; i <= 750; i++) {
                osArr[i - 380] = 0

            }
        }
    }

    // 色を要素に反映
    let afterColor = select("#afterColor")
    afterColor.style("background-color:rgb(" + str(rAfter) + "," + str(gAfter) + "," + str(bAfter) + ")")
    return rAfter, gAfter, bAfter

}

// セロハン及び二枚目の偏光板を透過した時の処理(セロハン1枚のみ)
function afterColorCalculate1() {

    // セロハンの組数が１枚以上ある場合
    if (colabNum >= 1) {

        // 計算には１組目のセロハンを基準とした相対角度を使う
        let referenceAngle = select("#rotateInput-1")
        let a = radians(-referenceAngle.value()) // 一組目のセロハンに対する偏光板一枚目の相対的な回転角
        let firstCellophaneNum = select("#numInput-1") // セロハン１組目の枚数
        E_1 = [[-sin(a)], [cos(a)]]

        // それぞれの波長毎に計算
        for (let i = 380; i <= 750; i++) {

            let l = i
            let delta = dArr[i - 380] * firstCellophaneNum.value() * 2 * opdInput.value() * PI / l / 100
            let cello = [[1, 0], [0, math.exp(math.complex(0, -delta))]]
            E_2 = math.multiply(cello, E_1)
            if (polarizerSelect.value() == "平行ニコル配置") {
                c = radians(-referenceAngle.value())
            } else if (polarizerSelect.value() == "直交ニコル配置") {
                c = radians(-referenceAngle.value()) - radians(90)
            }

            E_3 = math.multiply(jhons(c), E_2)
            let relativeStrength = math.abs(math.abs(math.multiply(E_3[0], E_3[0])) + math.abs(math.multiply(E_3[1], E_3[1])))
            osArr[i - 380] = (relativeStrength * osArrOrigin[i - 380])
            xArrAfter[i - 380] = osArr[i - 380] * xLambda[i - 380]
            yArrAfter[i - 380] = osArr[i - 380] * yLambda[i - 380]
            zArrAfter[i - 380] = osArr[i - 380] * zLambda[i - 380]

        }

        xSumAfter = math.sum(xArrAfter)
        ySumAfter = math.sum(yArrAfter)
        zSumAfter = math.sum(zArrAfter)
        xNumAfter = map(xSumAfter, xSumAfter + ySumAfter + zSumAfter, 0, 1, 0)
        yNumAfter = map(ySumAfter, xSumAfter + ySumAfter + zSumAfter, 0, 1, 0)
        zNumAfter = map(zSumAfter, xSumAfter + ySumAfter + zSumAfter, 0, 1, 0)
        tosRGB = [
            [3.2406, -1.5372, -0.4986],
            [-0.9689, 1.8758, 0.0415],
            [0.0557, -0.2040, 1.0570]
        ]
        sRGB = math.multiply(tosRGB, [xNumAfter, yNumAfter, zNumAfter])
        rAfter1 = toRGB(sRGB[0])
        gAfter1 = toRGB(sRGB[1])
        bAfter1 = toRGB(sRGB[2])
    }

    // セロハンの組が0組の場合
    else {
        if (polarizerSelect.value() == "平行ニコル配置") {
            rAfter1 = rBefore
            gAfter1 = gBefore
            bAfter1 = bBefore
        } else if (polarizerSelect.value() == "直交ニコル配置") {
            rAfter1 = 0
            gAfter1 = 0
            bAfter1 = 0
            for (let i = 380; i <= 750; i++) {
                osArr[i - 380] = 0

            }
        }
    }

    //色を要素に反映
    //let afterColor = select("#afterColor")
    //afterColor.style("background-color:rgb(" + str(rAfter1) + "," + str(gAfter1) + "," + str(bAfter1) + ")")
    return rAfter1, gAfter1, bAfter1

}

// セロハン及び二枚目の偏光板を透過した時の処理
function afterColorCalculates(binaryString) {
    let bi = 0;
    let tape_sum = 0;
    let numStart = 0;
    let firstCellophaneNum
    let referenceAngle
    let a
    let bit = new Array(binaryString.length).fill(0);//配列の宣言-バイナリの要素を指定する配列
    for (let j = 0; j < binaryString.length; j++) {
        bit[j] = parseInt(binaryString[j], 10);
        if (bit[j] == 0) { tape_sum += 1; }
    }

    if (bit[0] == 0) {//colabNum2: 00,01
        // 計算には１組目のセロハンを基準とした相対角度を使う
        referenceAngle = select("#rotateInput-1")
        a = radians(-referenceAngle.value()) // 一組目のセロハンに対する偏光板一枚目の相対的な回転角
        firstCellophaneNum = select("#numInput-1") // セロハン１組目の枚数
        E_1 = [[-sin(a)], [cos(a)]]
        numStart = 1;
    }
    else {//colabNum:10,11
        for (let j = 0; j < binaryString.length - 1; j++) { //10等の小さい数でも探索できるように，0から探索開始 2024.6.21
            if (bit[j] == 0) {
                numStart = j; //10について, 1
                bi = 1;
                break
            }
        }
        if (bi == 0) { //全て1であった場合
            if (bit[binaryString.length - 1] == 0) {
                numStart = binaryString.length - 1
            } else { numStart = 0 }
        }
        if (numStart != 0) {
            let numS = numStart + 1;
            referenceAngle = select("#rotateInput-" + numS)
            a = radians(-referenceAngle.value()) // 一組目のセロハンに対する偏光板一枚目の相対的な回転角
            firstCellophaneNum = select("#numInput-" + numS) // セロハン１組目の枚数
            E_1 = [[-sin(a)], [cos(a)]]
        }
    }

    if (numStart !== 0) {
        // それぞれの波長毎に計算
        for (let i = 380; i <= 750; i++) {
            let l = i
            let delta = dArr[i - 380] * firstCellophaneNum.value() * 2 * opdInput.value() * PI / l / 100//2024.6.22 firstCellophaneの値をvalueで数値化しないとだめだった!
            let cello = [[1, 0], [0, math.exp(math.complex(0, -delta))]]
            E_2 = math.multiply(cello, E_1)

            if (bit[0] == 0) {
                for (let j = 1; j < colabNum; j++) {//2角組目以降..
                    let n = j + 1;
                    let otherCellophaneNum = select("#numInput-" + n)
                    let delta = dArr[i - 380] * otherCellophaneNum.value() * 2 * opdInput.value() * PI / l / 100
                    let cello = [[1, 0], [0, math.exp(math.complex(0, -delta))]]
                    let targetAngle = select("#rotateInput-" + n)
                    let b = radians(targetAngle.value() - referenceAngle.value())
                    if (bit[j] == 0) {
                        E_2 = math.multiply(r_theta(b), math.multiply(cello, math.multiply(mai_r_theta(b), E_2)))
                    }
                    else { E_2 = E_2; }
                }
            }
            else if (tape_sum > 1) {
                for (let k = numStart + 1; k < binaryString.length; k++) { //2024.6.19 n=numStartから+1?
                    let num = k + 1;
                    let otherCellophaneNum = select("#numInput-" + num)
                    let delta = dArr[i - 380] * otherCellophaneNum.value() * 2 * opdInput.value() * PI / l / 100
                    let cello = [[1, 0], [0, math.exp(math.complex(0, -delta))]]
                    let targetAngle = select("#rotateInput-" + num)
                    let b = radians(targetAngle.value() - referenceAngle.value()) //2024.6.21 いや,こっちでダメ?!
                    if (bit[k] == 0) {
                        E_2 = math.multiply(r_theta(b), math.multiply(cello, math.multiply(mai_r_theta(b), E_2))) //2024.6.21 ここでバグが生じる
                    }
                    else { E_2 = E_2; }
                }
            }


            let c
            if (polarizerSelect.value() == "平行ニコル配置") {
                c = radians(-referenceAngle.value())
            } else if (polarizerSelect.value() == "直交ニコル配置") {
                c = radians(-referenceAngle.value()) - radians(90)
            }

            E_3 = math.multiply(jhons(c), E_2)
            let relativeStrength = math.abs(math.abs(math.multiply(E_3[0], E_3[0])) + math.abs(math.multiply(E_3[1], E_3[1])))
            osArr[i - 380] = (relativeStrength * osArrOrigin[i - 380])
            xArrAfter[i - 380] = osArr[i - 380] * xLambda[i - 380]
            yArrAfter[i - 380] = osArr[i - 380] * yLambda[i - 380]
            zArrAfter[i - 380] = osArr[i - 380] * zLambda[i - 380]


        }
        xSumAfter = math.sum(xArrAfter)
        ySumAfter = math.sum(yArrAfter)
        zSumAfter = math.sum(zArrAfter)
        xNumAfter = map(xSumAfter, xSumAfter + ySumAfter + zSumAfter, 0, 1, 0)
        yNumAfter = map(ySumAfter, xSumAfter + ySumAfter + zSumAfter, 0, 1, 0)
        zNumAfter = map(zSumAfter, xSumAfter + ySumAfter + zSumAfter, 0, 1, 0)
        tosRGB = [[3.2406, -1.5372, -0.4986],
        [-0.9689, 1.8758, 0.0415],
        [0.0557, -0.2040, 1.0570]
        ]
        sRGB = math.multiply(tosRGB, [xNumAfter, yNumAfter, zNumAfter])
        rAfter2 = toRGB(sRGB[0])
        gAfter2 = toRGB(sRGB[1])
        bAfter2 = toRGB(sRGB[2])
        //rAfter2 = 255-50*tape_sum
    }
    else {
        if (polarizerSelect.value() == "平行ニコル配置") {
            rAfter2 = 200; gAfter2 = 200; bAfter2 = 200;
        } else if (polarizerSelect.value() == "直交ニコル配置") {
            rAfter2 = 0; gAfter2 = 0; bAfter2 = 0;
        }
    }

    // 色を要素に反映
    //let afterColor = select("#afterColor")
    //afterColor.style("background-color:rgb(" + str(rAfter) + "," + str(gAfter) + "," + str(bAfter) + ")")
    return rAfter2, gAfter2, bAfter2;

    //rAfter2 = 255-50*tape_sum
}

// draw関数
let rotateTime = 0
function draw() {

    frameRate(2);
    tape_angle = new Array(colabNum).fill(0);
    tape_angle_cal = new Array(colabNum).fill(0);//配列の宣言(1枚目以降) 1,2,3,4,5..colabNum
    tape_number_cal = new Array(colabNum).fill(0);

    // テープ描画における条件設定(幅)
    angle_1 = atan2(100, slider.value());
    angle_2 = PI - atan2(100, slider.value());
    angle_3 = PI + atan2(100, slider.value());
    angle_4 = 2 * PI - atan2(100, slider.value());

    // 回転の設定
    //rotateTime += 0.5
    rotateY(180 * PI / 180) //本来回転時はrotateY(rotateTime * PI / 180)
    // 背景色の設定
    background(200);
    push();
    translate(-100, -100);
    image(img, 0, 0);
    pop();
    img.loadPixels;


    // 偏光板の描画
    createPolarizer(200, 0, 0, 0, 0)
    cellophaneNum = numInputFunction()
    if (polarizerSelect.value() == "平行ニコル配置") createPolarizer(200, 0, 0, - 0.1 * cellophaneNum, 0)
    if (polarizerSelect.value() == "直交ニコル配置") createPolarizer(200, 0, 0, - 0.1 * cellophaneNum, 1)


    // セロハンの透過方向を示す矢印の描画
    push()
    rotateX(PI / 2)
    translate(0, -0.05 * cellophaneNum, 0)
    fill(0)
    cylinder(1, 0.1 * cellophaneNum + 50, 10, 3, true, true);
    translate(0, -25 - 0.05 * cellophaneNum, 0)
    rotateZ(PI)
    cone(5, 10, 10, 3, false);
    pop()


    if (colabNum == 1) {
        let z = 0
        let i = 0;
        let num = i + 1
        let numInput = select("#numInput-" + num)
        let rotateInput = select("#rotateInput-" + num)
        createCellophane(numInput.value(), rotateInput.value(), z, angle_1)
        z += parseInt(numInput.value())
        //tape1枚のみに色を塗る
        rAfter1, gAfter1, bAfter1 = afterColorCalculate1()
        drawTape_1(rAfter1, gAfter1, bAfter1, rotateInput.value())
        img.updatePixels();
    }

    if (colabNum >= 2) {
        let count = 0;
        if (count == 0) {
            for (let i = 0; i < img.pixels.length; i += 4) {
                img.pixels[i] = 200;
                img.pixels[i + 1] = 200;
                img.pixels[i + 2] = 200;
                img.pixels[i + 3] = 255; //7.13までは80

            }
            img.updatePixels();
            count += 1;
        }


        // rgbを格納する配列の初期化
        rAftera = new Array(Math.pow(2, colabNum)); //2024.6.17 colabNum修正 colabNum-1から
        gAftera = new Array(Math.pow(2, colabNum));
        bAftera = new Array(Math.pow(2, colabNum));
        for (let i = 0; i < Math.pow(2, colabNum); i++) {
            //その枚数で生み出せる全ての色を生成(2角目以降)
            let binaryString = ""
            binaryString = i.toString(2).padStart(colabNum, '0'); // colabNum=2 //00,01,10,11
            rAfter2, gAfter2, bAfter2 = afterColorCalculates(binaryString, tape_angle_cal, tape_number_cal);
            rAftera[i] = rAfter2;
            gAftera[i] = gAfter2;
            bAftera[i] = bAfter2;
        }

        let z = 0
        for (let i = 0; i < colabNum; i++) { //colabNumが3の場合, 0,1,2 (1,2,3枚)
            let num = i + 1
            let numInput = select("#numInput-" + num)
            let rotateInput = select("#rotateInput-" + num)
            createCellophane(numInput.value(), rotateInput.value(), z, angle_1)
            z += parseInt(numInput.value())
            tape_angle[i] = rotateInput.value(); //テープの全角度を収納する
        }
        drawTapes(tape_angle, rAftera, gAftera, bAftera);
        img.updatePixels();
    }

    rAfter, gAfter, bAfter = afterColorCalculate()
    // グラフの描画
    //drawGraph()
}

// tape1枚目のみに色を塗る
function drawTape_1(rAfter1, gAfter1, bAfter1, rotateInput) {
    tape_angle_get = rotateInput * PI / 180;
    getrectPoint(tape_angle_get);
    for (let i = 0; i < img.pixels.length; i += 4) {
        if (checkA(i / 4)) { img.pixels[i + 0] = rAfter1; img.pixels[i + 1] = gAfter1; img.pixels[i + 2] = bAfter1; }
        else {
            if (polarizerSelect.value() == "平行ニコル配置") {
                img.pixels[i + 0] = 200; img.pixels[i + 1] = 200; img.pixels[i + 2] = 200;
            } else if (polarizerSelect.value() == "直交ニコル配置") {
                img.pixels[i + 0] = 0; img.pixels[i + 1] = 0; img.pixels[i + 2] = 0;
            }
        }
    }
}

//tapeが2枚以上ある場合における，色の塗りつぶし
function drawTapes(tape_angle, rAftera, gAftera, bAftera) {


    let tape_array = new Array(img.pixels.length / 4).fill("");
    let tape_arraySum = new Array(img.pixels.length / 4).fill("");
    let zz; //その位置のテープの重なり具合を指定するバイナリ数


    for (let t = 0; t < colabNum; t++) {  //colabNumが3の場合 t=0,1,2 
        tape_angle_get = tape_angle[t] * PI / 180;
        getrectPoint(tape_angle_get);


        for (let i = 0; i < img.pixels.length; i += 4) {
            if (checkA(i / 4)) {
                tape_array[i / 4] = "0"
            } else { tape_array[i / 4] = "1" }
            tape_arraySum[i / 4] += tape_array[i / 4];
        }
    }
    for (let i = 0; i < img.pixels.length; i += 4) {
        zz = parseInt(tape_arraySum[i / 4], 2);//"0"又は"1"からなるバイナリ数を数字化
        img.pixels[i] = (rAftera[zz]);
        img.pixels[i + 1] = (gAftera[zz]);
        img.pixels[i + 2] = (bAftera[zz]);
    }
}



// ある角度におけるテープの4隅の点の情報を入手
function getrectPoint(tape_angle) {
    push();
    translate(-100, -100);
    let sinValues = [sin(angle_1 + tape_angle), sin(angle_2 + tape_angle), sin(angle_3 + tape_angle), sin(angle_4 + tape_angle)];
    let cosValues = [cos(angle_1 + tape_angle), cos(angle_2 + tape_angle), cos(angle_3 + tape_angle), cos(angle_4 + tape_angle)];

    x1 = centerX + cosValues[0] * radius;
    y1 = centerY + sinValues[0] * radius;
    x2 = centerX + cosValues[1] * radius;
    y2 = centerY + sinValues[1] * radius;
    x3 = centerX + cosValues[2] * radius;
    y3 = centerY + sinValues[2] * radius;
    x4 = centerX + cosValues[3] * radius;
    y4 = centerY + sinValues[3] * radius;

    push();
    fill(255, 0, 0);
    //ellipse(x1, y1, 10, 10);
    //ellipse(x2, y2, 10, 10);
    //ellipse(x3, y3, 10, 10);
    //ellipse(x4, y4, 10, 10);
    pop();
    line(x1, y1, x2, y2);
    line(x2, y2, x3, y3);
    line(x3, y3, x4, y4);
    line(x4, y4, x1, y1);
    pop();
}


//そのピクセルが，tapeの内部にあるために変更を求められるかを判定
function checkA(i) {
    let x = i % img.width;
    let y = (i - x) / img.width;
    let P0 = { x: x, y: y };
    let P1 = { x: x1, y: y1 };
    let P2 = { x: x2, y: y2 };
    let P3 = { x: x3, y: y3 };
    let P4 = { x: x4, y: y4 };

    let c1 = crossProduct(P0, P1, P2);
    let c2 = crossProduct(P0, P2, P3);
    let c3 = crossProduct(P0, P3, P4);
    let c4 = crossProduct(P0, P4, P1);

    return (c1 > 0 && c2 > 0 && c3 > 0 && c4 > 0) || (c1 < 0 && c2 < 0 && c3 < 0 && c4 < 0);
}

//tape内部にあることを判定する外積計算S
function crossProduct(P, A, B) {
    let AB = { x: B.x - A.x, y: B.y - A.y };
    let AP = { x: P.x - A.x, y: P.y - A.y };
    return AB.x * AP.y - AB.y * AP.x;
}
// windowがリサイズされたときの処理
function windowResized() {
    let p5Canvas = document.getElementById("p5Canvas")
    let canvas = resizeCanvas(p5Canvas.clientWidth, p5Canvas.clientHeight, WEBGL)
    elInit()
    for (let i = 0; i < cellophaneNum; i++)cellophaneRemoveButtonFunction()
    initValue()
    camera(0, 0, 300, 0, 0, 0, 0, 1, 0);
    beforeColorCalculate()
}

// セロハンのDOMクラス
class Cellophane {
    constructor(n) {
        this.number = n
        let parentDiv = createDiv().parent("#cellophaneColabNum").id("cellophane-" + this.number).class("mb-1 pb-1")
        let inputGroup = createDiv().parent(parentDiv).class("input-group")
        let numSpan = createSpan(this.number + "組目の枚数").parent(inputGroup).class("input-group-text")
        let numInput = createInput(1, "number").parent(inputGroup).class("form-control").attribute("min", 1).id("numInput-" + this.number)
        let rotateSpan = createSpan(this.number + "組目の回転角").parent(inputGroup).class("input-group-text")
        let rotateInput = createInput(1, "number").parent(inputGroup).class("form-control").id("rotateInput-" + this.number)
    }
}

let mainChartObj
let subChartObj
function drawGraph() {

    if (typeof mainChartObj !== 'undefined' && mainChartObj) {
        mainChartObj.destroy();
    }
    //データ
    let mainData = {
        labels: waveLengthArr,
        datasets: [
            {
                label: "シミュレーションのスペクトル",  //options.legend で凡例の表示・非表示を設定できる
                data: osArr,
                backgroundColor: "rgba(" + rAfter + "," + gAfter + "," + bAfter + ",0.5)",  //点の色
                borderColor: "rgba(" + rAfter + "," + gAfter + "," + bAfter + ",1)",
                pointRadius: 0,
                fill: 'start',
                showLine: true

            }, {
                label: "１枚目の偏光板を透過した時のスペクトル",  //options.legend で凡例の表示・非表示を設定できる
                data: osArrOrigin,
                backgroundColor: "rgba(" + rBefore + "," + gBefore + "," + bBefore + ",0.5)",  //点の色
                borderColor: "rgba(" + rBefore + "," + gBefore + "," + bBefore + ",1)",
                pointRadius: 0,
                fill: 'start',
                showLine: true

            },

        ],

    };

    //グラフの表示設定
    let mainOptions = {
        plugins: {
            legend: {
                labels: {
                    font: {
                        size: 16
                    }
                }
            },
            title: {
                display: true,
                text: '１枚目の偏光板を透過した後とシミュレーションのスペクトルの比較',
                font: {
                    size: 20
                }
            }
        },
        responsive: true,
        maintainAspectRatio: false,
        animation: false,
        scales: {
            x: {
                display: true,
                title: {
                    display: true,
                    text: '波長(nm)',
                    font: {
                        size: 16
                    }
                },
                max: 750,
                min: 380,
                ticks: {
                    font: {
                        size: 14
                    }
                }
            },
            y: {
                display: true,
                title: {
                    display: true,
                    text: '強度(a.u.)',
                    font: {
                        size: 16
                    }
                },
                max: 1,
                min: 0,
                ticks: {
                    font: {
                        size: 14
                    }
                }
            },
        },
    };

    let mainChartsetup = {
        type: "scatter",
        data: mainData,
        options: mainOptions,
    };

    //canvasにグラフを描画
    //Chart.Scatter() で散布図になる
    let mainCtx = document.getElementById("mainSpectrumGraph");
    mainChartObj = new Chart(mainCtx, mainChartsetup);

}