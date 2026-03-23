let currentSlider;
let label;

function setup() {
  createCanvas(900, 600, WEBGL);
  // 視点の設定
  camera(
      0, -300, 600,  // カメラ位置
      0, 0, 0,       // 見る場所
      0, 1, 0        // 上方向
    );
  
  // UIの構築
  label = createP('電流の強さ: 1.0 A');
  label.style('color', 'black');
  label.position(20, 0);

  // スライダー：-3から3まで、初期値1
  currentSlider = createSlider(-4, 4, 1, 1);
  currentSlider.position(20, 40);
  currentSlider.input(() => {
    label.html(`電流の強さ: ${currentSlider.value().toFixed(1)} A`);
  });
}

function draw() {
  background(240);
  orbitControl(); // マウスで視点を動かせます

  let currentVal = currentSlider.value();  

  drawWire(currentVal);
  drawFieldLines(currentVal);
}

function drawWire(currentVal) {
  push();
  noStroke();
  
  // 電流の向きを示す黄色い矢印（強さに比例して速くなる）
  if (abs(currentVal) > 0.1) {
    fill("#FF8C00");
    let speed = currentVal ;
    let yOffset = (frameCount * speed) % 40;
    
    for (let i = -6; i < 6; i++) {
      push();
      translate(0, i * 40 + yOffset, 0);
      if (currentVal < 0) {
        translate(0, 40, 0);
        rotateX(PI)
      }
      cone(5,10);
      translate(0,-10,0);
      cylinder(2, 10);
      pop();
    }
  }
  fill(200,200,200,100);
  cylinder(8, 500); // 導体
  pop();
}

function drawFieldLines(currentVal) {
  let val = abs(currentVal);

  let numLines = val * 2; 

  for (let i = 0; i < numLines; i++) {
    let r = 180-(180/numLines)*i; // 半径
 
    noFill();
    stroke("#0073FF");
    
    // 磁力線の円を描画
    drawCircle(r);

    // 磁力線上の動く矢印（右ねじの法則）
    drawFlowArrow(r, 0, currentVal);
  }
}

function drawCircle(R) {
  beginShape();
  for (let theta = 0; theta <= TWO_PI; theta += 0.05) {
    vertex(R * cos(theta), 0, R * sin(theta));
  }
  endShape(CLOSE);
}

function drawFlowArrow(r, y, currentVal) {
  let t = (frameCount *0.0* currentVal) % TWO_PI;
  
  let x = r * cos(t);
  let z = r * sin(t);
  
  push();
  translate(x, y, z);

  // 接線方向（右ねじの法則）に向かせる計算
  let directionOffset = (currentVal >= 0) ? PI/2 : -PI/2;
  rotateY(-t + directionOffset); 
  noStroke();
  fill("#0073FF");
  rotateZ(PI/2); 
  cone(4, 10); // 磁力線の向きを示す矢印
  pop();
   push();
  translate(-x, -y, z);

  // 接線方向（右ねじの法則）に向かせる計算
  directionOffset = (currentVal <= 0) ? PI/2 : -PI/2;
  rotateY(-t + directionOffset); 
  noStroke();
  fill("#0073FF");
  rotateZ(PI/2); 
  cone(4, 10); // 磁力線の向きを示す矢印
  pop();
}