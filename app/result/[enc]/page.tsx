import { ResultsView } from "~/components/ResultsView";
import { headers } from 'next/headers';
import { getFullUrl, decodeState } from "~/utils/helper";

export async function generateMetadata({ params }: { params: Promise<{ enc: string }> }) {
  const { enc } = await params;
  const counter = decodeState(enc);
  const headersList = headers();
  const pathParam = `${getFullUrl(headersList.get('host'))}/result/${enc}`;
  const ogImage = `${getFullUrl(headersList.get('host'))}/api?path=${pathParam}`;

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
      images: [ogImage]
    }
  }
}

export default async function Result({ params }: { params: Promise<{ enc: string }> }) {
  const { enc } = await params;

  return (
    <ResultsView state={enc} />
  )
}
