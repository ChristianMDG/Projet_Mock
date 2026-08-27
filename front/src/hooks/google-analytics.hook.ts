import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import ReactGA from 'react-ga4';

const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID as string | undefined;

let isInitialized = false;

/**
 * Initializes Google Analytics (GA4) and tracks page views on every route change.
 * The Measurement ID is read from the VITE_GA_MEASUREMENT_ID environment variable.
 */
export function useGoogleAnalytics() {
  const location = useLocation();

  useEffect(() => {
    const shouldInitialize = GA_MEASUREMENT_ID && isInitialized === false;
    if (shouldInitialize) {
      ReactGA.initialize(GA_MEASUREMENT_ID);
      isInitialized = true;
    }
  }, []);

  useEffect(() => {
    if (GA_MEASUREMENT_ID && isInitialized) {
      ReactGA.send({ hitType: 'pageview', page: location.pathname + location.search });
    }
  }, [location]);
}

/**
 * Tracks a user click event in Google Analytics.
 * @param category - The event category (e.g. 'Button', 'Link')
 * @param label - A descriptive label for the element clicked
 */
export function trackClick(category: string, label: string) {
  if (GA_MEASUREMENT_ID && isInitialized) {
    ReactGA.event({ action: 'click', category, label });
  }
}

/**
 * Tracks a custom named event in Google Analytics.
 * @param action - The event action name (e.g. 'voyage_search', 'payment_initiated')
 * @param category - The event category (e.g. 'Booking', 'Payment')
 * @param label - Optional descriptive label
 * @param value - Optional numeric value (e.g. amount in Ariary)
 */
export function trackEvent(action: string, category: string, label?: string, value?: number) {
  if (GA_MEASUREMENT_ID && isInitialized) {
    ReactGA.event({ action, category, label, value });
  }
}

/**
 * Tracks a component becoming visible (impression) in Google Analytics.
 * Call this hook inside the component you want to track.
 * @param category - The event category (e.g. 'Banner', 'Card')
 * @param label - A descriptive label for the component
 */
export function useComponentView(category: string, label: string) {
  useEffect(() => {
    if (GA_MEASUREMENT_ID && isInitialized) {
      ReactGA.event({ action: 'component_view', category, label });
    }
  }, [category, label]);
}

/**
 * Automatically tracks ALL clicks on buttons and links globally.
 * Fulfills the requirement to track every possible event made by use.
 */
export function useGlobalInteractionTracking() {
  useEffect(() => {
    if (GA_MEASUREMENT_ID) {
      const handleGlobalClick = (event: MouseEvent) => {
        if (isInitialized && event.target) {
          const target = event.target as HTMLElement;
          const button = target.closest('button');
          const link = target.closest('a');

          if (button) {
            const rawText = button.textContent?.trim() ?? button.ariaLabel?.trim() ?? '';
            const text = rawText ? rawText.substring(0, 50) : 'Button';
            ReactGA.event({ action: 'auto_click_button', category: 'User Interaction', label: text });
          } else if (link) {
            const rawText = link.textContent?.trim() ?? link.ariaLabel?.trim() ?? '';
            const text = rawText ? rawText.substring(0, 50) : 'Link';
            ReactGA.event({ action: 'auto_click_link', category: 'User Interaction', label: text });
          }
        }
      };

      const handleGlobalSubmit = (event: SubmitEvent) => {
        if (isInitialized && event.target) {
          const target = event.target as HTMLFormElement;
          const rawId = target.id?.trim() ?? target.className?.trim() ?? '';
          const id = rawId ? rawId : 'Form';
          ReactGA.event({ action: 'auto_submit_form', category: 'User Interaction', label: id });
        }
      };

      document.addEventListener('click', handleGlobalClick, { capture: true });
      document.addEventListener('submit', handleGlobalSubmit, { capture: true });

      return () => {
        document.removeEventListener('click', handleGlobalClick, { capture: true });
        document.removeEventListener('submit', handleGlobalSubmit, { capture: true });
      };
    }
  }, []);
}
