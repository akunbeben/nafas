import { Activity } from "lucide-react";
import { PropsWithChildren } from "react";
import { decodeState, getRateCategory } from "~/utils/helper";
import { format } from 'date-fns';
import { redirect } from "next/navigation";
import { useTranslations } from "next-intl";

type Props = {
  state: string;
}

export function ResultCard({ children, state }: PropsWithChildren<Props>) {
  const t = useTranslations('Main');
  const [error, decoded] = decodeState(decodeURIComponent(state));

  if (error) {
    redirect('/');
  }

  const rate = Math.round((parseInt(decoded?.c || '0') / parseInt(decoded?.d || '0')) * 60);
  const rateStatus = getRateCategory(rate);
  const unixTime = !decoded?.t ? 0 : parseInt(decoded.t);

  return (
    <div className="p-6 space-y-6 bg-white shadow rounded-2xl" id="result-card">
      <div className="flex items-center justify-center space-x-2">
        <Activity className="w-8 h-8 text-blue-600" />
        <h1 className="text-2xl font-bold text-gray-900">{t('label.result')}</h1>
      </div>

      <div className="space-y-4">
        <div className="p-4 rounded-lg bg-blue-50">
          <h2 className="text-lg text-center">
            {t('label.rate')}:
            <span className={`block text-4xl font-bold ${rateStatus.color}`}>
              {rate} {t('label.bpm')}
            </span>
          </h2>
        </div>

        <div className="space-y-2">
          <p className="text-gray-600">
            • {t('label.total')}: <strong>{decoded?.c}</strong>
          </p>
          <p className="text-gray-600">
            • {t('label.measured_over')}: <strong>{decoded?.d} {t('label.seconds')}</strong>
          </p>
          {!decoded?.t ? null : (
            <p className="text-gray-600">
              • {t('label.measured_at')}: <strong>{format(unixTime, 'dd MMM yyyy, H:mm')}</strong>
            </p>
          )}
        </div>
      </div>

      <div id="children">
        {children}
      </div>
    </div>
  )
}
