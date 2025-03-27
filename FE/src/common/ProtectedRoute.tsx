import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated } from '@/stores/auth/authSelectors';

const ProtectedRoute = () => {
  const isAuthenticated = useSelector(selectIsAuthenticated);

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/intro"
        replace
      />
    );
  }

  return <Outlet />;
};

export default ProtectedRoute;
