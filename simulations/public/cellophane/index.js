function fullScreen() {
    createCanvas(2 * windowWidth / 3, 8 * windowHeight / 10, WEBGL)
}

//csvファイルを読み込むインスタンス
//セロハンの枚数毎の強度分布
let spectrumSheet,
    //セロハンの枚数毎のRGB値
    rgbSheet,
    //等色関数の強度分布
    cmfSheet,
    //光源の強度分布;
    lightSourceSpectrumSheet;
//csvファイルに格納されているデータをインスタンスに渡す手続き
function preload() {
    spectrumSheet = loadTable("https://dl.dropboxusercontent.com/s/vqd8bojsw5z5zxz/spectrumSheet.csv");
    rgbSheet = loadTable("https://dl.dropboxusercontent.com/s/a2o8jwq7b7234ul/rgbSheet.csv");
    cmfSheet = loadTable("https://dl.dropboxusercontent.com/s/t00y963w7hitfho/cmfSheet.csv");
    lightSourceSpectrumSheet = loadTable("https://dl.dropboxusercontent.com/s/bsoxh313yvv6wuv/lightSourceSpectrumSheet.csv");
}

//ボタン、スライダー、グラフのインスタンス
let backgroundDiv,
    waveRepresentationButton,
    cellophaneCountSlider,
    cellophaneCountSliderValue,
    rButton,
    gButton,
    bButton,
    switchButton,
    graph,
    graphCanvas,
    graphChart,
    cmfGraph,
    cmfGraphCanvas,
    cmfGraphChart,
    incidentColor,
    transmittedColor;
function elCreate() {
    incidentColor = createDiv("入射光");
    transmittedColor = createDiv("出射光");
    graph = createDiv();
    graphCanvas = createElement("canvas");
    cmfGraph = createDiv();
    cmfGraphCanvas = createElement("canvas");
    backgroundDiv = createDiv();
    waveRepresentationButton = createButton("波動表現の切り替え");
    cellophaneCountSlider = createSlider(1, 10, 1);
    cellophaneCountSliderValue = createDiv("セロハンテープの枚数:" + cellophaneCountSlider.value() + "枚");
    rButton = createButton("赤(600 nm)");
    gButton = createButton("緑(550 nm)");
    bButton = createButton("青(450 nm)");
    switchButton = createButton("ストップ");
}

//視点を規定する手続き
//viewPointButtonをクリックすると呼び出される
function waveRepresentationFunctioon() {
    if (waveRepresentation == 'line') {
        waveRepresentation = 'sphere';
        waveRepresentationButton.removeClass('btn-danger').addClass('btn-primary');
    } else if (waveRepresentation == 'sphere') {
        waveRepresentation = 'line';
        waveRepresentationButton.removeClass('btn-primary').addClass('btn-danger');
    }
}

//光線をredrawする手続き
//スライダーが動いた時に呼び出される
function cellophaneCountSliderFunction() {
    for (let i = 0; i < rays_number; i < i++) {
        r_rays[i] = new Ray(150 + i * (300 / rays_number), 'r');
        g_rays[i] = new Ray(150 + i * (300 / rays_number), 'g');
        b_rays[i] = new Ray(150 + i * (300 / rays_number), 'b');
    }
    cellophaneCountSliderValue.html("セロハンテープの枚数:" + cellophaneCountSlider.value() + "枚")
    transmittedColor.style('background', 'rgb(' + rgb[cellophaneCountSlider.value() - 1][0] + ',' + rgb[cellophaneCountSlider.value() - 1][1] + ',' + rgb[cellophaneCountSlider.value() - 1][2] + ')');
}


//動かすか止めるかを規定する手続き
//スイッチボタンをクリックすると呼び出される
function switchFunction() {
    if (switchIs == false) {
        switchIs = true;
        switchButton.removeClass('btn btn-primary').addClass('btn btn-danger').html("ストップ");
    } else {
        switchIs = false;
        switchButton.removeClass('btn btn-danger').addClass('btn btn-primary').html("スタート");
    }
}

//赤の光線を描画するか規定する手続き
function rButtonFunction() {
    if (rIs == true) {
        rIs = false;
        rButton.removeClass('btn btn-danger').addClass('btn btn-secondary');
    } else {
        rIs = true;
        rButton.removeClass('btn btn-secondary').addClass('btn btn-danger');
    }
}

