import { Chip } from '@mui/material';

function StatusBadge({ estado }) {
  const config = {
    Reportado: { color: 'error', label: 'Reportado' },
    'En proceso': { color: 'warning', label: 'En proceso' },
    Resuelto: { color: 'success', label: 'Resuelto' },
  };

  const selected = config[estado] || { color: 'default', label: estado };

  return <Chip color={selected.color} label={selected.label} size="small" />;
}

export default StatusBadge;
