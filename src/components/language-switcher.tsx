"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/routing";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

export function LanguageSwitcher() {
    const locale = useLocale();
    const router = useRouter();
    const pathname = usePathname();

    const handleChange = (value: string) => {
        router.replace(pathname, { locale: value });
    };

    return (
        <Select value={locale} onValueChange={handleChange}>
            <SelectTrigger className="w-[70px] h-8 border-none bg-transparent focus:ring-0 focus:ring-offset-0">
                <SelectValue placeholder="Lang" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="en">EN</SelectItem>
                <SelectItem value="fr">FR</SelectItem>
            </SelectContent>
        </Select>
    );
}
