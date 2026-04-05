import { state } from "./state.js";

export function onMaterialAChange() {
  state.materialA = parseInt(state.materialSelectA.value());
}

export function onMaterialBChange() {
  state.materialB = parseInt(state.materialSelectB.value());
}

export function onMassAChange() {
  state.massA = parseInt(state.massSelectA.value());
}

export function onMassBChange() {
  state.massB = parseInt(state.massSelectB.value());
}

export function onToggleModal() {
  const modal = document.getElementById("settingsModal");
  if (modal) {
    modal.style.display = modal.style.display === "none" ? "block" : "none";
  }
}

export function onCloseModal() {
  const modal = document.getElementById("settingsModal");
  if (modal) modal.style.display = "none";
}
