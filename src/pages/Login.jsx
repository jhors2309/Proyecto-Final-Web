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
    <Container maxWidth="sm" sx={{ mt: 6 }}>
      <Paper className="form-card">
        <Typography variant="h4" component="h1" align="center" gutterBottom>
          Iniciar sesión
        </Typography>
        <Typography align="center" color="text.secondary" sx={{ mb: 3 }}>
          Sistema de reporte de incidentes de la Universidad de la Amazonia
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
          />

          <TextField
            label="Contraseña"
            type="password"
            fullWidth
            required
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }} disabled={loading}>
            {loading ? 'Ingresando...' : 'Ingresar'}
          </Button>
        </Box>

        <Typography align="center" sx={{ mt: 2 }}>
          ¿No tienes cuenta? <Link to="/registro">Regístrate aquí</Link>
        </Typography>
      </Paper>
    </Container>
  );
}

export default Login;
