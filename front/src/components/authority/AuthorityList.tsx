import React from 'react';
import { Box, CircularProgress, IconButton, List, ListItem, ListItemText, Typography } from '@mui/material';
import Delete from '@mui/icons-material/Delete';
import { useTranslation } from 'react-i18next';
import Labels from '@/labelKeys.json';
import { useAuthorities, useDeleteAuthority } from '@/hooks/authority.hooks';
import { Authority } from '@/models/Authority';

const AuthorityList: React.FC = () => {
  const { t } = useTranslation();
  const { data, isLoading, isError } = useAuthorities();
  const deleteMutation = useDeleteAuthority();

  const authorities: Authority[] = data ?? [];
  const isReady = !isLoading;
  const hasItems = authorities.length > 0;
  const showLoading = isLoading;
  const showError = isReady && isError;
  const showEmpty = isReady && !isError && !hasItems;
  const showList = isReady && !isError && hasItems;

  const handleDelete = (id?: number) => {
    if (typeof id === 'number') {
      deleteMutation.mutate(id);
    }
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        {t(Labels.authority_list_title)}
      </Typography>
      {showLoading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
          <CircularProgress />
        </Box>
      )}
      {showError && <Typography color="error">{t(Labels.authority_list_error)}</Typography>}
      {showEmpty && <Typography color="text.secondary">{t(Labels.authority_list_empty)}</Typography>}
      {showList && (
        <List>
          {authorities.map(authority => (
            <ListItem
              key={authority.id}
              secondaryAction={
                <IconButton
                  edge="end"
                  onClick={() => handleDelete(authority.id)}
                  disabled={deleteMutation.isPending}
                  aria-label={t(Labels.authority_delete_button)}
                >
                  <Delete />
                </IconButton>
              }
            >
              <ListItemText primary={authority.name} secondary={`#${authority.id ?? ''}`} />
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
};

export default AuthorityList;