//緑の光線を描画するか規定する手続き
function gButtonFunction() {
    if (gIs == true) {
        gIs = false;
        gButton.removeClass('btn btn-success').addClass('btn btn-secondary');
    } else {
        gIs = true;
        gButton.removeClass('btn btn-secondary').addClass('btn btn-success');
    }
}

//青の光線を描画するか規定する手続き
function bButtonFunction() {
    if (bIs == true) {
        bIs = false;
        bButton.removeClass('btn btn-primary').addClass('btn btn-secondary');
    } else {
        bIs = true;
        bButton.removeClass('btn btn-secondary').addClass('btn btn-primary');
    }
}

function elInit() {
    backgroundDiv.size(windowWidth, windowHeight / 10).position(0, 9 * windowHeight / 10);
    waveRepresentationButton.mousePressed(waveRepresentationFunctioon).size(windowWidth / 4, windowHeight / 10).position(0, 0).parent(backgroundDiv).addClass('btn btn-primary').style("font-size", "3vh");;
    cellophaneCountSlider.size(windowWidth / 4, 2 * windowHeight / 30).position(windowWidth / 4, windowHeight / 30).parent(backgroundDiv).input(cellophaneCountSliderFunction);
    cellophaneCountSliderValue.size(windowWidth / 4, windowHeight / 20).position(windowWidth / 4, 0).parent(backgroundDiv).style("font-size", "3vh");
    rButton.mousePressed(rButtonFunction).size(windowWidth / 12, windowHeight / 10).position(2 * windowWidth / 4 + 0 * windowWidth / 12, 0).parent(backgroundDiv).addClass('btn btn-danger');
    gButton.mousePressed(gButtonFunction).size(windowWidth / 12, windowHeight / 10).position(2 * windowWidth / 4 + 1 * windowWidth / 12, 0).parent(backgroundDiv).addClass('btn btn-success');
    bButton.mousePressed(bButtonFunction).size(windowWidth / 12, windowHeight / 10).position(2 * windowWidth / 4 + 2 * windowWidth / 12, 0).parent(backgroundDiv).addClass('btn btn-primary');
    switchButton.mousePressed(switchFunction).size(windowWidth / 4, windowHeight / 10).position(3 * windowWidth / 4, 0).parent(backgroundDiv).addClass('btn btn-danger').style("font-size", "3vh");
    graph.size(windowWidth / 3, 4.5 * height / 10).position(2 * windowWidth / 3, windowHeight / 10 + height / 10).style("background-color", "white");
    graphCanvas.size(0, 0).position(0, 0).id("graphChart").parent(graph);
    cmfGraph.size(windowWidth / 3, 4.5 * height / 10).position(2 * windowWidth / 3, windowHeight / 10 + 5.5 * height / 10).style("background-color", "white");
    cmfGraphCanvas.size(0, 0).position(0, 0).id("cmfGraphChart").parent(cmfGraph);
    let lh = height / 10;
    incidentColor.size(windowWidth / 6, height / 10).position(2 * windowWidth / 3, windowHeight / 10).style('background', 'white').style('text-align', 'center')
        .style("font-size", "3vh").style('line-height', lh + 'px').addClass("fw-bold");
    transmittedColor.size(windowWidth / 6, height / 10).position(2 * windowWidth / 3 + windowWidth / 6, windowHeight / 10).style('background', 'white')
        .style('text-align', 'center').style("font-size", "3vh").style('line-height', lh + 'px').addClass("fw-bold");
}


//csvファイル内のデータを格納する配列
let waveLength = [],
    intensity = [];
let rgb = [];
let cmfr = [],
    cmfg = [],
    cmfb = [];
let lightSourceIntensity = [];

