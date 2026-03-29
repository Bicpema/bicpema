import { state } from './state.js';

export function initValue() {
  state.t = 0;
  state.Thot = state.Thot0;
  state.Tcold = state.Tcold0;
}
