// API Configuration - reads from runtime config injected by entrypoint.sh
export const API_CONFIG = {
  BASE_URL: (typeof window !== 'undefined' && window.config?.baseUrl) || 'DEFAULT_API_URL',
  ENDPOINTS: {
    MISSION_PACKAGE: '/api/v1/mission-package'
  }
} as const;

// Declare window.config type for TypeScript
declare global {
  interface Window {
    config?: {
      baseUrl?: string;
      premium?: boolean | string;
      googleMaps?: {
        apiKey?: string;
        mapId?: string;
      };
      mapbox?: {
        apiKey?: string;
      };
    };
  }
}

// Google Maps Configuration - reads from runtime config injected by entrypoint.sh
export const GOOGLE_MAPS_CONFIG = {
  // Get API key from runtime config or fallback to build-time env variable
  API_KEY: (typeof window !== 'undefined' && window.config?.googleMaps?.apiKey) || import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',
  // Map ID is optional but recommended for advanced styling
  MAP_ID: (typeof window !== 'undefined' && window.config?.googleMaps?.mapId) || import.meta.env.VITE_GOOGLE_MAPS_MAP_ID || ''
} as const;

// Mapbox Configuration - reads from runtime config injected by entrypoint.sh
export const MAPBOX_CONFIG = {
  // Get API key from runtime config or fallback to build-time env variable
  API_KEY: (typeof window !== 'undefined' && window.config?.mapbox?.apiKey) || import.meta.env.VITE_MAPBOX_API_KEY || ''
} as const;

// Helper function to build full API URLs
export function getApiUrl(endpoint: keyof typeof API_CONFIG.ENDPOINTS): string {
  return `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS[endpoint]}`;
}
