import React, { useEffect, useState, useMemo } from 'react';
import { Box, Fade, IconButton, Stack, Tooltip, Typography, alpha, useColorScheme, useMediaQuery } from '@mui/material';
import { keyframes } from '@mui/system';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import EastIcon from '@mui/icons-material/East';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ROUTES } from '@/constants';
import LanguageSelector from '@/components/shared/LanguageSelector';
import { useTopKoperatives } from '@/hooks/koperative.hooks';
import { customStorage } from '@/utils/customStorage';
import Labels from '@/labelKeys.json';
import SEO from '@/components/shared/SEO';

import taxibrousseLogo from '@/assets/taxibrousse.png';
import taxibrousseDark from '@/assets/taxibrousse-dark.svg';
import taxibrousseLight from '@/assets/taxibrousse-light.svg';

const float = keyframes`
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-24px) rotate(4deg); }
`;

const slideUp = keyframes`
  from { opacity: 0; transform: translateY(16px); }
  to { opacity: 1; transform: translateY(0); }
`;

const slideUpSx = {
  position: 'relative',
  width: '100%',
  animation: `${slideUp} 0.6s ease-out`,
} as const;

const featureItemSx = {
  color: 'text.primary',
  opacity: 0.85,
  lineHeight: 1.6,
  '&::marker': { color: 'primary.main' },
} as const;

const muted = { color: 'text.primary', opacity: 0.85 } as const;

