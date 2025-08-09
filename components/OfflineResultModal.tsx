'use client';

import { useState } from 'react';
import { ResultCard } from './ResultCard';
import * as htmlToImage from 'html-to-image';
import { useTranslations } from 'next-intl';
import { decodeState } from '~/utils/helper';

interface OfflineResultModalProps {
  state: string;
  onClose: () => void;
}

export function OfflineResultModal({ state, onClose }: OfflineResultModalProps) {
  const t = useTranslations('Main');
  const [_, result] = decodeState(state);

  function downloadResult() {
    const element = document.getElementById('offline-result-card');

    if (!element) {
      alert(t('misc.error_image'));
      return;
    }

    htmlToImage.toPng(element)
      .then((dataUrl) => {
        const link = document.createElement("a");
        link.href = dataUrl;
        link.download = `${result?.t}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      })
      .catch((error) => {
        alert(t('misc.error_image'));
        console.error(t('misc.error_image'), error);
      });
  }

  function copyUrl() {
    const url = `${window.location.origin}/result/${state}`;
    navigator.clipboard.writeText(url);
    alert(t('misc.link_copied'));
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-2xl shadow-lg p-6 max-w-sm w-full">
        <div id="offline-result-card">
          <ResultCard state={state} />
        </div>
        <div className="flex space-x-3 mt-4">
          <button
            onClick={downloadResult}
            className="flex-1 px-4 py-2 text-white transition bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            Download Image
          </button>
          <button
            onClick={copyUrl}
            className="flex-1 px-4 py-2 text-gray-700 transition bg-gray-100 rounded-lg hover:bg-gray-200"
          >
            Copy URL
          </button>
        </div>
        <button
          onClick={onClose}
          className="w-full mt-4 px-4 py-2 text-gray-700 transition bg-gray-100 rounded-lg hover:bg-gray-200"
        >
          Close
        </button>
      </div>
    </div>
  );
}
