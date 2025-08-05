import { CounterState } from "~/app/types";

export const encodeState = (state: CounterState): string => {
  return btoa(JSON.stringify(state));
};

export const decodeState = (encoded?: string): [error: boolean, data: CounterState | null] => {
  try {
    return [false, JSON.parse(atob(encoded || ''))];
  } catch {
    return [true, null];
  }
};

export const getRateCategory = (rate: number) => {
  if (rate < 16) {
    return {
      category: 'Below Normal',
      color: '#ca8a04'
    };
  } else if (rate >= 16 && rate <= 20) {
    return {
      category: 'Normal',
      color: '#16a34a'
    };
  } else {
    return {
      category: 'Above Normal',
      color: '#ca8a04'
    };
  }
};

export const getFullUrl = (host: string | null): string => {
  if (!host) return '';

  const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
  return `${protocol}://${host}`;
};
