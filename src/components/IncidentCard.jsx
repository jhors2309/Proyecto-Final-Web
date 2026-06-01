import { Card, CardContent, CardMedia, Typography, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import StatusBadge from './StatusBadge';

function formatDate(fechaCreacion) {
  if (!fechaCreacion?.toDate) return 'Fecha pendiente';
  return fechaCreacion.toDate().toLocaleString('es-CO');
}

function IncidentCard({ incident }) {
  return (
    <Card sx={{
      borderRadius: 2,
      boxShadow: '0 4px 15px rgba(0, 0, 0, 0.08)',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      '&:hover': {
        transform: 'translateY(-8px)',
        boxShadow: '0 12px 25px rgba(102, 126, 234, 0.2)'
      }
    }}>
      <CardMedia
        component="img"
        height="200"
        image={incident.imagenURL}
        alt={`Imagen del incidente ${incident.tipo}`}
        sx={{
          objectFit: 'cover',
          objectPosition: 'center'
        }}
      />
      <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', p: 2.5 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 1, mb: 2 }}>
          <Typography variant="h6" component="h3" sx={{ fontWeight: 700, color: '#333' }}>
            {incident.tipo}
          </Typography>
          <StatusBadge estado={incident.estado} />
        </Box>

        <Typography 
          variant="body2" 
          color="text.secondary" 
          sx={{ mb: 2, flex: 1, lineHeight: 1.6 }}
        >
          {incident.descripcion.length > 100
            ? `${incident.descripcion.substring(0, 100)}...`
            : incident.descripcion}
        </Typography>

        <Box sx={{ mb: 2, pb: 2, borderBottom: '1px solid #eee' }}>
          <Typography variant="body2" sx={{ mb: 0.5, color: '#666' }}>
            <strong>📍 Ubicación:</strong>
          </Typography>
          <Typography variant="body2" sx={{ color: '#333', fontWeight: 500 }}>
            {incident.ubicacionTexto}
          </Typography>
        </Box>

        <Typography variant="caption" sx={{ color: '#999', mb: 2 }}>
          <strong>📅</strong> {formatDate(incident.fechaCreacion)}
        </Typography>

        <Button 
          component={Link} 
          to={`/incidente/${incident.id}`} 
          variant="contained"
          fullWidth
          sx={{
            background: 'linear-gradient(135deg, #1B5E20 0%, #4CAF50 100%)',
            fontWeight: 600,
            py: 1,
            mt: 'auto',
            textTransform: 'none'
          }}
        >
          Ver Detalle
        </Button>
      </CardContent>
    </Card>
  );
}

export default IncidentCard;
