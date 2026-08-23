export class BicpemaCanvasController {
  constructor(fixed = true, is3D = false, widthRatio = 1.0, heightRatio = 1.0) {
    this.fixed = fixed;
    this.is3D = is3D;
    this.widthRatio = widthRatio;
    this.heightRatio = heightRatio;
  }

  fullScreen(p) {
    const canvasContainer = p.select("#p5Canvas");
    const navBar = p.select("#navBar");
    const { width, height } = this.getSize(p, navBar);
    const canvas = this.is3D
      ? p.createCanvas(width * this.widthRatio, height * this.heightRatio, p.WEBGL)
      : p.createCanvas(width * this.widthRatio, height * this.heightRatio);
    canvas.parent(canvasContainer).class("rounded border border-1");
  }

  resizeScreen(p) {
    const navBar = p.select("#navBar");
    const { width, height } = this.getSize(p, navBar);
    p.resizeCanvas(width * this.widthRatio, height * this.heightRatio);
  }

  getSize(p, navBar) {
    if (!this.fixed) {
      return { width: p.windowWidth, height: p.windowHeight - navBar.height };
    }

    const ratio = 9 / 16;
    let width = p.windowWidth;
    let height = width * ratio;
    if (height > p.windowHeight - navBar.height) {
      height = p.windowHeight - navBar.height;
      width = height / ratio;
    }
    return { width, height };
  }
}
