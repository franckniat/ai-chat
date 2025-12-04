import { getRequestConfig } from 'next-intl/server';
import { cookies } from 'next/headers';
import { LOCALE_COOKIE_NAME, DEFAULT_LOCALE, SUPPORTED_LOCALES, type Locale } from '@/lib/locale-utils';

export default getRequestConfig(async () => {
    // Get locale from cookie
    const cookieStore = await cookies();
    const localeCookie = cookieStore.get(LOCALE_COOKIE_NAME);

    let locale: Locale = DEFAULT_LOCALE;

    if (localeCookie?.value && SUPPORTED_LOCALES.includes(localeCookie.value as Locale)) {
        locale = localeCookie.value as Locale;
    }

    return {
        locale,
        messages: (await import(`../../messages/${locale}.json`)).default
    };
});
