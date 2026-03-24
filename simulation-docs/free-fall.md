# 自由落下シミュレーション

- `vite/simulations/free-fall/index.html`
- `vite/simulations/free-fall/css/style.css`
- `vite/simulations/free-fall/js/index.js`
- `vite/simulations/free-fall/js/state.js`
- `vite/simulations/free-fall/js/ball.js`
- `vite/simulations/free-fall/js/init.js`
- `vite/simulations/free-fall/js/element-function.js`
- `vite/simulations/free-fall/js/bicpema-canvas-controller.js`

## 概要

自由落下運動を再現するシミュレーションです。初速度を0とし、鉛直下向きに加速度 $g=9.8\ \mathrm{m/s^2}$ がかかる運動を可視化します。

## 主要動作

- 設定で初期高さを入力
- リセット、開始/一時停止の操作
- 到達高度が1m以下になると停止
- 時間、高さ、速度を表示
