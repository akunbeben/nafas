import { create } from 'zustand';
import { encodeState, decodeState, vibrate } from '~/utils/helper';
import Cookies from 'js-cookie';

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

  startTimer: () => {
    new Audio('/beep.mp3').play();

    set({
      isActive: true,
      startTime: Date.now()
    })
  },

  stopTimer: () => set({
    isActive: false,
    startTime: null
  }),

  increment: () => {
    const { isActive } = get();

    vibrate(100);

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
      t: Date.now().toString(),
      lc: Cookies.get('locale') || 'id',
      tz: Cookies.get('timezone') || Intl.DateTimeFormat().resolvedOptions().timeZone,
    });
  },

  complete: () => {
    const { count, duration } = get();

    vibrate(500);

    new Audio('/beep.mp3').play();
    setTimeout(() => {
      new Audio('/beep.mp3').play();
    }, 150);

    set({
      isActive: false,
      startTime: null
    });

    return encodeState({
      c: count.toString(),
      d: duration.toString(),
      t: Date.now().toString(),
      lc: Cookies.get('locale') || 'id',
      tz: Cookies.get('timezone') || Intl.DateTimeFormat().resolvedOptions().timeZone,
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

