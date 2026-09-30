import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { beforeAll, describe, expect, it } from "vitest";
import Icon from "../../src/components/Icon.astro";
import LoadingSpinner from "../../src/components/simulation/LoadingSpinner.astro";
import NavBar from "../../src/components/simulation/NavBar.astro";
import SettingsButton from "../../src/components/simulation/SettingsButton.astro";
import SettingsModal from "../../src/components/simulation/SettingsModal.astro";
import { findSimulationArticleIds } from "../../src/lib/simulation-page.js";

/** @type {AstroContainer} */
let container;

beforeAll(async () => {
  container = await AstroContainer.create();
});

/**
 * コンポーネントを描画したHTMLを返す。
 * @param {any} component
 * @param {{ props?: Record<string, unknown>, slots?: Record<string, string>, request?: Request }} [options]
 * @returns {Promise<string>}
 */
function render(component, options) {
  return container.renderToString(component, options);
}

describe("Icon", () => {
  it("Bootstrap IconsのSVGを指定サイズ・追加クラス付きで返す", async () => {
    const html = await render(Icon, {
      props: { name: "camera", size: 20, class: "pb-1" }
    });

    expect(html).toMatch(/^<svg\b/);
    expect(html).toContain('width="20"');
    expect(html).toContain('height="20"');
    expect(html).toContain('class="bi bi-camera pb-1"');
    expect(html).toContain('viewBox="0 0 16 16"');
    expect(html).toContain("<path");
  });

  it("装飾目的のためaria-hidden属性を付与する", async () => {
    expect(await render(Icon, { props: { name: "camera" } })).toContain(
      'aria-hidden="true"'
    );
  });

  it("sizeを省略した場合は16pxにする", async () => {
    expect(await render(Icon, { props: { name: "camera" } })).toContain(
      'width="16"'
    );
  });

  it("存在しないアイコン名はエラーにする", async () => {
    await expect(
      render(Icon, { props: { name: "no-such-icon" } })
    ).rejects.toThrow("存在しないアイコン名");
  });

  it("パス区切りなどを含む不正な名前はエラーにする", async () => {
    await expect(
      render(Icon, { props: { name: "../package" } })
    ).rejects.toThrow("nameが不正");
  });

  it("sizeが整数でない場合はエラーにする", async () => {
    await expect(
      render(Icon, { props: { name: "camera", size: "1.5" } })
    ).rejects.toThrow("px単位の整数");
  });
});

describe("NavBar", () => {
  it("トップページへのリンクを実行環境に依存しないルート相対パスにする", async () => {
    const html = await render(NavBar, { props: { title: "振り子の実験" } });

    expect(html).toMatch(/href="\/"[^>]*>Bicpema<\/a>/);
    expect(html).not.toContain("https://bicpema.com");
    expect(html).toContain('id="navBar"');
    expect(html).toContain("振り子の実験");
  });

  it("左端に解説ページへ戻るボタンを配置する", async () => {
    const html = await render(NavBar, {
      props: { title: "振り子", backHref: "/post/a/" }
    });

    expect(html).toMatch(/<a\s+id="navBackButton"[^>]*href="\/post\/a\/"/);
    expect(html).toContain('aria-label="解説ページへ戻る"');
    expect(html).toContain("bi-arrow-left");
    expect(html.indexOf("navBackButton")).toBeLessThan(html.indexOf("Bicpema"));
  });

  it("直前のページが戻り先と同じ場合のみ履歴を戻る", async () => {
    const html = await render(NavBar, {
      props: { title: "振り子", backHref: "/post/a/" }
    });

    expect(html).toContain("history.back()");
    expect(html).toContain("r.pathname===this.pathname");
  });

  it("シミュレーション以外のページではトップページへ戻る", async () => {
    const html = await render(NavBar, { props: { title: "振り子" } });

    expect(html).toMatch(/id="navBackButton"[^>]*href="\/"/);
    expect(html).toContain('aria-label="トップページへ戻る"');
  });

  it("タイトルの特殊文字をエスケープする", async () => {
    const html = await render(NavBar, { props: { title: '<a href="x">' } });

    expect(html).toContain("&lt;a href=&quot;x&quot;&gt;");
  });
});

