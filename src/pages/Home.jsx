import { Box, Button, Card, CardContent, Container, Grid, Typography, Paper } from '@mui/material';
import { Link } from 'react-router-dom';
import AddAlertRoundedIcon from '@mui/icons-material/AddAlertRounded';
import ListAltIcon from '@mui/icons-material/ListAlt';
import BarChartIcon from '@mui/icons-material/BarChart';
import { useAuth } from '../context/AuthContext';
import { useEffect, useState } from 'react';
import { getAllIncidents } from '../services/incidentService';

function Home() {
  const { userData, isAdmin } = useAuth();
  const [counts, setCounts] = useState({ reportados: 0, enProceso: 0, resueltos: 0, total: 0 });

  useEffect(() => {
    let mounted = true;
    async function fetchCounts() {
      try {
        const incidents = await getAllIncidents();
        if (!mounted) return;
        const total = incidents.length;
        const reportados = incidents.filter(i => i.estado === 'Reportado').length;
        const enProceso = incidents.filter(i => i.estado === 'En proceso').length;
        const resueltos = incidents.filter(i => i.estado === 'Resuelto').length;
        setCounts({ reportados, enProceso, resueltos, total });
      } catch (err) {
        // silently ignore for now
        console.error('Error fetching incidents for home stats', err);
      }
    }

    if (isAdmin) fetchCounts();
    return () => { mounted = false; };
  }, [isAdmin]);

  return (
    <Box sx={{ background: '#f5f7f6', minHeight: 'calc(100vh - 64px)', pb: 4 }}>
      {/* Hero Banner */}
      <Box className="hero" sx={{ py: 6, px: 2, textAlign: 'center' }}>
        <Container maxWidth="md">
          <Typography variant="h3" component="h1" sx={{ fontWeight: 700, mb: 2 }}>
            UDLA Reporta
          </Typography>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 400, opacity: 0.95 }}>
            Bienvenido, {userData?.nombre || 'usuario'}
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.85, maxWidth: '600px', mx: 'auto' }}>
            Sistema de reporte de incidentes de la Universidad de la Amazonia. 
            Registra incidentes, adjunta evidencia fotográfica y consulta el estado de atención.
          </Typography>
        </Container>
      </Box>

      {/* Contenido Principal */}
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Card sx={{
              height: '100%',
              borderRadius: 2,
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-8px)',
                boxShadow: '0 12px 30px rgba(102, 126, 234, 0.25)'
              }
            }}>
              <CardContent sx={{ p: 3, textAlign: 'center' }}>
                <Box className="icon-circle-gradient" sx={{
                  width: 60,
                  height: 60,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 2
                }}>
                  <AddAlertRoundedIcon sx={{ fontSize: 32}} />
                </Box>
                <Typography variant="h6" sx={{ mb: 1, fontWeight: 700 }}>
                  Nuevo Reporte
                </Typography>
                <Typography color="text.secondary" sx={{ my: 2, fontSize: '14px' }}>
                  Registra un incidente con tipo, descripción, ubicación y fotografía obligatoria.
                </Typography>
                <Button 
                  component={Link} 
                  to="/nuevo-reporte" 
                  variant="contained"
                  fullWidth
                  className="btn-gradient"
                  sx={{
                    fontWeight: 600,
                    py: 1.2,
                    mt: 2
                  }}
                >
                  Crear Reporte
                </Button>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card sx={{
              height: '100%',
              borderRadius: 2,
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-8px)',
                boxShadow: '0 12px 30px rgba(102, 126, 234, 0.25)'
              }
            }}>
              <CardContent sx={{ p: 3, textAlign: 'center' }}>
                <Box className="icon-circle-gradient" sx={{
                  width: 60,
                  height: 60,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 2
                }}>
                  <ListAltIcon sx={{ fontSize: 32, color: 'var(--green-2)' }} />
                </Box>
                <Typography variant="h6" sx={{ mb: 1, fontWeight: 700 }}>
                  Mis Reportes
                </Typography>
                <Typography color="text.secondary" sx={{ my: 2, fontSize: '14px' }}>
                  Consulta tus reportes y revisa si están reportados, en proceso o resueltos.
                </Typography>
                <Button 
                  component={Link} 
                  to="/mis-reportes" 
                  variant="contained"
                  fullWidth
                  className="btn-gradient"
                  sx={{
                    fontWeight: 600,
                    py: 1.2,
                    mt: 2,
                    '&:hover': { opacity: 0.95 }
                  }}
                >
                  Ver Mis Reportes
                </Button>
              </CardContent>
            </Card>
          </Grid>

          {isAdmin && (
            <Grid item xs={12} md={4}>
              <Card sx={{
                height: '100%',
                borderRadius: 2,
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: '0 12px 30px rgba(102, 126, 234, 0.25)'
                }
              }}>
                <CardContent sx={{ p: 3, textAlign: 'center' }}>
                  <Box className="icon-circle-gradient" sx={{
                    width: 60,
                    height: 60,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 2
                  }}>
                    <BarChartIcon sx={{ fontSize: 32, color: 'var(--green-3)' }} />
                  </Box>
                  <Typography variant="h6" sx={{ mb: 1, fontWeight: 700 }}>
                    Administración
                  </Typography>
                  <Typography color="text.secondary" sx={{ my: 2, fontSize: '14px' }}>
                    Cambia estados, agrupa incidentes repetidos y revisa estadísticas.
                  </Typography>
                  <Button 
                    component={Link} 
                    to="/admin" 
                    variant="contained"
                    fullWidth
                    className="btn-gradient"
                    sx={{
                      fontWeight: 600,
                      py: 1.2,
                      mt: 2,
                      '&:hover': { opacity: 0.95 }
                    }}
                  >
                    Panel Admin
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          )}
        </Grid>

        {isAdmin && (
          <Grid container spacing={3} sx={{ mt: 2 }}>
            <Grid item xs={12} md={3}>
              <Paper sx={{ p: 2, textAlign: 'center', borderRadius: 2, background: '#ffebee', border: '1px solid #ef5350' }}>
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#c62828' }}>{counts.reportados}</Typography>
                <Typography variant="body2" color="text.secondary">Reportados</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={3}>
              <Paper sx={{ p: 2, textAlign: 'center', borderRadius: 2, background: '#fff3e0', border: '1px solid #ffb74d' }}>
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#e65100' }}>{counts.enProceso}</Typography>
                <Typography variant="body2" color="text.secondary">En Proceso</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={3}>
              <Paper sx={{ p: 2, textAlign: 'center', borderRadius: 2, background: '#e8f5e9', border: '1px solid #66bb6a' }}>
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#2e7d32' }}>{counts.resueltos}</Typography>
                <Typography variant="body2" color="text.secondary">Resueltos</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={3}>
              <Paper sx={{ p: 2, textAlign: 'center', borderRadius: 2, background: '#f3e5f5', border: '1px solid #ba68c8' }}>
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#6a1b9a' }}>{counts.total}</Typography>
                <Typography variant="body2" color="text.secondary">Total</Typography>
              </Paper>
            </Grid>
          </Grid>
        )}
      </Container>
    </Box>
  );
}

export default Home;
