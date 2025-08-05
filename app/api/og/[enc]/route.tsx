import { format } from 'date-fns-tz';
import { getTranslations } from 'next-intl/server';
import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server';
import { decodeState, getRateCategory, isValidTimezone } from '~/utils/helper';

export async function GET(request: NextRequest, { params }: { params: Promise<{ enc: string }> }) {
  const { enc } = await params;
  const [err, state] = decodeState(enc);

  if (err || state === null) {
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }

  const t = await getTranslations({ locale: state.lc, namespace: 'Main' });
  const [error, result] = decodeState(enc);

  const rate = Math.round((parseInt(result?.c || '0') / parseInt(result?.d || '0')) * 60);
  const rateStatus = getRateCategory(rate);
  const unixTime = !result?.t ? 0 : parseInt(result.t);
  const timeZoned = new Date(unixTime).toLocaleString('en-US', { timeZone: state.tz })


  if (error) {
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }

  try {
    return new ImageResponse(
      (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem',
            width: '100%',
            height: '100%',
            backgroundColor: 'black',
          }}
        >
          <div
            style={{
              padding: '1.5rem',
              backgroundColor: 'white',
              borderRadius: '1rem',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.5rem',
              width: '80%',
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
              <div style={{ fontSize: '1.5rem', fontWeight: '900', color: '#111827' }}>{t('label.result')}</div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div
                style={{
                  padding: '1rem',
                  borderRadius: '0.5rem',
                  backgroundColor: '#eff6ff',
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', fontSize: '1.125rem' }}>
                  {t('label.rate')}:
                  <div
                    style={{
                      display: 'flex',
                      fontSize: '2.25rem',
                      fontWeight: 'bolder',
                      color: rateStatus.color,
                    }}
                  >
                    {rate}{t('label.bpm')}
                  </div>
                </div>
              </div>

              <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                <div style={{ color: '#4b5563', display: 'flex', flexDirection: 'row' }}>
                  • {t('label.total')}:&nbsp; <div style={{ display: 'flex', flexDirection: 'column', fontWeight: 'bold' }}>{result?.c}</div>
                </div>
                <div style={{ color: '#4b5563', display: 'flex', flexDirection: 'row' }}>
                  • {t('label.measured_over')}:&nbsp; <div style={{ display: 'flex', flexDirection: 'column', fontWeight: 'bold' }}>{result?.d} {t('label.seconds')}</div>
                </div>
                <div style={{ color: '#4b5563', display: 'flex', flexDirection: 'row' }}>
                  • {t('label.measured_at')}:&nbsp; <div style={{ display: 'flex', flexDirection: 'column', fontWeight: 'bold' }}>{format(timeZoned, 'dd MMM yyyy, HH:mm', { timeZone: state.tz })}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
      {
        width: 600,
        height: 315,
      }
    )

  } catch (e) {
    console.error(e);

    return new Response(`Failed to generate the image`, {
      status: 500,
    })
  }
}
