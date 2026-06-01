export function settingInit(p) {}

export function elementSelectInit(p) {}

function updateControlLabels() {
  const currentSlider = document.getElementById("currentSlider");
  const currentLabel = document.getElementById("currentLabel");
  if (currentSlider && currentLabel) {
    currentLabel.textContent = `電流の強さ: ${parseFloat(currentSlider.value).toFixed(1)} A`;
  }
}

export function elementPositionInit(p) {
  const currentSlider = document.getElementById("currentSlider");
  if (currentSlider) {
    currentSlider.oninput = updateControlLabels;
  }

  updateControlLabels();
}

export function valueInit(p) {}
