import { Activity } from "lucide-react";
import { PropsWithChildren } from "react";
import { decodeState, getRateCategory } from "~/utils/helper";

type Props = {
    state: string;
}

export function ResultCard({ children, state }: PropsWithChildren<Props>) {
    const decoded = decodeState(decodeURIComponent(state));
    const rate = Math.round((parseInt(decoded?.c || '0') / parseInt(decoded?.d || '0')) * 60);
    const rateStatus = getRateCategory(rate);

    return (
        <div className="p-6 space-y-6 bg-white shadow rounded-2xl" id="result-card">
            <div className="flex items-center justify-center space-x-2">
                <Activity className="w-8 h-8 text-blue-600" />
                <h1 className="text-2xl font-bold text-gray-900">Results</h1>
            </div>

            <div className="space-y-4">
                <div className="p-4 rounded-lg bg-blue-50">
                    <p className="text-lg text-center">
                        Respiratory Rate:
                        <span className={`block text-4xl font-bold ${rateStatus.color}`}>
                            {rate} breaths/min
                        </span>
                        <span className={`text-sm font-medium ${rateStatus.color}`}>
                            {rateStatus.category}
                        </span>
                    </p>
                </div>

                <div className="space-y-2">
                    <p className="text-gray-600">
                        • Measured over: {decoded?.d} seconds
                    </p>
                    <p className="text-gray-600">
                        • Total breaths counted: {decoded?.c}
                    </p>
                </div>
            </div>

            {children}
        </div>
    )
}