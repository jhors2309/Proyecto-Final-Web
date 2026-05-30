import { Box, CircularProgress, Typography } from '@mui/material';

function Loading({ text = 'Cargando...' }) {
  return (
    <Box className="center-screen">
      <CircularProgress />
      <Typography sx={{ mt: 2 }}>{text}</Typography>
    </Box>
  );
}

export default Loading;
