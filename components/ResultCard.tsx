import { PropsWithChildren } from "react";
import { decodeState, getRateCategory } from "~/utils/helper";
import { format } from 'date-fns-tz';
import { redirect } from "next/navigation";
import { useTranslations } from "next-intl";
import Cookies from 'js-cookie';

type Props = {
  state: string;
};

export function ResultCard({ children, state }: PropsWithChildren<Props>) {
  const timeZone = Cookies.get('timezone') || 'UTC';
  const t = useTranslations('Main');
  const [error, decoded] = decodeState(decodeURIComponent(state));

  if (error) {
    redirect('/');
  }

  const rate = Math.round((parseInt(decoded?.c || '0') / parseInt(decoded?.d || '0')) * 60);
  const rateStatus = getRateCategory(rate);
  const unixTime = !decoded?.t ? 0 : parseInt(decoded.t);

  return (
    <div
      id="result-card"
      style={{
        padding: '1.5rem',
        backgroundColor: 'white',
        borderRadius: '1rem',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem'
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem'
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ color: '#2563eb' }}
        >
          <path d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2" />
        </svg>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827' }}>{t('label.result')}</h1>
      </div>

      <div>
        <div
          style={{
            padding: '1rem',
            borderRadius: '0.5rem',
            backgroundColor: '#eff6ff',
            textAlign: 'center'
          }}
        >
          <h2 style={{ fontSize: '1.125rem' }}>
            {t('label.rate')}:
            <span
              style={{
                display: 'flex',
                fontSize: '2.25rem',
                fontWeight: 'bold',
                color: rateStatus.color,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              {rate}{t('label.bpm')}
            </span>
          </h2>
        </div>

        <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          <p style={{ color: '#4b5563' }}>
            • {t('label.total')}: <strong>{decoded?.c}</strong>
          </p>
          <p style={{ color: '#4b5563' }}>
            • {t('label.measured_over')}: <strong>{decoded?.d} {t('label.seconds')}</strong>
          </p>
          {!decoded?.t ? null : (
            <p style={{ color: '#4b5563' }}>
              • {t('label.measured_at')}: <strong>{format(unixTime, 'dd MMM yyyy, H:mm', { timeZone })}</strong>
            </p>
          )}
        </div>
      </div>

      <div id="children">
        {children}
      </div>
    </div>
  );
}
