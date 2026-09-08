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
