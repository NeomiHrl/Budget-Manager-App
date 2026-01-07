import { useUser } from '../Contexts/UserContext';
import { Navigate } from 'react-router-dom';

const Spinner = () => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
    <div style={{
      border: '6px solid #f3f3f3',
      borderTop: '6px solid #7b2ff7',
      borderRadius: '50%',
      width: '48px',
      height: '48px',
      animation: 'spin 1s linear infinite'
    }} />
    <style>{`
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `}</style>
  </div>
);


const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, loading, user } = useUser();
  if (loading) return <Spinner />;
  return (isAuthenticated && user) ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;