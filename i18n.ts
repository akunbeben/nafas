import { getRequestConfig } from 'next-intl/server';
import { cookies } from 'next/headers';

export default getRequestConfig(async () => {
    const locale = cookies().get('locale')?.value || process.env.APP_LOCALE || 'id';

    return {
        locale,
        messages: {
            ...(await import(`./lang/${locale}/main.json`)).default,
            ...(await import(`./lang/${locale}/structured-data.json`)).default,
            ...(await import(`./lang/${locale}/seo.json`)).default
        }
    };
});