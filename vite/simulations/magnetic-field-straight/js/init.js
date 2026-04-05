export function settingInit(p) {}

export function elementSelectInit(p) {}

export function elementPositionInit(p) {
  const slider = document.getElementById("currentSlider");
  const label = document.getElementById("currentLabel");
  if (slider && label) {
    slider.oninput = () => {
      label.textContent = `電流の強さ: ${parseFloat(slider.value).toFixed(1)} A`;
    };
  }
}

export function valueInit(p) {}
