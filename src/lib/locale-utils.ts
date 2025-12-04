export const LOCALE_COOKIE_NAME = 'NEXT_LOCALE';
export const LOCALE_STORAGE_KEY = 'preferred-locale';
export const DEFAULT_LOCALE = 'fr';
export const SUPPORTED_LOCALES = ['en', 'fr'] as const;

export type Locale = (typeof SUPPORTED_LOCALES)[number];

/**
 * Get locale from localStorage (client-side only)
 */
export function getLocaleFromStorage(): Locale | null {
    if (typeof window === 'undefined') return null;

    const stored = localStorage.getItem(LOCALE_STORAGE_KEY);
    if (stored && SUPPORTED_LOCALES.includes(stored as Locale)) {
        return stored as Locale;
    }
    return null;
}

/**
 * Set locale in localStorage (client-side only)
 */
export function setLocaleInStorage(locale: Locale): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(LOCALE_STORAGE_KEY, locale);
}

/**
 * Get locale from cookie (works on both client and server)
 */
export function getLocaleFromCookie(cookieString?: string): Locale | null {
    const cookies = cookieString || (typeof document !== 'undefined' ? document.cookie : '');
    const match = cookies.match(new RegExp(`(^| )${LOCALE_COOKIE_NAME}=([^;]+)`));
    const locale = match ? match[2] : null;

    if (locale && SUPPORTED_LOCALES.includes(locale as Locale)) {
        return locale as Locale;
    }
    return null;
}

/**
 * Set locale cookie (client-side only)
 */
export function setLocaleCookie(locale: Locale): void {
    if (typeof document === 'undefined') return;

    // Set cookie for 1 year
    const maxAge = 365 * 24 * 60 * 60;
    document.cookie = `${LOCALE_COOKIE_NAME}=${locale}; path=/; max-age=${maxAge}; SameSite=Lax`;
}

/**
 * Get the current locale with fallback priority:
 * 1. localStorage (client-side)
 * 2. Cookie
 * 3. Default locale
 */
export function getCurrentLocale(): Locale {
    return getLocaleFromStorage() || getLocaleFromCookie() || DEFAULT_LOCALE;
}

/**
 * Set locale in both localStorage and cookie, then reload page
 */
export function changeLocale(locale: Locale): void {
    setLocaleInStorage(locale);
    setLocaleCookie(locale);

    // Reload to apply new locale
    if (typeof window !== 'undefined') {
        window.location.reload();
    }
}
