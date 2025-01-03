export interface CounterState {
  c: string;    // count
  d: string;    // duration
  t: string;    // timestamp
}

export interface CounterProps {
  count: number;
  timeLeft: number;
  duration: number;
  isActive: boolean;
  toggleTimer: () => void;
  incrementCount: () => void;
  resetCounter: (duration?: number) => void;
}

export interface ResultsProps {
  count: number;
  duration: number;
  resetCounter: () => void;
}