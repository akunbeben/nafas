import { decodeState, isValidTimezone } from "~/utils/helper";
import { ResultsView } from "~/components/ResultsView";
import { getTranslations, getLocale } from 'next-intl/server';
import { format } from "date-fns-tz";
import { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function generateMetadata({ params, searchParams }: { params: Promise<{ enc: string }>, searchParams: Promise<{ [key: string]: string | string[] | undefined }> }): Promise<Metadata> {
  const cookieStore = await cookies();
  const timeZone = cookieStore.get('timezone')?.value || 'UTC';
  const { locale: localeQuery, tz } = await searchParams;
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: 'Main' });
  const { enc } = await params;
  const [error, counter] = decodeState(enc);
  const unixTime = !counter?.t ? 0 : parseInt(counter.t);

  if (!['id', 'en'].includes(localeQuery!.toString())) {
    redirect(`/result/${enc}?locale=${locale}`);
  }

  if (!isValidTimezone(tz?.toString())) {
    redirect(`/result/${enc}?locale=${locale}&tz=${Intl.DateTimeFormat().resolvedOptions().timeZone}`);
  }

  if (error) {
    return {};
  }

  return {
    title: t('seo.result.title'),
    description: t('seo.result.title'),
    other: {
      'respiratory-rate': `${counter?.c || 0} breaths/min`,
      'measurement-duration': `${counter?.d} seconds`,
      'updated-at': `${format(unixTime, 'dd MMM yyyy, HH:mm', { timeZone })}`
    },
    openGraph: {
      title: t('seo.result.title'),
      description: t('seo.result.title'),
      images: [
        `/api/og/${enc}?locale=${localeQuery}&tz=${timeZone}`
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title: t('seo.result.title'),
      description: t('seo.result.title'),
      images: [
        `/api/og/${enc}?locale=${localeQuery}&tz=${timeZone}`
      ]
    }
  }
}

export default async function Result({ params, searchParams }: { params: Promise<{ enc: string }>, searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const { enc } = await params;
  const { locale: localeQuery, tz } = await searchParams;
  const locale = await getLocale();

  if (!['id', 'en'].includes(localeQuery!.toString())) {
    redirect(`/result/${enc}?locale=${locale}`);
  }

  if (!isValidTimezone(tz?.toString())) {
    redirect(`/result/${enc}?locale=${locale}&tz=${Intl.DateTimeFormat().resolvedOptions().timeZone}`);
  }

  return (
    <ResultsView state={enc} />
  )
}
