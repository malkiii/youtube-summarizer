import './styles/index.css';

import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@/components/theme-provider';
import ReactDOM from 'react-dom/client';

import App from './app';

ReactDOM.hydrateRoot(
  document.getElementById('root') as HTMLElement,
  <ThemeProvider defaultTheme="system">
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </ThemeProvider>,
);
