import { Activity } from "lucide-react";
import { PropsWithChildren } from "react";
import { decodeState, getRateCategory } from "~/utils/helper";
import { format } from 'date-fns';
import { redirect } from "next/navigation";

type Props = {
  state: string;
}

export function ResultCard({ children, state }: PropsWithChildren<Props>) {
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
        <h1 className="text-2xl font-bold text-gray-900">Results</h1>
      </div>

      <div className="space-y-4">
        <div className="p-4 rounded-lg bg-blue-50">
          <h2 className="text-lg text-center">
            Respiratory Rate:
            <span className={`block text-4xl font-bold ${rateStatus.color}`}>
              {rate} breaths/min
            </span>
          </h2>
        </div>

        <div className="space-y-2">
          <p className="text-gray-600">
            • Measured over: {decoded?.d} seconds
          </p>
          <p className="text-gray-600">
            • Total breaths counted: {decoded?.c}
          </p>
          {!decoded?.t ? null : (
            <p className="text-gray-600">
              • Measured at: {format(unixTime, 'dd MMM yyyy, H:m')}
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
