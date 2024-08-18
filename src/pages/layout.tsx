import { Outlet, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Logo } from '@/components/logo';

import { Button } from '@/components/ui/button';
import { useTheme } from '@/components/theme-provider';
import { Moon, Sun } from 'lucide-react';
import { BackgroundBeams } from '@/components/background-beams';
import { LanguageSelector } from './language-selector';

export default function RootLayout() {
  const location = useLocation();

  return (
    <>
      {location.pathname.length === 3 && <BackgroundBeams />}
      <div className="flex min-h-dvh flex-col px-4 *:mx-auto *:w-full *:max-w-6xl">
        <Header />
        <main className="relative flex-grow">
          <Outlet />
        </main>
        <Footer />
      </div>
    </>
  );
}

function Header() {
  return (
    <header className="flex items-center justify-between py-4">
      <Logo className="h-12 w-auto" />
      <div className="flex items-center gap-4">
        <LanguageSelector />
        <ThemeToggle />
      </div>
    </header>
  );
}

export function ThemeToggle() {
  const { toggle } = useTheme();
  const { t } = useTranslation();

  return (
    <Button
      variant="outline"
      size="icon"
      aria-label={t('header.theme')}
      title={t('header.theme')}
      onClick={toggle}
    >
      <Sun className="hidden size-5 dark:flex" />
      <Moon className="flex size-5 dark:hidden" />
    </Button>
  );
}

function Footer() {
  return (
    <footer className="flex justify-between gap-10 text-balance py-4 text-sm *:w-fit">
      <div>&copy; {new Date().getFullYear()} Malki Abderrahmane</div>
      <div>
        Source code available on{' '}
        <a
          href="https://github.com/malkiii/youtube-summerizer"
          target="_blank"
          className="underline underline-offset-2"
        >
          GitHub
        </a>
      </div>
    </footer>
  );
}
