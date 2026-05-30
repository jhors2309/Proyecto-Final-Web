import { Card, CardContent, CardMedia, Typography, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import StatusBadge from './StatusBadge';

function formatDate(fechaCreacion) {
  if (!fechaCreacion?.toDate) return 'Fecha pendiente';
  return fechaCreacion.toDate().toLocaleString('es-CO');
}

function IncidentCard({ incident }) {
  return (
    <Card className="incident-card">
      <CardMedia
        component="img"
        height="180"
        image={incident.imagenURL}
        alt={`Imagen del incidente ${incident.tipo}`}
      />
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 1, mb: 1 }}>
          <Typography variant="h6" component="h3">
            {incident.tipo}
          </Typography>
          <StatusBadge estado={incident.estado} />
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          {incident.descripcion.length > 100
            ? `${incident.descripcion.substring(0, 100)}...`
            : incident.descripcion}
        </Typography>

        <Typography variant="body2"><strong>Ubicación:</strong> {incident.ubicacionTexto}</Typography>
        <Typography variant="body2" sx={{ mb: 2 }}><strong>Fecha:</strong> {formatDate(incident.fechaCreacion)}</Typography>

        <Button component={Link} to={`/incidente/${incident.id}`} variant="outlined" fullWidth>
          Ver detalle
        </Button>
      </CardContent>
    </Card>
  );
}

export default IncidentCard;
