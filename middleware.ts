import { NextResponse } from 'next/server';

export function middleware(request: Request) {
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-url', request.headers.get('host') ?? '');

    return NextResponse.next({
        request: {
            headers: requestHeaders,
        }
    });
}