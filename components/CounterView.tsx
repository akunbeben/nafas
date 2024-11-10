'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCounterStore } from '~/stores/useCounterStore';
import { Timer } from 'lucide-react';

export const CounterView: React.FC = () => {
  const router = useRouter();
  const counter = useCounterStore();
  const [timeLeft, setTimeLeft] = useState<number>(counter.duration);

  useEffect(() => {
    setTimeLeft(counter.duration);
  }, [counter.duration]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (counter.isActive && counter.startTime) {
      interval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - counter.startTime!) / 1000);
        const remaining = counter.duration - elapsed;

        if (remaining <= 0) {
          const state = counter.complete();
          setTimeLeft(0);
          clearInterval(interval!);
          router.push(`/result/${state}`);
        } else {
          setTimeLeft(remaining);
        }
      }, 100);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [counter.isActive, counter.startTime, counter.duration, router]);

  const getEstimatedRate = () => {
    if (timeLeft > counter.duration / 2) {
      return 0;
    }

    if (counter.count === 0) return 0;
    const elapsedTime = counter.duration - timeLeft;
    if (elapsedTime <= 0) return 0;
    return Math.round((counter.count / elapsedTime) * 60);
  };

  return (
    <div className="min-h-screen bg-blue-50 flex flex-col">
      <div className="flex-1 max-w-md mx-auto w-full px-4 py-8 flex flex-col">
        <div className="bg-white rounded-2xl shadow p-6 mb-4">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <Timer className="w-6 h-6 text-blue-600" />
              <span className="text-xl font-semibold">
                {timeLeft} seconds left
              </span>
            </div>
            <button
              onClick={() => counter.duration === 60 ? counter.reset(30) : counter.reset(60)}
              className="text-sm px-3 py-1 bg-gray-100 rounded-full hover:bg-gray-200"
            >
              {counter.duration === 60 ? "Switch to 30s" : "Switch to 60s"}
            </button>
          </div>

          <div className="space-y-2">
            <p className="text-gray-600">
              Count: <span className="font-bold text-xl">{counter.count}</span>
            </p>
            <p className="text-gray-600">
              Estimated rate: <span className="font-bold text-xl">
                {getEstimatedRate()}
              </span> breaths/min
            </p>
          </div>
        </div>

        <button
          onClick={!counter.isActive ? counter.startTimer : counter.increment}
          className={`flex-1 rounded-2xl shadow transition ${!counter.isActive
            ? "bg-blue-600 text-white hover:bg-blue-700"
            : "bg-white text-blue-600 hover:bg-gray-50"
            }`}
        >
          <div className="h-full w-full flex items-center justify-center p-8">
            <span className="text-xl font-medium">
              {!counter.isActive ? "Start Counting" : "Tap to Count"}
            </span>
          </div>
        </button>
      </div>
    </div>
  );
};
