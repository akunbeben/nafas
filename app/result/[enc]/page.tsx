import { ResultsView } from "~/components/ResultsView";
import { headers } from 'next/headers';
import { getFullUrl } from "~/utils/helper";

export async function generateMetadata({ params }: { params: Promise<{ enc: string }> }) {
    const { enc } = await params;
    const headersList = await headers();
    const pathParam = `${getFullUrl(headersList.get('host'))}/result/${enc}`;
    const fullUrl = `${getFullUrl(headersList.get('host'))}/api?path=${pathParam}`;

    return {
        title: `Respiratory Rate: ${enc}`,
        description: `Your respiratory rate is ${enc} breaths per minute.`,
        openGraph: {
            title: `Respiratory Rate: ${enc}`,
            description: `Your respiratory rate is ${enc} breaths per minute.`,
            images: [fullUrl]
        }
    }
}

export default async function Result({ params }: { params: Promise<{ enc: string }> }) {
    const { enc } = await params;

    return (
        <ResultsView state={enc} />
    )
}