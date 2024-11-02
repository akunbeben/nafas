'use client';

import React from 'react';
import { Activity, Share2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { decodeState } from '~/utils/stateManagement';

export const ResultsView: React.FC<{ state: string }> = ({ state }) => {
  const router = useRouter();
  const decoded = decodeState(decodeURIComponent(state));
  const rate = Math.round((parseInt(decoded?.c || '0') / parseInt(decoded?.d || '0')) * 60);

  return (
    <div className="min-h-screen bg-blue-50">
      <div className="h-full max-w-md px-4 py-8 mx-auto">
        <div className="p-6 space-y-6 bg-white shadow-lg rounded-2xl">
          <div className="flex items-center justify-center space-x-2">
            <Activity className="w-8 h-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">Results</h1>
          </div>

          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-blue-50">
              <p className="text-lg text-center">
                Respiratory Rate:
                <span className="block text-4xl font-bold text-blue-600">
                  {rate} breaths/min
                </span>
              </p>
            </div>

            <div className="space-y-2">
              <p className="text-gray-600">
                • Measured over: {decoded?.d} seconds
              </p>
              <p className="text-gray-600">
                • Total breaths counted: {decoded?.c}
              </p>
            </div>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={() => router.push('/')}
              className="flex-1 px-4 py-2 text-white transition bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              New Count
            </button>
            <button
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                alert('Link copied to clipboard!');
              }}
              className="px-4 py-2 text-gray-700 transition bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};