import { Grid } from '@mui/material';
import FacebookAuthButton from '@/components/ui/FacebookAuthButton';
import GoogleAuthButton from '@/components/ui/GoogleAuthButton';

const SocialLogin = () => {
  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 6 }}>
        <GoogleAuthButton />
      </Grid>
      <Grid size={{ xs: 6 }}>
        <FacebookAuthButton />
      </Grid>
    </Grid>
  );
};

export default SocialLogin;
