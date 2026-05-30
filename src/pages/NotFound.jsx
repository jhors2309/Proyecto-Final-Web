import { Button, Container, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <Container maxWidth="md" sx={{ mt: 6, textAlign: 'center' }}>
      <Typography variant="h3" component="h1" gutterBottom>
        Página no encontrada
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 3 }}>
        La ruta solicitada no existe dentro de UDLA Reporta.
      </Typography>
      <Button component={Link} to="/inicio" variant="contained">
        Volver al inicio
      </Button>
    </Container>
  );
}

export default NotFound;
