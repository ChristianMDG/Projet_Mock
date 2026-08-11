import React from 'react';
import { ToggleButton } from '@mui/material';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import { useTranslation } from 'react-i18next';
import Labels from '@/labelKeys.json';

interface SwapVillesButtonProps {
  onClick: () => void;
  isSwapping: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
}

const SwapVillesButton: React.FC<SwapVillesButtonProps> = React.memo(
  ({ onClick, isSwapping, disabled = false, fullWidth = true }) => {
    const { t } = useTranslation();

    return (
      <ToggleButton
        value="swap"
        selected={false}
        onChange={onClick}
        disabled={disabled}
        fullWidth={fullWidth}
        sx={{
          height: '56px',
          display: 'flex',
          color: 'primary.main',
          borderRadius: 2,
          gap: 1,
        }}
      >
        <SwapHorizIcon
          sx={{
            transform: isSwapping ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.3s ease-in-out',
          }}
        />
        {isSwapping ? t(Labels.voyage_search_swapping) : t(Labels.voyage_search_swap_cities)}
      </ToggleButton>
    );
  },
);

SwapVillesButton.displayName = 'SwapVillesButton';

export default SwapVillesButton;
