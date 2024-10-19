"use client"

import { useEffect, useState } from "react";
import { useResultStore } from "~/app/store/result-store";
import { useRouter } from 'next/navigation';
import { cn, encrypt, getBreathingRate } from "~/lib/utils";
import { Result } from "~/types";
import { useTranslations } from "next-intl";
import { ClipboardCheckIcon, PauseIcon, PlayIcon, RefreshCcwIcon } from "lucide-react";
import { ButtonWithTooltip } from "~/components/ui/button-with-tooltip";
import Link from "next/link";

export function Timer({ mode, age }: { mode: 30 | 60, age: number }) {
    const t = useTranslations('Main');
    const [time, setTime] = useState<number>(mode);
    const [isRunning, setIsRunning] = useState(false);
    const [count, setCount] = useState(0);
    const { result, setResult } = useResultStore();
    const [cycleCompleted, setCycleCompleted] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const interval = setInterval(() => {
            if (isRunning) {
                setTime(prevTime => {
                    const newTime = prevTime - 1;
                    if (newTime <= 0) {
                        setIsRunning(false);
                        setCycleCompleted(true);

                        return 0;
                    }
                    return newTime;
                });
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [isRunning]);

    useEffect(() => {
        if (cycleCompleted) {
            const newResult = {
                ...result,
                state: 1,
                mode,
                age,
                average: (result?.average ?? 0) + (count / ((result?.cycles?.length ?? 0) + 1)),
                cycles: [...(result?.cycles ?? []), {
                    count,
                    iteration: (result?.cycles?.length ?? 0) + 1,
                    mode,
                }]
            };
            setResult(newResult);
            setCycleCompleted(false);
        }
    }, [cycleCompleted, mode, count, result, setResult]);

    const handleStart = (e: React.MouseEvent<HTMLDivElement | HTMLButtonElement>) => {
        e.stopPropagation();

        setIsRunning(true);
        setCycleCompleted(false);

        if (time === 0) {
            setTime(mode);
            setCount(0);
        }
    }

    const handlePause = (e: React.MouseEvent<HTMLDivElement | HTMLButtonElement>) => {
        e.stopPropagation();

        setIsRunning(false);
    }

    const handleReset = (e: React.MouseEvent<HTMLDivElement | HTMLButtonElement>) => {
        e.stopPropagation();

        setTime(mode);
        setCount(0);
        setCycleCompleted(false);
    }

    const handleSeeResults = (e: React.MouseEvent<HTMLDivElement | HTMLButtonElement>) => {
        e.stopPropagation();

        const encryptedResult = encrypt(result as Result);
        router.push(`/${encryptedResult}/results`);
    }

    return (
        <div className="flex flex-col gap-4 items-center justify-center grow h-full">
            <div className="mt-auto sm:mt-0">
                <div className="flex flex-col justify-center items-center p-4">
                    <h2>{t('label.normal', { bpm: getBreathingRate(age), textMode: mode === 30 ? `${mode} ${t('label.seconds')}` : `${t('label.minute')}` })}</h2>
                    <Link
                        href="https://www.halodoc.com/artikel/ketahui-frekuensi-napas-normal-dari-bayi-sampai-lansia#:~:text=Bayi%20(0%2D1%20tahun,28%20napas%20per%20menit."
                        target="_blank"
                        className="text-xs text-muted-foreground underline"
                    >
                        {t('label.source')}
                    </Link>
                    <h1 className="text-4xl font-bold my-10">{t('label.timer')}: {time}</h1>
                </div>
                <div
                    className="relative h-[50dvh] sm:h-80 w-screen sm:w-80 bg-white dark:bg-zinc-800 sm:rounded-lg border cursor-pointer flex items-center justify-center mx-auto"
                    onClick={e => {
                        e.stopPropagation();

                        if (!isRunning) {
                            handleStart(e);
                        }

                        if (time === 0) {
                            handleReset(e);
                            setCount(c => c + 1);
                            return;
                        }

                        setCount(count => count + 1);
                    }}
                >
                    <div className="absolute z-10 top-0 right-0 flex justify-end sm:justify-center gap-2 p-4 min-h-[72px]">
                        {(result?.cycles.length ?? 0) > 0 ? (
                            <ButtonWithTooltip
                                tooltipContent={t('action.seeResults')}
                                tooltipSide="bottom"
                                onClick={e => handleSeeResults(e)}
                                variant="outline"
                            >
                                <ClipboardCheckIcon className="w-4 h-4" />
                            </ButtonWithTooltip>
                        ) : null}
                        {isRunning ? (
                            <ButtonWithTooltip
                                tooltipContent={t('action.pause')}
                                tooltipSide="bottom"
                                onClick={e => handlePause(e)}
                                variant="outline"
                            >
                                <PauseIcon className="w-4 h-4" />
                            </ButtonWithTooltip>
                        ) : null}
                        {!isRunning && count !== 0 ? (
                            <ButtonWithTooltip
                                tooltipContent={t('action.reset')}
                                tooltipSide="bottom"
                                onClick={e => handleReset(e)}
                                variant="destructive"
                            >
                                <RefreshCcwIcon className="w-4 h-4" />
                            </ButtonWithTooltip>
                        ) : null}
                        {(time !== mode || 0) && !isRunning ? (
                            <ButtonWithTooltip
                                tooltipContent={t('action.continue')}
                                tooltipSide="bottom"
                                onClick={e => handleStart(e)}
                                variant="outline"
                            >
                                <PlayIcon className="w-4 h-4" />
                            </ButtonWithTooltip>
                        ) : null}
                    </div>
                    <div className={cn('font-bold', count === 0 ? 'text-center' : 'text-4xl')}>
                        {(time !== mode) && !isRunning ? (
                            <div className="flex flex-col items-center justify-center gap-2">
                                <h1>{count}</h1>
                                <span className="text-xs text-muted-foreground">
                                    {t('label.continue')}
                                </span>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center gap-2">
                                <h1>{count === 0 ? t('label.start') : count}</h1>
                                <span className="text-xs text-muted-foreground">
                                    &nbsp;
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
