"use client";

import { GlobeIcon, MoonIcon, SunIcon } from "lucide-react";
import { useCookies } from "next-client-cookies";
import { useTheme } from "next-themes";
import { useParams, usePathname, useRouter } from "next/navigation";
import { Result } from "~/types";
import { decrypt, encrypt } from "~/lib/utils";
import { ButtonWithTooltip } from "~/components/ui/button-with-tooltip";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import ThemeSwitch from "~/components/ui/theme-switch";

export function ClientLayout({ children }: { children: React.ReactNode }) {
    const t = useTranslations('Main');
    const cookieStore = useCookies();
    const locale = cookieStore.get('locale') ?? 'id';
    const router = useRouter();
    const params = useParams<{ enc: string }>();
    const pathname = usePathname();
    const data = decrypt<Result>(params.enc);
    const { theme, setTheme } = useTheme();
    const isResultsPage = pathname.includes('/results');

    return (
        <main className="relative h-screen flex flex-col justify-center items-center max-w-2xl w-full border mx-auto bg-zinc-100 text-sm dark:bg-zinc-900">
            <div className="absolute top-0 mx-auto space-x-2 m-4 flex items-center">
                <ButtonWithTooltip
                    tooltipContent={locale === 'id' ? 'Ganti ke Bahasa Inggris' : 'Switch to Bahasa Indonesia'}
                    onClick={() => {
                        cookieStore.set('locale', locale === 'id' ? 'en' : 'id');
                        router.refresh();
                    }}
                    variant="outline"
                >
                    {locale.toUpperCase()}
                </ButtonWithTooltip>
                <ThemeSwitch />
                {!isResultsPage && (
                    <ButtonWithTooltip
                        tooltipContent={t('label.mode', { textMode: data.mode === 30 ? `${data.mode} ${t('label.seconds')}` : `${t('label.minute')}` })}
                        onClick={() => {
                            const newMode = data.mode === 30 ? 60 : 30;
                            const encryptedResult = encrypt({ ...data, mode: newMode });
                            router.push(`/${encryptedResult}`);
                        }}
                        variant="outline"
                    >
                        {data.mode}
                    </ButtonWithTooltip>
                )}
            </div>
            {children}
        </main>
    );
}