describe("findSimulationArticleIds", () => {
  it("シミュレーションへリンクしている記事のidを返す", () => {
    const ids = findSimulationArticleIds([
      { id: "記事い", body: "[リンク](/vite/simulations/sim-b/)" },
      {
        id: "記事あ",
        body: '{{< simulation-link "/vite/simulations/sim-a/" >}}'
      }
    ]);

    expect(ids.get("sim-a")).toBe("記事あ");
    expect(ids.get("sim-b")).toBe("記事い");
    expect(ids.has("sim-c")).toBe(false);
  });

  it("複数の記事からリンクされている場合はidの昇順で最初の記事を採用する", () => {
    const ids = findSimulationArticleIds([
      { id: "記事い", body: "/vite/simulations/sim-a/" },
      { id: "記事あ", body: "/vite/simulations/sim-a/" }
    ]);

    expect(ids.get("sim-a")).toBe("記事あ");
  });
});

describe("LoadingSpinner", () => {
  it("画面全体を覆うローディングスピナーを出力する", async () => {
    const html = await render(LoadingSpinner);

    expect(html).toContain('id="loadingSpinner"');
    expect(html).toContain('role="status"');
    expect(html).toContain('aria-label="読み込み中"');
    expect(html).toContain("animate-spin");
  });
});

describe("SettingsButton", () => {
  it(".settings-modal-openを持つボタンを右上に配置する", async () => {
    const html = await render(SettingsButton);

    expect(html).toContain(
      'class="settings-modal-open btn-settings-modal-open"'
    );
    expect(html).toContain('aria-label="シミュレーションの設定"');
    expect(html).toContain("absolute top-5 right-5");
  });

  it("idと配置クラスを指定できる", async () => {
    const html = await render(SettingsButton, {
      props: { id: "openButton", class: "absolute bottom-0 m-3" }
    });

    expect(html).toContain('id="openButton"');
    expect(html).toMatch(/<div class="absolute bottom-0 m-3"[\s>]/);
    expect(html).not.toContain("top-5");
  });
});

describe("SettingsModal", () => {
  it("スロットの中身を設定モーダルの外枠に差し込む", async () => {
    const html = await render(SettingsModal, {
      slots: { default: '<input id="exampleInput" />' }
    });

    expect(html).toContain('id="simulationSettingModal"');
    expect(html).toContain('aria-labelledby="simulationSettingModalLabel"');
    expect(html).toContain('<input id="exampleInput" />');
    expect(html).toContain("シミュレーションの設定");
    expect(html).toContain("modal-close modal-close-icon");
    expect(html).toContain("bg-black/50");
    expect(html).toContain("w-full max-w-lg");
  });

  it("idと見出しを指定できる", async () => {
    const html = await render(SettingsModal, {
      props: { id: "graphModal", title: "グラフの設定" }
    });

    expect(html).toContain('id="graphModal"');
    expect(html).toContain('id="graphModalLabel"');
    expect(html).toContain("グラフの設定");
  });

  it('variant="dark"は背景を暗くしない暗色パネルにする', async () => {
    const html = await render(SettingsModal, {
      props: { variant: "dark", panelClass: "w-[340px]" }
    });

    expect(html).toContain("modal-panel");
    expect(html).toContain("w-[340px]");
    expect(html).toContain("modal-close modal-close-solid");
    expect(html).not.toContain("bg-black/50");
  });

  it("lightのpanelClassは既定の幅クラスを置き換える", async () => {
    const html = await render(SettingsModal, {
      props: { panelClass: "w-[500px]" }
    });

    expect(html).toContain("w-[500px]");
    expect(html).not.toContain("max-w-lg");
  });

  it("未知のvariantはエラーにする", async () => {
    await expect(
      render(SettingsModal, { props: { variant: "blue" } })
    ).rejects.toThrow('"light"または"dark"');
  });
});
