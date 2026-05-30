import { AppBar, Box, Button, Container, Toolbar, Typography } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { logoutUser } from '../services/authService';

function Navbar() {
  const { currentUser, isAdmin } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logoutUser();
    navigate('/');
  }

  return (
    <AppBar position="static" color="primary">
      <Container maxWidth="lg">
        <Toolbar disableGutters className="navbar-toolbar">
          <Typography
            component={Link}
            to={currentUser ? '/inicio' : '/'}
            variant="h6"
            className="navbar-brand"
          >
            UDLA Reporta
          </Typography>

          <Box className="navbar-links">
            {currentUser ? (
              <>
                <Button color="inherit" component={Link} to="/inicio">Inicio</Button>
                <Button color="inherit" component={Link} to="/nuevo-reporte">Reportar</Button>
                <Button color="inherit" component={Link} to="/mis-reportes">Mis reportes</Button>
                {isAdmin && (
                  <>
                    <Button color="inherit" component={Link} to="/admin">Admin</Button>
                    <Button color="inherit" component={Link} to="/estadisticas">Estadísticas</Button>
                  </>
                )}
                <Button color="inherit" onClick={handleLogout}>Salir</Button>
              </>
            ) : (
              <>
                <Button color="inherit" component={Link} to="/">Ingresar</Button>
                <Button color="inherit" component={Link} to="/registro">Registro</Button>
              </>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Navbar;
