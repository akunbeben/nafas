'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useCounterStore } from '~/stores/useCounterStore';
import { Timer } from 'lucide-react';
import { useTranslations, useLocale } from 'next-intl';
import Cookies from 'js-cookie';

export const CounterView: React.FC = () => {
  const locale = useLocale();
  const t = useTranslations('Main');
  const router = useRouter();
  const counter = useCounterStore();
  const [timeLeft, setTimeLeft] = useState<number>(counter.duration);
  const [animate, setAnimate] = useState(false);
  const [clickable, setClickable] = useState(true);
  const lastRemaining = useRef(-1);

  useEffect(() => {
    setClickable(true);
  }, [])

  useEffect(() => {
    Cookies.set('timezone', Intl.DateTimeFormat().resolvedOptions().timeZone)
  }, [])

  useEffect(() => {
    setTimeLeft(counter.duration);
  }, [counter.duration]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    const tickAudio = new Audio('/tick.mp3');
    tickAudio.preload = 'auto';

    if (counter.isActive && counter.startTime) {
      interval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - counter.startTime!) / 1000);
        const remaining = counter.duration - elapsed;

        if (remaining <= 0) {
          const state = counter.complete();

          setClickable(false);
          setTimeLeft(0);
          clearInterval(interval!);
          router.push(`/result/${state}`);
        } else {
          if (lastRemaining.current !== remaining) {
            setTimeLeft(remaining);
            tickAudio.play();
            lastRemaining.current = remaining;
          }
        }
      }, 100);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [counter.isActive, counter.startTime, counter.duration, counter.complete, router]);

  function toggleLocale() {
    if (locale === 'en') {
      Cookies.set('locale', 'id');
    } else {
      Cookies.set('locale', 'en');
    }

    setClickable(true);
    router.refresh();
  }

  function toggleDuration() {
    if (counter.duration === 60) {
      counter.reset(30);
    } else {
      counter.reset(60);
    }

    setClickable(true);
    setAnimate(false);
    setTimeout(() => setAnimate(true), 10);
    new Audio('/switch.mp3').play();
  }

  return (
    <div className="min-h-screen bg-blue-50 flex flex-col">
      <div className="flex-1 max-w-md mx-auto w-full p-4 flex flex-col">
        <button
          className={`mb-4 w-fit mx-auto ${counter.isActive ? 'text-gray-600' : ''}`}
          disabled={counter.isActive}
          onClick={toggleLocale}
        >
          {locale.toUpperCase()}
        </button>
        <div className="relative mb-4">
          {counter.isActive && (
            <div className="absolute inset-0 rounded-2xl animate-ping-card bg-blue-500"></div>
          )}
          <div className="relative bg-white rounded-2xl shadow p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-2">
                <Timer className="w-6 h-6 text-blue-600" />
                <span className={`text-xl font-semibold ${animate ? "animate-fade-left" : ""}`}>
                  {timeLeft} {t('label.timeLeft')}
                </span>
              </div>
              <button
                onClick={() => toggleDuration()}
                className="text-sm px-3 py-1 bg-gray-100 rounded-full hover:bg-gray-200 disabled:hover:bg-gray-100"
                disabled={counter.isActive}
              >
                {counter.duration === 60 ? t('action.switch', { duration: 30 }) : t('action.switch', { duration: 60 })}
              </button>
            </div>

            <div className="space-y-2">
              <p className="text-gray-600">
                {t('label.count')}: <span className="font-bold text-xl">{counter.count}</span>
              </p>
            </div>
          </div>
        </div>

        <button
          disabled={!clickable}
          onClick={!counter.isActive ? counter.startTimer : counter.increment}
          className={`flex-1 rounded-2xl shadow transition ${!counter.isActive
            ? "bg-blue-600 text-white hover:bg-blue-700"
            : "bg-white text-blue-600 hover:bg-gray-50"
            }`}
        >
          <div className="h-full w-full flex items-center justify-center p-8">
            <span className="text-xl font-medium">
              {!counter.isActive ? t('action.start') : t('action.tap')}
            </span>
          </div>
        </button>
      </div>
    </div>
  );
};
