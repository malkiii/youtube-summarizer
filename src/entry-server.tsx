import ReactDOMServer from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';

import { TRPCProvider } from './trpc';
import App from './app';

type RenderProps = { path: string };

export function render(props: RenderProps) {
  const html = ReactDOMServer.renderToString(
    <TRPCProvider>
      <StaticRouter location={props.path}>
        <App />
      </StaticRouter>
    </TRPCProvider>,
  );

  return { html };
}
