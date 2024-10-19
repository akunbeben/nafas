import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(async () => {
    const locale = process.env.APP_LOCALE;

    return {
        locale,
        messages: { ...(await import(`../lang/${locale}/main.json`)).default }
    };
});