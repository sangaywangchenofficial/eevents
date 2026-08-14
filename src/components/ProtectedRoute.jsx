import { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { isAuthenticated } from '../utils/auth';
import { toast } from 'react-toastify';

const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const authenticated = isAuthenticated();

  useEffect(() => {
    if (!authenticated) {
      toast.error('Please login to access this page');
    }
  }, [authenticated]);

  if (!authenticated) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location.pathname + location.search }}
      />
    );
  }

  return children;
};

export default ProtectedRoute;
