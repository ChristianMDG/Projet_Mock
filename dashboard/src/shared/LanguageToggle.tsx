import { useTranslation } from 'react-i18next';
import { IconButton, Menu, MenuItem, Typography, Box } from '@mui/material';
import { Language } from '@mui/icons-material';
import { useState } from 'react';

const languages = [
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'mg', label: 'Malagasy', flag: '🇲🇬' },
];

export default function LanguageToggle() {
  const { i18n } = useTranslation();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleSelect = (code: string) => {
    i18n.changeLanguage(code);
    localStorage.setItem('dashboard-lang', code);
    setAnchorEl(null);
  };

  const currentLang = languages.find((l) => l.code === i18n.language) ?? languages[0];

  return (
    <>
      <IconButton
        onClick={handleClick}
        size="small"
        sx={{
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 2,
          px: 1.5,
          gap: 0.5,
        }}
      >
        <Language sx={{ fontSize: '1.1rem' }} />
        <Typography variant="caption" sx={{ fontWeight: 600, fontSize: '0.7rem' }}>
          {currentLang.flag} {currentLang.code.toUpperCase()}
        </Typography>
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        slotProps={{ paper: { sx: { minWidth: 140, borderRadius: 2 } } }}
      >
        {languages.map((lang) => (
          <MenuItem key={lang.code} selected={i18n.language === lang.code} onClick={() => handleSelect(lang.code)}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="body2">{lang.flag}</Typography>
              <Typography variant="body2" sx={{ fontWeight: i18n.language === lang.code ? 600 : 400 }}>
                {lang.label}
              </Typography>
            </Box>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}
