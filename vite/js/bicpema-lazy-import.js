/**
 * createLazyImporter
 *
 * 動的import()の結果をキャッシュし、複数回呼び出されても実際のimportは一度だけ
 * 実行されるローダー関数を生成する。Chart.js・mathjs・modern-screenshotのような
 * 初期表示に不要な重い依存関係を、実際に必要になったタイミングで読み込むために使用する。
 *
 * @template T
 * @param {() => Promise<T>} importFn 動的importを実行する関数
 * @returns {() => Promise<T>} 初回呼び出し時のみimportを実行し、以降はキャッシュされたPromiseを返す関数
 */
export function createLazyImporter(importFn) {
  /** @type {Promise<T> | null} */
  let promise = null;
  return function load() {
    if (!promise) {
      promise = importFn();
    }
    return promise;
  };
}
