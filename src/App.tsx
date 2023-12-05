import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { SignIn } from './pages/SignIn.tsx';
import { Dashboard } from './pages/Dashboard.tsx';
import { AuthLayout } from './components/AuthLayout';

import { PocketbaseProvider } from './contexts/PocketbaseContext';

const App = () => {
  return (
    <PocketbaseProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/sign-in" element={<SignIn />} />
          <Route element={<AuthLayout />}>
            <Route path="/" element={<Dashboard />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </PocketbaseProvider>
  );
};

export default App;
