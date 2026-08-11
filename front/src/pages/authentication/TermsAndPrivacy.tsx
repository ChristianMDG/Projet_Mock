import React from 'react';
import { Link, Typography } from '@mui/material';
import Labels from '@/labelKeys.json';
import { useTranslation } from 'react-i18next';

const TermsAndPrivacy: React.FC = () => {
  const { t } = useTranslation();

  return (
    <Typography
      variant="caption"
      color="text.secondary"
      align="center"
      sx={{
        display: 'block',
        mt: 2,
      }}
    >
      {t(Labels.authform_terms_accept)}{' '}
      <Link href="#" color="primary">
        {t(Labels.authform_terms_of_use)}
      </Link>{' '}
      {t(Labels.authform_and_our)}{' '}
      <Link href="#" color="primary">
        {t(Labels.authform_privacy_policy)}
      </Link>
    </Typography>
  );
};

export default TermsAndPrivacy;
