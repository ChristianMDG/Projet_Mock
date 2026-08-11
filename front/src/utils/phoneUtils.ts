// Phone number utilities for Madagascar numbers
// Handles formatting, validation, and normalization

export interface PhoneFormatOptions {
  displayFormat?: boolean; // true for display (034 00 000 00), false for storage (034000000)
  strict?: boolean; // strict validation
}

/**
 * Madagascar mobile operators and their prefixes
 */
export const MADAGASCAR_OPERATORS = {
  TELMA: ['034', '038'] as const,
  AIRTEL: ['033'] as const,
  ORANGE: ['032', '037'] as const,
} as const;

/**
 * All valid Madagascar mobile prefixes
 */
export const VALID_PREFIXES = ['034', '038', '033', '032', '037'] as const;
export type ValidPrefix = (typeof VALID_PREFIXES)[number];

/**
 * Normalize phone number to storage format (034000000)
 * @param phone - Input phone number in any format
 * @returns Normalized phone number or null if invalid
 */
export const normalizePhoneNumber = (phone: string): string | null => {
  if (!phone) return null;

  // Remove all non-digits
  let cleaned = phone.replace(/\D/g, '');

  // Handle different input formats:
  // +261340000000 -> 340000000 -> 034000000
  if (cleaned.startsWith('261')) {
    cleaned = cleaned.substring(3);
  }

  // 340000000 -> 034000000 (add leading 0 if missing)
  if (cleaned.length === 9 && !cleaned.startsWith('0')) {
    cleaned = '0' + cleaned;
  }

  // Check if valid length and prefix
  if (cleaned.length !== 10 || !cleaned.startsWith('0')) {
    return null;
  }

  const prefix = cleaned.substring(0, 3) as ValidPrefix;
  if (!VALID_PREFIXES.includes(prefix)) {
    return null;
  }

  return cleaned;
};

/**
 * Format phone number for display (034 00 000 00)
 * @param phone - Phone number in storage format (034000000)
 * @returns Formatted phone number for display
 */
export const formatPhoneForDisplay = (phone: string): string => {
  const normalized = normalizePhoneNumber(phone);
  if (!normalized) return phone;

  // 034000000 -> 034 00 000 00
  const prefix = normalized.substring(0, 3); // 034
  const part1 = normalized.substring(3, 5); // 00
  const part2 = normalized.substring(5, 8); // 000
  const part3 = normalized.substring(8); // 00

  return `${prefix} ${part1} ${part2} ${part3}`;
};

/**
 * Validate Madagascar phone number
 * @param phone - Phone number to validate
 * @param strict - If true, requires exact format
 * @returns Validation result with error message
 */
export const validatePhoneNumber = (phone: string, strict = false): { isValid: boolean; message?: string } => {
  if (!phone?.trim()) {
    return { isValid: false, message: 'Le numéro de téléphone est requis' };
  }

  const normalized = normalizePhoneNumber(phone);
  if (!normalized) {
    return {
      isValid: false,
      message: 'Format invalide. Utilisez le format: 034 XX XXX XX ou 034XXXXXX',
    };
  }

  const prefix = normalized.substring(0, 3) as ValidPrefix;
  if (!VALID_PREFIXES.includes(prefix)) {
    const validPrefixesStr = VALID_PREFIXES.join(', ');
    return {
      isValid: false,
      message: `Préfixe invalide. Utilisez: ${validPrefixesStr}`,
    };
  }

  if (strict) {
    // Additional strict validation can be added here
    // e.g., check against known number patterns, blacklists, etc.
  }

  return { isValid: true };
};

/**
 * Get operator name from phone number
 * @param phone - Phone number
 * @returns Operator name or 'Unknown'
 */
export const getOperatorName = (phone: string): string => {
  const normalized = normalizePhoneNumber(phone);
  if (!normalized) return 'Unknown';

  const prefix = normalized.substring(0, 3) as ValidPrefix;

  // Check each operator's prefixes
  if ((MADAGASCAR_OPERATORS.TELMA as readonly string[]).includes(prefix)) {
    return 'TELMA';
  }
  if ((MADAGASCAR_OPERATORS.AIRTEL as readonly string[]).includes(prefix)) {
    return 'AIRTEL';
  }
  if ((MADAGASCAR_OPERATORS.ORANGE as readonly string[]).includes(prefix)) {
    return 'ORANGE';
  }

  return 'Unknown';
};

/**
 * Format phone number as user types (for input field)
 * @param value - Current input value
 * @returns Formatted value for display in input
 */
export const formatPhoneInput = (value: string): string => {
  const digits = value.replace(/\D/g, '');

  if (digits.length === 0) return '';

  // Handle numbers starting with 261 (convert to local)
  if (digits.startsWith('261') && digits.length > 3) {
    const localDigits = '0' + digits.substring(3);
    return formatLocalInput(localDigits);
  }

  // Handle local format
  return formatLocalInput(digits);
};

/**
 * Format local phone input (034 format)
 */
const formatLocalInput = (digits: string): string => {
  let workingDigits = digits;

  // Add leading 0 if missing and looks like mobile number
  if (!workingDigits.startsWith('0') && VALID_PREFIXES.some(p => workingDigits.startsWith(p.substring(1)))) {
    workingDigits = '0' + workingDigits;
  }

  if (workingDigits.length <= 3) return workingDigits;
  if (workingDigits.length <= 5) return `${workingDigits.substring(0, 3)} ${workingDigits.substring(3)}`;
  if (workingDigits.length <= 8)
    return `${workingDigits.substring(0, 3)} ${workingDigits.substring(3, 5)} ${workingDigits.substring(5)}`;
  if (workingDigits.length <= 10)
    return `${workingDigits.substring(0, 3)} ${workingDigits.substring(3, 5)} ${workingDigits.substring(5, 8)} ${workingDigits.substring(8)}`;

  return `${workingDigits.substring(0, 3)} ${workingDigits.substring(3, 5)} ${workingDigits.substring(5, 8)} ${workingDigits.substring(8, 10)}`;
};

/**
 * Check if a phone number format is for display or storage
 * @param phone - Phone number to check
 * @returns true if it's a display format, false if storage format
 */
export const isDisplayFormat = (phone: string): boolean => {
  return phone.includes(' ');
};

/**
 * Convert phone number to storage format
 * @param phone - Phone number to convert
 * @returns Phone number in storage format
 */
export const convertPhoneToStorage = (phone: string): string => {
  return normalizePhoneNumber(phone) ?? phone;
};

/**
 * Convert phone number to display format
 * @param phone - Phone number to convert
 * @returns Phone number in display format
 */
export const convertPhoneToDisplay = (phone: string): string => {
  return formatPhoneForDisplay(phone);
};
