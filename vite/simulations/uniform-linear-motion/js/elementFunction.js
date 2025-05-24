/**
 * グラフの切り替えボタンを押した時に走る。
 * elInitメソッド内で、graphButtonと紐づく。
 */
const graphButtonFunction = () => {
  if (graphData === true) {
    graphData = false;
  } else {
    graphData = true;
  }
};
