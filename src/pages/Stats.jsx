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
  LabelList,
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

// Color palette for status
const STATUS_COLORS = {
  'Reportado': '#f50000',    // Red
  'En proceso': '#c9d219',   // Yellow-green
  'Resuelto': '#4caf50',     // Green
};

// Color palette for types
const TYPE_COLORS = [
  '#1B5E20', // Dark green
  '#8e16de', // Light green
  '#16c5bc', // Medium green
  '#b0d81e', // Lighter green
  '#d72828', // Very light green
  '#0c708e', // Pale green
  '#6e821d', // Orange
  '#FF7043', // Deep orange
];

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
    <Box sx={{ background: '#f5f7f6', minHeight: 'calc(100vh - 64px)', pb: 4 }}>
      {/* Header */}
      <Box className="page-header" sx={{
        background: 'linear-gradient(135deg, #1B5E20 0%, #4CAF50 100%)',
        color: 'white',
        py: 4,
        px: 2,
        mb: 4
      }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
            <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
              Estadísticas de Incidentes
            </Typography>
            <Button 
              startIcon={<PrintIcon />} 
              variant="contained" 
              onClick={() => window.print()}
              sx={{ 
                background: 'rgba(255,255,255,0.2)',
                '&:hover': { background: 'rgba(255,255,255,0.3)' }
              }}
            >
              Imprimir Reporte
            </Button>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ mt: 3, mb: 4 }}>
        {error && <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>{error}</Alert>}

        {/* Filtros */}
        <Paper className="stats-filters no-print" sx={{ p: 3, mb: 4, borderRadius: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>Filtrar por rango de fechas</Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Fecha inicial"
                type="date"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                variant="outlined"
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
                variant="outlined"
              />
            </Grid>
          </Grid>
        </Paper>

        {/* Total Card */}
        <Grid container spacing={3} className="stat-summary" sx={{ mb: 4 }}>
          <Grid item xs={12} md={3}>
            <Paper className="stat-box" sx={{ 
              p: 3, 
              borderRadius: 2,
              background: 'linear-gradient(135deg, #1B5E20 0%, #4CAF50 100%)',
              color: 'white',
              textAlign: 'center',
              boxShadow: '0 4px 15px rgba(27, 94, 32, 0.2)'
            }}>
              <Typography variant="body2" sx={{ mb: 1, opacity: 0.9 }}>Total de incidentes</Typography>
              <Typography variant="h3" sx={{ fontWeight: 700 }}>{filteredIncidents.length}</Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} md={3}>
            <Paper className="stat-box print-reportado" sx={{ 
              p: 3, 
              borderRadius: 2,
              background: 'linear-gradient(135deg, #ff0000 0%, #f50000 100%)',
              color: 'white',
              textAlign: 'center',
              boxShadow: '0 4px 15px rgba(255, 152, 0, 0.2)',
              WebkitPrintColorAdjust: 'exact',
              printColorAdjust: 'exact'
            }}>
              <Typography variant="body2" sx={{ mb: 1, opacity: 0.9 }}>Reportados</Typography>
              <Typography variant="h3" sx={{ fontWeight: 700 }}>{byStatus.find(s => s.name === 'Reportado')?.value || 0}</Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} md={3}>
            <Paper className="stat-box print-en-proceso" sx={{ 
              p: 3, 
              borderRadius: 2,
              background: 'linear-gradient(135deg, #d4f321 0%, #c9d219 100%)',
              color: 'white',
              textAlign: 'center',
              boxShadow: '0 4px 15px rgba(243, 233, 33, 0.2)',
              WebkitPrintColorAdjust: 'exact',
              printColorAdjust: 'exact'
            }}>
              <Typography variant="body2" sx={{ mb: 1, opacity: 0.9 }}>En Proceso</Typography>
              <Typography variant="h3" sx={{ fontWeight: 700 }}>{byStatus.find(s => s.name === 'En proceso')?.value || 0}</Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} md={3}>
            <Paper className="stat-box print-resuelto" sx={{ 
              p: 3, 
              borderRadius: 2,
              background: 'linear-gradient(135deg, #4caf50 0%, #388e3c 100%)',
              color: 'white',
              textAlign: 'center',
              boxShadow: '0 4px 15px rgba(76, 175, 80, 0.2)',
              WebkitPrintColorAdjust: 'exact',
              printColorAdjust: 'exact'
            }}>
              <Typography variant="body2" sx={{ mb: 1, opacity: 0.9 }}>Resueltos</Typography>
              <Typography variant="h3" sx={{ fontWeight: 700 }}>{byStatus.find(s => s.name === 'Resuelto')?.value || 0}</Typography>
            </Paper>
          </Grid>
        </Grid>

        {/* Charts */}
        <Grid container spacing={3} className="charts-page">
          {/* Bar Chart */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, borderRadius: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>Incidentes por Estado</Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={byStatus} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                  <XAxis dataKey="name" />
                  <YAxis allowDecimals={false} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#fff', 
                      border: '2px solid #1B5E20',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar dataKey="value" name="Cantidad" fill="#1B5E20" radius={[8, 8, 0, 0]}>
                    <LabelList dataKey="value" position="top" style={{ fill: '#333', fontWeight: 700 }} />
                    {byStatus.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={STATUS_COLORS[entry.name] || '#1B5E20'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>

          {/* Pie Chart */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, borderRadius: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>Incidentes por Tipo</Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie 
                    data={byType} 
                    dataKey="value" 
                    nameKey="name" 
                    outerRadius={90}
                    label={{
                      formatter: (value) => `${value}`,
                      fill: '#333'
                    }}
                  >
                    {byType.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={TYPE_COLORS[index % TYPE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#fff', 
                      border: '2px solid #1B5E20',
                      borderRadius: '8px'
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default Stats;
