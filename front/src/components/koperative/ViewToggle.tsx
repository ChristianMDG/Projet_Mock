import React from 'react';
import { Box, ToggleButton, ToggleButtonGroup, Tooltip, Typography } from '@mui/material';
import { GridView as GridViewIcon, List as ListIcon } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import Labels from '@/labelKeys.json';

type ViewMode = 'grid' | 'list';

interface ViewToggleProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  count?: number;
}

export const ViewToggle: React.FC<ViewToggleProps> = ({ viewMode, onViewModeChange, count }) => {
  const { t } = useTranslation();

  const handleChange = (_: React.MouseEvent<HTMLElement>, newViewMode: ViewMode | null) => {
    if (newViewMode !== null) {
      onViewModeChange(newViewMode);
    }
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      {count !== undefined && (
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            minWidth: 'fit-content',
            whiteSpace: 'nowrap',
          }}
        >
          {t(Labels.koperative_results_count, { count })}
        </Typography>
      )}

      <ToggleButtonGroup
        value={viewMode}
        exclusive
        onChange={handleChange}
        aria-label="view mode"
        size="small"
        sx={{
          '& .MuiToggleButton-root': {
            border: '1px solid',
            borderColor: 'divider',
            '&.Mui-selected': {
              bgcolor: 'primary.main',
              color: 'primary.contrastText',
              '&:hover': {
                bgcolor: 'primary.dark',
              },
            },
            '&:hover': {
              bgcolor: 'action.hover',
            },
          },
        }}
      >
        <ToggleButton value="grid" aria-label="grid view">
          <Tooltip title="Vue grille">
            <GridViewIcon fontSize="small" />
          </Tooltip>
        </ToggleButton>
        <ToggleButton value="list" aria-label="list view">
          <Tooltip title="Vue liste">
            <ListIcon fontSize="small" />
          </Tooltip>
        </ToggleButton>
      </ToggleButtonGroup>
    </Box>
  );
};

export default ViewToggle;
