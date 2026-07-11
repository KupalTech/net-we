import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const PrivateRoute = ({ children }) => {
  const { currentUser, emailVerified } = useAuth();

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  if (!emailVerified) {
    return <Navigate to="/verificar-email" />;
  }

  return children;
};

export default PrivateRoute;
