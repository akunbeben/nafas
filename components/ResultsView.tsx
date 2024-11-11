'use client';

import React, { useState } from 'react';
import { Info, ImageIcon, LinkIcon, GithubIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ResultCard } from './ResultCard';
import Link from 'next/link';
import * as htmlToImage from 'html-to-image';
import { decodeState } from '~/utils/helper';
import { useCounterStore } from '~/stores/useCounterStore';
import { useTranslations } from 'next-intl';

export const ResultsView: React.FC<{ state: string }> = ({ state }) => {
  const t = useTranslations('Main');
  const router = useRouter();
  const [showAgeRanges, setShowAgeRanges] = useState(false);
  const [error, result] = decodeState(state);
  const counter = useCounterStore();

  if (error) {
    router.push('/');
  }

  function downloadResult() {
    const element = document.getElementById('result-card');

    if (!element) {
      alert(t('misc.error_image'));
      return;
    }

    const children = element.querySelector('#children') as HTMLDivElement
    element.removeChild(children);

    htmlToImage.toPng(element)
      .then((dataUrl) => {
        const link = document.createElement("a");
        link.href = dataUrl;
        link.download = `${result?.t}.png`;

        document.body.appendChild(link);
        link.click();
      })
      .catch((error) => {
        alert(t('misc.error_image'));
        console.error(t('misc.error_image'), error);
      })
      .finally(() => {
        element.appendChild(children);
      });
  };

  function startOver() {
    counter.reset();

    router.push('/');
  }

  return (
    <div className="min-h-screen bg-blue-50 relative">
      <div className="h-full max-w-md px-4 py-8 mx-auto space-y-4">
        <ResultCard state={state}>
          <div className="flex space-x-3">
            <button
              onClick={startOver}
              className="flex-1 px-4 py-2 text-white transition bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              {t('action.start_over')}
            </button>
            <button
              onClick={downloadResult}
              className="px-4 py-2 text-gray-700 transition bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              <ImageIcon className="w-5 h-5" />
            </button>
            <button
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                alert(t('misc.link_copied'));
              }}
              className="px-4 py-2 text-gray-700 transition bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              <LinkIcon className="w-5 h-5" />
            </button>
          </div>
        </ResultCard>

        <div className="p-4 bg-white shadow rounded-2xl">
          <button
            onClick={() => setShowAgeRanges(!showAgeRanges)}
            className="flex justify-between items-center w-full text-left"
          >
            <span className="font-medium text-gray-900">{t('label.ages.title')}</span>
            <Info className={`w-5 h-5 text-gray-600 transition-transform duration-200`} />
          </button>

          <div className={`grid transition-all duration-200 ease-in-out ${showAgeRanges ? 'grid-rows-[1fr] opacity-100 mt-3' : 'grid-rows-[0fr] opacity-0'}`}>
            <div className="overflow-hidden">
              <ul className="list-disc list-inside pl-4 space-y-1 text-sm text-gray-600">
                <li>{t('label.ages.0')}</li>
                <li>{t('label.ages.1')}</li>
                <li>{t('label.ages.2')}</li>
                <li>{t('label.ages.3')}</li>
                <li>{t('label.ages.4')}</li>
                <li>{t('label.ages.5')}</li>
                <li>{t('label.ages.6')}</li>
                <li>{t('label.ages.7')}</li>
                <li>{t('label.ages.8')}</li>
              </ul>
              <p className="mt-2 text-xs">
                {t('label.source')}: <Link
                  href="https://en.wikipedia.org/wiki/Respiratory_rate#Normal_range"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  Wikipedia
                </Link>
              </p>
            </div>
          </div>
        </div>

        <div className="p-4 bg-white shadow rounded-2xl space-y-2">
          <h2>{t('label.about.title')}</h2>

          <div className="text-xs text-gray-500">
            <p>{t('label.about.0')}</p>
            <p>{t('label.about.1')}</p>
            <p>{t('label.about.2')}</p>
          </div>
        </div>

      </div>

      <div className="absolute gap-2 bottom-2 inset-x-0 text-center text-sm text-gray-500">
        <a href="https://github.com/akunbeben/nafas" target="_blank" className="flex justify-center gap-1">
          <GithubIcon className="w-4 h-4" />
          https://github.com/akunbeben/nafas
        </a>
      </div>
    </div>
  );
};
