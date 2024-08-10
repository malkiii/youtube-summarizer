import { Routes, Route } from 'react-router-dom';

import Home from './pages/home';
import Other from './pages/other';
import NotFound from './pages/not-found';

export const Router = () => {
  return (
    <Routes>
      <Route index element={<Home />} />
      <Route path="/other" element={<Other />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};
