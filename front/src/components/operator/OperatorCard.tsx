import React from 'react';
import { Avatar, Box, Card, CardActionArea, CardContent, Chip, Typography } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import { UserOperator } from '@/types';
import Labels from '@/labelKeys.json';
import StyledIcon from '@/components/ui/StyledIcon';
import { useAuth } from '@/context/AuthContext';
import { AuthorityEnum } from '@/models/enums';

interface OperatorCardProps {
  operator: UserOperator;
  t: (key: string) => string;
  onEdit: (operator: UserOperator) => void;
}

interface ContactItemProps {
  icon: React.ReactNode;
  text: string;
}

const ContactItem: React.FC<ContactItemProps> = ({ icon, text }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
    {icon}
    <Typography
      variant="body2"
      color="text.secondary"
      sx={{
        overflow: 'hidden',
        textOverflow: 'ellipsis',
      }}
    >
      {text}
    </Typography>
  </Box>
);

const OperatorCard: React.FC<OperatorCardProps> = ({ operator, t, onEdit }) => {
  const { user } = useAuth();
  const isAdminOrOperator = user?.admin ?? user?.authorities?.some(a => a.name === AuthorityEnum.OPERATOR);

  const displayName =
    `${operator.firstName ?? ''} ${operator.lastName ?? ''}`.trim() ?? operator.email ?? operator.phone ?? 'Operator';

  const villeNames = React.useMemo(() => {
    if (!operator.guichets?.length) return [];

    return operator.guichets
      .map(guichet => guichet.gare?.ville?.name)
      .filter(Boolean)
      .filter((ville, index, array) => array.indexOf(ville) === index);
  }, [operator.guichets]);

  return (
    <Card
      variant="outlined"
      sx={{
        height: '100%',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: 2,
        },
      }}
    >
      <CardActionArea onClick={() => onEdit(operator)} sx={{ height: '100%' }}>
        <CardContent sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Avatar
              src={operator.photo?.url}
              alt={displayName}
              sx={{ width: 52, height: 52, mr: 2, bgcolor: 'primary.main' }}
            >
              <StyledIcon icon={PersonIcon} />
            </Avatar>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5 }}>
                {displayName}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
            {operator.email && (
              <ContactItem icon={<EmailIcon fontSize="small" color="action" />} text={operator.email} />
            )}

            {operator.phone && isAdminOrOperator && (
              <ContactItem icon={<PhoneIcon fontSize="small" color="action" />} text={operator.phone} />
            )}

            {villeNames.length > 0 && (
              <ContactItem icon={<LocationCityIcon fontSize="small" color="action" />} text={villeNames.join(', ')} />
            )}
          </Box>
          {operator.guichets && operator.guichets.length > 0 && (
            <Box
              sx={{
                mt: 2,
                pt: 2,
                borderTop: 2,
                borderColor: 'divider',
                display: 'flex',
                justifyContent: 'space-between',
              }}
            >
              <Typography variant="caption" color="text.secondary">
                {operator.guichets.length} {t(Labels.ui_useroperator_guichets)}
              </Typography>
              <Chip
                label={operator.isActive ? t(Labels.ui_status_active) : t(Labels.ui_status_inactive)}
                size="small"
                color={operator.isActive ? 'success' : 'default'}
                sx={{ fontSize: '0.75rem' }}
              />
            </Box>
          )}
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default OperatorCard;
