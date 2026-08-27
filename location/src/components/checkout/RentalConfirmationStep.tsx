import { Typography, Paper, Button } from '@mui/material';
import { Link } from 'react-router-dom';

export default function RentalConfirmationStep() {
  return (
    <Paper variant="outlined" sx={{ p: 4, borderRadius: 3, textAlign: 'center' }}>
      <Typography variant="h4" color="success.main" sx={{ mb: 2, fontWeight: 800 }}>
        Réservation confirmée !
      </Typography>
      <Typography sx={{ mb: 4 }}>Votre paiement a été validé avec succès.</Typography>
      <Button variant="contained" component={Link} to="/location">
        Retour à l'accueil
      </Button>
    </Paper>
  );
}
