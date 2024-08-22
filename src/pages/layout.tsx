import { Outlet, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Logo } from '@/components/logo';

import { Button } from '@/components/ui/button';
import { useTheme } from '@/components/theme-provider';
import { Moon, Sun } from 'lucide-react';
import { BackgroundBeams } from '@/components/background-beams';
import { ScrollToTopButton } from '@/components/scroll-to-top-button';
import { LanguageSelector } from './language-selector';

export default function RootLayout() {
  const location = useLocation();
  const isHome = location.pathname.length === 3;

  return (
    <>
      {isHome && <BackgroundBeams />}
      <div
        className={`flex min-h-dvh flex-col px-4 *:mx-auto *:w-full ${isHome ? '*:max-w-6xl' : '*:max-w-2xl'}`}
      >
        <Header />
        <main className="relative flex-grow">
          <Outlet />
        </main>
        <Footer />
      </div>
      <ScrollToTopButton />
    </>
  );
}

function Header() {
  return (
    <header className="flex items-center justify-between py-4 print:hidden">
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
    <footer className="text-balance py-4 text-center text-sm print:hidden">
      <p suppressHydrationWarning>
        &copy; {new Date().getFullYear()}{' '}
        <a href="https://malki.me" target="_blank" className="underline underline-offset-4">
          Malki Abderrahmane
        </a>
        , All rights reserved.
      </p>
    </footer>
  );
}
