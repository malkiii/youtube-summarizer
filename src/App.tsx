import { Routes, Route } from 'react-router-dom';

import Home from './pages/home';
import Other from './pages/other';
import NotFound from './pages/not-found';

import RootLayout from './pages/layout';

export default function App() {
  return (
    <Routes>
      <Route element={<RootLayout />}>
        <Route index element={<Home />} />
        <Route path="/other" element={<Other />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
