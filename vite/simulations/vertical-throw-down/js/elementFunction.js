/**
 * DOM要素の静的な設定を行う。
 */
const elInit = () => {
  /** シミュレーション設定ボタンのbutton要素 */
  const MODAL_BUTTON = createButton("シミュレーション設定")
    .class("btn btn-primary")
    .id("modalButton")
    .parent(select("#p5Container"))
    .attribute("data-bs-toggle", "modal")
    .attribute("data-bs-target", "#modal");

  const modalWindow = createDiv(
    `
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h1 class="modal-title fs-5" id="modalLabel">シミュレーション設定</h1>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <div class="input-group mb-3">
                <span class="input-group-text" id="heightLabel">ビルの高さ</span>
                <input type="number" min="10" max="200" class="form-control" aria-describedby="heightLabel" id="heightInput" value="50"/>
                <span class="input-group-text">m</span>
              </div>
              <div class="input-group mb-3">
                <span class="input-group-text" id="velocityLabel">初速度</span>
                <input type="number" min="1" max="50" class="form-control" aria-describedby="velocityLabel" id="velocityInput" value="5"/>
                <span class="input-group-text">m/s</span>
              </div>
              <div class="form-check">
                <input class="form-check-input" type="checkbox" id="scaleCheckBox" checked>
                <label class="form-check-label" for="scaleCheckBox">スケールの表示</label>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">閉じる</button>
            </div>
          </div>
        </div>
      `
  )
    .class("modal fade")
    .id("modal")
    .parent(select("#p5Container"))
    .attribute("tabindex", "-1")
    .attribute("aria-labelledby", "modalLabel")
    .attribute("aria-hidden", "true");

  const HEIGHT_INPUT = select("#heightInput").changed(initValue);
  const VELOCITY_INPUT = select("#velocityInput").changed(initValue);
};

/**
 * DOM要素の動的に変化する設定を行う。
 */
const elSetting = () => {
  const MODAL_BUTTON = select("#modalButton").position(windowWidth / 2 - width / 2, 60 + height + 10);
};
