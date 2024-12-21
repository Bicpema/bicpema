function sliderInputFunc() {
  fbWeightSliderLabel.html("抵抗なし玉の質量:" + fbWeightSlider.value());
  vbWeightSliderLabel.html("粘性抵抗ありの玉の質量:" + vbWeightSlider.value());
  ibWeightSliderLabel.html("慣性抵抗ありの玉の質量:" + ibWeightSlider.value());
  valueInit();
}
