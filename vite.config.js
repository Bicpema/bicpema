import { resolve } from "path";

const outDir = resolve(__dirname, "static");
const root = resolve(__dirname, "simulations");

export default {
  root,
  build: {
    outDir,
    rollupOptions: {
      input: {
        "wave-reflection": resolve(
          root,
          "simulations/wave-reflection/index.html"
        ),
      },
    },
  },
};
