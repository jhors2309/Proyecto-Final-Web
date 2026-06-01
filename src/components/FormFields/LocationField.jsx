import { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Alert,
  Chip,
  CircularProgress,
} from '@mui/material';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import LocationOnIcon from '@mui/icons-material/LocationOn';

/**
 * Componente para gestionar ubicación manual + GPS
 * Props: ubicacionTexto, setUbicacionTexto, latitud, setLatitud, longitud, setLongitud
 */
function LocationField({
  ubicacionTexto,
  setUbicacionTexto,
  latitud,
  setLatitud,
  longitud,
  setLongitud,
  error = false,
  helperText = '',
  required = false,
}) {
  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsError, setGpsError] = useState('');
  const [gpsSuccess, setGpsSuccess] = useState(false);

  const handleGetLocation = () => {
    setGpsError('');
    setGpsSuccess(false);
    setGpsLoading(true);

    if (!navigator.geolocation) {
      setGpsError('Tu navegador no soporta geolocalización. Ingresa la ubicación manualmente.');
      setGpsLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLatitud(latitude);
        setLongitud(longitude);
        setGpsSuccess(true);
        setGpsError('');
        setGpsLoading(false);
      },
      (error) => {
        let errorMsg = 'No pudimos obtener tu ubicación.';
        if (error.code === error.PERMISSION_DENIED) {
          errorMsg =
            'Permiso denegado. Por favor habilita la geolocalización en tu navegador.';
        }
        setGpsError(errorMsg);
        setGpsLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  const clearGPS = () => {
    setLatitud('');
    setLongitud('');
    setGpsSuccess(false);
    setGpsError('');
  };

  return (
    <Box sx={{ mb: 2 }}>
      <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 600 }}>
        {required && <span style={{ color: 'red' }}>*</span>} Ubicación del incidente
      </Typography>

      {/* Campo de ubicación manual */}
      <TextField
        fullWidth
        label="Ubicación manual"
        placeholder="Ejemplo: Bloque A, piso 2, cerca del baño de hombres"
        value={ubicacionTexto}
        onChange={(e) => setUbicacionTexto(e.target.value)}
        error={error && !ubicacionTexto}
        helperText={error && !ubicacionTexto ? 'Este campo es requerido' : helperText}
        multiline
        rows={2}
        variant="outlined"
        sx={{ mb: 2 }}
      />

      {/* Botón GPS */}
      <Box sx={{ mb: 2 }}>
        <Button
          variant={gpsSuccess ? 'contained' : 'outlined'}
          startIcon={
            gpsLoading ? (
              <CircularProgress size={20} sx={{ mr: 1 }} />
            ) : (
              <MyLocationIcon />
            )
          }
          onClick={handleGetLocation}
          disabled={gpsLoading}
          color={gpsSuccess ? 'success' : 'primary'}
          fullWidth
          sx={{
            textTransform: 'none',
            fontSize: '0.95rem',
          }}
        >
          {gpsLoading
            ? 'Obteniendo ubicación...'
            : gpsSuccess
              ? 'Ubicación GPS capturada ✓'
              : 'Capturar ubicación GPS (opcional)'}
        </Button>
      </Box>

      {/* Error GPS */}
      {gpsError && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          {gpsError}
        </Alert>
      )}

      {/* Coordenadas GPS capturadas */}
      {gpsSuccess && latitud && longitud && (
        <Box
          sx={{
            p: 2,
            backgroundColor: '#e8f5e9',
            borderLeft: '4px solid #4caf50',
            borderRadius: 1,
            mb: 2,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <LocationOnIcon sx={{ color: '#4caf50', fontSize: 20 }} />
            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#2e7d32' }}>
              Ubicación GPS capturada
            </Typography>
          </Box>
          <Typography variant="body2" sx={{ mb: 1, color: '#1b5e20', fontFamily: 'monospace' }}>
            📍 Latitud: {latitud.toFixed(6)} | Longitud: {longitud.toFixed(6)}
          </Typography>
          <Button size="small" variant="text" onClick={clearGPS} sx={{ color: '#d32f2f' }}>
            Limpiar coordenadas
          </Button>
        </Box>
      )}
    </Box>
  );
}

export default LocationField;
