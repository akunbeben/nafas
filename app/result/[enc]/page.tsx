import { ResultsView } from "~/components/ResultsView";

export default async function Result({ params }: { params: Promise<{ enc: string }> }) {
    const { enc } = await params;

    return (
        <ResultsView state={enc} />
    )
}