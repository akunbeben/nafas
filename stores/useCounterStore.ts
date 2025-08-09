import { create } from 'zustand';
import { encodeState, decodeState, vibrate } from '~/utils/helper';
import Cookies from 'js-cookie';
import { db } from '~/utils/db';

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
  complete: () => Promise<string>;
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
    const beep = new Audio('/beep.mp3');
    beep.preload = 'auto';

    beep.play();

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

  complete: async () => {
    const { count, duration } = get();

    vibrate(500);

    const firstBeep = new Audio('/beep.mp3');
    const secondBeep = new Audio('/beep.mp3');
    firstBeep.preload = 'auto';
    secondBeep.preload = 'auto';

    firstBeep.play();
    setTimeout(() => {
      secondBeep.play();
    }, 150);

    set({
      isActive: false,
      startTime: null
    });

    const encodedState = encodeState({
      c: count.toString(),
      d: duration.toString(),
      t: Date.now().toString(),
      lc: Cookies.get('locale') || 'id',
      tz: Cookies.get('timezone') || Intl.DateTimeFormat().resolvedOptions().timeZone,
    });

    const [_, decoded] = decodeState(encodedState);

    if (decoded) {
      await db.results.add({
        enc: encodedState,
        count: parseInt(decoded.c),
        duration: parseInt(decoded.d),
        timestamp: parseInt(decoded.t),
        locale: decoded.lc,
        timezone: decoded.tz,
        synced: 0,
      });
    }

    return encodedState;
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

