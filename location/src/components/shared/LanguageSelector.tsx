import { useState, useEffect, useCallback } from 'react';
import { Box, IconButton, Menu, MenuItem } from '@mui/material';
import ReactCountryFlag from 'react-country-flag';
import { useLocation, useNavigate, matchPath, generatePath } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getLanguageFromPath, DEFAULT_LANGUAGE, ROUTES } from '@/constants/routes';

const LANGUAGES = [
  { code: 'mg', name: 'Malagasy', countryCode: 'MG' },
  { code: 'fr', name: 'Français', countryCode: 'FR' },
  { code: 'en', name: 'English', countryCode: 'GB' },
] as const;

const LanguageSelector: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { i18n } = useTranslation();

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [mounted, setMounted] = useState(false);

  const currentLang = getLanguageFromPath(location.pathname);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLanguageSelect = useCallback(
    async (lang: string) => {
      setAnchorEl(null);
      await i18n.changeLanguage(lang);

      const matchedRoute = Object.values(ROUTES).find(route =>
        matchPath({ path: route[currentLang], end: true }, location.pathname),
      );

      if (matchedRoute) {
        const match = matchPath({ path: matchedRoute[currentLang], end: true }, location.pathname);
        const newUrl = generatePath(matchedRoute[lang], match?.params);
        navigate(`${newUrl}${location.search}`, { replace: true });
      } else {
        navigate(lang === DEFAULT_LANGUAGE ? '/' : `/${lang}`, { replace: true });
      }
    },
    [currentLang, location.pathname, location.search, i18n, navigate],
  );

  return (
    <Box>
      <IconButton
        onClick={e => setAnchorEl(e.currentTarget)}
        size="large"
        sx={{
          width: 48,
          height: 48,
          fontSize: '1.1rem',
          fontWeight: 600,
          color: 'inherit',
        }}
      >
        {mounted ? currentLang.toUpperCase() : DEFAULT_LANGUAGE.toUpperCase()}
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        transformOrigin={{ horizontal: 'center', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'center', vertical: 'bottom' }}
      >
        {LANGUAGES.map(lang => (
          <MenuItem
            key={lang.code}
            onClick={() => handleLanguageSelect(lang.code)}
            selected={lang.code === currentLang}
            sx={{ gap: 1 }}
          >
            <ReactCountryFlag countryCode={lang.countryCode} svg style={{ width: 20, height: 20 }} />
            {lang.name}
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
};

export default LanguageSelector;
