import './styles/index.css';

import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@/components/theme-provider';
import ReactDOM from 'react-dom/client';
import App from './app';

import './lib/i18n';

ReactDOM.hydrateRoot(
  document.getElementById('root') as HTMLElement,
  <ThemeProvider defaultTheme="dark">
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </ThemeProvider>,
);
