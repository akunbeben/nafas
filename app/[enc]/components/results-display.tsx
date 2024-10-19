"use client"

import { Result } from "~/types";
import { encrypt } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import { useRouter } from 'next/navigation';

export function ResultsDisplay({ result }: { result: Result }) {
    const router = useRouter();

    const getBreathingRate = (age: number) => {
        if (age < 1) return '30-60';
        if (age < 3) return '24-40';
        if (age < 6) return '22-34';
        if (age < 12) return '18-30';
        return '12-20';
    };

    return (
        <div className="flex flex-col gap-4 items-center justify-center">
            <h2>Patient Age: {result.age} years</h2>
            <h2>Normal Breathing Rate: {getBreathingRate(result.age)} breaths/minute</h2>
            <div className="flex flex-col gap-2">
                <h1>Results</h1>
                <div className="flex flex-col gap-2">
                    <h1>Average: {result.average.toFixed(2)} breaths/minute</h1>
                    {result.cycles.map((cycle, index) => (
                        <div key={index} className="flex gap-2">
                            <h1>Iteration {cycle.iteration}: {cycle.count} breaths/minute</h1>
                        </div>
                    ))}
                </div>
            </div>
            <Button onClick={() => {
                const shareUrl = `${window.location.origin}${window.location.pathname}`;
                navigator.clipboard.writeText(shareUrl);
                alert('Share link copied to clipboard!');
            }}>
                Share Results
            </Button>
            <Button onClick={() => {
                const newResult = {
                    ...result,
                    cycles: [],
                    average: 0
                };
                const encryptedResult = encrypt(newResult);
                router.push(`/${encryptedResult}`);
            }}>
                Start New Session
            </Button>
        </div>
    )
}
