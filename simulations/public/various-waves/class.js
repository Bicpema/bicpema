class incidenceWave {
  constructor(l, a, f, c, n, t) {
    this.posx = 0;
    this.waveLength = l;
    this.amplitude = a;
    this.frequency = f;
    this.color = c;
    this.waveNum = n;
    this.waveType = t;
  }
  _update() {
    this.posx += 1;
  }
  _draw() {
    fill(255);
    strokeWeight(5);
    noFill();
    stroke(this.color.value());
    push();
    translate(this.posx, canvasHeight / 2);
    beginShape();
    for (let i = 0; i <= 60 * 2 * this.waveLength.value() * this.waveNum.value(); i++) {
      let amp = 60 * this.amplitude.value();
      let pha = 0;
      if (this.waveType.value() == "-sin波") {
        pha = (2 * PI * i) / (2 * 60 * this.waveLength.value());
      } else if (this.waveType.value() == "sin波") {
        pha = (-2 * PI * i) / (2 * 60 * this.waveLength.value());
      }
      vertex(-i / 2 + 60, amp * sin(pha));
    }
    endShape();
    pop();
  }
}

class DOM {
  constructor(n) {
    this.num = n;
    this.parentDiv = createDiv()
      .parent("#waveSettingDiv")
      .id("parentDiv-" + this.num)
      .class("input-group mb-2");
    this.span = createSpan(this.num + "組目")
      .parent(this.parentDiv)
      .class("input-group-text");
    this.waveLengthInput = createInput(1, "number")
      .parent(this.parentDiv)
      .id("waveLengthInput-" + this.num)
      .attribute("placeholder", "波長")
      .attribute("min", "1")
      .class("form-control");
    this.amplitudeInput = createInput(1, "number")
      .parent(this.parentDiv)
      .id("amplitudeInput-" + this.num)
      .attribute("placeholder", "振幅")
      .attribute("min", "1")
      .class("form-control");
    this.frequencyInput = createInput(1, "number")
      .parent(this.parentDiv)
      .id("frequencyInput-" + this.num)
      .attribute("placeholder", "振動数")
      .attribute("min", "1")
      .class("form-control");
    this.waveTypeInput = createSelect()
      .parent(this.parentDiv)
      .id("waveTypeInput-" + this.num)
      .class("form-select");
    let optionArr = ["sin波", "-sin波"];
    for (let i = 0; i < optionArr.length; i++) this.waveTypeInput.option(optionArr[i]);
    this.waveNumInput = createInput(1, "number")
      .parent(this.parentDiv)
      .id("waveNumInput-" + this.num)
      .attribute("placeholder", "波数")
      .attribute("min", "1")
      .class("form-control");
    this.colorInput = createColorPicker()
      .parent(this.parentDiv)
      .id("colorInput-" + this.num)
      .class("form-control form-control-color");
  }
}
