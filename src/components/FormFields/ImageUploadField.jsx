import { useState, useRef } from 'react';
import {
  Box,
  Button,
  Typography,
  Paper,
  IconButton,
  Chip,
  Card,
  CardMedia,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import ImageIcon from '@mui/icons-material/Image';

/**
 * Componente reutilizable para carga de imágenes con previsualización
 * Props: value, onChange, error, helperText, required
 */
function ImageUploadField({
  value = null,
  onChange,
  error = false,
  helperText = '',
  required = false,
  accept = 'image/*',
  maxSizeMB = 5,
  ...rest
}) {
  const fileInputRef = useRef(null);
  const [preview, setPreview] = useState(value?.preview || '');
  const [fileInfo, setFileInfo] = useState(value?.file || null);
  const [sizeError, setSizeError] = useState('');

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validar tamaño
    const sizeMB = file.size / (1024 * 1024);
    if (sizeMB > maxSizeMB) {
      setSizeError(`El archivo es muy grande. Máximo: ${maxSizeMB}MB`);
      return;
    }

    setSizeError('');
    setFileInfo(file);

    // Crear previsualización
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target.result);
      onChange({
        file,
        preview: e.target.result,
      });
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setFileInfo(null);
    setPreview('');
    setSizeError('');
    onChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <Box sx={{ mb: 2 }}>
      <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
        {required && <span style={{ color: 'red' }}>*</span>} Fotografía del incidente
      </Typography>

      {!preview ? (
        <Paper
          variant="outlined"
          sx={{
            p: 3,
            textAlign: 'center',
            border: error ? '2px solid #d32f2f' : '2px dashed #bdbdbd',
            backgroundColor: error ? 'rgba(211, 47, 47, 0.05)' : 'rgba(0, 0, 0, 0.02)',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            '&:hover': {
              borderColor: error ? '#d32f2f' : '#1976d2',
              backgroundColor: error ? 'rgba(211, 47, 47, 0.08)' : 'rgba(25, 118, 210, 0.05)',
            },
          }}
          onClick={handleClick}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            onChange={handleFileChange}
            style={{ display: 'none' }}
            {...rest}
          />
          <ImageIcon
            sx={{
              fontSize: 48,
              color: error ? '#d32f2f' : '#757575',
              mb: 1,
            }}
          />
          <Typography variant="body1" sx={{ mb: 1, fontWeight: 500 }}>
            Haz clic o arrastra una imagen
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Formatos: JPG, PNG, GIF (máximo {maxSizeMB}MB)
          </Typography>
        </Paper>
      ) : (
        <Card
          sx={{
            position: 'relative',
            overflow: 'hidden',
            borderRadius: 2,
          }}
        >
          <CardMedia
            component="img"
            image={preview}
            alt="Vista previa del incidente"
            sx={{
              height: 300,
              objectFit: 'cover',
              objectPosition: 'center',
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              right: 0,
              p: 1,
              backgroundColor: 'rgba(0, 0, 0, 0.3)',
              backdropFilter: 'blur(4px)',
            }}
          >
            <IconButton
              size="small"
              onClick={handleRemoveImage}
              sx={{
                backgroundColor: '#d32f2f',
                color: 'white',
                '&:hover': {
                  backgroundColor: '#b71c1c',
                },
              }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Box>
          {fileInfo && (
            <Box sx={{ p: 2, backgroundColor: '#f5f5f5' }}>
              <Chip
                icon={<ImageIcon />}
                label={`${fileInfo.name} (${(fileInfo.size / 1024).toFixed(2)} KB)`}
                onDelete={handleRemoveImage}
                color="primary"
                variant="outlined"
              />
            </Box>
          )}
        </Card>
      )}

      {sizeError && (
        <Typography variant="caption" sx={{ color: '#d32f2f', display: 'block', mt: 1 }}>
          {sizeError}
        </Typography>
      )}

      {helperText && !sizeError && (
        <Typography variant="caption" sx={{ color: error ? '#d32f2f' : '#666', display: 'block', mt: 1 }}>
          {helperText}
        </Typography>
      )}
    </Box>
  );
}

export default ImageUploadField;
