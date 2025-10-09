// API Configuration
export const API_CONFIG = {
  BASE_URL: 'https://ag.bury.local',
  ENDPOINTS: {
    MISSION_PACKAGE: '/api/v1/mission-package'
  }
} as const;

// Declare window.config type for TypeScript
declare global {
  interface Window {
    config?: {
      googleMaps?: {
        apiKey?: string;
        mapId?: string;
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

// Authentik Configuration
export const AUTHENTIK_CONFIG = {
  // Using path-based routing through NPM - all under same domain
  AUTHORITY: `${API_CONFIG.BASE_URL}/auth/application/o/agrar-drohnenkarte/`,
  CLIENT_ID: 'VdMCo11sWPUpjGOoC3UgNyS83skFvvYimrdcTEj5',
  // All callbacks redirect to the same domain root
  get REDIRECT_URI() { return `${API_CONFIG.BASE_URL}/` },
  get POST_LOGOUT_REDIRECT_URI() { return `${API_CONFIG.BASE_URL}/` },
  get SILENT_REDIRECT_URI() { return `${API_CONFIG.BASE_URL}/` }
} as const;

// Helper function to build full API URLs
export function getApiUrl(endpoint: keyof typeof API_CONFIG.ENDPOINTS): string {
  return `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS[endpoint]}`;
}

// Helper function to make authenticated API requests
export async function makeAuthenticatedRequest(
  url: string, 
  options: RequestInit = {},
  accessToken?: string
): Promise<Response> {
  const headers = new Headers(options.headers);
  
  // Add Authorization header if access token is provided
  if (accessToken) {
    headers.set('Authorization', `Bearer ${accessToken}`);
  }
  
  // Always include credentials for cookie-based auth fallback
  const requestOptions: RequestInit = {
    ...options,
    headers,
    credentials: 'include'
  };
  
  return fetch(url, requestOptions);
}