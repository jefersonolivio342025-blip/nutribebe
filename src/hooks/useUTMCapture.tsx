import { useEffect } from 'react';

const UTM_STORAGE_KEY = 'nutribebe_utm_params';

export interface UTMParams {
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_content: string | null;
}

export const captureUTMParams = (): void => {
  const urlParams = new URLSearchParams(window.location.search);
  
  const utmParams: UTMParams = {
    utm_source: urlParams.get('utm_source'),
    utm_medium: urlParams.get('utm_medium'),
    utm_campaign: urlParams.get('utm_campaign'),
    utm_content: urlParams.get('utm_content'),
  };

  // Só salva se pelo menos um parâmetro UTM estiver presente
  const hasAnyUTM = Object.values(utmParams).some(value => value !== null);
  
  if (hasAnyUTM) {
    localStorage.setItem(UTM_STORAGE_KEY, JSON.stringify(utmParams));
  }
};

export const getStoredUTMParams = (): UTMParams => {
  try {
    const stored = localStorage.getItem(UTM_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error('Error reading UTM params from localStorage:', e);
  }
  
  return {
    utm_source: null,
    utm_medium: null,
    utm_campaign: null,
    utm_content: null,
  };
};

export const clearStoredUTMParams = (): void => {
  localStorage.removeItem(UTM_STORAGE_KEY);
};

export const useUTMCapture = (): void => {
  useEffect(() => {
    captureUTMParams();
  }, []);
};