//csvファイルないのデータを配列に格納する手続き
function csvDataLoad() {
    let rowCount = spectrumSheet.getRowCount();
    for (let i = 0; i < 10; i++) {
        intensity[i] = [];
        rgb[i] = [];
        for (let j = 1; j < rowCount; j++) {
            intensity[i][j] = spectrumSheet.getNum(j, i) / 1000;
        }
        for (let j = 0; j < 3; j++) {
            rgb[i][j] = rgbSheet.getNum(i + 1, j + 1);
        }
    }
    for (let i = 1; i < rowCount; i++) {
        waveLength[i] = cmfSheet.getNum(i, 0);
        cmfr[i] = cmfSheet.getNum(i, 1);
        cmfg[i] = cmfSheet.getNum(i, 2);
        cmfb[i] = cmfSheet.getNum(i, 3);
        lightSourceIntensity[i] = lightSourceSpectrumSheet.getNum(i, 1) / 1000;
    }
}


//初期値に関する変数
let rays_number,
    r_rays,
    g_rays,
    b_rays,
    waveRepresentation,
    switchIs,
    rIs,
    gIs,
    bIs,
    //波長600 nmのセロハン一枚当たりの位相差
    opdr,
    //波長550 nmのセロは一枚当たりの位相差
    opdg,
    //波長450 nmのセロハン一枚当たりの位相差
    opdb;

function initValue() {
    rays_number = 300;
    r_rays = new Array(rays_number);
    g_rays = new Array(rays_number);
    b_rays = new Array(rays_number);
    for (let i = 0; i < rays_number; i < i++) {
        r_rays[i] = new Ray(150 + i * (300 / rays_number), 'r');
        g_rays[i] = new Ray(150 + i * (300 / rays_number), 'g');
        b_rays[i] = new Ray(150 + i * (300 / rays_number), 'b');
    }
    camera(300, 0, 0, 0, 0, 0, 0, 1, 0);
    waveRepresentation = 'sphere';
    switchIs = true;
    rIs = true;
    gIs = true;
    bIs = true;
    opdr = 212.596704;
    opdg = 213.5303046;
    opdb = 215.5841246;
    frameRate(30);
}

function setup() {
    fullScreen()
    elCreate()
    elInit()
    initValue()
    csvDataLoad();
    incidentColor.style('background', 'rgb(144,181,130')
    transmittedColor.style('background', 'rgb(' + rgb[cellophaneCountSlider.value() - 1][0] + ',' + rgb[cellophaneCountSlider.value() - 1][1] + ',' + rgb[cellophaneCountSlider.value() - 1][2] + ')');
}

//偏光板を描画する関数
function createPolarizer(size, x, y, z, pattern) {
    push();
    translate(x, y, z);
    noFill();
    strokeWeight(2);
    stroke(0, 50);
    box(size, size, 0);
    if (pattern == 0) {
        for (let i = 0; i < size; i += 5) {
            line(size / 2 - i, -size / 2, 0, -size / 2, size / 2 - i, 0);
            line(size / 2, -size / 2 + i, 0, -size / 2 + i, size / 2, 0);
        }
    } else if (pattern == 1) {
        for (let i = 0; i < size; i += 5) {
            line(-size / 2, -size / 2 + i, 0, size / 2 - i, size / 2, 0);
            line(-size / 2 + i, -size / 2, 0, size / 2, size / 2 - i, 0);
        }
    }
    pop();
}

//背景のデザインを規定する手続き
function main() {
    //スタート寄りの偏光板
    createPolarizer(125, 0, 0, 100, 0);

    //ゴール寄りの偏光板
    createPolarizer(125, 0, 0, -100, 1);

    strokeWeight(1);
    //光の進行方向の軸
    //長さは300px
    fill(0);
    stroke(0);
    push();
    rotateX(PI / 2);
    cylinder(1, 300, 8, 8);
    pop();
    push();
    rotateX(-PI / 2);
    translate(0, 150, 0);
    cone(4, 7, 10, 10, true);
    pop();

    //セロハンの描画
    fill(0, 255, 255, 15);
    strokeWeight(1);
    push();
    translate(0, 0, cellophaneCountSlider.value());
    for (let i = 0; i < cellophaneCountSlider.value(); i++) {
        push();
        translate(0, 0, -2 * i);
        box(50, 100, 2);
        pop();
    }
    pop();
}

