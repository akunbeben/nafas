import { useState } from 'react';

export const useTimer = () => {
    const [timerState, setTimerState] = useState({
        isActive: false,
        startTime: null as number | null
    });

    const start = () => {
        setTimerState({
            isActive: true,
            startTime: Date.now()
        });
    };

    const stop = () => {
        setTimerState({
            isActive: false,
            startTime: null
        });
    };

    return {
        isActive: timerState.isActive,
        startTime: timerState.startTime,
        start,
        stop
    };
}; 