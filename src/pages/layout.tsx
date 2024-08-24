import { Outlet, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Logo } from '@/components/logo';

import { Button } from '@/components/ui/button';
import { useTheme } from '@/components/theme-provider';
import { LanguageSelector } from './language-selector';
import { Moon, Sun } from 'lucide-react';

export default function RootLayout() {
  const location = useLocation();
  const isHome = location.pathname.length === 3;

  return (
    <div
      style={
        isHome
          ? { background: 'linear-gradient(0deg, hsl(var(--foreground) / 0.02), hsl(var(--card)))' }
          : undefined
      }
      className={`grid-collapse grid min-h-dvh grid-rows-[min-content_auto_min-content] px-2 *:mx-auto *:w-full ${isHome ? '*:max-w-6xl' : '*:max-w-2xl'}`}
    >
      <Header />
      <main className="relative">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

function Header() {
  return (
    <header className="relative flex items-center justify-between p-4 after:absolute after:left-1/2 after:top-full after:h-px after:w-screen after:-translate-x-1/2 after:bg-border print:hidden">
      <Logo className="h-12 w-auto" />
      <div className="flex items-center gap-4">
        <LanguageSelector />
        <ThemeToggle />
      </div>
      <Corner top="100%" left="0" />
      <Corner top="100%" left="100%" />
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
    <footer
      dir="ltr"
      className="relative p-4 text-center text-sm after:absolute after:bottom-full after:left-1/2 after:h-px after:w-screen after:-translate-x-1/2 after:bg-border print:hidden"
    >
      <p suppressHydrationWarning>
        Built by{' '}
        <a href="https://malki.me" target="_blank" className="underline underline-offset-4">
          Malki Abderrahmane
        </a>
        .<br className="sm:hidden" /> The source code is available on{' '}
        <a
          href="https://github.com/malkiii/youtube-summerizer"
          target="_blank"
          className="underline underline-offset-4"
        >
          GitHub
        </a>
        .
      </p>
      <Corner top="0" left="0" />
      <Corner top="0" left="100%" />
    </footer>
  );
}

function Corner(style: React.CSSProperties) {
  return (
    <span
      style={style}
      className="absolute z-50 block aspect-square w-3 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-current"
    ></span>
  );
}
