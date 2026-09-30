import { getViteConfig } from "astro/config";
import { configDefaults } from "vitest/config";

// .astroコンポーネントのテスト（Container API）でAstroのコンパイラーを使うため、
// Astroの設定（astro.config.mjs）を読み込んだViteの設定でVitestを実行する
export default getViteConfig({
  test: {
    include: ["test/**/*.{test,spec}.{js,mjs}"],
    // test/e2e/ はPlaywrightのテストのため、Vitestの対象から除外する
    exclude: [...configDefaults.exclude, "test/e2e/**"]
  }
});
