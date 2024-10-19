import type { Metadata } from "next";
import "./globals.css";
import { getLocale, getMessages, getTranslations } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";
import { CookiesProvider } from "next-client-cookies/server";
import { Toaster } from "~/components/ui/sonner";
import { ClientLayout } from "./client-layout";
import { ThemeProvider } from "next-themes";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations({ namespace: "Main" });

  return {
    title: t('label.title'),
    description: t('label.description'),
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <CookiesProvider>
      <html lang={locale} suppressHydrationWarning>
        <body
          className="antialiased"
        >
          <NextIntlClientProvider locale={locale} messages={messages}>
            <ThemeProvider attribute="class">
              <ClientLayout>
                {children}
              </ClientLayout>
            </ThemeProvider>
            <Toaster />
          </NextIntlClientProvider>
        </body>
      </html>
    </CookiesProvider>
  );
}
