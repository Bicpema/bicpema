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
// 外部ファイルの読み込み
function preload() {
    cmfTable = loadTable("/simulations/cellophane-color/data/cmf.csv", "csv", "header") // 等色関数のデータ
    osTable = loadTable("/simulations/cellophane-color/data/os.csv", "csv", "header") // 偏光板を一枚通したときの波長毎の強度分布
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
let waveLengthArr; // 波長の配列
let xLambda, yLambda, zLambda; // XYZ等色関数の配列
let osArr, osArrOrigin; // 強度データの配列
let xArrAfter = [], yArrAfter = [], zArrAfter = []; // 一枚目の偏光板を透過したときのxyz要素
let xArrBefore = [], yArrBefore = [], zArrBefore = []; // 二枚目の偏光板を透過したときのxyz要素
let cellophaneNum; // セロハンの枚数
let cellophaneArr = []; // セロハンのデータ配列
let rBefore = 0, gBefore = 0, bBefore = 0; // 一枚目の偏光板を透過したときのrgb要素
let rAfter = 0, gAfter = 0, bAfter = 0; // 二枚目の偏光板を透過したときのrgb要素

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
}

// 偏光板を描画する処理
function createPolarizer(size, x, y, z, pattern) {
    push();
    translate(x, y, z);
    noFill();
    strokeWeight(1);
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
function createCellophane(n, rAfter, a) {
    // noStroke()
    push()
    rotateZ(rAfter * PI / 180)
    fill(157, 204, 224, 50)
    for (let i = 0; i < n; i++) {
        push()
        translate(-0, 0, -0.1 * (i + a))
        box(100, 200, 0.1)
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
    if (a <= 0.031308) {
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
            let delta = firstCellophaneNum.value() * 2 * opdInput.value() * PI / l
            let cello = [[1, 0], [0, math.exp(math.complex(0, -delta))]]
            E_2 = math.multiply(cello, E_1)

            // セロハンの組数が2組以上の場合、それぞれのセロハンに関する計算を再帰的に行う
            if (colabNum >= 2) {
                for (let n = 2; n <= colabNum; n++) {
                    let otherCellophaneNum = select("#numInput-" + n)
                    let delta = otherCellophaneNum.value() * 2 * opdInput.value() * PI / l
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

// draw関数
let rotateTime = 0
function draw() {

    // 背景色の設定
    background(100)

    // 回転の設定
    rotateTime += 0.5
    rotateY(rotateTime * PI / 180)

    // 偏光板を一枚透過したときの色の描画
    fill(rBefore, gBefore, bBefore, 100)
    noStroke()
    push()
    translate(0, 0, 0.1)
    ellipse(0, 0, 100, 100)
    pop()


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


    // セロハンの描画
    let z = 0
    for (let i = 0; i < colabNum; i++) {
        let num = i + 1
        let numInput = select("#numInput-" + num)
        let rotateInput = select("#rotateInput-" + num)
        createCellophane(numInput.value(), rotateInput.value(), z)
        z += parseInt(numInput.value())
    }


    rAfter, gAfter, bAfter = afterColorCalculate()
    noStroke()
    fill(rAfter, gAfter, bAfter)

    // 二枚目の偏光板を透過したときの色の描画
    push()
    translate(0, 0, - 0.1 * cellophaneNum - 1)
    ellipse(0, 0, 100, 100)
    pop()

    // グラフの描画
    drawGraph()
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