'use client';

import { useEffect } from 'react';
import { getLocaleFromStorage, setLocaleCookie, getLocaleFromCookie } from '@/lib/locale-utils';

/**
 * Client-side component that syncs locale between localStorage and cookies
 * This ensures the server can access the locale preference via cookies
 */
export function LocaleProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // On mount, sync localStorage to cookie if needed
    const storageLocale = getLocaleFromStorage();
    const cookieLocale = getLocaleFromCookie();
    
    if (storageLocale && storageLocale !== cookieLocale) {
      // localStorage has a preference that differs from cookie, update cookie
      setLocaleCookie(storageLocale);
    }
  }, []);

  return <>{children}</>;
}
