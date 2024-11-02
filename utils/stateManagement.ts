import { CounterState } from "~/app/types";

export const encodeState = (state: CounterState): string => {
  return btoa(JSON.stringify(state));
};

export const decodeState = (encoded?: string): CounterState | null => {
  try {
    return JSON.parse(atob(encoded || ''));
  } catch {
    return null;
  }
};