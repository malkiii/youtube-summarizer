import ReactDOMServer from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';

import App from './app';

type RenderProps = { path: string };

export function render(props: RenderProps) {
  const html = ReactDOMServer.renderToString(
    <StaticRouter location={props.path}>
      <App />
    </StaticRouter>,
  );

  return { html };
}
