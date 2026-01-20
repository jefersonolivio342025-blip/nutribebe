import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface TrackConversionParams {
  sourcePage: string;
  buttonText?: string;
}

export const useConversionTracking = () => {
  const { user, isPremium } = useAuth();

  const trackConversionClick = useCallback(async ({ sourcePage, buttonText }: TrackConversionParams) => {
    try {
      await supabase.from('conversion_events').insert({
        user_id: user?.id || null,
        event_type: 'paywall_click',
        source_page: sourcePage,
        button_text: buttonText || 'Liberar Acesso Vitalício',
        user_agent: navigator.userAgent,
        is_premium: isPremium,
      });
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
