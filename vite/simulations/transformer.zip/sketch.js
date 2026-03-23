let img1, img2, img3;
let radio1,radio2;
let count1 = 19;
let count2 = 4;
let k=5;
let omega=1;
let t=0;
let phase=true;
let radio;
const minCount = 4;
const maxCount = 19;
const angle = -20;
const amp = 30;


let topY1,topY2;

function preload() {
  img1 = loadImage("https://firebasestorage.googleapis.com/v0/b/bicpema.firebasestorage.app/o/public%2Fassets%2Fimg%2Ftrans%2FTransformer.png?alt=media&token=70310a44-504b-4e40-8180-c0806ca6a925"); // assetsフォルダ内の画像
  img2 = loadImage("https://firebasestorage.googleapis.com/v0/b/bicpema.firebasestorage.app/o/public%2Fassets%2Fimg%2Ftrans%2Fcoil1.png?alt=media&token=c72113f3-d995-496a-bc88-5b80653b68bd");
  img3 = loadImage("https://firebasestorage.googleapis.com/v0/b/bicpema.firebasestorage.app/o/public%2Fassets%2Fimg%2Ftrans%2Fcoil2.png?alt=media&token=23ef07d6-1a31-4a06-9b3b-aae6f433866a");
}

function setup() {
  createCanvas(1100, 1100*0.6);
  angleMode(DEGREES);
  radio1=createRadio();
  radio1.option("phasetrue","同位相");
  radio1.option("phasefalse","逆位相");
  radio1.selected("phasetrue");
  
  radio1.position(width/2,height-60);
  radio2=createRadio();
  radio2.option("1","ゆっくり");
  radio2.option("5","はやい");
  radio2.selected("1");
  radio2.position(width/2-200,height-60);

 
  button1();
  button2();
}

function draw() {
  if(radio1.value()=="phasetrue"){
    phase=true;
  }if(radio1.value()=="phasefalse"){
    phase=false;
  }
  omega=radio2.value();
  
  background(255);
 
  textSize(16);
  textAlign(CENTER,TOP);
  text("一次コイル", 395, 450);
  text("巻数："+(count1+1), 395, 475);
  text("二次コイル", 645, 450);
  text("巻数："+(count2+1), 645, 475);

  push();
    translate(350,0);
    image(img1, 0, 50, 396, 376); //鉄心の描画
    magline();
    coil1();//コイルの描写
    coil2();//コイルの描写
    
  pop();
  
  push();
    translate(50,150);
    oscillo1();
  pop();
  
  push();
    translate(850,150);
    oscillo2();
  pop()
  
  t++;
  
}

function button1(){
  const plusBtn = createButton("＋");
  plusBtn.position(350, 500);
  plusBtn.size(40,40);
  plusBtn.style("background-color", "#e06941");
  plusBtn.style("border-radius", "20px");
  plusBtn.style("font-weight", "bold");
  plusBtn.style("font-size", "16px");
  plusBtn.style("border", "none");
  plusBtn.style("color", "white");  
  plusBtn.mousePressed(() => {
    count1 = constrain(count1+5, minCount, maxCount);
  });

  const minusBtn = createButton("ー");
  minusBtn.position(400, 500);
  minusBtn.size(40,40);
  minusBtn.style("background-color", "#4169e1");
  minusBtn.style("border-radius", "20px");
  minusBtn.style("font-weight", "bold");
  minusBtn.style("font-size", "16px");
  minusBtn.style("border", "none");
  minusBtn.style("color", "white");  
  minusBtn.mousePressed(() => {
    count1 = constrain(count1-5, minCount, maxCount);
  });
}

function button2(){
  const plusBtn = createButton("＋");
  plusBtn.position(600, 500);
  plusBtn.size(40,40);
  plusBtn.style("background-color", "#e06941");
  plusBtn.style("border-radius", "20px");
  plusBtn.style("font-weight", "bold");
  plusBtn.style("font-size", "16px");
  plusBtn.style("border", "none");
  plusBtn.style("color", "white");
  plusBtn.mousePressed(() => {
    count2 = constrain(count2+5, minCount, maxCount);
  });

  const minusBtn = createButton("ー");
  minusBtn.position(650, 500);
  minusBtn.size(40,40);
  minusBtn.style("background-color", "#4169e1");
  minusBtn.style("border-radius", "20px");
  minusBtn.style("font-weight", "bold");
  minusBtn.style("font-size", "16px");
  minusBtn.style("border", "none");
  minusBtn.style("color", "white");  
  minusBtn.mousePressed(() => {
    count2 = constrain(count2-5, minCount, maxCount);
  });
}

function coil1(){
  const x = 0;
  const w = 91;
  const h = 5;
  const x2 = x+w-2;
  const w2 = 45;
  const y = 250 - (count1 * h) / 2;
  const d = sin(-angle)*w2
  
  image(img2, x-77, y-h-d, 78, h);
  image(img2, x-77, y+count1*h, w+77, h);
  
  push(); // 座標系を保存
    translate(x2, y+count1*h);
    rotate(angle);
    image(img3, 0, 0, w2, h);
  pop(); 
  
  for (let k = 0; k < count1; k++) {
    topY1 = y + k * h;
    image(img2, x, topY1, w, h);
    
    push();                 // 座標系を保存
    translate(x2, topY1);       // (x2, y) を原点にする
    rotate(angle);          // 回転
    image(img3, 0, 0, w2, h); // 原点に描画
    pop();                  // 座標系を復元
  }
  
  push();
    translate(-40,y+count1*h);
    current1();
    noStroke();
    fill(255,0,0);
    textSize(16);
    textAlign(CENTER,TOP);
    text("一次電流",0,20);
  pop();
}

