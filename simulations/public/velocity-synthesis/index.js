import p5 from "https://cdn.jsdelivr.net/npm/p5@1.11.0/+esm";
import { elementPositionInit, elementSelectInit, settingInit } from "./init.js";
import { CanvasController } from "../../../assets/js/bicpema/canvas/CanvasController.js";
import { Ship, Wave } from "./class.js";
import { moveIs } from "./init.js";

const sketch = (p) => {
  let font;
  p.preload = function () {
    font = p.loadFont("/assets/fonts/ZenMaruGothic-Regular.ttf");
  };

  let canvasController;
  let ship;
  let count = 0;
  const WINDOW_WIDTH = 1000;
  const WINDOW_HEIGHT = (1000 * 9) / 16;

  p.setup = function () {
    canvasController = new CanvasController(p);
    canvasController.fullScreen();
    settingInit(p, font);
    elementSelectInit(p);
    elementPositionInit(p);
    ship = new Ship(p, 0);
    for (let i = 0; i < 6; i++) {
      let wave = new Wave(p, (Math.random() * 3 * WINDOW_HEIGHT) / 4 - 20);
      wave.posX = Math.random() * WINDOW_WIDTH;
      waves.push(wave);
    }
  };

  let waves = [];
  p.draw = function () {
    p.scale(p.width / 1000);
    p.background(35, 169, 221);
    p.fill(151, 184, 98);
    p.rect(0, (3 * WINDOW_HEIGHT) / 4, WINDOW_WIDTH, WINDOW_HEIGHT);

    const waveVelocity = Number(p.select("#waveVelocityInput").value());

    count += 1;
    if (count % 120 === 0) {
      let initialPos = 0;
      if (waveVelocity < 0) {
        initialPos = WINDOW_WIDTH;
      }
      let wave = new Wave(p, (Math.random() * 3 * WINDOW_HEIGHT) / 4 - 20);
      wave.posX = initialPos;
      waves.push(wave);
    }

    p.stroke(255);
    p.strokeWeight(3);

    waves.forEach((wave) => {
      if (moveIs) {
        wave.update(waveVelocity);
      }
      wave.draw();
    });

    const shipVelocity = Number(p.select("#shipVelocityInput").value());
    p.stroke(0);
    p.strokeWeight(1);
    ship.calcRelativeVelocity(shipVelocity, waveVelocity);
    if (moveIs) {
      ship.update();
    }
    ship.draw(shipVelocity, waveVelocity);

    if (waves.length > 0) {
      if (waves[0].posX < -100 || waves[0].posX > WINDOW_WIDTH + 100) {
        waves.shift();
      }
    }
  };

  p.windowResized = function () {
    canvasController.resizeScreen();
    elementPositionInit(p);
  };
};

new p5(sketch);
