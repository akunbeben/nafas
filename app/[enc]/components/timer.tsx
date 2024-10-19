"use client"

import { useEffect, useState } from "react";
import { useResultStore } from "~/app/store/result-store";
import { Button } from "~/components/ui/button";
import { useRouter } from 'next/navigation';
import { encrypt } from "~/lib/utils";
import { Result } from "~/types";

export function Timer({ mode, age }: { mode: 30 | 60, age: number }) {
    const [time, setTime] = useState<number>(mode);
    const [isRunning, setIsRunning] = useState(false);
    const [count, setCount] = useState(0);
    const { result, setResult } = useResultStore();
    const [cycleCompleted, setCycleCompleted] = useState(false);
    const router = useRouter();
    const [currentAge, setCurrentAge] = useState(age);

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
                mode,
                age: currentAge,
                average: (result?.average ?? 0) + (count / ((result?.cycles?.length ?? 0) + 1)),
                cycles: [...(result?.cycles ?? []), {
                    count,
                    iteration: (result?.cycles?.length ?? 0) + 1,
                }]
            };
            setResult(newResult);
            setCycleCompleted(false);
        }
    }, [cycleCompleted, mode, count, result, currentAge]);

    const handleAgeChange = (newAge: number) => {
        if (result?.cycles.length === 0) {
            setCurrentAge(newAge);
            const updatedResult = { ...result, age: newAge };
            setResult(updatedResult);
            const encryptedResult = encrypt(updatedResult);
            router.replace(`/${encryptedResult}`);
        }
    };

    const handleStart = () => {
        setIsRunning(true);
        setCycleCompleted(false);

        if (time === 0) {
            setTime(mode);
            setCount(0);
        }
    }

    const handlePause = () => {
        setIsRunning(false);
    }

    const handleReset = () => {
        setTime(mode);
        setCount(0);
        setCycleCompleted(false);
    }

    const handleSeeResults = () => {
        const encryptedResult = encrypt(result);
        router.push(`/${encryptedResult}/results`);
    }

    const getBreathingRate = (age: number) => {
        if (age < 1) return '30-60';
        if (age < 3) return '24-40';
        if (age < 6) return '22-34';
        if (age < 12) return '18-30';
        return '12-20';
    };

    return (
        <div className="flex flex-col gap-4 items-center justify-center">
            {result?.cycles.length === 0 && (
                <div className="flex items-center gap-2">
                    <label htmlFor="age-input">Age:</label>
                    <input
                        id="age-input"
                        type="number"
                        value={currentAge}
                        onChange={(e) => handleAgeChange(parseInt(e.target.value, 10))}
                        min="0"
                        max="120"
                        className="border rounded px-2 py-1"
                    />
                </div>
            )}
            <h2>Normal Breathing Rate: {getBreathingRate(currentAge)} breaths/minute</h2>
            <h1>Time: {time}</h1>
            <div
                className="h-60 w-screen sm:w-60 bg-secondary rounded-lg border cursor-pointer flex items-center justify-center"
                onClick={() => {
                    if (!isRunning) {
                        handleStart();
                    }

                    if (time === 0) {
                        handleReset();
                        setCount(c => c + 1);
                        return;
                    }

                    setCount(count => count + 1);
                }}
            >
                <h1>{count}</h1>
            </div>
            <div className="flex gap-2">
                {isRunning && (<Button onClick={handlePause}>Pause</Button>)}
                {!isRunning && (<Button variant="destructive" onClick={handleReset}>Reset</Button>)}
                {!isRunning && time !== 0 && (<Button onClick={handleStart}>Continue</Button>)}
                {result?.cycles.length && (<Button onClick={handleSeeResults}>See Results</Button>)}
            </div>
        </div>
    )
}
