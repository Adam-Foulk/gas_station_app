import { Navigate, Outlet, useLocation } from 'react-router-dom';

import { usePocketbase } from '../contexts/PocketbaseContext';

export const RequireAuth = () => {
  const { user } = usePocketbase();
  const location = useLocation();

  if (!user) {
    return <Navigate to={{ pathname: '/sign-in' }} state={{ location }} replace />;
  }

  return <Outlet />;
};
