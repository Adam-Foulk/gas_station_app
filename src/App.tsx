import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { SignIn } from './pages/SignIn.tsx';
import { Dashboard } from './pages/Dashboard.tsx';
import { RequireAuth } from './components/RequireAuth';

import { PocketbaseProvider } from './contexts/PocketbaseContext';

const App = () => {
  return (
    <PocketbaseProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/sign-in" element={<SignIn />} />
          <Route element={<RequireAuth />}>
            <Route path="/" element={<Dashboard />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </PocketbaseProvider>
  );
};

export default App;
