import { SvgIconComponent } from '@mui/icons-material';
import VerifiedRoundedIcon from '@mui/icons-material/VerifiedRounded';
import { Box, Tooltip } from '@mui/material';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Koperative } from '../../models/Koperative';
import { KoperativeStatusEnum } from '../../models/enums';

interface KoperativeVerifiedIconProps {
  koperative?: Koperative | null;
  status?: string | KoperativeStatusEnum;
  icon?: SvgIconComponent;
  fontSize?: 'inherit' | 'small' | 'medium' | 'large';
  color?: 'inherit' | 'primary' | 'secondary' | 'action' | 'disabled' | 'error' | 'info' | 'success' | 'warning';
}

const KoperativeVerifiedIcon: React.FC<KoperativeVerifiedIconProps> = ({
  koperative,
  status,
  icon: Icon = VerifiedRoundedIcon,
  fontSize = 'inherit',
  color = 'primary',
}) => {
  const { t } = useTranslation();
  const currentStatus = koperative?.status ?? status;

  return currentStatus === KoperativeStatusEnum.CONFIRMED ? (
    <Tooltip title={t('enum_koperative_status_confirmed')} arrow>
      <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center', ml: 0.5 }}>
        <Icon fontSize={fontSize} color={color} />
      </Box>
    </Tooltip>
  ) : (
    <></>
  );
};

export default KoperativeVerifiedIcon;
