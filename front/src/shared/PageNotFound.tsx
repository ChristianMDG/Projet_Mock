import React from 'react';
import { Alert, Box, Button, Container, Typography } from '@mui/material';
import ErrorOutlined from '@mui/icons-material/ErrorOutlined';
import Home from '@mui/icons-material/Home';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Labels from '@/labelKeys.json';
import { ROUTES } from '@/constants/routes';

interface PageNotFoundProps {
  error?: Error | null;
}

const PageNotFound: React.FC<PageNotFoundProps> = ({ error }) => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  return (
    <Container
      sx={{
        maxWidth: 'md',
      }}
    >
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <ErrorOutlined sx={{ fontSize: 80, color: 'error.main', mb: 2 }} />

        <Typography variant="h3" component="h1" gutterBottom color="text.primary">
          {error ? t(Labels.error_pages_load_failed) : t(Labels.ui_error_not_found)}
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mt: 3, mb: 3, textAlign: 'left' }}>
            <Typography variant="body2">{error.message}</Typography>
          </Alert>
        )}

        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          {error ? t(Labels.dynamic_page_error_message) : t(Labels.dynamic_page_not_found_message)}
        </Typography>

        <Button
          variant="contained"
          size="large"
          startIcon={<Home />}
          onClick={() => navigate(ROUTES.home[i18n.language])}
        >
          {t(Labels.payment_return_home)}
        </Button>
      </Box>
    </Container>
  );
};

export default PageNotFound;
