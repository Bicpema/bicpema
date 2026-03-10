// Import our custom CSS
import "../scss/common.scss";

// Import jQuery and expose it globally
import $ from "jquery";
window.$ = window.jQuery = $;

// Import all of Bootstrap's JS
import "bootstrap";

// Import simulation's dependencies
import Chart from "chart.js/auto";
window.Chart = Chart;
import p5 from "p5";
// p5をグローバルモードで初期化(全シミュレーションで利用可能に)
new p5();
import html2canvas from "html2canvas";
window.html2canvas = html2canvas;
import * as math from "mathjs";
// mathjsの必要な関数のみをMathオブジェクトに追加
Math.sum = math.sum;
Math.multiply = math.multiply;
// mathをグローバルに公開
window.math = math;
import "matter-js";
