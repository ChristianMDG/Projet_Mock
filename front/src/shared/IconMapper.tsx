import React from 'react';
import AccessTime from '@mui/icons-material/AccessTime';
import AcUnit from '@mui/icons-material/AcUnit';
import AirlineSeatFlat from '@mui/icons-material/AirlineSeatFlat';
import AirlineSeatReclineExtra from '@mui/icons-material/AirlineSeatReclineExtra';
import Build from '@mui/icons-material/Build';
import Business from '@mui/icons-material/Business';
import CalendarMonth from '@mui/icons-material/CalendarMonth';
import Category from '@mui/icons-material/Category';
import CheckCircle from '@mui/icons-material/CheckCircle';
import Checkroom from '@mui/icons-material/Checkroom';
import ContactMail from '@mui/icons-material/ContactMail';
import CreditCard from '@mui/icons-material/CreditCard';
import Deck from '@mui/icons-material/Deck';
import DepartureBoard from '@mui/icons-material/DepartureBoard';
import Description from '@mui/icons-material/Description';
import Devices from '@mui/icons-material/Devices';
import DirectionsCar from '@mui/icons-material/DirectionsCar';
import Edit from '@mui/icons-material/Edit';
import EditCalendar from '@mui/icons-material/EditCalendar';
import Emergency from '@mui/icons-material/Emergency';
import EmojiEvents from '@mui/icons-material/EmojiEvents';
import EnergySavingsLeaf from '@mui/icons-material/EnergySavingsLeaf';
import Event from '@mui/icons-material/Event';
import EventSeat from '@mui/icons-material/EventSeat';
import Favorite from '@mui/icons-material/Favorite';
import FireTruck from '@mui/icons-material/FireTruck';
import Gavel from '@mui/icons-material/Gavel';
import Groups from '@mui/icons-material/Groups';
import Handshake from '@mui/icons-material/Handshake';
import Help from '@mui/icons-material/Help';
import Home from '@mui/icons-material/Home';
import Info from '@mui/icons-material/Info';
import Kitchen from '@mui/icons-material/Kitchen';
import Lightbulb from '@mui/icons-material/Lightbulb';
import LocalAtm from '@mui/icons-material/LocalAtm';
import LocalCafe from '@mui/icons-material/LocalCafe';
import LocalHospital from '@mui/icons-material/LocalHospital';
import LocalOffer from '@mui/icons-material/LocalOffer';
import LocalPolice from '@mui/icons-material/LocalPolice';
import LocationOn from '@mui/icons-material/LocationOn';
import Luggage from '@mui/icons-material/Luggage';
import Map from '@mui/icons-material/Map';
import MedicalServices from '@mui/icons-material/MedicalServices';
import Nature from '@mui/icons-material/Nature';
import Payment from '@mui/icons-material/Payment';
import People from '@mui/icons-material/People';
import PermPhoneMsg from '@mui/icons-material/PermPhoneMsg';
import Person from '@mui/icons-material/Person';
import Phone from '@mui/icons-material/Phone';
import PhoneAndroid from '@mui/icons-material/PhoneAndroid';
import Place from '@mui/icons-material/Place';
import Power from '@mui/icons-material/Power';
import PriorityHigh from '@mui/icons-material/PriorityHigh';
import Route from '@mui/icons-material/Route';
import Schedule from '@mui/icons-material/Schedule';
import Security from '@mui/icons-material/Security';
import Shield from '@mui/icons-material/Shield';
import Spa from '@mui/icons-material/Spa';
import Speed from '@mui/icons-material/Speed';
import Star from '@mui/icons-material/Star';
import Support from '@mui/icons-material/Support';
import SupportAgent from '@mui/icons-material/SupportAgent';
import ThumbUp from '@mui/icons-material/ThumbUp';
import TrendingUp from '@mui/icons-material/TrendingUp';
import TwoWheeler from '@mui/icons-material/TwoWheeler';
import Usb from '@mui/icons-material/Usb';
import Verified from '@mui/icons-material/Verified';
import VerifiedUser from '@mui/icons-material/VerifiedUser';
import Wifi from '@mui/icons-material/Wifi';
import StyledIcon from '@/components/ui/StyledIcon';
import VehicleIcon from '@/components/shared/VehicleIcon';

// Type for icon names that match the CMS enum
export type IconName =
  | 'AccessTime'
  | 'AcUnit'
  | 'AirlineSeatFlat'
  | 'AirlineSeatReclineExtra'
  | 'Build'
  | 'Business'
  | 'CalendarMonth'
  | 'Category'
  | 'CheckCircle'
  | 'Checkroom'
  | 'ContactMail'
  | 'CreditCard'
  | 'Deck'
  | 'DepartureBoard'
  | 'Description'
  | 'Devices'
  | 'DirectionsBus'
  | 'DirectionsCar'
  | 'Eco'
  | 'Edit'
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
  | 'Home'
  | 'Info'
  | 'Kitchen'
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
  | 'Spa'
  | 'Speed'
  | 'Star'
  | 'Support'
  | 'SupportAgent'
  | 'ThumbUp'
  | 'TrendingUp'
  | 'TwoWheeler'
  | 'Usb'
  | 'Verified'
  | 'VerifiedUser'
  | 'Wifi';

// Icon mapping object
export const iconMap: Record<IconName, React.ComponentType<any>> = {
  AccessTime,
  AcUnit,
  AirlineSeatFlat,
  AirlineSeatReclineExtra,
  Build,
  Business,
  CalendarMonth,
  Category,
  CheckCircle,
  Checkroom,
  ContactMail,
  CreditCard,
  Deck,
  DepartureBoard,
  Description,
  Devices,
  DirectionsBus: VehicleIcon,
  DirectionsCar,
  Eco: EnergySavingsLeaf,
  Edit,
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
  Home,
  Info,
  Kitchen,
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
  Spa,
  Speed,
  Star,
  Support,
  SupportAgent,
  ThumbUp,
  TrendingUp,
  TwoWheeler,
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

export default Icon;
