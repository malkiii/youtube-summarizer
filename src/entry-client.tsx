import './styles/index.css';

import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@/components/theme-provider';
import ReactDOM from 'react-dom/client';
import Router from './router';

import './lib/i18n';

ReactDOM.hydrateRoot(
  document.getElementById('root') as HTMLElement,
  <ThemeProvider defaultTheme="dark">
    <BrowserRouter>
      <Router />
    </BrowserRouter>
  </ThemeProvider>,
);
