import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { onSpeedInputChange } from "../../../vite/simulations/doppler/js/element-function.js";
import { state } from "../../../vite/simulations/doppler/js/state.js";

const originalDocumentDescriptor = Object.getOwnPropertyDescriptor(
  globalThis,
  "document"
);
const originalHTMLInputElementDescriptor = Object.getOwnPropertyDescriptor(
  globalThis,
  "HTMLInputElement"
);

class MockHTMLInputElement {
  constructor(value = "") {
    this.value = value;
  }
}

/**
 * @param {unknown} element
 */
function setMockDom(element) {
  Object.defineProperty(globalThis, "HTMLInputElement", {
    value: MockHTMLInputElement,
    configurable: true,
    writable: true,
  });
  Object.defineProperty(globalThis, "document", {
    value: {
      getElementById: () => element,
    },
    configurable: true,
    writable: true,
  });
}

function restoreGlobal(name, descriptor) {
  if (descriptor) {
    Object.defineProperty(globalThis, name, descriptor);
    return;
  }
  delete globalThis[name];
}

beforeEach(() => {
  state.speedValue = 340;
});

afterEach(() => {
  restoreGlobal("document", originalDocumentDescriptor);
  restoreGlobal("HTMLInputElement", originalHTMLInputElementDescriptor);
});

describe("onSpeedInputChange", () => {
  it("speedInput が存在しない場合は何もしない", () => {
    setMockDom(null);

    onSpeedInputChange();

    expect(state.speedValue).toBe(340);
  });

  it("speedInput が input 要素でない場合は何もしない", () => {
    setMockDom({ value: "500" });

    onSpeedInputChange();

    expect(state.speedValue).toBe(340);
  });

  it("input 要素の値は 0 から 1000 の範囲にクランプする", () => {
    const speedInput = new MockHTMLInputElement("1200");
    setMockDom(speedInput);

    onSpeedInputChange();

    expect(state.speedValue).toBe(1000);
    expect(speedInput.value).toBe("1000");
  });
});
