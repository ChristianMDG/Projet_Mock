import Box from '@mui/material/Box';
import SearchForm from '@/shared/SearchForm';
import { Container } from '@mui/material';
import HeroContent from './HeroContent';

export default function HeroSearch() {
  return (
    <Box component="div">
      <HeroContent />
      <Container sx={{ position: 'relative', zIndex: 3, padding: { xs: 0 } }} maxWidth="lg">
        <SearchForm />
      </Container>
    </Box>
  );
}
