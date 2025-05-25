export class BicpemaCanvasController {
    /**
     * @constructor
     * @param {p5Instance} p
     * @param {boolean} f 回転時に比率を固定化するか
     * @param {boolean} i 3Dかどうか
     * @param {number} w_r 幅の比率（0.0~1.0）
     * @param {number} h_r 高さの比率（0.0~1.0）
     */
    constructor(p, f = true, i = false, w_r = 1.0, h_r = 1.0) {
        this.p = p;
        this.fixed = f;
        this.is3D = i;
        this.widthRatio = w_r;
        this.heightRatio = h_r;
    }
    /**
     * HTML要素で生成している#p5Canvasと#navBarを元にcanvasを生成する。
     */
    fullScreen() {
        const P5_CANVAS = this.p.select("#p5Canvas");
        const NAV_BAR = this.p.select("#navBar");
        let canvas, w, h;
        if (this.fixed) {
            const RATIO = 9 / 16;
            w = this.p.windowWidth;
            h = w * RATIO;
            if (h > this.p.windowHeight - NAV_BAR.height) {
                h = this.p.windowHeight - NAV_BAR.height;
                w = h / RATIO;
            }
        } else {
            w = this.p.windowWidth;
            h = this.p.windowHeight - NAV_BAR.height;
        }
        if (this.is3D) {
            canvas = this.p.createCanvas(w * this.widthRatio, h * this.heightRatio, this.p.WEBGL);
        } else {
            canvas = this.p.createCanvas(w * this.widthRatio, h * this.heightRatio);
        }
        canvas.parent(P5_CANVAS).class("rounded border border-1");
    }

    /**
     * HTML要素で生成している#p5Canvasと#navBarを元にcanvasをリサイズする。
     */
    resizeScreen() {
        const NAV_BAR = this.p.select("#navBar");
        let w = 0;
        let h = 0;
        if (this.fixed) {
            const RATIO = 9 / 16;
            w = this.p.windowWidth;
            h = w * RATIO;
            if (h > this.p.windowHeight - NAV_BAR.height) {
                h = this.p.windowHeight - NAV_BAR.height;
                w = h / RATIO;
            }
        } else {
            w = this.p.windowWidth;
            h = this.p.windowHeight - NAV_BAR.height;
        }
        this.p.resizeCanvas(w * this.widthRatio, h * this.heightRatio);
    }
}