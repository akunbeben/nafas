import { decrypt } from "~/lib/utils";
import { Result } from "~/types";
import { Metadata } from "next";
import { ResultsDisplay } from "../components/results-display";
import Script from 'next/script';
import { notFound, redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({ params }: { params: { enc: string } }): Promise<Metadata> {
    const t = await getTranslations('SEO.results');

    let result: Result;

    try {
        result = decrypt<Result>(params.enc);
    } catch (error) {
        console.error(error);
        notFound();
    }

    const averageRate = result.average.toFixed(2);
    const totalCycles = result.cycles.length;
    const lastCycleRate = result.cycles[totalCycles - 1]?.count || 0;

    const title = t('title', { averageRate: averageRate });
    const description = t(
        'description',
        {
            age: result.age,
            totalCycles: totalCycles,
            lastCycleRate: lastCycleRate,
            averageRate: averageRate
        }
    );

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
    const t = await getTranslations('StructuredData');
    let result: Result;

    try {
        result = decrypt<Result>(params.enc);
    } catch (error) {
        console.error(error);
        redirect('/');
    }

    if (result.state === 0) redirect(`/${params.enc}`);

    const averageRate = result.average.toFixed(2);
    const totalCycles = result.cycles.length;
    const lastCycleRate = result.cycles[totalCycles - 1]?.count || 0;

    const structuredData = {
        "@context": "https://schema.org",
        "@type": "MedicalTest",
        "name": t('name'),
        "description": t('description', { age: result.age }),
        "usesDevice": {
            "@type": "MedicalDevice",
            "name": t('deviceName'),
            "url": `${process.env.APP_URL}/${params.enc}/results`
        },
        "result": {
            "@type": "MedicalTestPanel",
            "name": t('resultPanelName'),
            "result": [
                {
                    "@type": "MedicalTest",
                    "name": t('averageRateName'),
                    "result": {
                        "@type": "MedicalTestPanel",
                        "value": averageRate,
                        "unitCode": "BPM"
                    }
                },
                {
                    "@type": "MedicalTest",
                    "name": t('totalCyclesName'),
                    "result": {
                        "@type": "MedicalTestPanel",
                        "value": totalCycles
                    }
                },
                {
                    "@type": "MedicalTest",
                    "name": t('lastCycleRateName'),
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
