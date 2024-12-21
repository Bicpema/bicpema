class FallBall {
  constructor(x, m, t) {
    this.posX = x;
    this.posY = 50;
    this.velocity = 0;
    this.mass = m;
    this.type = t;
    this.gravity = 9.8;
    this.arr = [];
  }

  fallBallDraw() {
    fill(255);
    switch (this.type) {
      case "free":
        text("抵抗なし", this.posX, width / 50);
        this.velocity = (this.gravity * count) / FPS;
        this.posY += this.velocity;
        fill(255, 0, 0);
        break;

      case "viscosity":
        text("粘性抵抗あり", this.posX, width / 50);
        this.velocity = (this.mass * this.gravity * (1 - exp(-count / this.mass))) / FPS;
        this.posY += this.velocity;
        fill(0, 255, 0);
        break;

      case "inertia":
        text("慣性抵抗あり", this.posX, width / 50);
        this.velocity = (sqrt(this.mass * this.gravity) * Math.tanh(sqrt(this.gravity / this.mass) * count)) / FPS;
        this.posY += this.velocity;
        fill(0, 0, 255);
        break;

      default:
        text("抵抗なし（無指定）", width / 12, width / 50);
        this.velocity = (this.gravity * count) / FPS;
        this.posY = (1 / 2) * this.gravity * sq(count / FPS);
        fill(255, 0, 0);
        break;
    }
    ellipse(this.posX, this.posY, 20, 20);
  }

  trajectoryDraw() {
    if (count % 5 == 0) {
      this.arr.push(this.posY);
    }
    for (let i = 0; i < this.arr.length; i++) {
      ellipse(this.posX, this.arr[i], 20, 20);
    }
  }
}
