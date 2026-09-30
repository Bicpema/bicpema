import { describe, it, expect } from "vitest";
import { renderSimulationEmbed } from "../../src/plugins/remark-simulation-link.mjs";

describe("renderSimulationEmbed", () => {
  const html = renderSimulationEmbed("/vite/simulations/pendulum/", "振り子");

  it("シミュレーションを遅延読み込みのiframeで埋め込む", () => {
    expect(html).toMatch(
      /<iframe src="\/vite\/simulations\/pendulum\/" title="シミュレーション「振り子」" loading="lazy"/
    );
  });

  it("全画面表示とマイク入力（オシロスコープ）を許可する", () => {
    expect(html).toContain('allow="fullscreen; microphone"');
    expect(html).toContain("allowfullscreen");
  });

  it("埋め込みの下に全画面表示ボタンと別タブで開くリンクを配置する", () => {
    const frameEnd = html.indexOf("</iframe>");
    const fullscreen = html.indexOf("data-simulation-embed-fullscreen");
    const newTab = html.indexOf(
      '<a class="simulation-embed__button" href="/vite/simulations/pendulum/" target="_blank" rel="noopener">'
    );

    expect(fullscreen).toBeGreaterThan(frameEnd);
    expect(newTab).toBeGreaterThan(fullscreen);
    expect(html).toContain("bi-arrows-fullscreen");
    expect(html).toContain("bi-box-arrow-up-right");
  });

  it("タイトルの特殊文字をエスケープする", () => {
    expect(
      renderSimulationEmbed("/vite/simulations/a/", '"><script>')
    ).toContain('title="シミュレーション「&quot;&gt;&lt;script&gt;」"');
  });
});
