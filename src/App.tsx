import { Routes, Route } from 'react-router-dom';

import Home from './pages/home';
import NotFound from './pages/not-found';

import RootLayout from './pages/layout';

export default function App() {
  return (
    <Routes>
      <Route element={<RootLayout />}>
        <Route index element={<Home />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
