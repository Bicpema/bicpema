import { describe, it, expect } from "vitest";
import {
  expandBicpemaComponents,
  parseAttributes,
  renderIcon,
  renderLoadingSpinner,
  renderNavBar,
  renderSettingsButton,
  renderSettingsModal
} from "../../vite/_build/bicpemaComponents.js";

/**
 * 文字列をHTMLとして解釈できる最小限の形に整えるため、テスト用のページを組み立てる。
 * @param {string} body
 * @param {string} [title]
 */
function page(body, title = "振り子の実験") {
  return `<html><head><title>${title}</title></head><body>${body}</body></html>`;
}

describe("parseAttributes", () => {
  it("属性をオブジェクトに変換する", () => {
    expect(parseAttributes(' id="a" data-x="b c"')).toEqual({
      id: "a",
      "data-x": "b c"
    });
  });
});

describe("renderIcon", () => {
  it("Bootstrap IconsのSVGを指定サイズ・追加クラス付きで返す", () => {
    const svg = renderIcon({ name: "camera", size: "20", className: "pb-1" });

    expect(svg).toMatch(/^<svg [^>]*>[\s\S]*<\/svg>$/);
    expect(svg).toContain('width="20" height="20"');
    expect(svg).toContain('class="bi bi-camera pb-1"');
    expect(svg).toContain('viewBox="0 0 16 16"');
    expect(svg).toContain('fill="currentColor"');
    expect(svg).toContain("<path ");
  });

  it("装飾目的のためaria-hidden属性を付与する", () => {
    expect(renderIcon({ name: "camera" })).toContain('aria-hidden="true"');
  });

  it("sizeを省略した場合は16pxにする", () => {
    expect(renderIcon({ name: "camera" })).toContain('width="16" height="16"');
  });

  it("存在しないアイコン名はエラーにする", () => {
    expect(() => renderIcon({ name: "no-such-icon" })).toThrow("no-such-icon");
  });

  it("パス区切りなどを含む不正な名前はエラーにする", () => {
    expect(() => renderIcon({ name: "../package" })).toThrow("nameが不正です");
  });

  it("nameがない場合・sizeが整数でない場合はエラーにする", () => {
    expect(() => renderIcon({ name: "" })).toThrow("name属性が必要です");
    expect(() => renderIcon({ name: "camera", size: "20px" })).toThrow(
      "sizeはpx単位の整数"
    );
  });
});

