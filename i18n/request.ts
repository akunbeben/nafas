import { getRequestConfig } from 'next-intl/server';
import { cookies } from 'next/headers';

export default getRequestConfig(async () => {
  const cookiesStore = cookies();
  const locale = cookiesStore.get('locale')?.value || 'id';

  return {
    locale,
    messages: (await import(`../lang/${locale}/main.json`)).default
  };
});
