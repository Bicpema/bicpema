// init.js は初期処理専用のファイルです。

import { state } from './state.js';
import {
  onMaterialChange,
  onMassChange,
  onContactStateChange,
  onReset,
} from './element-function.js';

/**
 * 値の初期化を行う。
 * @param {*} p - p5 インスタンス。
 */
export function initValue(p) {
  state.t = 0;
  state.Thot = state.Thot0;
  state.Tcold = state.Tcold0;
}

/**
 * DOM 要素のイベントリスナーを設定する。
 * @param {*} p - p5 インスタンス。
 */
export function elCreate(p) {
  // 物質選択ラジオボタン
  const materialRadios = document.querySelectorAll('input[name="materialRadio"]');
  materialRadios.forEach((radio) => {
    radio.addEventListener('change', (e) => onMaterialChange(e.target.value));
  });

  // 質量選択ラジオボタン
  const massRadios = document.querySelectorAll('input[name="massRadio"]');
  massRadios.forEach((radio) => {
    radio.addEventListener('change', (e) => onMassChange(e.target.value));
  });

  // 接触状態セレクト
  const contactSelect = document.getElementById('contactStateSelect');
  contactSelect.addEventListener('change', (e) =>
    onContactStateChange(e.target.value)
  );

  // リセットボタン
  const resetBtn = document.getElementById('resetButton');
  resetBtn.addEventListener('click', () => onReset());

  // 設定モーダルの開閉
  const toggleModal = document.getElementById('toggleModal');
  const settingsModal = document.getElementById('settingsModal');
  const closeModal = document.getElementById('closeModal');

  toggleModal.addEventListener('click', () => {
    settingsModal.style.display =
      settingsModal.style.display === 'none' ? 'block' : 'none';
  });

  closeModal.addEventListener('click', () => {
    settingsModal.style.display = 'none';
  });
}
