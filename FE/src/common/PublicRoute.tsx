import { Outlet, useLocation } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated } from '@/stores/auth/authSelectors';

const PublicRoute = () => {
  const isAuthenticated = useSelector(selectIsAuthenticated);

  return isAuthenticated ? (
    // 메인으로 이동
    <Navigate
      to="/"
      replace
    />
  ) : (
    <Outlet />
  );
};

export default PublicRoute;
