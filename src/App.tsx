import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { SignIn } from './pages/SignIn.tsx';
import { Dashboard } from './pages/Dashboard.tsx';
import { AuthLayout } from './components/AuthLayout';

import { PocketbaseProvider } from './contexts/PocketbaseContext';
import { MantineProvider } from '@mantine/core';
import { ModalsProvider } from '@mantine/modals';
import { Notifications } from '@mantine/notifications';
import '@mantine/notifications/styles.css';

const App = () => {
  return (
    <PocketbaseProvider>
      <MantineProvider>
        <Notifications />
        <ModalsProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/sign-in" element={<SignIn />} />
              <Route element={<AuthLayout />}>
                <Route path="/" element={<Dashboard />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </ModalsProvider>
      </MantineProvider>
    </PocketbaseProvider>
  );
};

export default App;
