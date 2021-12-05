import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/auth-hook';
import { LOGIN_PATH } from './paths';

function RequireAuth({ children }) {
  const { isLoggedIn } = useAuth();
  const location = useLocation();

  if (!isLoggedIn) {
    return <Navigate to={LOGIN_PATH()} replace state={{ from: location }} />;
  }

  return children;
}

export default RequireAuth;
