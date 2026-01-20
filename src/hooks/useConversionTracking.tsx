import { useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

declare global {
  interface Window {
    fbq: (...args: any[]) => void;
  }
}

interface TrackConversionParams {
  sourcePage: string;
  buttonText?: string;
}

export const useConversionTracking = () => {
  const { user, isPremium } = useAuth();

  const trackConversionClick = useCallback(async ({ sourcePage, buttonText }: TrackConversionParams) => {
    try {
      // Track in Supabase
      await supabase.from('conversion_events').insert({
        user_id: user?.id || null,
        event_type: 'paywall_click',
        source_page: sourcePage,
        button_text: buttonText || 'Liberar Acesso Vitalício',
        user_agent: navigator.userAgent,
        is_premium: isPremium,
      });

      // Track Facebook Pixel InitiateCheckout event
      if (typeof window.fbq === 'function') {
        window.fbq('track', 'InitiateCheckout');
      }
    } catch (error) {
      // Silent fail - don't block the user action
      console.error('Failed to track conversion:', error);
    }
  }, [user?.id, isPremium]);

  const handlePaywallClick = useCallback((sourcePage: string, buttonText?: string) => {
    trackConversionClick({ sourcePage, buttonText });
    // The actual navigation happens via the <a> tag
  }, [trackConversionClick]);

  return { trackConversionClick, handlePaywallClick };
};

// Hook to track ViewContent on page load
export const useViewContentTracking = (contentName: string, contentCategory?: string) => {
  useEffect(() => {
    if (typeof window.fbq === 'function') {
      window.fbq('track', 'ViewContent', {
        content_name: contentName,
        content_category: contentCategory || 'Page View',
      });
    }
  }, [contentName, contentCategory]);
};
