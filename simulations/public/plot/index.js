let table;
let x = [];
let y = [];
let mag_x, mag_y;

// まずはx軸とy軸の値を持つ2列のcsvファイルを読み込む
function preload() {
    table = loadTable('Book000.csv', 'csv');
}

function setup() {
    createCanvas(400, 400);
    // 読み込んだ表の行数を得る
    let rowCount = table.getRowCount();
    // 表の行数分だけ繰り返す
    for (let i = 0; i < rowCount; i++) {
        // 各列の数値を各配列に入れる
        x[i] = table.getNum(i, 0);
        y[i] = table.getNum(i, 1);

    }
    //グラフにプロットする数値を画面サイズにするための倍率
    mag_x = (width - width / 10) / (max(x) - min(x));
    mag_y = (height - height / 10) / (max(y) - min(y));

}

function draw() {
    background(200);
    noFill();
    stroke(0);
    translate((width - ((max(x) + min(x)) * mag_x)) / 2,
        (height + ((max(y) + min(y)) * mag_y)) / 2);

    // 撒布図を描く
    for (let j = 0; j < x.length; j++) {

        ellipse(x[j] * mag_x, -(y[j] * mag_y), 8, 8);
    }
    ellipse(0, 0, 2, 2);//原点の位置
    //x軸とy軸を描く
    line(min(x) * mag_x - width / 10, 0,
        max(x) * mag_x + width / 10, 0);
    line(0, -min(y) * mag_y + height / 10, 0,
        -max(y) * mag_y - height / 10);

}