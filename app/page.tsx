import { CounterView } from "~/components/CounterView";
import { getTranslations, getLocale } from 'next-intl/server';
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: 'Main' });

  return {
    title: t('seo.index.title'),
    description: t('seo.index.title'),
    openGraph: {
      title: t('seo.index.title'),
      description: t('seo.index.title'),
    }
  };
}

export default function Home() {
  return (
    <CounterView />
  );
}
