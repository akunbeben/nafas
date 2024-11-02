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

export const getRateCategory = (rate: number) => {
  if (rate < 16) {
    return {
      category: 'Below Normal',
      color: 'text-yellow-600'
    };
  } else if (rate >= 16 && rate <= 20) {
    return {
      category: 'Normal',
      color: 'text-green-600'
    };
  } else {
    return {
      category: 'Above Normal',
      color: 'text-yellow-600'
    };
  }
};

export const getFullUrl = (host: string | null): string => {
  if (!host) return '';

  const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
  return `${protocol}://${host}`;
};
