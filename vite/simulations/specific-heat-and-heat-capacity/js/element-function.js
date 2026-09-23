import { state } from "./state.js";

export function onMaterialAChange() {
  state.materialA = parseInt(state.materialSelectA.value(), 10);
}

export function onMaterialBChange() {
  state.materialB = parseInt(state.materialSelectB.value(), 10);
}

export function onMassAChange() {
  state.massA = parseInt(state.massSelectA.value(), 10);
}

export function onMassBChange() {
  state.massB = parseInt(state.massSelectB.value(), 10);
}
