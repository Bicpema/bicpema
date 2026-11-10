import { describe, it, expect, vi } from "vitest";
import { ComponentGroup } from "../../vite/ts/components/component-group.js";

/** @returns {any} SimComponentのモック */
function createComponent() {
  return {
    update: vi.fn(),
    draw: vi.fn(),
    reset: vi.fn(),
    dispose: vi.fn()
  };
}

describe("ComponentGroup", () => {
  it("再生中はupdateとdrawを全部品に伝える", () => {
    const group = new ComponentGroup(() => false);
    const a = group.add(createComponent());
    const b = group.add(createComponent());
    const p = /** @type {any} */ ({});
    group.update();
    group.draw(p);
    for (const c of [a, b]) {
      expect(c.update).toHaveBeenCalledTimes(1);
      expect(c.draw).toHaveBeenCalledWith(p);
    }
  });

  it("一時停止中はupdateをスキップし、drawのみ実行する", () => {
    let paused = true;
    const group = new ComponentGroup(() => paused);
    const a = group.add(createComponent());
    group.update();
    group.draw(/** @type {any} */ ({}));
    expect(a.update).not.toHaveBeenCalled();
    expect(a.draw).toHaveBeenCalledTimes(1);

    paused = false;
    group.update();
    expect(a.update).toHaveBeenCalledTimes(1);
  });

  it("引数省略時は常に再生中として扱う", () => {
    const group = new ComponentGroup();
    const a = group.add(createComponent());
    group.update();
    expect(a.update).toHaveBeenCalledTimes(1);
  });

  it("一時停止中でもresetは全部品に伝わる", () => {
    const group = new ComponentGroup(() => true);
    const a = group.add(createComponent());
    group.reset();
    expect(a.reset).toHaveBeenCalledTimes(1);
  });

  it("disposeは全部品を破棄し、以降は何も呼ばない", () => {
    const group = new ComponentGroup();
    const a = group.add(createComponent());
    group.dispose();
    expect(a.dispose).toHaveBeenCalledTimes(1);
    group.update();
    group.draw(/** @type {any} */ ({}));
    expect(a.update).not.toHaveBeenCalled();
    expect(a.draw).not.toHaveBeenCalled();
  });

  it("addは追加した部品を返す", () => {
    const group = new ComponentGroup();
    const a = createComponent();
    expect(group.add(a)).toBe(a);
  });
});
