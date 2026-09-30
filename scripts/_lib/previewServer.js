// ビルド済みのサイト（dist/）を配信するプレビューサーバーを起動する。
// scripts/verify-simulation-runtime.js・scripts/benchmark-simulation-performance.js で使う。
import { createServer } from "node:net";
import { preview } from "astro";

/**
 * 空いているTCPポートを1つ取得する。
 * @returns {Promise<number>}
 */
function findFreePort() {
  return new Promise((resolvePort, reject) => {
    const server = createServer();
    server.unref();
    server.on("error", reject);
    server.listen(0, () => {
      const address = server.address();
      const port = typeof address === "object" && address ? address.port : 0;
      server.close(() => resolvePort(port));
    });
  });
}

/**
 * 空いているポートで `astro preview` を起動する。
 * @param {string} rootDir リポジトリのルート（astro.config.mjs のあるディレクトリ）
 * @returns {Promise<{ baseUrl: string, stop: () => Promise<void> }>}
 */
export async function startPreviewServer(rootDir) {
  const port = await findFreePort();
  const server = await preview({
    root: rootDir,
    server: { port },
    logLevel: "warn"
  });
  return { baseUrl: `http://localhost:${port}`, stop: () => server.stop() };
}
