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
    <AppBar 
      position="static" 
      sx={{
        background: 'linear-gradient(135deg, var(--green-1) 0%, var(--green-2) 60%, var(--green-3) 100%)',
        boxShadow: '0 4px 20px rgba(27, 94, 32, 0.25)'
      }}
      className="navbar-gradient"
    >
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ display: 'flex', justifyContent: 'space-between', py: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 , background: 'rgb(255, 255, 255)', px: 2, py: 1, borderRadius: 1 }}>
            <img 
              src="/udla-logo.svg" 
              alt="Logo Universidad de la Amazonia"
              style={{ width: '48px', height: '48px', objectFit: 'contain' }}
              onError={(e) => { e.target.style.display = 'none'; }}
            />
            <Typography
              component={Link}
              to={currentUser ? '/inicio' : '/'}
              variant="h6"
              sx={{
                color: 'green',
                fontWeight: 700,
                textDecoration: 'none',
                fontSize: '1.3rem',
                letterSpacing: '0.5px'
              }}
            >
              UDLA Reporta
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
            {currentUser ? (
              <>
                <Button 
                  color="inherit" 
                  component={Link} 
                  to="/inicio"
                  sx={{ 
                    fontWeight: 500,
                    '&:hover': { background: 'rgba(255,255,255,0.1)', borderRadius: 1 }
                  }}
                >
                  Inicio
                </Button>
                <Button 
                  color="inherit" 
                  component={Link} 
                  to="/nuevo-reporte"
                  sx={{ 
                    fontWeight: 500,
                    '&:hover': { background: 'rgba(255,255,255,0.1)', borderRadius: 1 }
                  }}
                >
                  Reportar
                </Button>
                <Button 
                  color="inherit" 
                  component={Link} 
                  to="/mis-reportes"
                  sx={{ 
                    fontWeight: 500,
                    '&:hover': { background: 'rgba(255,255,255,0.1)', borderRadius: 1 }
                  }}
                >
                  Mis Reportes
                </Button>
                {isAdmin && (
                  <>
                    <Button 
                      color="inherit" 
                      component={Link} 
                      to="/admin"
                      sx={{ 
                        fontWeight: 500,
                        '&:hover': { background: 'rgba(255,255,255,0.1)', borderRadius: 1 }
                      }}
                    >
                      Admin
                    </Button>
                    <Button 
                      color="inherit" 
                      component={Link} 
                      to="/estadisticas"
                      sx={{ 
                        fontWeight: 500,
                        '&:hover': { background: 'rgba(255,255,255,0.1)', borderRadius: 1 }
                      }}
                    >
                      Estadísticas
                    </Button>
                  </>
                )}
                <Button 
                  color="inherit" 
                  onClick={handleLogout}
                  sx={{ 
                    fontWeight: 600,
                    ml: 1,
                    px: 2,
                    borderRadius: 1,
                    '&:hover': { background: 'rgba(255,255,255,0.2)' }
                  }}
                >
                  Salir
                </Button>
              </>
            ) : (
              <>
                <Button 
                  color="inherit" 
                  component={Link} 
                  to="/"
                  sx={{ 
                    fontWeight: 500,
                    '&:hover': { background: 'rgba(255,255,255,0.1)', borderRadius: 1 }
                  }}
                >
                  Ingresar
                </Button>
                <Button 
                  color="inherit" 
                  component={Link} 
                  to="/registro"
                  sx={{ 
                    fontWeight: 600,
                    px: 2,
                    borderRadius: 1,
                    background: 'rgba(255,255,255,0.2)',
                    '&:hover': { background: 'rgba(255,255,255,0.3)' }
                  }}
                >
                  Registro
                </Button>
              </>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Navbar;
