import { Alert, Box, Button, Container } from '@mui/material';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Loading from './Loading';

function AdminRoute({ children }) {
  const { currentUser, loading, isAdmin } = useAuth();

  if (loading) {
    return <Loading text="Verificando permisos..." />;
  }

  if (!currentUser) {
    return <Navigate to="/" replace />;
  }

  if (!isAdmin) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="warning">No tienes permisos de administrador para entrar a esta sección.</Alert>
        <Box sx={{ mt: 2 }}>
          <Button component={Link} to="/inicio" variant="contained">
            Volver al inicio
          </Button>
        </Box>
      </Container>
    );
  }

  return children;
}

export default AdminRoute;
