import { decodeState } from "~/utils/helper";
import { ResultsView } from "~/components/ResultsView";

export async function generateMetadata({ params }: { params: Promise<{ enc: string }> }) {
  const { enc } = await params;
  const [error, counter] = decodeState(enc);

  if (error) {
    return {};
  }

  return {
    title: 'Respiratory rate result',
    description: `Respiratory Rate and measurement details`,
    other: {
      'respiratory-rate': `${counter?.c || 0} breaths/min`,
      'measurement-duration': `${counter?.d} seconds`,
      'updated-at': `${new Date(counter?.t || 0).toDateString()}`
    },
    openGraph: {
      title: 'Respiratory rate result',
      description: `Respiratory Rate and measurement details`,
    }
  }
}

export default async function Result({ params }: { params: Promise<{ enc: string }> }) {
  const { enc } = await params;

  return (
    <ResultsView state={enc} />
  )
}
