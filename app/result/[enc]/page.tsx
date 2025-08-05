import { decodeState } from "~/utils/helper";
import { ResultsView } from "~/components/ResultsView";
import { getTranslations, getLocale } from 'next-intl/server';
import { format } from "date-fns-tz";
import { Metadata } from "next";
import { redirect } from "next/navigation";

export async function generateMetadata({ params }: { params: Promise<{ enc: string }> }): Promise<Metadata> {
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: 'Main' });
  const { enc } = await params;
  const [error, state] = decodeState(enc);
  const unixTime = !state?.t ? 0 : parseInt(state.t);

  if (error || state === null) {
    return {};
  }

  return {
    title: t('seo.result.title'),
    description: t('seo.result.title'),
    other: {
      'respiratory-rate': `${state.c || 0} breaths/min`,
      'measurement-duration': `${state.d} seconds`,
      'updated-at': `${format(unixTime, 'dd MMM yyyy, HH:mm', { timeZone: state.tz })}`
    },
    openGraph: {
      title: t('seo.result.title'),
      description: t('seo.result.title'),
      images: [
        `/api/og/${enc}`
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title: t('seo.result.title'),
      description: t('seo.result.title'),
      images: [
        `/api/og/${enc}`
      ]
    }
  }
}

export default async function Result({ params }: { params: Promise<{ enc: string }> }) {
  const { enc } = await params;
  const [error, state] = decodeState(enc);

  if (error || state === null) {
    redirect(`/result/${enc}`);
  }

  return (
    <ResultsView state={enc} />
  )
}
