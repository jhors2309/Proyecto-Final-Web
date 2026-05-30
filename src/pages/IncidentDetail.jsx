import { useEffect, useState } from 'react';
import { Alert, Box, Button, Container, Divider, Paper, Typography } from '@mui/material';
import { Link, useParams } from 'react-router-dom';
import Loading from '../components/Loading';
import StatusBadge from '../components/StatusBadge';
import { useAuth } from '../context/AuthContext';
import { getIncidentById } from '../services/incidentService';

function formatDate(fechaCreacion) {
  if (!fechaCreacion?.toDate) return 'Fecha pendiente';
  return fechaCreacion.toDate().toLocaleString('es-CO');
}

function IncidentDetail() {
  const { id } = useParams();
  const { currentUser, isAdmin } = useAuth();
  const [incident, setIncident] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadIncident() {
      setLoading(true);
      setError('');

      try {
        const data = await getIncidentById(id);
        setIncident(data);
      } catch (err) {
        setError('No fue posible cargar el detalle del incidente.');
      } finally {
        setLoading(false);
      }
    }

    loadIncident();
  }, [id]);

  if (loading) return <Loading text="Cargando detalle..." />;
  if (error) return <Container sx={{ mt: 4 }}><Alert severity="error">{error}</Alert></Container>;

  const canView = isAdmin || incident.usuarioId === currentUser.uid;

  if (!canView) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="warning">No tienes permiso para ver este incidente.</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper className="detail-card">
        <Box className="detail-title-row">
          <Typography variant="h4" component="h1">Detalle del incidente</Typography>
          <StatusBadge estado={incident.estado} />
        </Box>

        <img className="detail-img" src={incident.imagenURL} alt={`Incidente ${incident.tipo}`} />

        <Divider sx={{ my: 3 }} />

        <Typography variant="h6">Tipo</Typography>
        <Typography sx={{ mb: 2 }}>{incident.tipo}</Typography>

        <Typography variant="h6">Descripción</Typography>
        <Typography sx={{ mb: 2 }}>{incident.descripcion}</Typography>

        <Typography variant="h6">Ubicación</Typography>
        <Typography sx={{ mb: 2 }}>{incident.ubicacionTexto}</Typography>

        {(incident.latitud && incident.longitud) && (
          <Typography sx={{ mb: 2 }}>
            <strong>GPS:</strong> {incident.latitud}, {incident.longitud}
          </Typography>
        )}

        <Typography sx={{ mb: 2 }}>
          <strong>Fecha de creación:</strong> {formatDate(incident.fechaCreacion)}
        </Typography>

        {incident.grupoId && (
          <Alert severity="info" sx={{ mb: 2 }}>
            Este incidente pertenece al grupo: {incident.grupoId}
          </Alert>
        )}

        <Button component={Link} to={isAdmin ? '/admin' : '/mis-reportes'} variant="contained">
          Volver
        </Button>
      </Paper>
    </Container>
  );
}

export default IncidentDetail;
