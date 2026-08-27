// ============================================================================
// ENUMS
// ============================================================================

// Authority Enum
export enum AuthorityEnum {
  USER = 'USER',
  ADMIN = 'ADMIN',
  GUICHET = 'GUICHET',
  KOPERATIVE = 'KOPERATIVE',
  CHAUFFEUR = 'CHAUFFEUR',
  OPERATEUR = 'OPERATEUR',
}

// Contract Status Enum
export enum ContratStatusEnum {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  EXPIRED = 'EXPIRED',
  TERMINATED = 'TERMINATED',
  RENEWED = 'RENEWED',
}

// Payment Status Enum
export enum PaymentStatusEnum {
  PENDING = 'PENDING',
  PAID = 'PAID',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
  PARTIALLY_PAID = 'PARTIALLY_PAID',
}

// CIN Type Enum
export enum CinTypeEnum {
  NATIONAL_ID = 'NATIONAL_ID',
  PASSPORT = 'PASSPORT',
  DRIVING_LICENSE = 'DRIVING_LICENSE',
  OTHER = 'OTHER',
}

// Koperative Status Enum
export enum KoperativeStatusEnum {
  ACTIVE = 'ACTIVE',
  CONFIRMED = 'CONFIRMED',
  INACTIVE = 'INACTIVE',
  SUSPENDED = 'SUSPENDED',
}

// Contract Type Enum
export enum ContratTypeEnum {
  PARTNERSHIP = 'PARTNERSHIP',
  EMPLOYMENT = 'EMPLOYMENT',
  SERVICE_AGREEMENT = 'SERVICE_AGREEMENT',
  RENTAL = 'RENTAL',
  OTHER = 'OTHER',
}

// Partenaire Type Enum
export enum PartenaireTypeEnum {
  HOTEL = 'HOTEL',
  MAINTENANCE_PROVIDER = 'MAINTENANCE_PROVIDER',
  MARKETING_AGENCY = 'MARKETING_AGENCY',
  INSURANCE_PROVIDER = 'INSURANCE_PROVIDER',
  FUEL_STATION = 'FUEL_STATION',
  OTHER = 'OTHER',
}

// Voyage Status Enum
export enum VoyageStatusEnum {
  SCHEDULED = 'SCHEDULED',
  ONGOING = 'ONGOING',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  DELAYED = 'DELAYED',
}

// Recurrence Type Enum
export enum RecurrenceTypeEnum {
  ONE_OFF = 'ONE_OFF',
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY',
  CUSTOM = 'CUSTOM',
}

// Reservation Status Enum
export enum ReservationStatusEnum {
  PENDING_PAYMENT = 'PENDING_PAYMENT',
  CONFIRMED = 'CONFIRMED',
  CANCELLED_BY_USER = 'CANCELLED_BY_USER',
  CANCELLED_BY_OPERATOR = 'CANCELLED_BY_OPERATOR',
  COMPLETED = 'COMPLETED',
  NO_SHOW = 'NO_SHOW',
}

// Seat Status Enum
export enum SeatStatusEnum {
  AVAILABLE = 'AVAILABLE',
  RESERVED = 'RESERVED',
  BLOCKED = 'BLOCKED',
  DAMAGED = 'DAMAGED',
}

// Payment Transaction Status Enum
export enum PaymentTransactionStatusEnum {
  INITIATED = 'INITIATED',
  PENDING_OTP = 'PENDING_OTP',
  OTP_VERIFIED = 'OTP_VERIFIED',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  TIMEOUT = 'TIMEOUT',
  CANCELLED = 'CANCELLED',
}

// Payment Method Enum
export enum PaymentMethodEnum {
  CASH = 'CASH',
  MOBILE_MONEY = 'MOBILE_MONEY',
  BANK_TRANSFER = 'BANK_TRANSFER',
  CREDIT_CARD = 'CREDIT_CARD',
  ONLINE_PAYMENT = 'ONLINE_PAYMENT',
}

// Mobile Money Operator Enum
export enum MobileMoneyOperatorEnum {
  ORANGE = 'ORANGE',
  MVOLA = 'MVOLA',
  AIRTEL = 'AIRTEL',
}

// Message Type Enum
export enum MessageType {
  TEXT = 'TEXT',
  IMAGE = 'IMAGE',
  LOCATION = 'LOCATION',
  SYSTEM = 'SYSTEM',
  FILE = 'FILE',
}

// Chat Room Type Enum
export enum ChatRoomType {
  CUSTOMER_SUPPORT = 'CUSTOMER_SUPPORT',
  VOYAGE_CHAT = 'VOYAGE_CHAT',
  GENERAL_INQUIRY = 'GENERAL_INQUIRY',
}

// ============================================================================
// BASE INTERFACES
// ============================================================================

