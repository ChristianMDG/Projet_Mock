import React from 'react';
import {
  AccessTime,
  AcUnit,
  AirlineSeatFlat,
  AirlineSeatReclineExtra,
  Build,
  Business,
  CalendarMonth,
  CheckCircle,
  ContactMail,
  CreditCard,
  Deck,
  DepartureBoard,
  Description,
  DirectionsCar,
  EditCalendar,
  Emergency,
  EmojiEvents,
  EnergySavingsLeaf,
  Event,
  EventSeat,
  Favorite,
  FireTruck,
  Gavel,
  Groups,
  Handshake,
  Help,
  Info,
  Lightbulb,
  LocalAtm,
  LocalCafe,
  LocalHospital,
  LocalOffer,
  LocalPolice,
  LocationOn,
  Luggage,
  Map,
  MedicalServices,
  Nature,
  Payment,
  People,
  PermPhoneMsg,
  Person,
  Phone,
  PhoneAndroid,
  Place,
  Power,
  PriorityHigh,
  Route,
  Schedule,
  Security,
  Shield,
  Speed,
  Star,
  Support,
  SupportAgent,
  ThumbUp,
  TrendingUp,
  Usb,
  Verified,
  VerifiedUser,
  Wifi,
} from '@mui/icons-material';
import { StyledIcon } from '@/components';
import { VehicleIcon } from '@/components/shared';

// Type for icon names that match the CMS enum
export type IconName =
  | 'AccessTime'
  | 'AcUnit'
  | 'AirlineSeatFlat'
  | 'AirlineSeatReclineExtra'
  | 'Build'
  | 'Business'
  | 'CalendarMonth'
  | 'CheckCircle'
  | 'ContactMail'
  | 'CreditCard'
  | 'Deck'
  | 'DepartureBoard'
  | 'Description'
  | 'DirectionsBus'
  | 'DirectionsCar'
  | 'Eco'
  | 'EditCalendar'
  | 'Emergency'
  | 'EmojiEvents'
  | 'Event'
  | 'EventSeat'
  | 'Favorite'
  | 'FireTruck'
  | 'Gavel'
  | 'Groups'
  | 'Handshake'
  | 'Help'
  | 'Info'
  | 'Lightbulb'
  | 'LocalAtm'
  | 'LocalCafe'
  | 'LocalHospital'
  | 'LocalOffer'
  | 'LocalPolice'
  | 'LocationOn'
  | 'Luggage'
  | 'Map'
  | 'MedicalServices'
  | 'Nature'
  | 'Payment'
  | 'People'
  | 'PermPhoneMsg'
  | 'Person'
  | 'Phone'
  | 'PhoneAndroid'
  | 'Place'
  | 'Power'
  | 'PriorityHigh'
  | 'Route'
  | 'Schedule'
  | 'Security'
  | 'Shield'
  | 'Speed'
  | 'Star'
  | 'Support'
  | 'SupportAgent'
  | 'ThumbUp'
  | 'TrendingUp'
  | 'Usb'
  | 'Verified'
  | 'VerifiedUser'
  | 'Wifi';

// Icon mapping object
const iconMap: Record<IconName, React.ComponentType<any>> = {
  AccessTime,
  AcUnit,
  AirlineSeatFlat,
  AirlineSeatReclineExtra,
  Build,
  Business,
  CalendarMonth,
  CheckCircle,
  ContactMail,
  CreditCard,
  Deck,
  DepartureBoard,
  Description,
  DirectionsBus: VehicleIcon,
  DirectionsCar,
  Eco: EnergySavingsLeaf,
  EditCalendar,
  Emergency,
  EmojiEvents,
  Event,
  EventSeat,
  Favorite,
  FireTruck,
  Gavel,
  Groups,
  Handshake,
  Help,
  Info,
  Lightbulb,
  LocalAtm,
  LocalCafe,
  LocalHospital,
  LocalOffer,
  LocalPolice,
  LocationOn,
  Luggage,
  Map,
  MedicalServices,
  Nature,
  Payment,
  People,
  PermPhoneMsg,
  Person,
  Phone,
  PhoneAndroid,
  Place,
  Power,
  PriorityHigh,
  Route,
  Schedule,
  Security,
  Shield,
  Speed,
  Star,
  Support,
  SupportAgent,
  ThumbUp,
  TrendingUp,
  Usb,
  Verified,
  VerifiedUser,
  Wifi,
};

/**
 * Icon component that renders an icon from icon name string
 */
interface IconProps {
  iconName: string | null | undefined;
  [key: string]: unknown;
}

export const Icon: React.FC<IconProps> = React.memo(({ iconName, ...props }) => {
  if (iconName && iconMap[iconName as IconName]) {
    const IconComponent = iconMap[iconName as IconName];
    return <StyledIcon icon={IconComponent} {...props} />;
  }

  return <></>;
});
