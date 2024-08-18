import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { LinkIcon, CircleAlertIcon } from 'lucide-react';

export default function Page() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const inputRef = React.useRef<HTMLInputElement>(null);
  const [error, setError] = React.useState<string>('');

  const handleClick = React.useCallback(() => {
    try {
      const value = inputRef.current?.value.trim();
      if (!value) throw new Error();

      const id = extractYouTubeId(value);
      if (!id) throw new Error();

      navigate(`/${i18n.language}/${id}`);
    } catch {
      setError('Please enter a valid YouTube video link!');
    }
  }, [i18n.language]);

  return (
    <div className="pt-8 md:pt-20">
      <div id="hero" className="mb-10 text-center">
        <h1 className="text-pretty text-5xl max-md:text-3xl">{t('home.title')}</h1>
        <p className="mx-auto mt-4 max-w-3xl text-balance text-lg text-muted-foreground max-md:text-base">
          {t('home.description')}
        </p>
      </div>
      <div className="relative mx-auto flex max-w-3xl items-start gap-4 max-sm:flex-col">
        <div className="w-full flex-grow">
          <Input
            type="text"
            ref={inputRef}
            placeholder={t('home.input')}
            className="ltr:pl-10 rtl:pr-10"
          />
          <LinkIcon className="absolute top-2.5 size-5 text-muted-foreground ltr:left-3 rtl:right-3" />
          {error && (
            <div className="mt-2 flex items-center justify-center gap-2 pl-2 text-red-600">
              <CircleAlertIcon className="size-4" />
              <p role="alert">{error}</p>
            </div>
          )}
        </div>
        <Button onClick={handleClick} className="block max-sm:w-full">
          {t('home.button')}
        </Button>
      </div>
    </div>
  );
}

function extractYouTubeId(link: string) {
  const url = new URL(link);
  const hostname = url.hostname.replace('www.', '');

  if (hostname === 'youtu.be') {
    return url.pathname.split('/')[1];
  }

  if (hostname === 'youtube.com') {
    return url.searchParams.get('v') ?? url.pathname.split('/')[2];
  }
}
