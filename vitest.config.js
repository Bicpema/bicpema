import { configDefaults, defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["test/**/*.{test,spec}.{js,mjs}"],
    // test/e2e/ はPlaywrightのテストのため、Vitestの対象から除外する
    exclude: [...configDefaults.exclude, "test/e2e/**"]
  }
});