//グラフを描画する手続き
function graphDraw() {
    if (typeof graphChart !== 'undefined' && graphChart) {
        graphChart.destroy();
    }
    let ctx1 = document.getElementById('graphChart').getContext('2d');
    let data1 = {
        labels: waveLength,
        datasets: [{
            label: "入射光",
            data: lightSourceIntensity,
            borderColor: 'rgba(0, 0, 0 ,1)',
            lineTension: 0.3,
        }, {
            label: "出射光（セロハンテープが" + cellophaneCountSlider.value() + "枚の時）",
            data: intensity[cellophaneCountSlider.value() - 1],
            fill: true,
            backgroundColor: 'rgba(' + rgb[cellophaneCountSlider.value() - 1][0] + ',' + rgb[cellophaneCountSlider.value() - 1][1] + ',' + rgb[cellophaneCountSlider.value() - 1][2] + ',0.5)',
            borderColor: 'rgba(' + rgb[cellophaneCountSlider.value() - 1][0] + ',' + rgb[cellophaneCountSlider.value() - 1][1] + ',' + rgb[cellophaneCountSlider.value() - 1][2] + ',1)',
            lineTension: 0.3,
        }
        ]
    }
    let options1 = {
        scales: {
            x: {
                display: true,
                title: {
                    display: true,
                    text: '波長(nm)'
                }
            },
            y: {
                display: true,
                title: {
                    display: true,
                    text: '強度(a.u.)'
                },
                min: 0
            }
        },
        plugins: {
            title: {
                display: true,
                text: 'スペクトル'
            },
        },
        animation: false
    }
    graphChart = new Chart(ctx1, {
        type: 'line',
        data: data1,
        options: options1
    });

    if (typeof cmfGraphChart !== 'undefined' && cmfGraphChart) {
        cmfGraphChart.destroy();
    }

    let ctx2 = document.getElementById('cmfGraphChart').getContext('2d');
    let data2 = {
        labels: waveLength,
        datasets: [{
            label: "x(λ)",
            data: cmfr,
            borderColor: 'rgba(255, 0, 0, 1)',
            lineTension: 0.3,
        }, {
            label: "y(λ)",
            data: cmfg,
            borderColor: 'rgba(0, 255, 0, 1)',
            lineTension: 0.3,
        }, {
            label: "z(λ)",
            data: cmfb,
            borderColor: 'rgba(0, 0, 255, 1)',
            lineTension: 0.3,
        }]
    }
    let options2 = {
        scales: {
            x: {
                display: true,
                title: {
                    display: true,
                    text: '波長(nm)',
                }
            },
            y: {
                display: true,
                title: {
                    display: true,
                    text: '強度(a.u.)'
                },
                min: 0
            }
        },
        plugins: {
            title: {
                display: true,
                text: '測色標準観測者の等色関数'
            },
        },
        animation: false
    }
    cmfGraphChart = new Chart(ctx2, {
        type: 'line',
        data: data2,
        options: options2
    });
}

function draw() {
    orbitControl(10, 10, 10);
    //背景色
    background(100);
    for (let i = 0; i < rays_number; i++) {
        r_rays[i]._draw();
        g_rays[i]._draw();
        b_rays[i]._draw();
    }
    main();
    graphDraw();
}

function windowResized() {
    fullScreen()
    elInit()
    initValue()
    incidentColor.style('background', 'rgb(144,181,130')
    transmittedColor.style('background', 'rgb(' + rgb[cellophaneCountSlider.value() - 1][0] + ',' + rgb[cellophaneCountSlider.value() - 1][1] + ',' + rgb[cellophaneCountSlider.value() - 1][2] + ')');
}

