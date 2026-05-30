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
} from '@mui/material';
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
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box className="page-header">
        <Typography variant="h4" component="h1">Mis reportes</Typography>
        <FormControl size="small" sx={{ minWidth: 200 }}>
          <InputLabel>Filtrar por estado</InputLabel>
          <Select value={estado} label="Filtrar por estado" onChange={(e) => setEstado(e.target.value)}>
            <MenuItem value="Todos">Todos</MenuItem>
            <MenuItem value="Reportado">Reportado</MenuItem>
            <MenuItem value="En proceso">En proceso</MenuItem>
            <MenuItem value="Resuelto">Resuelto</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {incidents.length === 0 ? (
        <Alert severity="info">No hay reportes para mostrar con ese filtro.</Alert>
      ) : (
        <Grid container spacing={3}>
          {incidents.map((incident) => (
            <Grid item xs={12} sm={6} md={4} key={incident.id}>
              <IncidentCard incident={incident} />
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
}

export default MyIncidents;
