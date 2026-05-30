import { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Container,
  Grid,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import PrintIcon from '@mui/icons-material/Print';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import Loading from '../components/Loading';
import { getAllIncidents } from '../services/incidentService';

function getDateFromFirebase(fechaCreacion) {
  if (!fechaCreacion?.toDate) return null;
  return fechaCreacion.toDate();
}

function countBy(items, key) {
  const result = {};
  items.forEach((item) => {
    const value = item[key] || 'Sin dato';
    result[value] = (result[value] || 0) + 1;
  });

  return Object.entries(result).map(([name, value]) => ({ name, value }));
}

function Stats() {
  const [incidents, setIncidents] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      setError('');

      try {
        const data = await getAllIncidents('Todos');
        setIncidents(data);
      } catch (err) {
        setError('No fue posible cargar las estadísticas.');
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const filteredIncidents = useMemo(() => {
    return incidents.filter((incident) => {
      const date = getDateFromFirebase(incident.fechaCreacion);
      if (!date) return false;

      const afterStart = startDate ? date >= new Date(`${startDate}T00:00:00`) : true;
      const beforeEnd = endDate ? date <= new Date(`${endDate}T23:59:59`) : true;

      return afterStart && beforeEnd;
    });
  }, [incidents, startDate, endDate]);

  const byStatus = countBy(filteredIncidents, 'estado');
  const byType = countBy(filteredIncidents, 'tipo');

  if (loading) return <Loading text="Cargando estadísticas..." />;

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box className="page-header no-print">
        <Typography variant="h4" component="h1">Estadísticas de incidentes</Typography>
        <Button startIcon={<PrintIcon />} variant="contained" onClick={() => window.print()}>
          Imprimir reporte
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Paper className="stats-filters no-print">
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Fecha inicial"
              type="date"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Fecha final"
              type="date"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </Grid>
        </Grid>
      </Paper>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper className="stat-box">
            <Typography variant="h6">Total de incidentes</Typography>
            <Typography variant="h2" color="primary">{filteredIncidents.length}</Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={8}>
          <Paper className="chart-card">
            <Typography variant="h6" gutterBottom>Incidentes por estado</Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={byStatus}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" name="Cantidad" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper className="chart-card">
            <Typography variant="h6" gutterBottom>Incidentes por tipo</Typography>
            <ResponsiveContainer width="100%" height={330}>
              <PieChart>
                <Pie data={byType} dataKey="value" nameKey="name" outerRadius={110} label>
                  {byType.map((entry, index) => (
                    <Cell key={`cell-${entry.name}`} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

export default Stats;
