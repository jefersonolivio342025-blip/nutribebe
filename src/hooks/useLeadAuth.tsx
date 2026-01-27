import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { getStoredUTMParams, clearStoredUTMParams } from '@/hooks/useUTMCapture';

interface LeadData {
  id?: string;
  nome: string;
  whatsapp: string;
  created_at?: string;
}

const LEAD_STORAGE_KEY = 'nutribebe_lead';

export const useLeadAuth = () => {
  const [lead, setLead] = useState<LeadData | null>(null);
  const [loading, setLoading] = useState(true);

  // Load lead from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(LEAD_STORAGE_KEY);
    if (stored) {
      try {
        setLead(JSON.parse(stored));
      } catch {
        localStorage.removeItem(LEAD_STORAGE_KEY);
      }
    }
    setLoading(false);
  }, []);

  // Check if WhatsApp exists and create/retrieve lead
  const registerLead = useCallback(async (nome: string, whatsapp: string): Promise<{ success: boolean; error?: string }> => {
    try {
      // Clean WhatsApp to only digits
      const cleanWhatsapp = whatsapp.replace(/\D/g, '');
      
      // Check if lead exists
      const { data: existingLead, error: fetchError } = await supabase
        .from('leads')
        .select('*')
        .eq('whatsapp', cleanWhatsapp)
        .maybeSingle();

      if (fetchError) {
        console.error('Error checking lead:', fetchError);
        return { success: false, error: 'Erro ao verificar cadastro' };
      }

      let leadData: LeadData;

      if (existingLead) {
        // Lead exists - update nome if changed
        if (existingLead.nome !== nome) {
          await supabase
            .from('leads')
            .update({ nome })
            .eq('id', existingLead.id);
        }
        leadData = {
          id: existingLead.id,
          nome: nome || existingLead.nome,
          whatsapp: cleanWhatsapp,
          created_at: existingLead.created_at,
        };
      } else {
        // New lead - create with UTM params
        const utmParams = getStoredUTMParams();
        
        const { data: newLead, error: insertError } = await supabase
          .from('leads')
          .insert({
            nome,
            whatsapp: cleanWhatsapp,
            utm_source: utmParams.utm_source,
            utm_medium: utmParams.utm_medium,
            utm_campaign: utmParams.utm_campaign,
            utm_content: utmParams.utm_content,
          })
          .select()
          .single();

        if (insertError) {
          console.error('Error creating lead:', insertError);
          return { success: false, error: 'Erro ao cadastrar' };
        }

        clearStoredUTMParams();
        
        leadData = {
          id: newLead.id,
          nome,
          whatsapp: cleanWhatsapp,
          created_at: newLead.created_at,
        };
      }

      // Save to localStorage
      localStorage.setItem(LEAD_STORAGE_KEY, JSON.stringify(leadData));
      setLead(leadData);

      return { success: true };
    } catch (error) {
      console.error('Lead registration error:', error);
      return { success: false, error: 'Erro inesperado' };
    }
  }, []);

  const clearLead = useCallback(() => {
    localStorage.removeItem(LEAD_STORAGE_KEY);
    setLead(null);
  }, []);

  const isLeadLoggedIn = !!lead;

  return {
    lead,
    loading,
    isLeadLoggedIn,
    registerLead,
    clearLead,
  };
};

// Export helper to get lead data anywhere
export const getStoredLead = (): LeadData | null => {
  const stored = localStorage.getItem(LEAD_STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return null;
    }
  }
  return null;
};
