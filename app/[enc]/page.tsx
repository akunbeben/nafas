import { decrypt } from "~/lib/utils";
import { Result } from "~/types";
import { Timer } from "./components/timer";
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: { enc: string } }): Promise<Metadata> {
    const result = decrypt<Result>(params.enc);
    return {
        title: 'Breathing Rate Counter',
        description: `Count breaths for early diagnosis of Pneumonia, Asthma, Bronchitis and other causes of respiratory diseases. Share the result with your doctor.`,
        openGraph: {
            title: 'Breathing Rate Counter',
            description: `Count breaths for early diagnosis of Pneumonia, Asthma, Bronchitis and other causes of respiratory diseases. Share the result with your doctor.`,
        },
    };
}

export default async function Page({ params }: { params: { enc: string } }) {
    const result = decrypt<Result>(params.enc);

    return (
        <div className="flex flex-col gap-4 min-h-screen w-full items-center justify-center">
            <Timer mode={result.mode} age={result.age} />
        </div>
    )
}
