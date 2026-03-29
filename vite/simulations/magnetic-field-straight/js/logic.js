function getCurrentVal() {
  const slider = document.getElementById("currentSlider");
  return slider ? parseFloat(slider.value) : 1;
}

function drawWire(p, currentVal) {
  p.push();
  p.noStroke();
  if (p.abs(currentVal) > 0.1) {
    p.fill("#FF8C00");
    let speed = currentVal;
    let yOffset = (p.frameCount * speed) % 40;
    for (let i = -6; i < 6; i++) {
      p.push();
      p.translate(0, i * 40 + yOffset, 0);
      if (currentVal < 0) {
        p.translate(0, 40, 0);
        p.rotateX(p.PI);
      }
      p.cone(5, 10);
      p.translate(0, -10, 0);
      p.cylinder(2, 10);
      p.pop();
    }
  }
  p.fill(200, 200, 200, 100);
  p.cylinder(8, 500);
  p.pop();
}

function drawCircle(p, R) {
  p.beginShape();
  for (let theta = 0; theta <= p.TWO_PI; theta += 0.05) {
    p.vertex(R * p.cos(theta), 0, R * p.sin(theta));
  }
  p.endShape(p.CLOSE);
}

function drawFlowArrow(p, r, y, currentVal) {
  let t = (p.frameCount * 0.0 * currentVal) % p.TWO_PI;
  let x = r * p.cos(t);
  let z = r * p.sin(t);
  p.push();
  p.translate(x, y, z);
  let directionOffset = currentVal >= 0 ? p.PI / 2 : -p.PI / 2;
  p.rotateY(-t + directionOffset);
  p.noStroke();
  p.fill("#0073FF");
  p.rotateZ(p.PI / 2);
  p.cone(4, 10);
  p.pop();
  p.push();
  p.translate(-x, -y, z);
  directionOffset = currentVal <= 0 ? p.PI / 2 : -p.PI / 2;
  p.rotateY(-t + directionOffset);
  p.noStroke();
  p.fill("#0073FF");
  p.rotateZ(p.PI / 2);
  p.cone(4, 10);
  p.pop();
}

function drawFieldLines(p, currentVal) {
  let val = p.abs(currentVal);
  let numLines = val * 2;
  for (let i = 0; i < numLines; i++) {
    let r = 180 - (180 / numLines) * i;
    p.noFill();
    p.stroke("#0073FF");
    drawCircle(p, r);
    drawFlowArrow(p, r, 0, currentVal);
  }
}

export function drawSimulation(p) {
  p.background(240);
  p.orbitControl();
  let currentVal = getCurrentVal();
  drawWire(p, currentVal);
  drawFieldLines(p, currentVal);
}
