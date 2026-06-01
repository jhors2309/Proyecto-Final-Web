import { useEffect, useState } from 'react';
import {
  Alert,
  Box,
  Container,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Typography,
  Button,
} from '@mui/material';
import { Link } from 'react-router-dom';
import AddAlertIcon from '@mui/icons-material/AddAlert';
import IncidentCard from '../components/IncidentCard';
import Loading from '../components/Loading';
import { useAuth } from '../context/AuthContext';
import { getIncidentsByUser } from '../services/incidentService';

function MyIncidents() {
  const { currentUser } = useAuth();
  const [incidents, setIncidents] = useState([]);
  const [estado, setEstado] = useState('Todos');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadIncidents() {
      setLoading(true);
      setError('');

      try {
        const data = await getIncidentsByUser(currentUser.uid, estado);
        setIncidents(data);
      } catch (err) {
        setError('No fue posible cargar tus reportes.');
      } finally {
        setLoading(false);
      }
    }

    loadIncidents();
  }, [currentUser.uid, estado]);

  if (loading) {
    return <Loading text="Cargando reportes..." />;
  }

  return (
    <Box sx={{ background: '#f5f7f6', minHeight: 'calc(100vh - 64px)', pb: 4 }}>
      {/* Header */}
      <Box sx={{
        background: 'linear-gradient(135deg, #1B5E20 0%, #4CAF50 100%)',
        color: 'white',
        py: 4,
        px: 2
      }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
            <Box>
              <Typography variant="h4" component="h1" sx={{ fontWeight: 700, mb: 1 }}>
                Mis Reportes
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Consulta el estado de tus reportes de incidentes
              </Typography>
            </Box>
            <Button 
              component={Link}
              to="/nuevo-reporte"
              variant="contained"
              startIcon={<AddAlertIcon />}
              sx={{
                background: 'rgba(255,255,255,0.2)',
                '&:hover': { background: 'rgba(255,255,255,0.3)' }
              }}
            >
              Nuevo Reporte
            </Button>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ mt: 4 }}>
        {/* Filtro */}
        <Box sx={{ mb: 3 }}>
          <FormControl size="small" sx={{ minWidth: 250 }}>
            <InputLabel>Filtrar por estado</InputLabel>
            <Select 
              value={estado} 
              label="Filtrar por estado" 
              onChange={(e) => setEstado(e.target.value)}
              sx={{
                background: 'white',
                borderRadius: 1
              }}
            >
              <MenuItem value="Todos">Todos</MenuItem>
              <MenuItem value="Reportado">Reportado</MenuItem>
              <MenuItem value="En proceso">En proceso</MenuItem>
              <MenuItem value="Resuelto">Resuelto</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        {incidents.length === 0 ? (
          <Alert severity="info" sx={{ borderRadius: 2 }}>
            No hay reportes para mostrar con ese filtro.
          </Alert>
        ) : (
          <Grid container spacing={3} sx={{ mb: 4 }}>
            {incidents.map((incident) => (
              <Grid item xs={12} sm={6} md={4} key={incident.id}>
                <IncidentCard incident={incident} />
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  );
}

export default MyIncidents;
