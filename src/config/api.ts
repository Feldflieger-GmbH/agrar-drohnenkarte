// API Configuration
export const API_CONFIG = {
  BASE_URL: 'https://localhost:8443',
  ENDPOINTS: {
    PROTECTED: '/api/protected',
    GENERATE_SHAPEFILE: '/api/generate-shapefile',
    GENERATE_KML: '/api/generate-kml'
  }
} as const;

// Helper function to build full API URLs
export function getApiUrl(endpoint: keyof typeof API_CONFIG.ENDPOINTS): string {
  return `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS[endpoint]}`;
}