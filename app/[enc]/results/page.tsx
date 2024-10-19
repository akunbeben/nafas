import { decrypt } from "~/lib/utils";
import { Result } from "~/types";
import { Metadata } from "next";
import { ResultsDisplay } from "../components/results-display";
import Script from 'next/script';

export async function generateMetadata({ params }: { params: { enc: string } }): Promise<Metadata> {
    const result = decrypt<Result>(params.enc);

    const averageRate = result.average.toFixed(2);
    const totalCycles = result.cycles.length;
    const lastCycleRate = result.cycles[totalCycles - 1]?.count || 0;

    const getBreathingRate = (age: number) => {
        if (age < 1) return '30-60';
        if (age < 3) return '24-40';
        if (age < 6) return '22-34';
        if (age < 12) return '18-30';
        return '12-20';
    };

    const normalRate = getBreathingRate(result.age);

    const title = `Breathing Rate Results: ${averageRate} breaths/min`;
    const description = `Age: ${result.age} years, Average: ${averageRate} breaths/min, Cycles: ${totalCycles}, Last cycle: ${lastCycleRate} breaths/min, Normal range: ${normalRate} breaths/min`;

    return {
        title,
        description,
        openGraph: {
            title,
            description,
        },
        twitter: {
            card: 'summary',
            title,
            description,
        },
    };
}

export default async function ResultsPage({ params }: { params: { enc: string } }) {
    const result = decrypt<Result>(params.enc);

    const averageRate = result.average.toFixed(2);
    const totalCycles = result.cycles.length;
    const lastCycleRate = result.cycles[totalCycles - 1]?.count || 0;

    const structuredData = {
        "@context": "https://schema.org",
        "@type": "MedicalTest",
        "name": "Breathing Rate Test",
        "description": `Breathing rate test results for a ${result.age}-year-old patient`,
        "usesDevice": {
            "@type": "MedicalDevice",
            "name": "Breathing Rate Calculator"
        },
        "result": {
            "@type": "MedicalTestPanel",
            "name": "Breathing Rate Results",
            "result": [
                {
                    "@type": "MedicalTest",
                    "name": "Average Breathing Rate",
                    "result": {
                        "@type": "MedicalTestPanel",
                        "value": averageRate,
                        "unitCode": "BPM"
                    }
                },
                {
                    "@type": "MedicalTest",
                    "name": "Total Cycles",
                    "result": {
                        "@type": "MedicalTestPanel",
                        "value": totalCycles
                    }
                },
                {
                    "@type": "MedicalTest",
                    "name": "Last Cycle Breathing Rate",
                    "result": {
                        "@type": "MedicalTestPanel",
                        "value": lastCycleRate,
                        "unitCode": "BPM"
                    }
                }
            ]
        }
    };

    return (
        <>
            <Script id="structured-data" type="application/ld+json">
                {JSON.stringify(structuredData)}
            </Script>
            <div className="flex flex-col gap-4 min-h-screen w-full items-center justify-center">
                <ResultsDisplay result={result} />
            </div>
        </>
    )
}
