import { NextRequest, NextResponse } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { LOCALE_COOKIE_NAME, DEFAULT_LOCALE, SUPPORTED_LOCALES } from './lib/locale-utils';

const intlMiddleware = createMiddleware({
    locales: SUPPORTED_LOCALES,
    defaultLocale: DEFAULT_LOCALE,
    localePrefix: 'never' // Never add locale prefix to URLs
});

export default function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Skip middleware for API routes, Next.js internals, and static files
    if (
        pathname.startsWith('/api/') ||
        pathname.startsWith('/_next/') ||
        pathname.startsWith('/auth/') ||
        pathname.startsWith('/chat') ||
        pathname.match(/\.(ico|png|jpg|jpeg|svg|gif|webp|woff|woff2|ttf|eot)$/)
    ) {
        return NextResponse.next();
    }

    // Apply next-intl middleware
    return intlMiddleware(request);
}

export const config = {
    matcher: ['/((?!api|_next|auth|chat).*)']
};
