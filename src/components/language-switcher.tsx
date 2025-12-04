'use client';

import { useLocale } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Languages } from 'lucide-react';
import { changeLocale, type Locale } from '@/lib/locale-utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const languages = {
  en: 'English',
  fr: 'Français',
} as const;

export function LanguageSwitcher() {
  const currentLocale = useLocale() as Locale;

  const handleLanguageChange = (locale: Locale) => {
    if (locale !== currentLocale) {
      changeLocale(locale);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <Languages className="size-5" />
          <span className="sr-only">Change language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {Object.entries(languages).map(([locale, label]) => (
          <DropdownMenuItem
            key={locale}
            onClick={() => handleLanguageChange(locale as Locale)}
            className={currentLocale === locale ? 'bg-accent' : ''}
          >
            {label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
