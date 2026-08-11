/**
 * Utility functions for managing guest reservation data in localStorage
 */

const GUEST_PHONE_KEY = 'guest_reservation_phone';
const GUEST_ID_NUMBER_KEY = 'guest_reservation_id_number';

export interface GuestReservationData {
  phoneNumber: string;
  idNumber: string;
}

/**
 * Save guest reservation credentials to localStorage
 */
export const saveGuestReservationData = (data: GuestReservationData): void => {
  try {
    localStorage.setItem(GUEST_PHONE_KEY, data.phoneNumber);
    localStorage.setItem(GUEST_ID_NUMBER_KEY, data.idNumber);
  } catch (error) {
    console.error('Failed to save guest reservation data:', error);
  }
};

/**
 * Get guest reservation credentials from localStorage
 */
export const getGuestReservationData = (): GuestReservationData | null => {
  try {
    const phoneNumber = localStorage.getItem(GUEST_PHONE_KEY);
    const idNumber = localStorage.getItem(GUEST_ID_NUMBER_KEY);

    // Return data if at least one field is present
    if (phoneNumber || idNumber) {
      return {
        phoneNumber: phoneNumber ?? '',
        idNumber: idNumber ?? '',
      };
    }
    return null;
  } catch (error) {
    console.error('Failed to get guest reservation data:', error);
    return null;
  }
};

/**
 * Clear guest reservation credentials from localStorage
 */
export const clearGuestReservationData = (): void => {
  try {
    localStorage.removeItem(GUEST_PHONE_KEY);
    localStorage.removeItem(GUEST_ID_NUMBER_KEY);
  } catch (error) {
    console.error('Failed to clear guest reservation data:', error);
  }
};

/**
 * Check if guest reservation data exists
 */
export const hasGuestReservationData = (): boolean => {
  const data = getGuestReservationData();
  return data !== null && (data.phoneNumber.length > 0 || data.idNumber.length > 0);
};
