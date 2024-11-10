'use client';

import React, { useState } from 'react';
import { Share2, Info, ImageIcon, LinkIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ResultCard } from './ResultCard';
import Link from 'next/link';
import * as htmlToImage from 'html-to-image';
import { decodeState } from '~/utils/helper';

export const ResultsView: React.FC<{ state: string }> = ({ state }) => {
  const router = useRouter();
  const [showAgeRanges, setShowAgeRanges] = useState(false);
  const result = decodeState(state);

  const downloadResult = () => {
    const element = document.getElementById('result-card');

    if (!element) {
      alert('Could not generate image');
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
        alert('Could not generate image');
        console.error('Could not generate image', error);
      })
      .finally(() => {
        element.appendChild(children);
      });
  };

  return (
    <div className="min-h-screen bg-blue-50">
      <div className="h-full max-w-md px-4 py-8 mx-auto space-y-4">
        <ResultCard state={state}>
          <div className="flex space-x-3">
            <button
              onClick={() => router.push('/')}
              className="flex-1 px-4 py-2 text-white transition bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              New Count
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
                alert('Link copied to clipboard!');
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
            <span className="font-medium text-gray-900">Age-Specific Normal Ranges</span>
            <Info className={`w-5 h-5 text-gray-600 transition-transform duration-200`} />
          </button>

          <div className={`grid transition-all duration-200 ease-in-out ${showAgeRanges ? 'grid-rows-[1fr] opacity-100 mt-3' : 'grid-rows-[0fr] opacity-0'}`}>
            <div className="overflow-hidden">
              <ul className="list-disc list-inside pl-4 space-y-1 text-sm text-gray-600">
                <li>Birth to 6 weeks: 30-40 breaths/min</li>
                <li>6 months: 25-40 breaths/min</li>
                <li>3 years: 20-30 breaths/min</li>
                <li>6 years: 18-25 breaths/min</li>
                <li>10 years: 17-23 breaths/min</li>
                <li>Adults: 15-18 breaths/min</li>
                <li>50 years: 18-25 breaths/min</li>
                <li>Elderly (≥65 years): 12-28 breaths/min</li>
                <li>Elderly (≥80 years): 10-30 breaths/min</li>
              </ul>
              <p className="mt-2 text-xs">
                Source: <Link
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
          <h2>About</h2>

          <div className="text-xs text-gray-500">
            <p>We do not collect any data from this measurement.</p>
            <p>Your measurement data resides in the encrypted URL parameter.</p>
            <p>To share the results, simply copy the URL or download it.</p>
          </div>
        </div>

      </div>
    </div>
  );
};
