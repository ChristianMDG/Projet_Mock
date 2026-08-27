/**
 * Analytics utility for tracking user events
 * Integrates with Google Analytics (gtag.js)
 */

declare global {
  interface Window {
    gtag?: (
      command: string,
      action: string | Date,
      params?: {
        event_category?: string;
        event_label?: string;
        value?: number;
        [key: string]: unknown;
      },
    ) => void;
  }
}

/**
 * Track an event with Google Analytics
 *
 * @param action - The event action (e.g., 'checkout_initiated', 'payment_method_selected')
 * @param category - The event category (e.g., 'Shop', 'Reservation')
 * @param label - Optional label for additional context (e.g., 'MVola', 'Step 1')
 * @param value - Optional numeric value (e.g., amount, step number)
 *
 * @example
 * trackEvent('checkout_initiated', 'Shop', 'Checkout Initiated');
 * trackEvent('checkout_step', 'Shop', 'Delivery Info', 1);
 * trackEvent('payment_method_selected', 'Shop', 'MVola');
 * trackEvent('shop_order_confirmed', 'Shop', 'Mobile Money', 150000);
 */
export function trackEvent(action: string, category: string, label?: string, value?: number): void {
  if (typeof window === 'undefined') {
    return;
  }

  // Check if gtag is available
  if (typeof window.gtag === 'function') {
    const params: {
      event_category: string;
      event_label?: string;
      value?: number;
    } = {
      event_category: category,
    };

    if (label !== undefined) {
      params.event_label = label;
    }

    if (value !== undefined) {
      params.value = value;
    }

    window.gtag('event', action, params);
  }

  // Log to console in development mode
  if (import.meta.env.DEV) {
    console.log('[Analytics Event]', {
      action,
      category,
      label,
      value,
    });
  }
}

/**
 * Initialize Google Analytics with tracking ID
 * Should be called once during app initialization
 *
 * @param trackingId - Google Analytics tracking ID (e.g., 'G-XXXXXXXXXX')
 */
export function initializeAnalytics(trackingId?: string): void {
  if (typeof window === 'undefined' || !trackingId) {
    return;
  }

  // Check if gtag script is already loaded
  if (window.gtag) {
    return;
  }

  // Load Google Analytics script
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${trackingId}`;
  document.head.appendChild(script);

  // Initialize gtag
  window.gtag = function gtag() {
    // eslint-disable-next-line prefer-rest-params
    (window as any).dataLayer = (window as any).dataLayer || [];
    // eslint-disable-next-line prefer-rest-params
    (window as any).dataLayer.push(arguments);
  };

  window.gtag('js', new Date());
  window.gtag('config', trackingId);
}
