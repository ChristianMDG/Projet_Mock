import React from 'react';
import { type SvgIconProps } from '@mui/material';

// Import explicitly to avoid bundling the entire @mui/icons-material package
import DirectionsCar from '@mui/icons-material/DirectionsCar';
import CheckCircle from '@mui/icons-material/CheckCircle';
import Security from '@mui/icons-material/Security';
import Star from '@mui/icons-material/Star';
import LocalShipping from '@mui/icons-material/LocalShipping';
import Assignment from '@mui/icons-material/Assignment';
import WarningAmber from '@mui/icons-material/WarningAmber';
import CheckCircleOutlined from '@mui/icons-material/CheckCircleOutlined';
import Info from '@mui/icons-material/Info';
import Build from '@mui/icons-material/Build';
import Settings from '@mui/icons-material/Settings';
import Event from '@mui/icons-material/Event';
import AccountCircle from '@mui/icons-material/AccountCircle';
import LocalOffer from '@mui/icons-material/LocalOffer';
import Storefront from '@mui/icons-material/Storefront';
import Payment from '@mui/icons-material/Payment';
import Handshake from '@mui/icons-material/Handshake';
import CarRental from '@mui/icons-material/CarRental';
import AttachMoney from '@mui/icons-material/AttachMoney';
import People from '@mui/icons-material/People';
import Phone from '@mui/icons-material/Phone';
import Email from '@mui/icons-material/Email';
import LocationOn from '@mui/icons-material/LocationOn';
import Search from '@mui/icons-material/Search';

const IconRegistry: Record<string, React.ElementType> = {
  DirectionsCar,
  CheckCircle,
  Security,
  Star,
  LocalShipping,
  Assignment,
  WarningAmber,
  CheckCircleOutlined,
  Info,
  Build,
  Settings,
  Event,
  AccountCircle,
  LocalOffer,
  Storefront,
  Payment,
  Handshake,
  CarRental,
  AttachMoney,
  People,
  Phone,
  Email,
  LocationOn,
  Search,
};

export type KnownIconName = keyof typeof IconRegistry;

export interface DynamicIconProps extends SvgIconProps {
  name?: string;
  fallback?: KnownIconName;
}

export const DynamicIcon: React.FC<DynamicIconProps> = ({ name, fallback = 'CheckCircle', ...props }) => {
  if (name && name in IconRegistry) {
    const Icon = IconRegistry[name];
    return <Icon {...props} />;
  }

  const FallbackIcon = IconRegistry[fallback] || IconRegistry['CheckCircle'];
  return <FallbackIcon {...props} />;
};
