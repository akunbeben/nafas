import { decrypt } from "~/lib/utils";
import { Result } from "~/types";
import { Timer } from "./components/timer";
import { Metadata } from "next";
import { redirect } from "next/navigation";

export async function generateMetadata(): Promise<Metadata> {
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
    let result: Result;

    try {
        result = decrypt<Result>(params.enc);
    } catch (error) {
        console.error(error);
        redirect('/');
    }

    return <Timer mode={result.mode} age={result.age} />
}
