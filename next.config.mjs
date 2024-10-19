import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        APP_KEY: process.env.APP_KEY,
        APP_LOCALE: process.env.APP_LOCALE
    }
};

export default withNextIntl(nextConfig);
