import { Box, Button, Card, CardContent, Container, Grid, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import AddAlertIcon from '@mui/icons-material/AddAlert';
import ListAltIcon from '@mui/icons-material/ListAlt';
import BarChartIcon from '@mui/icons-material/BarChart';
import { useAuth } from '../context/AuthContext';

function Home() {
  const { userData, isAdmin } = useAuth();

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box className="hero">
        <Typography variant="h3" component="h1" gutterBottom>
          UDLA Reporta
        </Typography>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Bienvenido, {userData?.nombre || 'usuario'}.
        </Typography>
        <Typography>
          Desde este sistema puedes registrar incidentes ocurridos dentro de la Universidad de la Amazonia,
          adjuntar evidencia fotográfica y consultar el estado de atención.
        </Typography>
      </Box>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12} md={4}>
          <Card className="home-card">
            <CardContent>
              <AddAlertIcon color="primary" fontSize="large" />
              <Typography variant="h5" sx={{ mt: 1 }}>Nuevo reporte</Typography>
              <Typography color="text.secondary" sx={{ my: 2 }}>
                Registra un incidente con tipo, descripción, ubicación y fotografía obligatoria.
              </Typography>
              <Button component={Link} to="/nuevo-reporte" variant="contained" fullWidth>
                Crear reporte
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card className="home-card">
            <CardContent>
              <ListAltIcon color="primary" fontSize="large" />
              <Typography variant="h5" sx={{ mt: 1 }}>Mis reportes</Typography>
              <Typography color="text.secondary" sx={{ my: 2 }}>
                Consulta tus reportes y revisa si están reportados, en proceso o resueltos.
              </Typography>
              <Button component={Link} to="/mis-reportes" variant="outlined" fullWidth>
                Ver mis reportes
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {isAdmin && (
          <Grid item xs={12} md={4}>
            <Card className="home-card">
              <CardContent>
                <BarChartIcon color="primary" fontSize="large" />
                <Typography variant="h5" sx={{ mt: 1 }}>Administración</Typography>
                <Typography color="text.secondary" sx={{ my: 2 }}>
                  Cambia estados, agrupa incidentes repetidos y revisa estadísticas básicas.
                </Typography>
                <Button component={Link} to="/admin" variant="contained" fullWidth>
                  Ir al panel admin
                </Button>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>
    </Container>
  );
}

export default Home;
