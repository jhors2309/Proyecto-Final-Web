import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  FormHelperText,
  Box,
} from '@mui/material';

/**
 * Componente reutilizable para selects/dropdowns
 * Props: label, value, onChange, options, error, helperText, required
 */
function FormFieldSelect({
  label,
  value,
  onChange,
  options = [],
  error = false,
  helperText = '',
  required = false,
  disabled = false,
  ...rest
}) {
  return (
    <Box sx={{ mb: 2 }}>
      <FormControl fullWidth margin="normal" required={required} error={error} {...rest}>
        <InputLabel>{label}</InputLabel>
        <Select
          value={value}
          label={label}
          onChange={onChange}
          disabled={disabled}
        >
          <MenuItem value="">
            <em>Selecciona una opción</em>
          </MenuItem>
          {options.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </Select>
        {helperText && <FormHelperText>{helperText}</FormHelperText>}
      </FormControl>
    </Box>
  );
}

export default FormFieldSelect;
