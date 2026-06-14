import type { GameState } from "./types";
import { SAVE_VERSION } from "./game";

const KEY = "instrument-mountain:save:v1";

export function saveGame(state: GameState): void {
  if (typeof window === "undefined") return;
  try {
    const payload = { ...state, lastSaved: Date.now() };
    window.localStorage.setItem(KEY, JSON.stringify(payload));
  } catch (e) {
    console.error("セーブに失敗しました", e);
  }
}

export function loadGame(): GameState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as GameState;
    if (parsed.version !== SAVE_VERSION) return null;
    return parsed;
  } catch (e) {
    console.error("ロードに失敗しました", e);
    return null;
  }
}

export function clearSave(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(KEY);
}

export function hasSave(): boolean {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(KEY) !== null;
}
