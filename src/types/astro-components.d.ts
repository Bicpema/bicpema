// tsc（npm run typecheck）は.astroファイルを解釈できないため、
// テストなどから.astroコンポーネントをimportする際の型を宣言する。
declare module "*.astro" {
  const Component: import("astro/runtime/server/index.js").AstroComponentFactory;
  export default Component;
}