interface AuthLayoutProps {
  children: React.ReactNode;
  seoTitle: string;
  title?: string;
  subtitle?: string;
  renderHeader?: () => React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children, seoTitle, title, subtitle, renderHeader }) => {
  const { t, i18n } = useTranslation();
  const { data: topKoperatives = [] } = useTopKoperatives({ top: 8 });

  const { mode: colorMode, setMode: setColorMode } = useColorScheme();
  const [mounted, setMounted] = useState(false);
  const prefersDark = useMediaQuery('(prefers-color-scheme: dark)', {
    defaultMatches: false,
    noSsr: true,
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  const effectiveMode: 'light' | 'dark' =
    mounted && (colorMode === 'dark' || (colorMode === 'system' && prefersDark)) ? 'dark' : 'light';
  const wordmark = effectiveMode === 'dark' ? taxibrousseDark : taxibrousseLight;

  const handleToggleTheme = () => {
    const next = effectiveMode === 'dark' ? 'light' : 'dark';
    setColorMode(next);
    customStorage.setItem('X-Theme-App', next);
    document.cookie = `mui-mode=${next}; path=/; max-age=31536000`;
  };

  const features = useMemo(
    () => [
      t(Labels.auth_branding_feature_routes),
      t(Labels.auth_branding_feature_booking),
      t(Labels.auth_branding_feature_secure),
      t(Labels.auth_branding_feature_support),
    ],
    [t],
  );

  const showPartners = topKoperatives.length > 0;
  const showCustomHeader = Boolean(renderHeader);
  const showDefaultHeader = !showCustomHeader && Boolean(title);

  return (
    <Box
      sx={theme => ({
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        background: {
          xs: `linear-gradient(135deg, ${alpha(theme.palette.secondary.light, 0.3)} 0%, ${alpha(theme.palette.background.paper, 1)} 40%, ${alpha(theme.palette.primary.light, 0.2)} 100%)`,
          md: theme.palette.background.paper,
        },
      })}
    >
      <SEO title={seoTitle} />

      {/* Top right controls */}
      <Stack
        direction="row"
        sx={{
          position: 'absolute',
          top: 16,
          right: 16,
          zIndex: 10,
          alignItems: 'center',
          gap: 3,
        }}
      >
        <LanguageSelector />
        <Tooltip title={effectiveMode === 'dark' ? 'Light mode' : 'Dark mode'}>
          <IconButton
            onClick={handleToggleTheme}
            aria-label="Toggle theme"
            sx={theme => ({
              bgcolor: alpha(theme.palette.background.paper, 0.6),
              backdropFilter: 'blur(8px)',
              border: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
              color: 'text.primary',
              transition: theme.transitions.create('all'),
              '&:hover': {
                bgcolor: alpha(theme.palette.background.paper, 0.9),
                transform: 'scale(1.05)',
              },
            })}
          >
            {effectiveMode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
        </Tooltip>
      </Stack>

      {/* Left branding panel */}
      <Box
        sx={theme => ({
          position: 'relative',
          flex: { xs: 'none', md: 1 },
          display: { xs: 'none', md: 'flex' },
          alignItems: 'center',
          justifyContent: 'flex-end',
          overflow: 'hidden',
          px: { md: 6, lg: 10 },
          py: { md: 8 },
          background: `linear-gradient(135deg, ${alpha(theme.palette.secondary.light, 0.35)} 0%, ${alpha(
            theme.palette.primary.light,
            0.25,
          )} 50%, ${alpha(theme.palette.primary.main, 0.18)} 100%)`,
        })}
      >
        <Box
          aria-hidden
          sx={theme => ({
            position: 'absolute',
            top: '-12%',
            left: '-8%',
            width: 320,
            height: 320,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${alpha(theme.palette.secondary.main, 0.35)} 0%, transparent 70%)`,
            animation: `${float} 16s ease-in-out infinite`,
            pointerEvents: 'none',
          })}
        />
        <Box
          aria-hidden
          sx={theme => ({
            position: 'absolute',
            bottom: '-15%',
            right: '5%',
            width: 380,
            height: 380,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${alpha(theme.palette.primary.main, 0.25)} 0%, transparent 70%)`,
            animation: `${float} 20s ease-in-out infinite reverse`,
            pointerEvents: 'none',
          })}
        />

        <Fade in timeout={600}>
          <Box sx={{ ...slideUpSx, maxWidth: 520 }}>
            <Stack direction="row" spacing={2} sx={{ alignItems: 'center', mb: 4 }}>
              <Box
                component="img"
                src={taxibrousseLogo}
                alt="Taxibrousse"
                sx={theme => ({
                  height: 96,
                  width: 96,
                  borderRadius: 3,
                  boxShadow: theme.shadows[4],
                })}
              />
              <Box component="img" src={wordmark} alt="Taxibrousse" sx={{ height: 44, opacity: 0.95 }} />
            </Stack>
            <Typography
              variant="h2"
              sx={{
                fontWeight: 700,
                color: 'primary.main',
                mb: 2,
                lineHeight: 1.2,
              }}
            >
              {t(Labels.auth_branding_title)}
            </Typography>
            <Typography variant="body1" sx={{ ...muted, mb: 3 }}>
              {t(Labels.auth_branding_subtitle)}
            </Typography>
            <Stack component="ul" spacing={1.5} sx={{ pl: 2.5, m: 0 }}>
              {features.map(feature => (
                <Typography component="li" key={feature} variant="body2" sx={featureItemSx}>
                  {feature}
                </Typography>
              ))}
            </Stack>

            {showPartners && (
              <Box sx={{ mt: 4 }}>
                <Typography
                  variant="caption"
                  sx={{
                    color: 'text.secondary',
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    fontWeight: 600,
                    display: 'block',
                    mb: 2,
                  }}
                >
                  {t(Labels.auth_branding_partners)}
                </Typography>
                <Box
                  sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 1.5,
                  }}
                >
                  {topKoperatives.map(k => (
                    <Box
                      key={k.id}
                      title={k.name}
                      sx={theme => ({
                        width: 52,
                        height: 52,
                        borderRadius: 2,
                        overflow: 'hidden',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        bgcolor: 'background.paper',
                        boxShadow: theme.shadows[2],
                        border: `1px solid ${alpha(theme.palette.divider, 0.4)}`,
                        transition: theme.transitions.create(['transform', 'boxShadow']),
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: theme.shadows[4],
                        },
                      })}
                    >
                      {k.logoUrl ? (
                        <Box
                          component="img"
                          src={k.logoUrl}
                          alt={k.name}
                          sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      ) : (
                        <Typography
                          variant="body1"
                          sx={{
                            fontWeight: 700,
                            color: 'primary.main',
                            userSelect: 'none',
                          }}
                        >
                          {k.name?.charAt(0).toUpperCase()}
                        </Typography>
                      )}
                    </Box>
                  ))}
                </Box>
                <Box
                  component={Link}
                  to={ROUTES.koperativesList[i18n.language as keyof typeof ROUTES.koperativesList] ?? '/koperativa'}
                  sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 0.5,
                    mt: 2,
                    fontWeight: 600,
                    color: 'primary.main',
                    textDecoration: 'none',
                    opacity: 0.8,
                    transition: 'opacity 0.2s ease, gap 0.2s ease',
                    '&:hover': {
                      opacity: 1,
                      gap: 1,
                      textDecoration: 'underline',
                    },
                  }}
                >
                  {t(Labels.auth_branding_see_koperatives)}
                  <EastIcon sx={{ fontSize: '0.9rem' }} />
                </Box>
              </Box>
            )}
          </Box>
        </Fade>
      </Box>

      {/* Right form panel */}
      <Box
        sx={{
          position: 'relative',
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          px: { xs: 2, sm: 4, md: 6, lg: 10 },
          py: { xs: 4, md: 8 },
          minHeight: { xs: '100vh', md: 'auto' },
          overflow: 'hidden',
        }}
      >
        {/* Mobile background blobs */}
        <Box
          aria-hidden
          sx={theme => ({
            display: { xs: 'block', md: 'none' },
            position: 'absolute',
            top: '-10%',
            right: '-15%',
            width: 280,
            height: 280,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${alpha(theme.palette.secondary.main, 0.28)} 0%, transparent 70%)`,
            animation: `${float} 14s ease-in-out infinite`,
            pointerEvents: 'none',
            filter: 'blur(2px)',
          })}
        />
        <Box
          aria-hidden
          sx={theme => ({
            display: { xs: 'block', md: 'none' },
            position: 'absolute',
            bottom: '-12%',
            left: '-10%',
            width: 320,
            height: 320,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${alpha(theme.palette.primary.main, 0.2)} 0%, transparent 70%)`,
            animation: `${float} 18s ease-in-out infinite reverse`,
            pointerEvents: 'none',
            filter: 'blur(2px)',
          })}
        />

        <Fade in timeout={500}>
          <Box sx={{ ...slideUpSx, width: '100%', maxWidth: 380, display: 'flex', flexDirection: 'column' }}>
            {/* Mobile logo */}
            <Box
              component="a"
              href="/"
              sx={{
                display: { xs: 'flex', md: 'none' },
                flexDirection: 'column',
                alignItems: 'center',
                gap: 1.5,
                mb: 4,
              }}
            >
              <Box
                component="img"
                src={taxibrousseLogo}
                alt="Taxibrousse"
                sx={theme => ({
                  height: 80,
                  width: 80,
                  borderRadius: 3,
                  boxShadow: theme.shadows[3],
                })}
              />
              <Box component="img" src={wordmark} alt="Taxibrousse" sx={{ height: 32, opacity: 0.95 }} />
            </Box>

            {/* Header */}
            {showCustomHeader && renderHeader!()}

            {showDefaultHeader && (
              <Box
                sx={{
                  textAlign: { xs: 'center', md: 'left' },
                  mb: 4,
                }}
              >
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 700,
                    color: 'text.primary',
                    mb: 1.5,
                    letterSpacing: '-0.02em',
                  }}
                >
                  {title}
                </Typography>
                {subtitle && (
                  <Typography variant="body2" color="text.secondary">
                    {subtitle}
                  </Typography>
                )}
              </Box>
            )}

            {children}
          </Box>
        </Fade>
      </Box>
    </Box>
  );
};

export default AuthLayout;
