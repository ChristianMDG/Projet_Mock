// Enums extracted from backend Java enums
// Path: /Users/ofanomezantsoa/Taxibrousse/src/main/java/mg/taxibrousse/entities/enums/

// Authority Enum
export enum AuthorityEnum {
  USER = 'USER',
  ADMIN = 'ADMIN',
  GUICHET = 'GUICHET',
  KOPERATIVE = 'KOPERATIVE',
  CHAUFFEUR = 'CHAUFFEUR',
  OPERATOR = 'OPERATOR',
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

// Utility functions for enum operations
export const getEnumValues = <T extends Record<keyof T, string>>(enumObject: T): T[keyof T][] => {
  return Object.values(enumObject).filter(value => typeof value === 'string') as T[keyof T][];
};

export const getEnumKeys = <T extends Record<keyof T, string>>(enumObject: T): (keyof T)[] => {
  return Object.keys(enumObject).filter(key => isNaN(Number(key))) as (keyof T)[];
};

// Display names for enums (Translation keys)
// Usage: t(VoyageStatusLabels[status]) where t is from useTranslation hook
// Example: const { t } = useTranslation();
//          <Chip label={t(VoyageStatusLabels[voyage.status])} />
export const ContratStatusLabels: Record<ContratStatusEnum, string> = {
  [ContratStatusEnum.DRAFT]: 'enum_contrat_status_draft',
  [ContratStatusEnum.ACTIVE]: 'enum_contrat_status_active',
  [ContratStatusEnum.EXPIRED]: 'enum_contrat_status_expired',
  [ContratStatusEnum.TERMINATED]: 'enum_contrat_status_terminated',
  [ContratStatusEnum.RENEWED]: 'enum_contrat_status_renewed',
};

export const PaymentStatusLabels: Record<PaymentStatusEnum, string> = {
  [PaymentStatusEnum.PENDING]: 'enum_payment_status_pending',
  [PaymentStatusEnum.PAID]: 'enum_payment_status_paid',
  [PaymentStatusEnum.FAILED]: 'enum_payment_status_failed',
  [PaymentStatusEnum.REFUNDED]: 'enum_payment_status_refunded',
  [PaymentStatusEnum.PARTIALLY_PAID]: 'enum_payment_status_partially_paid',
};

export const CinTypeLabels: Record<CinTypeEnum, string> = {
  [CinTypeEnum.NATIONAL_ID]: 'enum_cin_type_national_id',
  [CinTypeEnum.PASSPORT]: 'enum_cin_type_passport',
  [CinTypeEnum.DRIVING_LICENSE]: 'enum_cin_type_driving_license',
  [CinTypeEnum.OTHER]: 'enum_cin_type_other',
};

export const KoperativeStatusLabels: Record<KoperativeStatusEnum, string> = {
  [KoperativeStatusEnum.ACTIVE]: 'enum_koperative_status_active',
  [KoperativeStatusEnum.CONFIRMED]: 'enum_koperative_status_confirmed',
  [KoperativeStatusEnum.INACTIVE]: 'enum_koperative_status_inactive',
  [KoperativeStatusEnum.SUSPENDED]: 'enum_koperative_status_suspended',
};

export const ContratTypeLabels: Record<ContratTypeEnum, string> = {
  [ContratTypeEnum.PARTNERSHIP]: 'enum_contrat_type_partnership',
  [ContratTypeEnum.EMPLOYMENT]: 'enum_contrat_type_employment',
  [ContratTypeEnum.SERVICE_AGREEMENT]: 'enum_contrat_type_service_agreement',
  [ContratTypeEnum.RENTAL]: 'enum_contrat_type_rental',
  [ContratTypeEnum.OTHER]: 'enum_contrat_type_other',
};

export const PartenaireTypeLabels: Record<PartenaireTypeEnum, string> = {
  [PartenaireTypeEnum.HOTEL]: 'enum_partenaire_type_hotel',
  [PartenaireTypeEnum.MAINTENANCE_PROVIDER]: 'enum_partenaire_type_maintenance_provider',
  [PartenaireTypeEnum.MARKETING_AGENCY]: 'enum_partenaire_type_marketing_agency',
  [PartenaireTypeEnum.INSURANCE_PROVIDER]: 'enum_partenaire_type_insurance_provider',
  [PartenaireTypeEnum.FUEL_STATION]: 'enum_partenaire_type_fuel_station',
  [PartenaireTypeEnum.OTHER]: 'enum_partenaire_type_other',
};

export const VoyageStatusLabels: Record<VoyageStatusEnum, string> = {
  [VoyageStatusEnum.SCHEDULED]: 'enum_voyage_status_scheduled',
  [VoyageStatusEnum.ONGOING]: 'enum_voyage_status_ongoing',
  [VoyageStatusEnum.COMPLETED]: 'enum_voyage_status_completed',
  [VoyageStatusEnum.CANCELLED]: 'enum_voyage_status_cancelled',
  [VoyageStatusEnum.DELAYED]: 'enum_voyage_status_delayed',
};

export const RecurrenceTypeLabels: Record<RecurrenceTypeEnum, string> = {
  [RecurrenceTypeEnum.ONE_OFF]: 'enum_recurrence_type_one_off',
  [RecurrenceTypeEnum.DAILY]: 'enum_recurrence_type_daily',
  [RecurrenceTypeEnum.WEEKLY]: 'enum_recurrence_type_weekly',
  [RecurrenceTypeEnum.MONTHLY]: 'enum_recurrence_type_monthly',
  [RecurrenceTypeEnum.CUSTOM]: 'enum_recurrence_type_custom',
};

export const ReservationStatusLabels: Record<ReservationStatusEnum, string> = {
  [ReservationStatusEnum.PENDING_PAYMENT]: 'enum_reservation_status_pending_payment',
  [ReservationStatusEnum.CONFIRMED]: 'enum_reservation_status_confirmed',
  [ReservationStatusEnum.CANCELLED_BY_USER]: 'enum_reservation_status_cancelled_by_user',
  [ReservationStatusEnum.CANCELLED_BY_OPERATOR]: 'enum_reservation_status_cancelled_by_operator',
  [ReservationStatusEnum.COMPLETED]: 'enum_reservation_status_completed',
  [ReservationStatusEnum.NO_SHOW]: 'enum_reservation_status_no_show',
};

export const SeatStatusLabels: Record<SeatStatusEnum, string> = {
  [SeatStatusEnum.AVAILABLE]: 'enum_seat_status_available',
  [SeatStatusEnum.RESERVED]: 'enum_seat_status_reserved',
  [SeatStatusEnum.BLOCKED]: 'enum_seat_status_blocked',
  [SeatStatusEnum.DAMAGED]: 'enum_seat_status_damaged',
};

export const PaymentMethodLabels: Record<PaymentMethodEnum, string> = {
  [PaymentMethodEnum.CASH]: 'payment_method_cash',
  [PaymentMethodEnum.MOBILE_MONEY]: 'payment_method_mobile_money',
  [PaymentMethodEnum.BANK_TRANSFER]: 'payment_method_bank_transfer',
  [PaymentMethodEnum.CREDIT_CARD]: 'payment_method_credit_card',
  [PaymentMethodEnum.ONLINE_PAYMENT]: 'payment_method_online_payment',
};

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

export const MessageTypeLabels: Record<MessageType, string> = {
  [MessageType.TEXT]: 'enum_message_type_text',
  [MessageType.IMAGE]: 'enum_message_type_image',
  [MessageType.LOCATION]: 'enum_message_type_location',
  [MessageType.SYSTEM]: 'enum_message_type_system',
  [MessageType.FILE]: 'enum_message_type_file',
};

export const ChatRoomTypeLabels: Record<ChatRoomType, string> = {
  [ChatRoomType.CUSTOMER_SUPPORT]: 'enum_chat_room_type_customer_support',
  [ChatRoomType.VOYAGE_CHAT]: 'enum_chat_room_type_voyage_chat',
  [ChatRoomType.GENERAL_INQUIRY]: 'enum_chat_room_type_general_inquiry',
};
