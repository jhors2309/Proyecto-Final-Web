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
    <Container maxWidth="sm" sx={{ mt: 6 }}>
      <Paper className="form-card">
        <Typography variant="h4" component="h1" align="center" gutterBottom>
          Crear cuenta
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
          />

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

          <TextField
            label="Confirmar contraseña"
            type="password"
            fullWidth
            required
            margin="normal"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }} disabled={loading}>
            {loading ? 'Registrando...' : 'Registrarme'}
          </Button>
        </Box>

        <Typography align="center" sx={{ mt: 2 }}>
          ¿Ya tienes cuenta? <Link to="/">Inicia sesión</Link>
        </Typography>
      </Paper>
    </Container>
  );
}

export default Register;
