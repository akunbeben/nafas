import { CounterState } from "~/app/types";

export function isValidTimezone(tz?: string): boolean {
  try {
    Intl.DateTimeFormat(undefined, { timeZone: tz });
    return true;
  } catch {
    return false;
  }
}

export const encodeState = (state: CounterState): string => {
  const base64 = btoa(JSON.stringify(state));
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
};

export const decodeState = (encoded?: string): [error: boolean, data: CounterState | null] => {
  try {
    if (!encoded) return [true, null];

    let base64 = encoded.replace(/-/g, '+').replace(/_/g, '/');
    while (base64.length % 4) {
      base64 += '=';
    }
    return [false, JSON.parse(atob(base64))];
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

export const vibrate = (pattern: VibratePattern) => {
  if ('vibrate' in navigator) {
    navigator.vibrate(pattern);
  }
};