export interface Base {
  id?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Authority {
  id?: number;
  name: string;
}

export interface UserAccount extends Base {
  username: string;
  password?: string;
  isAdmin?: boolean;
  authorities?: Authority[];
}

// ============================================================================
// CLOUDINARY
// ============================================================================

export interface Cloudinary extends Base {
  publicId: string;
  url: string;
  format?: string;
  resourceType?: string;
  bytes?: number;
  width?: number;
  height?: number;
  userinfo?: UserOperator;
  gares?: Gare[];
}

// ============================================================================
// USER MODELS
// ============================================================================

export interface UserInfo extends UserAccount {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone: string;
  address?: string;
  idNumber?: string;
  idType?: string;
  isActive?: boolean;
  photo?: Cloudinary;
  uploads?: Cloudinary[];
}

export interface UserOperator extends UserInfo {
  koperative?: Koperative;
  guichets?: Guichet[];
  withKoperative?: boolean;
  departureGare?: Gare;
  assignedKoperatives?: Koperative[];
}

export interface Voyageur extends UserOperator {
  reservations?: Reservation[];
}

// ============================================================================
// LOCATION MODELS
// ============================================================================

export interface Ville extends Base {
  name?: string;
  region?: string;
  province?: string;
  code?: string;
  isActive?: boolean;
  rn?: string;
  fokotanies?: Fokotany[];
  frequence?: number;
}

export interface Fokotany extends Base {
  ville: Ville;
  commune: string;
  fokontany: string;
}

export interface Gare extends Base {
  name: string;
  address?: string;
  ville: Ville;
  description?: string;
  photo?: Cloudinary;
  isClosed: boolean;
  guichets?: Guichet[];
  photos?: Cloudinary[];
  frequence?: number;
}

// ============================================================================
// KOPERATIVE & GUICHET
// ============================================================================

export interface Koperative extends Base {
  name?: string;
  description?: string;
  address?: string;
  phone?: string;
  email?: string;
  registrationNumber?: string;
  taxId?: string;
  website?: string;
  logoUrl?: string;
  routes?: string[];
  status?: KoperativeStatusEnum;
  proprietaire?: UserOperator;
  guichets?: Guichet[];
  crafters?: Crafter[];
  villes?: Ville[];
}

export interface Guichet extends Base {
  name: string;
  gare?: Gare;
  koperative: Koperative;
  operateurs?: UserOperator[];
  phones?: string;
  smsPhone?: string;
  isActive: boolean;
  paymentAutomatique?: boolean;
  openingHours?: string;
  photo?: Cloudinary;
  destinations?: Gare[];
}

// ============================================================================
// VEHICLE MODELS
// ============================================================================

export interface Crafter extends Base {
  registrationNumber: string;
  model?: string;
  kilometrage?: number;
  seatCapacity: number;
  koperative?: Koperative;
  chauffeur?: Chauffeur;
  isActive: boolean;
  configName?: string;
  seatConfig?: string;
  dateVisite?: string;
  photo?: Cloudinary;
}

export interface Moto extends Base {
  registrationNumber: string;
  model?: string;
  yearManufactured?: number;
  chauffeur?: Chauffeur;
  isActive: boolean;
  lastMaintenance?: string;
  photo?: Cloudinary;
}

// ============================================================================
// CHAUFFEUR
// ============================================================================

export interface Chauffeur extends Base {
  user?: UserOperator;
  licenseNumber: string;
  licenseAuthority?: string;
  licenseExpiry?: string;
  experienceYears?: number;
  rating?: number;
  isAvailable: boolean;
  photo?: Cloudinary;
  craftersAssigned?: Crafter[];
  motos?: Moto[];
  contrats?: Contrat[];
  koperativeId?: number;
}

// ============================================================================
// ROUTE & VOYAGE
// ============================================================================

export interface Route extends Base {
  name: string;
  departureGare?: Gare;
  arrivalGare?: Gare;
  estimatedDurationHours?: number;
  distanceKm?: number;
  fraisTaxibrousse?: number;
  fraisKoperative?: number;
  description?: string;
  frequence?: number;
  isActive: boolean;
  routeStops?: RouteStop[];
  voyages?: Voyage[];
}

export interface RouteStop extends Base {
  route: Route;
  ville: Ville;
  gare?: Gare;
  stopOrder: number;
  estimatedArrival?: string;
  estimatedDeparture?: string;
  isMandatory: boolean;
}

export interface Voyage extends Base {
  koperative?: Koperative;
  route?: Route;
  departureGare?: Gare;
  arrivalGare?: Gare;
  crafter?: Crafter;
  chauffeur?: Chauffeur;
  departureTime: string;
  estimatedArrivalTime?: string;
  actualArrivalTime?: string;
  availableSeats?: number;
  pricePerSeat: number;
  status?: VoyageStatusEnum;
  description?: string;
  recurrenceType?: RecurrenceTypeEnum;
  customInterval?: number;
  weekdays?: string;
  monthlyDates?: string;
  recurrenceStartDate?: string;
  recurrenceEndDate?: string;
  isTemplate?: boolean;
  parentTemplate?: Voyage;
  generatedInstances?: Voyage[];
}

// ============================================================================
// RESERVATION & SEAT
// ============================================================================

export interface Classe extends Base {
  name: string;
  description?: string;
  koperativeId?: number;
  icon?: Cloudinary;
  reservations?: Reservation[];
}

export interface Seat extends Base {
  voyage?: Voyage;
  crafter?: Crafter;
  reservation?: Reservation;
  seatNum: string;
  seatStatus: SeatStatusEnum;
  position: string;
  notes?: string;
  mine?: boolean;
}

export interface Reservation extends Base {
  voyage: Voyage;
  voyageur: Voyageur;
  classe?: Classe;
  seats?: Seat[];
  seatCount?: number;
  bookingReference: string;
  status: ReservationStatusEnum;
  bookingDate: string;
  totalAmount: number;
  notes?: string;
  facturation?: Facturation;
}

// ============================================================================
// PAYMENT & FACTURATION
// ============================================================================

export interface Facturation extends Base {
  reservation: Reservation;
  invoiceNumber: string;
  amount: number;
  taxAmount?: number;
  totalAmount: number;
  remainingAmount?: number;
  paymentMethodIdentifier?: string;
  paymentReference?: string;
  paymentStatus: PaymentStatusEnum;
  paymentDate?: string;
  dueDate?: string;
  advanceAmount?: number;
  commission?: number;
  commissionSeats?: number;
  commissionFee?: number;
  fraisTransaction?: number;
  fraisRetrait?: number;
  fraisTransfert?: number;
  fraisTotal?: number;
}

export interface Commission extends Base {
  minAmount: number;
  maxAmount: number;
  frais: number;
  koperativeId?: number;
}

export interface PaymentTransaction extends Base {
  facturationId: number;
  transactionReference: string;
  operatorName: string;
  amount: number;
  status: PaymentTransactionStatusEnum;
  phoneNumber?: string;
  serverCorrelationId?: string;
  operatorResponse?: string;
  initiatedAt?: string;
  completedAt?: string;
  otpAttempts?: number;
  fraisRetrait?: number;
  fraisTransfert?: number;
  fraisTotal?: number;
  fraisTransaction?: number;
  commissionSeats?: number;
  commissionFee?: number;
}

export interface PaymentRequest {
  reservationId: number;
  amount: number;
  paymentMethod?: PaymentMethodEnum;
  phoneNumber?: string;
  operatorName?: string;
}

export interface PaymentResponse {
  success: boolean;
  transactionId?: string;
  transactionReference?: string;
  message: string;
  remainingAmount?: number;
  reservation?: Reservation;
}

export interface InitiatePaymentRequest {
  reservationId: number;
  amount: number;
  phoneNumber: string;
  operatorName: string;
}

export interface InitiatePaymentResponse {
  success: boolean;
  transactionReference?: string;
  serverCorrelationId?: string;
  message: string;
  reservation?: Reservation;
  remainingAmount?: number;
}

// ============================================================================
// COLIS
// ============================================================================

export interface Colis extends Base {
  senderName: string;
  senderPhone: string;
  recipientName: string;
  recipientPhone: string;
  description?: string;
  weight?: number;
  price?: number;
  crafter?: Crafter;
  reservation?: Reservation;
  status?: string;
  voyageId?: number;
}

// ============================================================================
// MESSAGING
// ============================================================================

export interface Message extends Base {
  messageId: string;
  roomId: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  type: MessageType;
  content: string;
  metadata?: string;
  isRead: boolean;
  createdAt: string;
  deliveredAt?: string;
  readAt?: string;
  replyToMessageId?: string;
  isSystem: boolean;
  isFromCurrent: boolean;
  isAgent: boolean;
}

export interface ChatRoom {
  roomId: string;
  type: ChatRoomType;
  participants: string;
  isActive: boolean;
  title: string;
  lastMessage?: string;
  lastMessageSender?: string;
  lastActivity: string;
  metadata?: string;
  unreadCount: number;
}

// ============================================================================
// CONTRACTS & PARTNERS
// ============================================================================

export interface Partenaire extends Base {
  name: string;
  type: string;
  contactPerson?: string;
  phone?: string;
  logo?: Cloudinary;
  email?: string;
  address?: string;
  isActive: boolean;
  contrats?: Contrat[];
}

export interface Contrat extends Base {
  partenaire?: Partenaire;
  chauffeur?: Chauffeur;
  koperative?: Koperative;
  type: string;
  title: string;
  terms?: string;
  startDate?: string;
  endDate?: string;
  contractValue?: number;
  status: string;
}

// ============================================================================
// MISC MODELS
// ============================================================================

export interface Hotel extends Base {
  name: string;
  ville: Ville;
  address?: string;
  phone?: string;
  email?: string;
  rating?: number;
  amenities?: string;
  photo?: Cloudinary;
  isActive: boolean;
}

export interface Cart extends Base {
  userAccount: UserAccount;
}

export interface Wish extends Base {
  userAccount: UserAccount;
}

export interface Resource extends Base {
  id?: number;
  key: string;
  fr: string;
  en: string;
  mg: string;
}

export interface SpringSession {
  primaryId: string;
  sessionId: string;
  creationTime: number;
  lastAccessTime: number;
  maxInactiveInterval: number;
  expiryTime: number;
  principalName: string;
}
