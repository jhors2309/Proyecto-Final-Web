import { useEffect, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Checkbox,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { Link } from 'react-router-dom';
import StatusBadge from '../components/StatusBadge';
import Loading from '../components/Loading';
import { getAllIncidents, groupIncidents, updateIncidentStatus } from '../services/incidentService';

function formatDate(fechaCreacion) {
  if (!fechaCreacion?.toDate) return 'Pendiente';
  return fechaCreacion.toDate().toLocaleString('es-CO');
}

function AdminDashboard() {
  const [incidents, setIncidents] = useState([]);
  const [estado, setEstado] = useState('Todos');
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  async function loadIncidents() {
    setLoading(true);
    setError('');

    try {
      const data = await getAllIncidents(estado);
      setIncidents(data);
    } catch (err) {
      setError('No fue posible cargar los incidentes.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadIncidents();
  }, [estado]);

  function toggleSelected(id) {
    setSelected((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
    );
  }

  async function handleStatusChange(incident, newStatus) {
    setMessage('');
    setError('');

    try {
      await updateIncidentStatus(incident, newStatus);
      setMessage('Estado actualizado correctamente. Si el incidente estaba agrupado, el cambio se aplicó al grupo.');
      await loadIncidents();
    } catch (err) {
      setError('No fue posible actualizar el estado.');
    }
  }

  async function handleGroup() {
    setMessage('');
    setError('');

    try {
      const grupoId = await groupIncidents(selected);
      setMessage(`Incidentes agrupados correctamente en ${grupoId}.`);
      setSelected([]);
      await loadIncidents();
    } catch (err) {
      setError(err.message || 'No fue posible agrupar los incidentes.');
    }
  }

  if (loading) return <Loading text="Cargando panel administrador..." />;

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box className="page-header">
        <Typography variant="h4" component="h1">Panel administrador</Typography>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel>Filtrar por estado</InputLabel>
            <Select value={estado} label="Filtrar por estado" onChange={(e) => setEstado(e.target.value)}>
              <MenuItem value="Todos">Todos</MenuItem>
              <MenuItem value="Reportado">Reportado</MenuItem>
              <MenuItem value="En proceso">En proceso</MenuItem>
              <MenuItem value="Resuelto">Resuelto</MenuItem>
            </Select>
          </FormControl>
          <Button component={Link} to="/estadisticas" variant="contained">Ver estadísticas</Button>
        </Box>
      </Box>

      {message && <Alert severity="success" sx={{ mb: 2 }}>{message}</Alert>}
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Box sx={{ mb: 2 }}>
        <Button variant="outlined" onClick={handleGroup} disabled={selected.length < 2}>
          Agrupar seleccionados ({selected.length})
        </Button>
      </Box>

      {incidents.length === 0 ? (
        <Alert severity="info">No hay incidentes para mostrar.</Alert>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Agrupar</TableCell>
                <TableCell>Tipo</TableCell>
                <TableCell>Ubicación</TableCell>
                <TableCell>Usuario</TableCell>
                <TableCell>Fecha</TableCell>
                <TableCell>Estado actual</TableCell>
                <TableCell>Cambiar estado</TableCell>
                <TableCell>Detalle</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {incidents.map((incident) => (
                <TableRow key={incident.id}>
                  <TableCell>
                    <Checkbox checked={selected.includes(incident.id)} onChange={() => toggleSelected(incident.id)} />
                  </TableCell>
                  <TableCell>{incident.tipo}</TableCell>
                  <TableCell>{incident.ubicacionTexto}</TableCell>
                  <TableCell>{incident.usuarioEmail}</TableCell>
                  <TableCell>{formatDate(incident.fechaCreacion)}</TableCell>
                  <TableCell>
                    <StatusBadge estado={incident.estado} />
                    {incident.grupoId && (
                      <Typography variant="caption" display="block">Grupo: {incident.grupoId}</Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    <FormControl size="small" sx={{ minWidth: 150 }}>
                      <Select value={incident.estado} onChange={(e) => handleStatusChange(incident, e.target.value)}>
                        <MenuItem value="Reportado">Reportado</MenuItem>
                        <MenuItem value="En proceso">En proceso</MenuItem>
                        <MenuItem value="Resuelto">Resuelto</MenuItem>
                      </Select>
                    </FormControl>
                  </TableCell>
                  <TableCell>
                    <Button component={Link} to={`/incidente/${incident.id}`} size="small" variant="outlined">
                      Ver
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
}

export default AdminDashboard;
