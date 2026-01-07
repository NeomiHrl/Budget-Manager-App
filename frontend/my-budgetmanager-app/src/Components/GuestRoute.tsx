import { useUser } from '../Contexts/UserContext';
import { Navigate } from 'react-router-dom';

const GuestRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated,loading } = useUser();
  if (loading) return null;
  return isAuthenticated ? <Navigate to="/" replace /> : children;
};

export default GuestRoute;