//光線のクラス
class Ray {
    constructor(z, color) {
        this.posx = 0;
        this.posy = 0;
        this.posz = z;
        this.t = 0;
        this.x = true;
        this.y = true;
        this.z = true;
        this.clr = color;
        this.w = 0;
        this.opd = 0;
        this.wl = 0;
        this.magnification = 1;
    }
    _draw() {
        //波長700 nmの１フレーム当たりの角速度
        //単位は (°)
        if (this.clr == 'r') {
            this.w = (2 * 180 / 25);
            this.opd = cellophaneCountSlider.value() * opdr;
            this.wl = 600;
            this.magnification = (1.0 / 2.0) * (1 - cos(this.opd / this.wl * 2 * PI))
        }
        if (this.clr == 'g') {
            this.w = (2 * 180 / 25) * 0.78;
            this.opd = cellophaneCountSlider.value() * opdg;
            this.wl = 550;
            this.magnification = (1.0 / 2.0) * (1 - cos(this.opd / this.wl * 2 * PI))
        }
        if (this.clr == 'b') {
            this.w = (2 * 180 / 25) * 0.62214285714;
            this.opd = cellophaneCountSlider.value() * opdb;
            this.wl = 450;
            this.magnification = (1.0 / 2.0) * (1 - cos(this.opd / this.wl * 2 * PI))
        }
        if (switchIs == true) {
            if (this.posz <= 150) {
                this.t += this.w;
            }
            this.posz -= 1;
        }
        if (this.posz < -150) {
            this.posz = 150;
            this.t = 0;
        }
        if (100 < this.posz && this.posz < 150) {
            this.x = true;
            this.y = true;
            this.z = true;
            this.posx = 25 * sin(radians(this.t));
            this.posy = -25 * sin(radians(this.t));
        } else if (cellophaneCountSlider.value() < this.posz && this.posz < 100) {
            this.x = false;
            this.y = false;
            this.z = true;
            this.posx = 25 * sin(radians(this.t));
            this.posy = -25 * sin(radians(this.t));
        }
        else if (-100 < this.posz && this.posz < -cellophaneCountSlider.value()) {
            this.x = false;
            this.y = false;
            this.z = true;
            this.posx = 25 * sin(radians(this.t) + (this.opd / this.wl) * (2 * PI));
            this.posy = -25 * sin(radians(this.t));
        } else if (-150 < this.posz && this.posz < -100) {
            this.x = false;
            this.y = false;
            this.z = true;
            this.posx = sqrt(this.magnification) * 25 * sin(radians(this.t) + (this.opd / this.wl) * (2 * PI));
            this.posy = sqrt(this.magnification) * 25 * sin(radians(this.t) + (this.opd / this.wl) * (2 * PI));
        } else {
            this.x = false;
            this.y = false;
            this.z = false;
        }
        if (waveRepresentation == 'line') {
            if (this.clr == 'r') {
                stroke(255, 0, 0);
                if (rIs == true) {
                    strokeWeight(1);
                }
                else {
                    strokeWeight(0.1);
                }
            }
            if (this.clr == 'g') {
                stroke(0, 255, 0);
                if (gIs == true) {
                    strokeWeight(1);
                } else {
                    strokeWeight(0.1);
                }
            }
            if (this.clr == 'b') {
                stroke(0, 0, 255);
                if (bIs == true) {
                    strokeWeight(1);
                } else {
                    strokeWeight(0.1);
                }
            }
            //x方向の波
            push();
            if (this.x == true) {
                line(0, 0, this.posz, this.posx, 0, this.posz)
            }
            pop();
            //y方向の波
            push();
            if (this.y == true) {
                line(0, 0, this.posz, 0, this.posy, this.posz)
            }
            pop();
            //z方向の波
            push();

            if (this.z == true) {
                line(0, 0, this.posz, this.posx, this.posy, this.posz)
            }
            pop();
        } else {
            noStroke();
            if (this.clr == 'r') {
                if (rIs == true) {
                    fill(255, 0, 0, 255);
                }
                else {
                    fill(255, 0, 0, 50);
                }
            }
            if (this.clr == 'g') {
                if (gIs == true) {
                    fill(0, 255, 0, 255);
                } else {
                    fill(0, 255, 0, 50);
                }
            }
            if (this.clr == 'b') {
                if (bIs == true) {
                    fill(0, 0, 255, 255);
                } else {
                    fill(0, 0, 255, 50);
                }
            }
            //x方向の波
            push();
            translate(this.posx, 0, this.posz);
            if (this.x == true) {
                sphere(1.5);
            }
            pop();
            //y方向の波
            push();
            translate(0, this.posy, this.posz);
            if (this.y == true) {
                sphere(1.5);
            }
            pop();
            //z方向の波
            push();
            translate(this.posx, this.posy, this.posz);

            if (this.z == true) {
                sphere(1.5);
            }
            pop();
        }
    }
}