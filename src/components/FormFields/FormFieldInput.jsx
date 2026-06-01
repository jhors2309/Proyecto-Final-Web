import { TextField, FormHelperText, Box } from '@mui/material';

/**
 * Componente reutilizable para inputs de texto
 * Props: label, placeholder, value, onChange, error, helperText, required, multiline, rows, type
 */
function FormFieldInput({
  label,
  placeholder,
  value,
  onChange,
  error,
  helperText,
  required = false,
  multiline = false,
  rows = 1,
  type = 'text',
  disabled = false,
  ...rest
}) {
  return (
    <Box sx={{ mb: 2 }}>
      <TextField
        fullWidth
        label={label}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        error={error}
        helperText={helperText}
        required={required}
        multiline={multiline}
        rows={multiline ? rows : 1}
        type={type}
        disabled={disabled}
        variant="outlined"
        margin="normal"
        {...rest}
      />
    </Box>
  );
}

export default FormFieldInput;
