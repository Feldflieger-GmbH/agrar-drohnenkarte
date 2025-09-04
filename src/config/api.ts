// API Configuration
export const API_CONFIG = {
  BASE_URL: 'https://ag.bury.local',
  ENDPOINTS: {
    PROTECTED: '/api/protected',
    GENERATE_SHAPEFILE: '/api/generate-shapefile',
    GENERATE_KML: '/api/generate-kml'
  }
} as const;

// Authentik Configuration
export const AUTHENTIK_CONFIG = {
  // Using path-based routing through NPM - all under same domain
  AUTHORITY: 'https://ag.bury.local/auth/application/o/agrar-drohnenkarte/',
  CLIENT_ID: 'VdMCo11sWPUpjGOoC3UgNyS83skFvvYimrdcTEj5',
  // All callbacks redirect to the same domain root
  get REDIRECT_URI() { return 'https://ag.bury.local/' },
  get POST_LOGOUT_REDIRECT_URI() { return 'https://ag.bury.local/' },
  get SILENT_REDIRECT_URI() { return 'https://ag.bury.local/' }
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