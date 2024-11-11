import { CounterView } from "~/components/CounterView";
import { getTranslations } from 'next-intl/server';
import { cookies } from "next/headers";

export async function generateMetadata() {
  const locale = cookies().get('locale')?.value || 'en';
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
