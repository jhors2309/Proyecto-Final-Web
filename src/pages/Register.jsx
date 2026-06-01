import { useState } from 'react';
import { Alert, Box, Button, Container, Paper, TextField, Typography } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../services/authService';

function Register() {
  const navigate = useNavigate();
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('La contraseña debe tener mínimo 6 caracteres.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    setLoading(true);

    try {
      await registerUser({ nombre, email, password });
      navigate('/inicio');
    } catch (err) {
      setError('No fue posible registrar el usuario. Puede que el correo ya esté registrado.');
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
              Crear nueva cuenta
            </Typography>
          </Box>

          <Box sx={{ p: 4 }}>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, color: '#333' }}>
              Regístrate para continuar
            </Typography>

            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            <Box component="form" onSubmit={handleSubmit}>
              <TextField
                label="Nombre completo"
                fullWidth
                required
                margin="normal"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                variant="outlined"
                sx={{ mb: 2 }}
              />

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
                sx={{ mb: 2 }}
              />

              <TextField
                label="Confirmar contraseña"
                type="password"
                fullWidth
                required
                margin="normal"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
                {loading ? 'Registrando...' : 'Crear Cuenta'}
              </Button>
            </Box>

            <Box sx={{ textAlign: 'center', pt: 2, borderTop: '1px solid #eee' }}>
              <Typography variant="body2" sx={{ color: '#666' }}>
                ¿Ya tienes cuenta?{' '}
                <Link to="/" style={{ color: '#667eea', fontWeight: 600, textDecoration: 'none' }}>
                  Inicia sesión aquí
                </Link>
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}

export default Register;
