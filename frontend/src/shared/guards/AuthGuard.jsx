import { Navigate } from 'react-router-dom';
import { getToken } from '../utils/tokenUtils';

const AuthGuard = ({ children }) => {
  const token = getToken();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default AuthGuard;
