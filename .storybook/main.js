import { resolve } from "node:path";
import { mergeConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import { expandBicpemaComponents } from "../vite/_build/bicpemaComponents.js";

/**
 * `?bicpema` を付けてimportしたHTMLの<bicpema-*>タグを、ビルド時に共通マークアップへ展開して文字列として返す。
 * シミュレーションのビルド（vite build）と同じ展開処理を使うため、storiesで本番と同じ見た目を確認できる。
 * @returns {import("vite").Plugin} Viteプラグイン
 */
function bicpemaHtmlPlugin() {
  const suffix = "?bicpema";
  return {
    name: "storybook-bicpema-html",
    transform(code, id) {
      if (!id.endsWith(suffix)) return null;
      const html = expandBicpemaComponents(code);
      return `export default ${JSON.stringify(html)};`;
    }
  };
}

/** @type {import("@storybook/html-vite").StorybookConfig} */
const config = {
  // シミュレーションのビルド対象（vite/）に混ざらないよう、リポジトリ直下のstories/に置く
  stories: ["../stories/**/*.stories.js"],
  framework: "@storybook/html-vite",
  addons: [],
  core: { disableTelemetry: true },
  async viteFinal(baseConfig) {
    return mergeConfig(baseConfig, {
      // vite.config.jsのroot（./vite）・出力先（static/vite）はStorybookでは使わない
      root: resolve(import.meta.dirname, ".."),
      base: "/",
      plugins: [tailwindcss(), bicpemaHtmlPlugin()]
    });
  }
};

export default config;
