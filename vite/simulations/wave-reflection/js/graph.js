/**
 * 背景の設定を行う関数。
 * @param {*} p p5インスタンス。
 */
export function backgroundSetting(p) {
  p.fill(0);
  p.background(255);
  p.strokeWeight(1);
  p.stroke(68, 122, 191);
  let max_amp = 60 * (Math.floor(p.height / 60) / 2);
  let max_time = 60 * Math.floor(p.width / 60);

  for (let x = 60; x <= max_time; x += 60) p.line(x, 0, x, p.height);
  for (let y = p.height / 2; y > 0; y -= 60) p.line(60, y, max_time, y);
  for (let y = p.height / 2; y < p.height; y += 60) p.line(60, y, max_time, y);
  p.noStroke();

  for (let x = 300; x <= max_time; x += 300)
    p.text(x / 60, x + 60, p.height / 2 + 20);
  for (let y = p.height / 2 - 60; y > 0; y -= 60)
    p.text(p.int((p.height / 2 - y) / 60), 30, y + 8);
  for (let y = p.height / 2 + 60; y < p.height; y += 60)
    p.text(p.int((p.height / 2 - y) / 60), 30, y + 8);
  p.text("O", 60 - 30, p.height / 2 + 7);
  p.text("y", 60 - 30, 20);
  p.text("x", max_time - 15, p.height / 2 + 30);

  p.stroke(0);
  p.strokeWeight(3);
  p.line(max_time, p.height / 2, max_time - 12, p.height / 2 - 12);
  p.line(max_time, p.height / 2, max_time - 12, p.height / 2 + 12);
  p.line(60, p.height / 2 - max_amp, 48, p.height / 2 - max_amp + 12);
  p.line(60, p.height / 2 - max_amp, 72, p.height / 2 - max_amp + 12);
  p.line(60, p.height / 2 - max_amp, 60, p.height / 2 + max_amp);
  p.line(60, p.height / 2, max_time, p.height / 2);
}
