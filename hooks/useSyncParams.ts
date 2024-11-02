import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export type QueryParams<T> = { [K in keyof T]?: string };

export const useSyncQueryParams = <T extends Record<string, string>>(initialState: QueryParams<T> = {}): [QueryParams<T>, (newState: QueryParams<T>) => void] => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const [state, setState] = useState<QueryParams<T>>(() => {
        const params = Object.fromEntries(searchParams.entries()) as QueryParams<T>;
        return { ...initialState, ...params };
    });

    const handleStateChange = (newState: QueryParams<T>) => {
        const mergedState = { ...state, ...newState };
        setState(mergedState);
    };

    useEffect(() => {
        const filteredParams = Object.entries(state)
            .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {} as QueryParams<T>);

        const newSearchParams = new URLSearchParams(filteredParams as Record<string, string>);
        router.push(`${pathname}?${newSearchParams.toString()}`, { scroll: false });
    }, [state, pathname, router]);

    return [state, handleStateChange];
};