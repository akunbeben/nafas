import { ResultCard } from "~/components/ResultCard";

export default async function ResultImage({ params }: { params: Promise<{ enc: string }> }) {
    const { enc } = await params;

    return (
        <div className="min-h-screen bg-blue-50">
            <div className="h-full max-w-md px-4 py-8 mx-auto space-y-4">
                <ResultCard state={enc} />
            </div>
        </div>
    )
}