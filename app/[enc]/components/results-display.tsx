"use client"

import { Result } from "~/types";
import { usePathname, useRouter } from 'next/navigation';
import { BellRing, LinkIcon, RefreshCwIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useCookies } from "next-client-cookies";
import { toast } from "sonner";
import { ButtonWithTooltip } from "~/components/ui/button-with-tooltip";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card"
import { cn } from "~/lib/utils";

export function ResultsDisplay({ result }: { result: Result }) {
    const t = useTranslations('Main');
    const cookieStore = useCookies();
    const locale = cookieStore.get('locale') || process.env.APP_LOCALE || 'id';
    const router = useRouter();
    const pathname = usePathname();

    const handleCopyResults = async () => {
        try {
            const currentUrl = `${process.env.APP_URL}${pathname}`;
            await navigator.clipboard.writeText(currentUrl);
            toast.success(t('toast.copy.title.success'), {
                description: t('toast.copy.content.success')
            });
        } catch (error) {
            toast.error(t('toast.copy.title.error'), {
                description: t('toast.copy.content.error')
            });
        }
    };

    return (
        <div className="flex flex-col gap-4 items-center justify-center px-4 w-full">
            <Card className="w-full aspect-[2/1]">
                <CardHeader>
                    <CardTitle>{t('label.result.title')}</CardTitle>
                    <CardDescription>{t('label.result.description')}</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">
                    <div>
                        {result.cycles.map((cycle, index) => (
                            <div
                                key={index}
                                className="mb-4 grid items-start pb-4 last:mb-0 last:pb-0 border-b last:border-b-0"
                            >
                                <div className="space-y-1">
                                    <p className="text-sm font-medium leading-none">
                                        {cycle.iteration}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        {t('label.result.bpm', { bpm: cycle.count, textMode: result.mode === 30 ? `${cycle.mode} ${t('label.seconds')}` : t('label.minute') })}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
                {/* <CardFooter>
        <Button className="w-full">
          <Check /> Mark all as read
        </Button>
      </CardFooter> */}
            </Card>
            <div className="flex gap-2">
                <ButtonWithTooltip
                    tooltipContent={t('action.new')}
                    variant="outline"
                    onClick={() => router.push('/')}
                >
                    <RefreshCwIcon />
                </ButtonWithTooltip>
                <ButtonWithTooltip
                    tooltipContent={t('action.copy')}
                    variant="outline"
                    onClick={handleCopyResults}
                >
                    <LinkIcon />
                </ButtonWithTooltip>
            </div>
        </div>
    )
}
