import { customStorage } from '@/utils/customStorage';
import { initNavigatorRoom } from '@/utils/messaging.utils';

const CART_SESSION_KEY = 'cartSessionId';

const generateSessionId = (): string => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `cart-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
};

export const getCartSessionId = (): string => {
  const existing = customStorage.getItem(CART_SESSION_KEY);
  if (existing) return existing;
  const created = generateSessionId();
  customStorage.setItem(CART_SESSION_KEY, created);
  return created;
};

/**
 * Returns the canonical cart / order identification headers.
 *
 * - `X-Sender-Id`: senderId coming from the messaging NavigatorRoom — same id used by the
 *   WebSocket / messaging layer so the backend can correlate cart, order and chat sessions.
 * - `X-Cart-Session`: legacy header, kept as a secondary identifier for one release cycle.
 */
export const cartSenderHeaders = (): Record<string, string> => {
  const { senderId } = initNavigatorRoom();
  return {
    'X-Sender-Id': senderId,
    'X-Cart-Session': getCartSessionId(),
  };
};

/**
 * @deprecated Use `cartSenderHeaders()` instead. Kept as a thin alias for backward compatibility.
 */
export const cartSessionHeaders = cartSenderHeaders;

export const resetCartSession = (): void => {
  customStorage.removeItem(CART_SESSION_KEY);
};
