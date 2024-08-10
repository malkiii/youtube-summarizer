import ReactDOMServer from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import { Router } from './router';
// import App from './App'

type RenderProps = { path: string };

export function render(props: RenderProps) {
  const html = ReactDOMServer.renderToString(
    <StaticRouter location={props.path}>
      <Router />
    </StaticRouter>,
  );

  return { html };
}
