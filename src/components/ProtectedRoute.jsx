import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Loading from './Loading';

function ProtectedRoute({ children }) {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return <Loading text="Verificando sesión..." />;
  }

  if (!currentUser) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;
