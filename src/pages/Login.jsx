import { useState } from 'react';
import { Alert, Box, Button, Container, Paper, TextField, Typography } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '../services/authService';

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      await loginUser(email, password);
      navigate('/inicio');
    } catch (err) {
      setError('No fue posible iniciar sesión. Revisa el correo y la contraseña.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      background: 'linear-gradient(135deg, #1B5E20 0%, #4CAF50 100%)',
      py: 4 
    }}>
      <Container maxWidth="sm">
        <Paper elevation={3} sx={{ 
          borderRadius: 3, 
          overflow: 'hidden',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
        }}>
          <Box sx={{
            background: 'linear-gradient(135deg, #1B5E20 0%, #4CAF50 100%)',
            color: 'white',
            p: 3,
            textAlign: 'center'
          }}>
            <Typography variant="h4" component="h1" sx={{ fontWeight: 700, mb: 1 }}>
              UDLA Reporta
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              Sistema de reporte de incidentes
            </Typography>
          </Box>

          <Box sx={{ p: 4 }}>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, color: '#333' }}>
              Inicia sesión en tu cuenta
            </Typography>

            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            <Box component="form" onSubmit={handleSubmit}>
              <TextField
                label="Correo electrónico"
                type="email"
                fullWidth
                required
                margin="normal"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                variant="outlined"
                sx={{ mb: 2 }}
              />

              <TextField
                label="Contraseña"
                type="password"
                fullWidth
                required
                margin="normal"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                variant="outlined"
                sx={{ mb: 3 }}
              />

              <Button 
                type="submit" 
                variant="contained" 
                fullWidth 
                disabled={loading}
                sx={{ 
                  py: 1.5,
                  background: 'linear-gradient(135deg, #1B5E20 0%, #4CAF50 100%)',
                  fontWeight: 600,
                  fontSize: '1rem',
                  mb: 2
                }}
              >
                {loading ? 'Ingresando...' : 'Ingresar'}
              </Button>
            </Box>

            <Box sx={{ textAlign: 'center', pt: 2, borderTop: '1px solid #eee' }}>
              <Typography variant="body2" sx={{ color: '#666' }}>
                ¿No tienes cuenta?{' '}
                <Link to="/registro" style={{ color: '#667eea', fontWeight: 600, textDecoration: 'none' }}>
                  Regístrate aquí
                </Link>
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}

export default Login;
