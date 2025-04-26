import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.user);
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return children;
};