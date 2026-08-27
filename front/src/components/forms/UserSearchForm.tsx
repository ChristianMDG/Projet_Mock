import React, { useEffect, useState } from 'react';
import { Alert, Card, CardContent, IconButton, InputAdornment, TextField, Typography } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useTranslation } from 'react-i18next';
import Labels from '@/labelKeys.json';
import { Voyageur } from '@/models/Voyageur';
import { searchVoyageur } from '@/api/voyageur.api';

interface UserSearchFormProps {
  onUserFound: (user: Voyageur | null) => void;
  onSearchValueChange: (value: string) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

export const UserSearchForm: React.FC<UserSearchFormProps> = ({
  onUserFound,
  onSearchValueChange,
  loading,
  setLoading,
}) => {
  const { t } = useTranslation();
  const [searchValue, setSearchValue] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (showSuccess) {
      const timer = setTimeout(() => setShowSuccess(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [showSuccess]);

  const handleSearch = async () => {
    const idValue = searchValue.trim();
    if (idValue) {
      setLoading(true);
      setErrorMsg(null);
      setShowSuccess(false);

      try {
        const isPhone = /^\d+$/.test(idValue);
        const user = await searchVoyageur(isPhone ? idValue : undefined, isPhone ? undefined : idValue);
        onUserFound(user);
        onSearchValueChange(idValue);
        if (user) setShowSuccess(true);
      } catch (err: unknown) {
        onUserFound(null);
        if (err instanceof Error) {
          setErrorMsg(t(Labels.error_search_failed));
        } else {
          setErrorMsg(t(Labels.error_search_failed));
        }
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="subtitle1" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
          {t(Labels.search_existing_passenger)}
        </Typography>

        <TextField
          fullWidth
          label={t(Labels.phone_or_id_number)}
          value={searchValue}
          onChange={e => setSearchValue(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSearch()}
          placeholder={t(Labels.enter_phone_or_id)}
          margin="dense"
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleSearch} disabled={loading || !searchValue.trim()} color="primary">
                    <SearchIcon />
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
        />

        {showSuccess && (
          <Alert severity="success" sx={{ mt: 2 }}>
            {t(Labels.user_found_success)}
          </Alert>
        )}
        {errorMsg && (
          <Alert
            severity="error"
            sx={{ mt: 2 }}
            onClose={() => {
              setErrorMsg(null);
            }}
          >
            {errorMsg}
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};
