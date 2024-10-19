import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import CryptoJS from "crypto-js";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

function getKeyAndIV() {
  const keyString = process.env.APP_KEY as string;
  const hash = CryptoJS.SHA256(keyString);
  const key = hash.toString(CryptoJS.enc.Hex).slice(0, 32);
  const iv = hash.toString(CryptoJS.enc.Hex).slice(32, 48);
  return { key, iv };
}

function urlSafeEncode(str: string): string {
  return str
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

export function urlSafeDecode(str: string): string {
  str = str.replace(/-/g, '+').replace(/_/g, '/');
  while (str.length % 4) {
    str += '=';
  }
  return str;
}

export function encrypt(data: any) {
  const stringData = JSON.stringify(data);
  const { key, iv } = getKeyAndIV();

  const cipherText = CryptoJS.AES.encrypt(stringData, CryptoJS.enc.Hex.parse(key), {
    iv: CryptoJS.enc.Hex.parse(iv),
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  });

  return urlSafeEncode(cipherText.toString());
}

export function decrypt<T>(encrypted: string): T {
  const restoredBase64 = urlSafeDecode(encrypted);

  const { key, iv } = getKeyAndIV();

  const decrypted = CryptoJS.AES.decrypt(restoredBase64, CryptoJS.enc.Hex.parse(key), {
    iv: CryptoJS.enc.Hex.parse(iv),
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  });

  const decryptedString = decrypted.toString(CryptoJS.enc.Utf8);
  return JSON.parse(decryptedString);
}
