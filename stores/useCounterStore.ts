import { create } from 'zustand';
import { encodeState, decodeState } from '~/utils/helper';

interface CounterStore {
  count: number;
  duration: number;
  isActive: boolean;
  startTime: number | null;
  setCount: (count: number) => void;
  setDuration: (duration: number) => void;
  startTimer: () => void;
  stopTimer: () => void;
  increment: () => void;
  reset: (newDuration?: number) => string;
  complete: () => string;
  loadState: (encodedState: string) => void;
}

export const useCounterStore = create<CounterStore>((set, get) => ({
  count: 0,
  duration: 60,
  isActive: false,
  startTime: null,

  setCount: (count) => set({ count }),
  setDuration: (duration) => set({ duration }),

  startTimer: () => set({
    isActive: true,
    startTime: Date.now()
  }),

  stopTimer: () => set({
    isActive: false,
    startTime: null
  }),

  increment: () => {
    const { isActive } = get();

    navigator.vibrate(100);

    if (isActive) {
      set((state) => ({ count: state.count + 1 }));
    }
  },

  reset: (newDuration?: number) => {
    const duration = newDuration ?? get().duration;
    set({
      count: 0,
      duration,
      isActive: false,
      startTime: null
    });

    return encodeState({
      c: '0',
      d: duration.toString(),
      t: Date.now().toString()
    });
  },

  complete: () => {
    const { count, duration } = get();
    navigator.vibrate(500);

    set({
      isActive: false,
      startTime: null
    });

    return encodeState({
      c: count.toString(),
      d: duration.toString(),
      t: Date.now().toString()
    });
  },

  loadState: (encodedState: string) => {
    const [_, decoded] = decodeState(encodedState);

    if (decoded) {
      set({
        count: parseInt(decoded.c),
        duration: parseInt(decoded.d),
        isActive: false,
        startTime: null
      });
    }
  }
}))

