class LineBreakTransformer {
    constructor() {
        this.chunks = "";
    }
    transform(chunk, controller) {
        this.chunks += chunk;
        const lines = this.chunks.split("\r\n");
        this.chunks = lines.pop();
        lines.forEach((line) => controller.enqueue(line));
    }
    flush(controller) {
        controller.enqueue(this.chunks);
    }
}

const ctx = document.getElementById("realTimeGraph").getContext("2d");
let chart = new Chart(ctx, {
    type: "line",
    data: {
        datasets: [
            {
                label: '観測した光の強度',
                borderColor: 'rgb(0, 0, 0)',
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                data: [],
            }
        ]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        legend: {
            labels: {
                fontSize: 16
            }
        },
        title: {
            display: true,
            fontSize: 25,
            text: '光強度のリアルタイム表示'
        },
        scales: {
            xAxes: [
                {
                    scaleLabel: {
                        display: true,
                        labelString: '観測時刻',
                        fontSize: 16
                    },
                    type: "realtime",
                    realtime: {
                        duration: 30000
                    }
                },
            ],
            yAxes: [
                {
                    scaleLabel: {
                        display: true,
                        labelString: '光の強度[a.u.]',
                        fontSize: 16
                    },
                    ticks: {
                        min: 0,
                        max: 255 * 5,
                        fontSize: 14
                    }
                },
            ],
        },
    },
});
async function onStartButtonClick() {
    try {
        const port = await navigator.serial.requestPort();
        await port.open({ baudRate: 115200 });

        while (port.readable) {
            const textDecoder = new TextDecoderStream();
            const readableStreamClosed = port.readable.pipeTo(textDecoder.writable);
            const reader = textDecoder.readable
                .pipeThrough(new TransformStream(new LineBreakTransformer()))
                .getReader();

            try {
                while (true) {
                    const { value, done } = await reader.read();
                    if (done) {
                        console.log("Canceled");
                        break;
                    }
                    let target = document.getElementById("realTimeValue")
                    target.innerHTML = "現在の光強度：" + value.slice(2)
                    console.log(value)
                    if (value.slice(0, 1) === "X") {
                        chart.data.datasets[0].data.push({
                            x: Date.now(),
                            y: value.slice(2),
                        });
                    }
                    chart.update({
                        preservation: true,
                    });
                }
            } catch (error) {
                console.log("Error: Read");
                console.log(error);
            } finally {
                reader.releaseLock();
            }
        }
    } catch (error) {
        console.log("Error: Open");
        console.log(error);
    }
}