"use client"

import { Result } from "~/types";
import { encrypt } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export function ResultsDisplay({ result }: { result: Result }) {
    const router = useRouter();
    const [shortUrl, setShortUrl] = useState<string | null>(null);

    const getBreathingRate = (age: number) => {
        if (age < 1) return '30-60';
        if (age < 3) return '24-40';
        if (age < 6) return '22-34';
        if (age < 12) return '18-30';
        return '12-20';
    };

    const handleShareResults = async () => {
        const currentUrl = `${window.location.origin}${window.location.pathname}`;
        try {
            const response = await fetch('/api/shorten', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ url: currentUrl }),
            });
            const data = await response.json();
            setShortUrl(data.shortUrl);
            await navigator.clipboard.writeText(data.shortUrl);
            alert('Shortened link copied to clipboard!');
        } catch (error) {
            console.error('Error shortening URL:', error);
            alert('Failed to generate short link. Using full URL instead.');
            await navigator.clipboard.writeText(currentUrl);
            alert('Full link copied to clipboard!');
        }
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
            <Button onClick={handleShareResults}>
                Share Results
            </Button>
            {shortUrl && (
                <div>
                    <p>Shortened URL: {shortUrl}</p>
                </div>
            )}
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
