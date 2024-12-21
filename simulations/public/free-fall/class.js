export class Ball {
  constructor(p, g) {
    this.p = p;
    this.posX = 100;
    this.posY = 50;
    this.velocity = 0;
    this.gravity = g;
  }
  update() {
    this.velocity += this.gravity / 30;
    this.posY += this.velocity / 30;
  }
  draw() {
    this.p.ellipse(this.posX, this.posY, 50, 50);
  }
}
