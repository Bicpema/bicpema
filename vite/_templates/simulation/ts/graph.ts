// graph.tsはグラフ描画専用のファイルです。

// /**
//  * グラフを描画します。
//  * @param p - p5インスタンス
//  */
// export function drawGraph(p: p5) {
//   if (typeof graphChart !== "undefined" && graphChart) {
//     graphChart.destroy();
//   }
//   let ctx = document.getElementById("graphCanvas").getContext("2d");
//   let data = {};
//   let options = {
//     animation: false,
//     maintainAspectRatio: false,
//   };
//   graphChart = new Chart(ctx, {
//     type: "line",
//     data: data,
//     options: options,
//   });
// }
