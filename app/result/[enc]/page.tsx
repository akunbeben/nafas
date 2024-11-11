import { decodeState } from "~/utils/helper";
import { ResultsView } from "~/components/ResultsView";
import { getTranslations } from 'next-intl/server';
import { cookies } from "next/headers";
import { format } from "date-fns";

export async function generateMetadata({ params }: { params: Promise<{ enc: string }> }) {
  const locale = cookies().get('locale')?.value || 'en';
  const t = await getTranslations({ locale, namespace: 'Main' });
  const { enc } = await params;
  const [error, counter] = decodeState(enc);
  const unixTime = !counter?.t ? 0 : parseInt(counter.t);

  if (error) {
    return {};
  }

  return {
    title: t('seo.result.title'),
    description: t('seo.result.title'),
    other: {
      'respiratory-rate': `${counter?.c || 0} breaths/min`,
      'measurement-duration': `${counter?.d} seconds`,
      'updated-at': `${format(unixTime, 'dd MMM yyyy, H:mm')}`
    },
    openGraph: {
      title: t('seo.result.title'),
      description: t('seo.result.title'),
    }
  }
}

export default async function Result({ params }: { params: Promise<{ enc: string }> }) {
  const { enc } = await params;

  return (
    <ResultsView state={enc} />
  )
}
