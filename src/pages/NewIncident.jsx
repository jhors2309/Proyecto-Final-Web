import { useState, useCallback } from 'react';
import {
  Alert,
  Box,
  Button,
  Container,
  Paper,
  Typography,
  Divider,
  Card,
  CardContent,
  Fade,
  TextField,
  CircularProgress
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { createIncident } from '../services/incidentService';
import FormFieldSelect from '../components/FormFields/FormFieldSelect';
import FormFieldInput from '../components/FormFields/FormFieldInput';
import ImageUploadField from '../components/FormFields/ImageUploadField';

const INCIDENT_TYPES = [
  'Baño',
  'Electricidad',
  'Infraestructura',
  'Seguridad',
  'Fuga de agua',
  'Aseo',
  'Otro',
];

function NewIncident() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  // Estado del formulario
  const [formData, setFormData] = useState({
    tipo: '',
    descripcion: '',
    ubicacionTexto: '',
    imageData: null,
    latitud: '',
    longitud: '',
  });

  // Estados de validación y feedback
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [loadingGPS, setLoadingGPS] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [gpsError, setGpsError] = useState('');

  // Handlers para actualizar estados individuales
  const handleTipoChange = (e) => {
    setFormData({ ...formData, tipo: e.target.value });
    if (errors.tipo) setErrors({ ...errors, tipo: '' });
  };

  const handleDescripcionChange = (e) => {
    setFormData({ ...formData, descripcion: e.target.value });
    if (errors.descripcion) setErrors({ ...errors, descripcion: '' });
  };

  const handleUbicacionTextoChange = (e) => {
    setFormData({ ...formData, ubicacionTexto: e.target.value });
    if (errors.ubicacionTexto) setErrors({ ...errors, ubicacionTexto: '' });
  };

  const handleImageChange = (imageData) => {
    setFormData({ ...formData, imageData });
    if (errors.imageData) setErrors({ ...errors, imageData: '' });
  };

  // Función nativa para solicitar la ubicación por GPS
  const handleGetGPSLocation = () => {
    if (!navigator.geolocation) {
      setGpsError('Tu navegador o dispositivo no soporta geolocalización por GPS.');
      return;
    }

    setLoadingGPS(true);
    setGpsError('');
    setErrorMessage('');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        
        setFormData(prevState => ({
          ...prevState,
          latitud: latitude,
          longitud: longitude,
          // Rellenamos el campo con un indicador claro del GPS capturado
          ubicacionTexto: `Ubicación GPS fijada (Lat: ${latitude.toFixed(5)}, Lng: ${longitude.toFixed(5)})`
        }));

        if (errors.ubicacionTexto) setErrors(prev => ({ ...prev, ubicacionTexto: '' }));
        setLoadingGPS(false);
      },
      (error) => {
        setLoadingGPS(false);
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setGpsError('Permiso denegado. Por favor activa los permisos de GPS en tu navegador.');
            break;
          case error.POSITION_UNAVAILABLE:
            setGpsError('La señal de ubicación no está disponible actualmente.');
            break;
          case error.TIMEOUT:
            setGpsError('Se agotó el tiempo de espera para obtener la ubicación.');
            break;
          default:
            setGpsError('Ocurrió un error desconocido al adquirir el GPS.');
        }
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  // Validación del formulario adaptada a GPS o Manual
  const validateForm = useCallback(() => {
    const newErrors = {};

    if (!formData.tipo.trim()) {
      newErrors.tipo = 'Selecciona un tipo de incidente';
    }

    if (!formData.descripcion.trim() || formData.descripcion.length < 10) {
      newErrors.descripcion = 'La descripción debe tener al menos 10 caracteres';
    }

    // Pasa la prueba si el usuario ingresó texto O si tiene coordenadas GPS capturadas
    const tieneTexto = formData.ubicacionTexto && formData.ubicacionTexto.trim();
    const tieneGPS = formData.latitud && formData.longitud;

    if (!tieneTexto && !tieneGPS) {
      newErrors.ubicacionTexto = 'Ingresa la ubicación manual o activa la ubicación GPS';
    }

    if (!formData.imageData) {
      newErrors.imageData = 'La fotografía es obligatoria';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  // Cálculo del progreso visual adaptado
  const calculateProgress = () => {
    let filled = 0;
    if (formData.tipo) filled++;
    if (formData.descripcion) filled++;
    
    // Si tiene texto descriptivo O tiene las coordenadas GPS guardadas, este paso se cuenta completado
    if (formData.ubicacionTexto.trim() || (formData.latitud && formData.longitud)) {
      filled++;
    }
    
    if (formData.imageData) filled++;
    return Math.round((filled / 4) * 100);
  };

  // Envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!validateForm()) {
      setErrorMessage('Por favor completa todos los campos requeridos.');
      return;
    }

    setLoading(true);

    try {
      await createIncident({
        user: currentUser,
        tipo: formData.tipo,
        descripcion: formData.descripcion,
        ubicacionTexto: formData.ubicacionTexto,
        latitud: formData.latitud,
        longitud: formData.longitud,
        imageFile: formData.imageData?.file,
      });

      setSuccessMessage('¡Incidente reportado exitosamente!');
      setTimeout(() => {
        navigate('/mis-reportes');
      }, 2000);
    } catch (err) {
      setErrorMessage(err.message || 'Error al guardar el reporte. Intenta de nuevo.');
      console.error('Error submitting form:', err);
    } finally {
      setLoading(false);
    }
  };

  const tieneGPSValido = formData.latitud && formData.longitud;

  return (
    <Container maxWidth="md" sx={{ py: 4, minHeight: '80vh' }}>
      <Fade in={true} timeout={500}>
        <Paper
          elevation={2}
          sx={{
            borderRadius: 3,
            overflow: 'hidden',
          }}
        >
          {/* Header */}
          <Box
            sx={{
              background: 'linear-gradient(135deg, #1B5E20 0%, #4CAF50 100%)',
              color: 'white',
              p: 4,
              textAlign: 'center',
            }}
          >
            <Typography variant="h4" component="h1" sx={{ fontWeight: 700, mb: 1 }}>
              Reportar Nuevo Incidente
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.9 }}>
              Cuéntanos qué pasó y adjunta una fotografía. Tu reporte ayuda a mejorar nuestras instalaciones.
            </Typography>
          </Box>

          {/* Contenido */}
          <Box sx={{ p: 4 }}>
            {/* Indicador de progreso */}
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  Progreso del formulario
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 700, color: '#1B5E20' }}>
                  {calculateProgress()}%
                </Typography>
              </Box>
              <Box sx={{ width: '100%', height: 8, backgroundColor: '#e0e0e0', borderRadius: 4, overflow: 'hidden' }}>
                <Box
                  sx={{
                    height: '100%',
                    width: `${calculateProgress()}%`,
                    background: 'linear-gradient(90deg, #1B5E20 0%, #4CAF50 100%)',
                    transition: 'width 0.3s ease-in-out',
                  }}
                />
              </Box>
            </Box>

            {/* Alertas de error y éxito */}
            {errorMessage && (
              <Alert severity="error" icon={<ErrorIcon />} sx={{ mb: 3 }} onClose={() => setErrorMessage('')}>
                {errorMessage}
              </Alert>
            )}

            {successMessage && (
              <Alert severity="success" icon={<CheckCircleIcon />} sx={{ mb: 3 }} onClose={() => setSuccessMessage('')}>
                {successMessage}
              </Alert>
            )}

            {/* Formulario */}
            <Box component="form" onSubmit={handleSubmit} noValidate>
              {/* Sección 1: Tipo de Incidente */}
              <Card variant="outlined" sx={{ mb: 3, borderLeft: '4px solid #1B5E20' }}>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 28, height: 28, backgroundColor: '#1B5E20', color: 'white', borderRadius: '50%', fontSize: '14px', fontWeight: 700 }}>1</span>
                    ¿Qué tipo de incidente reportas?
                  </Typography>
                  <FormFieldSelect
                    label="Tipo de incidente"
                    value={formData.tipo}
                    onChange={handleTipoChange}
                    options={INCIDENT_TYPES}
                    error={!!errors.tipo}
                    helperText={errors.tipo}
                    required
                  />
                </CardContent>
              </Card>

              {/* Sección 2: Descripción */}
              <Card variant="outlined" sx={{ mb: 3, borderLeft: '4px solid #1B5E20' }}>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 28, height: 28, backgroundColor: '#1B5E20', color: 'white', borderRadius: '50%', fontSize: '14px', fontWeight: 700 }}>2</span>
                    Describe el incidente en detalle
                  </Typography>
                  <FormFieldInput
                    label="Descripción detallada"
                    placeholder="Ej: El piso del baño está mojado, hay riesgo de accidente..."
                    value={formData.descripcion}
                    onChange={handleDescripcionChange}
                    error={!!errors.descripcion}
                    helperText={errors.descripcion || `${formData.descripcion.length}/500 caracteres`}
                    multiline
                    rows={4}
                    required
                    inputProps={{ maxLength: 500 }}
                  />
                </CardContent>
              </Card>

              {/* Sección 3: Ubicación (Modificada con integración de GPS Directo) */}
              <Card variant="outlined" sx={{ mb: 3, borderLeft: '4px solid #1B5E20' }}>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 28, height: 28, backgroundColor: '#1B5E20', color: 'white', borderRadius: '50%', fontSize: '14px', fontWeight: 700 }}>3</span>
                    ¿Dónde ocurrió el incidente?
                  </Typography>

                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start', flexWrap: 'wrap' }}>
                      <Button
                        variant={tieneGPSValido ? "contained" : "outlined"}
                        color={tieneGPSValido ? "success" : "primary"}
                        onClick={handleGetGPSLocation}
                        disabled={loadingGPS}
                        startIcon={loadingGPS ? <CircularProgress size={20} color="inherit" /> : <MyLocationIcon />}
                        sx={{ textTransform: 'none', height: '56px', minWidth: '220px' }}
                      >
                        {loadingGPS ? 'Obteniendo GPS...' : tieneGPSValido ? 'Ubicación GPS Capturada' : 'Usar mi ubicación GPS'}
                      </Button>

                      <TextField
                        label="Dirección o punto de referencia manual"
                        placeholder="Ej: Bloque B, segundo piso al lado de la cafetería"
                        value={formData.ubicacionTexto}
                        onChange={handleUbicacionTextoChange}
                        error={!!errors.ubicacionTexto}
                        helperText={gpsError || errors.ubicacionTexto || "Puedes usar el botón GPS o escribirla si no tienes señal automática."}
                        required={!tieneGPSValido}
                        disabled={!!tieneGPSValido} // Bloquea el teclado si se usó el GPS con éxito
                        fullWidth
                        sx={{ flex: 1, minWidth: '250px' }}
                      />
                    </Box>

                    {tieneGPSValido && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: '#2e7d32' }}>
                        <CheckCircleOutlineIcon fontSize="small" />
                        <Typography variant="caption" sx={{ fontWeight: 600 }}>
                          Coordenadas fijadas con éxito. El campo manual ha sido completado y bloqueado por tu seguridad.
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </CardContent>
              </Card>

              {/* Sección 4: Fotografía */}
              <Card variant="outlined" sx={{ mb: 3, borderLeft: '4px solid #1B5E20' }}>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 28, height: 28, backgroundColor: '#1B5E20', color: 'white', borderRadius: '50%', fontSize: '14px', fontWeight: 700 }}>4</span>
                    Adjunta una fotografía (Obligatoria)
                  </Typography>
                  <ImageUploadField
                    value={formData.imageData}
                    onChange={handleImageChange}
                    error={!!errors.imageData}
                    helperText={errors.imageData ? errors.imageData : 'La fotografía ayuda a validar el incidente más rápidamente'}
                    maxSizeMB={5}
                    required
                  />
                </CardContent>
              </Card>

              {/* Botones de acción */}
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'space-between', mt: 4 }}>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/mis-reportes')}
                  disabled={loading}
                  sx={{ flex: 1, textTransform: 'none', fontSize: '1rem' }}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  disabled={loading}
                  sx={{
                    flex: 1,
                    background: 'linear-gradient(135deg, #1B5E20 0%, #4CAF50 100%)',
                    textTransform: 'none',
                    fontSize: '1rem',
                    fontWeight: 600,
                  }}
                >
                  {loading ? 'Enviando reporte...' : 'Enviar Reporte'}
                </Button>
              </Box>
            </Box>
          </Box>
        </Paper>
      </Fade>
    </Container>
  );
}

export default NewIncident;