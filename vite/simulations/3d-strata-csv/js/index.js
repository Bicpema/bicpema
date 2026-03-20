import * as initState from './init.js';
import { settingInit, elementSelectInit, valueInit, setCoordinateData,
         setRadioButton, unitSelect, dataInputArr } from './init.js';
import { calculateValue, backgroundSetting, drawDirMark, drawStrata, connectStrata } from './function.js';
import { placeAddButtonFunction, placeRemoveButtonFunction, strataAddButtonFunction,
         strataRemoveButtonFunction, setRadioButtonFunction, unitSelectFunction,
         strataFileInputFunction } from './elementFunction.js';

window.preload = function () {
  initState.font = loadFont(
    "https://firebasestorage.googleapis.com/v0/b/bicpema.firebasestorage.app/o/public%2Fassets%2Ffont%2FZenMaruGothic-Regular.ttf?alt=media&token=9b248da2-ed3a-46a3-b447-46a98775d580"
  );
};

window.setup = function () {
  settingInit();
  elementSelectInit(strataFileInputFunction);
  // elementPositionInit inline with imported callbacks
  initState.buttonParent.position(5, 65);
  initState.placeAddButton.mousePressed(placeAddButtonFunction);
  initState.placeRemoveButton.mousePressed(placeRemoveButtonFunction);
  initState.strataAddButton.mousePressed(strataAddButtonFunction);
  initState.strataRemoveButton.mousePressed(strataRemoveButtonFunction);
  initState.setRadioButton.option("自動", "auto");
  initState.setRadioButton.option("手動", "manual");
  initState.setRadioButton.value("auto");
  initState.setRadioButton.changed(setRadioButtonFunction);
  initState.unitSelect.option("緯度・経度", "latlng");
  initState.unitSelect.option("メートル", "meter");
  initState.unitSelect.changed(unitSelectFunction);
  initState.strataFileInput.position(0, initState.buttonParent.y + initState.buttonParent.height + 5);
  valueInit();
};

let coordinateData;
window.draw = function () {
  background(255);

  const dataRegisterModalIs = $("#dataRegisterModal").is(":hidden");
  if (dataRegisterModalIs) {
    orbitControl();
  }

  coordinateData = calculateValue(initState.setRadioButton.value(), initState.unitSelect.value());
  setCoordinateData(coordinateData);

  backgroundSetting(coordinateData);
  drawDirMark(-600, -600);

  initState.rotateTime += 3;

  for (let key in dataInputArr) {
    drawStrata(key, initState.rotateTime, coordinateData);
  }

  connectStrata();
};

window.windowResized = function () {
  initState.canvasController.resizeScreen();
};