function coil2(){
  const x = 260;
  const w = 87;
  const h = 5;
  const x2 = x+w-2;
  const w2 = 53;
  const y = 250 - (count2 * h) / 2;
  const d = sin(-angle)*w2
  
  for (let k = 0; k < count2; k++) {
    topY2 = y + k * h;
    image(img2, x, topY2, w, h);
    
    push();                 // 座標系を保存
    translate(x2, topY2);       // (x2, y) を原点にする
    rotate(angle);          // 回転
    image(img3, 0, 0, w2, h); // 原点に描画
    pop();     
  }
  if(phase){
    image(img2, x, y+count2*h, w, h);
    
    push(); 
      translate(x2, y+count2*h); 
      rotate(angle); 
      image(img3, 0, 0, w2, h); 
    pop();
    
    image(img3, x+w, y+count2*h, w+30, h);
    image(img3, x+135, y-h-d, w*2-135+30, h);
    
    push();
      translate(x2+82,y-h-d);
      current2();
      noStroke();
      fill(255,0,0);
      textSize(16);
      textAlign(CENTER,BOTTOM);
      text("二次電流",5,-10);
    pop();
    
  }if(!phase){
    image(img2, x, y-h, w, h);
    push(); 
      translate(x2, y-h); 
      rotate(angle); 
      image(img3, 0, 0, w2, h); 
    pop();
    image(img3, x+135, y+count2*h, w*2-135+30, h);
    image(img3, x+w, y-h, w+30, h);
    
    push();
      translate(x2+82,y-h);
      current2();
      noStroke();
      fill(255,0,0);
      textSize(16);
      textAlign(CENTER,BOTTOM);
      text("二次電流",5,-10);
    pop();
  }
    
}

function oscillo1(){
  const w = 200;
  const h = 200;
  const V1 = h / 10;
  textSize(16);
  textAlign(CENTER,BOTTOM);
  text("一次電圧",100,-10);
  fill(75,127,127,220);
  noStroke();
  rect(0,0,w,h);
  stroke(200);
   for(let i=0;i<=w;i+=V1){
    line(0,i,w,i);
    line(i,0,i,h);
  }
  noFill();
  stroke(0,255,255);
  strokeWeight(2);
  beginShape();
  for (let x = 0; x <= w; x++) {
    let y = h/2 + V1*sin( k*x - omega*t );
    vertex(x, y);
  }
  endShape();
}

function oscillo2(){
  const w = 200;
  const h = 200;
  const V1 = h / 10;
  let V2 = V1 * (count2+1)/(count1+1);
  textSize(16);
  textAlign(CENTER,BOTTOM);
  text("二次電圧",100,-10);
  fill(75,127,127,220);
  noStroke();
  rect(0,0,w,h);
  stroke(200);
  for(let i=0;i<=w;i+=V1){
    line(0,i,w,i)
    line(i,0,i,h)
  }
  noFill();
  stroke(0,255,255);
  strokeWeight(2);
  beginShape();
  for (let x = 0; x <= w; x++) {
    let y;
    if(phase){
      y = h/2 + V2 * sin( k*x - omega*t );
    }if(!phase){
      y = h/2 - V2 * sin( k*x - omega*t );
    }
   
    vertex(x, y);
  }
  endShape();
}

function magline(){
  rectMode(CENTER);
  noFill();
  stroke(0,50,200);
  strokeWeight(5);
  rect(177,252,250,250,20);
  if(sin(-omega*t)>=0){
    triangle(177-5,252+125+5,177-5,252+125-5,177+5,252+125);
    triangle(177+5,252-125+5,177+5,252-125-5,177-5,252-125);
  }
  if(sin(-omega*t)<0){
    triangle(177+5,252+125+5,177+5,252+125-5,177-5,252+125);
    triangle(177-5,252-125+5,177-5,252-125-5,177+5,252-125);
  }
  noStroke();
  fill(0,50,200);
  textSize(16);
  textAlign(CENTER,BOTTOM);
  text("磁力線",177,110);
}

function current1(){
  push();
  noStroke();
  fill(255,0,0);
    const I = 15* sin(omega * t);
    const x = 10 * sin(omega * t);
  quad(
    0, 0,      // 左上（固定）
    0 + I, 0,      // 右上（可動）
    0 + I, 0 + 5, // 右下（可動）
    0, 0 + 5  // 左下（固定）
  );
  triangle(I, 10, I, -5, I+x, 2.5);
  pop();
}

function current2(){
  push();
  noStroke();
  fill(255,0,0);
  let I,x;
  if(phase){
    I = 15*(count1+1)/(count2+1) * sin(omega * t);
    x = 10 * sin(omega * t);
  }else{
    I = -15*(count1+1)/(count2+1) * sin(omega * t);
    x = -10 * sin(omega * t);
  }
  quad(
    0, 0,      // 左上（固定）
    0 + I, 0,      // 右上（可動）
    0 + I, 0 + 5, // 右下（可動）
    0, 0 + 5  // 左下（固定）
  );
  triangle(I, 10, I, -5, I+x, 2.5);
  pop();
}