describe("expandBicpemaComponents", () => {
  it("<bicpema-nav-bar>を<title>をタイトルにしたナビバーへ展開する", () => {
    const html = expandBicpemaComponents(
      page("<bicpema-nav-bar></bicpema-nav-bar>")
    );

    expect(html).toContain('id="navBar"');
    expect(html).toContain(renderNavBar({ title: "振り子の実験" }));
    expect(html).not.toContain("bicpema-nav-bar");
  });

  it("<bicpema-nav-bar>のtitle属性を<title>より優先する", () => {
    const html = expandBicpemaComponents(
      page('<bicpema-nav-bar title="短いタイトル"></bicpema-nav-bar>')
    );

    expect(html).toContain(renderNavBar({ title: "短いタイトル" }));
  });

  it("<bicpema-loading-spinner>をローディングスピナーへ展開する", () => {
    const html = expandBicpemaComponents(
      page("<bicpema-loading-spinner></bicpema-loading-spinner>")
    );

    expect(html).toContain(renderLoadingSpinner());
    expect(html).toContain('id="loadingSpinner"');
  });

  it("<bicpema-settings-button>を.settings-modal-openを持つボタンへ展開する", () => {
    const html = expandBicpemaComponents(
      page(
        '<bicpema-settings-button id="toggleModal" class="absolute bottom-0 m-3"></bicpema-settings-button>'
      )
    );

    expect(html).toContain(
      renderSettingsButton({
        id: "toggleModal",
        positionClass: "absolute bottom-0 m-3"
      })
    );
    expect(html).toContain(
      'class="settings-modal-open btn-settings-modal-open"'
    );
    expect(html).toContain('id="toggleModal"');
  });

  it("<bicpema-settings-modal>の中身を設定モーダルの外枠に差し込む", () => {
    const html = expandBicpemaComponents(
      page(
        '<bicpema-settings-modal id="myModal" title="設定">\n<input id="massInput" />\n</bicpema-settings-modal>'
      )
    );

    expect(html).toContain(
      renderSettingsModal({
        id: "myModal",
        title: "設定",
        bodyHtml: '<input id="massInput" />'
      })
    );
    expect(html).toContain('aria-labelledby="myModalLabel"');
    expect(html).toContain(
      '<h1 class="text-lg font-semibold" id="myModalLabel">設定</h1>'
    );
  });

  it("<bicpema-settings-modal>の属性を省略した場合は既定のid・見出しを使う", () => {
    const html = expandBicpemaComponents(
      page("<bicpema-settings-modal></bicpema-settings-modal>")
    );

    expect(html).toContain('id="simulationSettingModal"');
    expect(html).toContain("シミュレーションの設定</h1>");
  });

  it('<bicpema-settings-modal variant="dark">を背景を暗くしない暗色パネルへ展開する', () => {
    const html = expandBicpemaComponents(
      page(
        '<bicpema-settings-modal id="settingsModal" variant="dark" panel-class="w-[340px]"><input /></bicpema-settings-modal>'
      )
    );

    expect(html).toContain(
      renderSettingsModal({
        id: "settingsModal",
        variant: "dark",
        panelClass: "w-[340px]",
        bodyHtml: "<input />"
      })
    );
    expect(html).toContain(
      '<div class="modal-panel max-h-[85vh] overflow-y-auto w-[340px]">'
    );
    expect(html).toContain('class="modal-close modal-close-solid mt-2"');
    expect(html).not.toContain("bg-black/50");
    expect(html).not.toContain("modal-close-icon");
  });

  it("lightのpanel-classは既定の幅クラスを置き換える", () => {
    const html = renderSettingsModal({
      panelClass: "w-full max-w-2xl",
      bodyHtml: ""
    });

    expect(html).toContain("max-w-2xl");
    expect(html).not.toContain("max-w-lg");
    expect(renderSettingsModal({ bodyHtml: "" })).toContain("w-full max-w-lg");
  });

  it("未知のvariantはエラーにする", () => {
    expect(() =>
      expandBicpemaComponents(
        page('<bicpema-settings-modal variant="blue"></bicpema-settings-modal>')
      )
    ).toThrow("blue");
  });

  it("設定モーダルの中身に含まれるHTMLコメントは保持したまま展開する", () => {
    const html = expandBicpemaComponents(
      page(
        "<bicpema-settings-modal><!-- 質量 --><input /></bicpema-settings-modal>"
      )
    );

    expect(html).toContain("<!-- 質量 --><input />");
    expect(html).not.toContain("bicpema-settings-modal");
  });

  it("<bicpema-icon>をSVGアイコンへ展開する", () => {
    const html = expandBicpemaComponents(
      page(
        '<button>撮影<bicpema-icon name="camera" size="20" class="pb-1"></bicpema-icon></button>'
      )
    );

    expect(html).toContain(
      `<button>撮影${renderIcon({ name: "camera", size: "20", className: "pb-1" })}</button>`
    );
    expect(html).not.toContain("bicpema-icon");
  });

  it("設定モーダルの中身に含まれる<bicpema-icon>も展開する", () => {
    const html = expandBicpemaComponents(
      page(
        '<bicpema-settings-modal>\n<button><bicpema-icon\n  name="plus-circle"\n  size="20"\n></bicpema-icon>追加</button>\n</bicpema-settings-modal>'
      )
    );

    expect(html).toContain(
      `<button>${renderIcon({ name: "plus-circle", size: "20" })}追加</button>`
    );
    expect(html).toContain('id="simulationSettingModal"');
    expect(html).not.toContain("bicpema-");
  });

  it("HTMLコメント内のタグは展開しない", () => {
    const body =
      "<!-- <bicpema-settings-button></bicpema-settings-button> --><!-- <bicpema-*> -->";
    expect(expandBicpemaComponents(page(body))).toBe(page(body));
  });

  it("<bicpema-*>タグがなければHTMLを変更しない", () => {
    const html = page('<div id="p5Canvas"></div>');
    expect(expandBicpemaComponents(html)).toBe(html);
  });

  it("未知のタグ名はエラーにする", () => {
    expect(() =>
      expandBicpemaComponents(page("<bicpema-navbar></bicpema-navbar>"))
    ).toThrow("<bicpema-navbar>");
  });

  it("閉じタグがないタグはエラーにする", () => {
    expect(() => expandBicpemaComponents(page("<bicpema-nav-bar />"))).toThrow(
      "<bicpema-nav-bar"
    );
  });

  it("属性値の特殊文字をエスケープする", () => {
    expect(renderSettingsButton({ id: 'a"b' })).toContain('id="a&quot;b"');
  });
});
