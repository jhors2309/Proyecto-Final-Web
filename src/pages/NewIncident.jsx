import { useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { createIncident } from '../services/incidentService';

const incidentTypes = [
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

  const [tipo, setTipo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [ubicacionTexto, setUbicacionTexto] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [latitud, setLatitud] = useState('');
  const [longitud, setLongitud] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function handleImageChange(event) {
    const file = event.target.files[0];
    setImageFile(file || null);
    setPreview(file ? URL.createObjectURL(file) : '');
  }

  function handleLocation() {
    setError('');

    if (!navigator.geolocation) {
      setError('El navegador no permite geolocalización. Puedes escribir la ubicación manualmente.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitud(position.coords.latitude);
        setLongitud(position.coords.longitude);
        setMessage('Ubicación GPS capturada correctamente.');
      },
      () => {
        setError('No fue posible obtener la ubicación GPS. Puedes continuar con ubicación manual.');
      }
    );
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setMessage('');

    if (!imageFile) {
      setError('Debes adjuntar una fotografía del incidente.');
      return;
    }

    setLoading(true);

    try {
      await createIncident({
        user: currentUser,
        tipo,
        descripcion,
        ubicacionTexto,
        latitud,
        longitud,
        imageFile,
      });

      navigate('/mis-reportes');
    } catch (err) {
      setError(err.message || 'No fue posible guardar el incidente.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper className="form-card">
        <Typography variant="h4" component="h1" gutterBottom>
          Registrar nuevo incidente
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 3 }}>
          Completa la información del incidente. La fotografía es obligatoria.
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {message && <Alert severity="success" sx={{ mb: 2 }}>{message}</Alert>}

        <Box component="form" onSubmit={handleSubmit}>
          <FormControl fullWidth margin="normal" required>
            <InputLabel>Tipo de incidente</InputLabel>
            <Select value={tipo} label="Tipo de incidente" onChange={(e) => setTipo(e.target.value)}>
              {incidentTypes.map((item) => (
                <MenuItem key={item} value={item}>{item}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="Descripción detallada"
            multiline
            minRows={4}
            fullWidth
            required
            margin="normal"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
          />

          <TextField
            label="Ubicación manual"
            placeholder="Ejemplo: Bloque 7, segundo piso, cerca del baño"
            fullWidth
            required
            margin="normal"
            value={ubicacionTexto}
            onChange={(e) => setUbicacionTexto(e.target.value)}
          />

          <Box sx={{ my: 2 }}>
            <Button variant="outlined" startIcon={<MyLocationIcon />} onClick={handleLocation}>
              Capturar ubicación GPS opcional
            </Button>
            {latitud && longitud && (
              <Typography variant="body2" sx={{ mt: 1 }}>
                Latitud: {latitud} | Longitud: {longitud}
              </Typography>
            )}
          </Box>

          <Button variant="outlined" component="label" fullWidth sx={{ mt: 1 }}>
            Seleccionar fotografía obligatoria
            <input hidden accept="image/*" capture="environment" type="file" onChange={handleImageChange} />
          </Button>

          {preview && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" sx={{ mb: 1 }}>Vista previa:</Typography>
              <img className="preview-img" src={preview} alt="Vista previa del incidente" />
            </Box>
          )}

          <Button type="submit" variant="contained" fullWidth sx={{ mt: 3 }} disabled={loading}>
            {loading ? 'Guardando reporte...' : 'Guardar reporte'}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}

export default NewIncident;
