import { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'dark' | 'light';

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

type ThemeProviderState = {
  theme: Theme;
  toggle: () => void;
};

const ThemeProviderContext = createContext<ThemeProviderState>({ theme: 'dark' } as any);

export function ThemeProvider({
  children,
  defaultTheme = 'dark',
  storageKey = 'theme',
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem(storageKey) as Theme) || defaultTheme,
  );

  const toggle = () => {
    const isDark = document.documentElement.classList.contains('dark');
    setTheme(isDark ? 'light' : 'dark');
  };

  useEffect(() => {
    const root = window.document.documentElement;

    disableTransition();
    root.classList.remove('light', 'dark');
    root.classList.add(theme);

    localStorage.setItem(storageKey, theme);
  }, [theme]);

  return (
    <ThemeProviderContext.Provider {...props} value={{ theme, toggle }}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined) throw new Error('useTheme must be used within a ThemeProvider');

  return context;
};

function disableTransition() {
  const css = document.createElement('style');

  css.appendChild(
    document.createTextNode(
      `*,*::before,*::after{-webkit-transition:none!important;-moz-transition:none!important;-o-transition:none!important;-ms-transition:none!important;transition:none!important}`,
    ),
  );

  document.head.appendChild(css);
  setTimeout(() => document.head.removeChild(css), 1);
}
