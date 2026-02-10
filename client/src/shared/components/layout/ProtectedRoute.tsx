import { Navigate, Outlet } from 'react-router-dom';
import { useAppSelector } from '../../../app/store/hooks';

export const ProtectedRoute = () => {
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};