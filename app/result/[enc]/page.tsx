import { decodeState } from "~/utils/helper";
import { ResultsView } from "~/components/ResultsView";
import { getTranslations, getLocale } from 'next-intl/server';
import { format } from "date-fns-tz";
import { Metadata } from "next";
import { cookies } from "next/headers";

export async function generateMetadata({ params }: { params: Promise<{ enc: string }> }): Promise<Metadata> {
  const cookieStore = await cookies();
  const timeZone = cookieStore.get('timezone')?.value || 'UTC';
  const locale = await getLocale();
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
      'updated-at': `${format(unixTime, 'dd MMM yyyy, H:mm', { timeZone })}`
    },
    openGraph: {
      title: t('seo.result.title'),
      description: t('seo.result.title'),
      images: [
        `/api/og/${enc}?locale=${locale}`
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title: t('seo.result.title'),
      description: t('seo.result.title'),
      images: [
        `/api/og/${enc}?locale=${locale}`
      ]
    }
  }
}

export default async function Result({ params }: { params: Promise<{ enc: string }> }) {
  const { enc } = await params;

  return (
    <ResultsView state={enc} />
  )
}
