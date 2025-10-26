// Import our custom CSS
import "../scss/common.scss";

// Import jQuery and expose it globally
import $ from "jquery";
window.$ = window.jQuery = $;

// Import all of Bootstrap's JS
import "bootstrap";

// Import simulation's dependencies
import "chart.js";
import p5 from "p5";
// p5をグローバルモードで初期化（全シミュレーションで利用可能に）
new p5();
import html2canvas from "html2canvas";
window.html2canvas = html2canvas;
import "mathjs";
import "matter-js";
