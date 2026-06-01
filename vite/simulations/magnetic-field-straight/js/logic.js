let lastCurrentVal = null;

function getCurrentVal() {
  const currentSlider = document.getElementById("currentSlider");
  return currentSlider ? parseFloat(currentSlider.value) : 1;
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

function drawFlowArrow(p, r, currentVal, arrowSize = 6, color = null) {
  // Arrow indicates direction; size reflects relative field strength at that radius
  const direction = currentVal >= 0 ? 1 : -1;
  const t = (p.frameCount * 0.02 * direction) % p.TWO_PI;
  const x = r * p.cos(t);
  const z = r * p.sin(t);
  p.push();
  p.translate(x, 0, z);
  let directionOffset = currentVal >= 0 ? p.PI / 2 : -p.PI / 2;
  p.rotateY(-t + directionOffset);
  p.noStroke();
  if (color) {
    p.fill(color);
  } else {
    p.fill("#0073FF");
  }
  p.rotateZ(p.PI / 2);
  p.cone(arrowSize, arrowSize * 2);
  p.pop();
}

function drawFieldLines(p, currentVal) {
  const absI = p.abs(currentVal);
  if (absI <= 0.01) {
    return;
  }

  const radii = [30, 50, 70, 90, 110, 130, 150, 170];
  const rMin = radii[0];

  // determine maximum current from slider to normalize color/weight scale
  const slider = document.getElementById("currentSlider");
  const maxCurrent = slider
    ? Math.max(
        Math.abs(parseFloat(slider.min)),
        Math.abs(parseFloat(slider.max))
      )
    : 4;
  const maxB = maxCurrent / rMin; // maximum B we'll map to the strongest color

  // Color scale from light cyan (weak) to deep blue (strong)
  const colLow = p.color(200, 240, 255);
  const colHigh = p.color(0, 96, 255);

  for (let i = 0; i < radii.length; i++) {
    const r = radii[i];
    const b = absI / r; // actual (relative) field magnitude
    const t = p.constrain(b / maxB, 0, 1);
    const strokeCol = p.lerpColor(colLow, colHigh, t);
    const weight = p.lerp(0.8, 5, t);

    p.noFill();
    p.stroke(strokeCol);
    p.strokeWeight(weight);
    drawCircle(p, r);

    // Arrow size proportional to field strength at this radius
    const arrowSize = p.map(b, 0, maxB, 3, 12, true);
    drawFlowArrow(p, r, currentVal, arrowSize, strokeCol);
  }
}

function updateInfoPanel(currentVal) {
  const fieldDirectionLabel = document.getElementById("fieldDirectionLabel");
  if (fieldDirectionLabel) {
    if (currentVal > 0.1) {
      fieldDirectionLabel.textContent = "現在の磁場の向き: 反時計回り";
    } else if (currentVal < -0.1) {
      fieldDirectionLabel.textContent = "現在の磁場の向き: 時計回り";
    } else {
      fieldDirectionLabel.textContent = "現在の磁場の向き: なし（I=0）";
    }
  }

  // show relative B at a fixed observation radius
  const bValueEl = document.getElementById("bValueDisplay");
  if (bValueEl) {
    const rObs = 50;
    const bVal = Math.abs(currentVal) / rObs;
    bValueEl.textContent = `相対磁場強度 (r=${rObs}): B ∝ |I|/r = ${bVal.toFixed(4)}`;
  }
}

export function drawSimulation(p) {
  p.background(240);
  p.orbitControl();
  const currentVal = getCurrentVal();
  drawWire(p, currentVal);
  drawFieldLines(p, currentVal);

  if (lastCurrentVal !== currentVal) {
    updateInfoPanel(currentVal);
    lastCurrentVal = currentVal;
  }
}
