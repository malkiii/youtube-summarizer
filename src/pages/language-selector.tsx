import { LanguagesIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { languages } from '@/lib/i18n/languages';
import { setCookie } from '@/lib/utils';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export function LanguageSelector() {
  const { i18n } = useTranslation();
  const navigate = useNavigate();

  return (
    <Select
      value={languages.find(lang => i18n.language.startsWith(lang.code))?.code}
      onValueChange={lang => {
        i18n.changeLanguage(lang);
        document.documentElement.dir = i18n.dir(lang);
        setCookie('locale', lang, 365);

        const rest = window.location.pathname.slice(3);

        navigate(`/${lang}${rest}`, { replace: true });
      }}
    >
      <SelectTrigger className="w-[152px]">
        <div className="flex items-center gap-2">
          <LanguagesIcon className="size-5" />
          <SelectValue placeholder="Language" />
        </div>
      </SelectTrigger>
      <SelectContent className="rounded-2xl">
        {languages.map(language => (
          <SelectItem key={language.code} value={language.code} className="py-2">
            {language.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
