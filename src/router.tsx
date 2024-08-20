import { Routes, Route } from 'react-router-dom';

import Home from './pages/home';
import Summary from './pages/summary';
import NotFound from './pages/not-found';

import RootLayout from './pages/layout';

export default function Router() {
  return (
    <Routes>
      <Route path="/:lang" element={<RootLayout />}>
        <Route index element={<Home />} />
        <Route key="summary" path=":id" element={<Summary />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
