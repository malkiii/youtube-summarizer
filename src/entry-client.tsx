import './index.css';

import { TRPCProvider } from './trpc';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './app';

ReactDOM.hydrateRoot(
  document.getElementById('root') as HTMLElement,
  <TRPCProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </TRPCProvider>,
);
