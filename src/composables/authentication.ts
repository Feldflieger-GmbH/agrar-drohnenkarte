import { ref, computed } from 'vue'
import { UserManager, User, type UserManagerSettings } from 'oidc-client-ts'
import { AUTHENTIK_CONFIG } from '../config/api'

// Authentication state
const user = ref<User | null>(null)
const isLoading = ref(false)
const error = ref<string | null>(null)

// Computed properties
const isAuthenticated = computed(() => !!user.value && !user.value.expired)
const accessToken = computed(() => user.value?.access_token)
const userProfile = computed(() => user.value?.profile)

// Authentik OIDC configuration
const oidcSettings: UserManagerSettings = {
  authority: AUTHENTIK_CONFIG.AUTHORITY,
  client_id: AUTHENTIK_CONFIG.CLIENT_ID,
  redirect_uri: AUTHENTIK_CONFIG.REDIRECT_URI,
  post_logout_redirect_uri: AUTHENTIK_CONFIG.POST_LOGOUT_REDIRECT_URI,
  response_type: 'code',
  scope: 'openid profile email',
  automaticSilentRenew: true,
  silent_redirect_uri: AUTHENTIK_CONFIG.SILENT_REDIRECT_URI,
  filterProtocolClaims: true,
  loadUserInfo: true,
}

// Create UserManager instance
const userManager = new UserManager(oidcSettings)

// Event handlers
userManager.events.addUserLoaded((loadedUser) => {
  user.value = loadedUser
  error.value = null
})

userManager.events.addUserUnloaded(() => {
  user.value = null
})

userManager.events.addSilentRenewError((err) => {
  console.error('Silent renew error:', err)
  error.value = 'Session renewal failed'
})

userManager.events.addAccessTokenExpired(() => {
  console.log('Access token expired')
  // Handle token expiration - will be defined in the useAuthentication function
})

// Test connection to Authentik server
const testAuthentikConnection = async () => {
  try {
    const response = await fetch(`${AUTHENTIK_CONFIG.AUTHORITY}.well-known/openid-configuration`);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    const config = await response.json();
    console.log('Authentik OIDC configuration loaded successfully:', config);
    return true;
  } catch (err) {
    console.error('Failed to connect to Authentik server:', err);
    throw new Error(`Cannot connect to Authentik server: ${err instanceof Error ? err.message : String(err)}`);
  }
}

// Authentication functions
export const useAuthentication = () => {
  // Initialize authentication state
  const initialize = async () => {
    isLoading.value = true
    try {
      // First test connection to Authentik
      await testAuthentikConnection();

      // Check if user is returning from authentication callback
      const urlParams = new URLSearchParams(window.location.search)
      if (urlParams.has('code') && urlParams.has('state')) {
        await handleSigninCallback()
        return
      }

      // Check if this is a silent callback
      if (window.location.hash.includes('access_token') || window.location.search.includes('access_token')) {
        await handleSilentCallback()
        return
      }

      // Try to get existing user
      const existingUser = await userManager.getUser()
      if (existingUser && !existingUser.expired) {
        user.value = existingUser
      }
    } catch (err) {
      console.error('Authentication initialization error:', err)
      error.value = `Failed to initialize authentication: ${err instanceof Error ? err.message : String(err)}`
    } finally {
      isLoading.value = false
    }
  }

  // Sign in redirect
  const signinRedirect = async () => {
    console.log('signinRedirect called - starting authentication flow')
    isLoading.value = true
    error.value = null
    try {
      console.log('Calling userManager.signinRedirect() with config:', {
        authority: AUTHENTIK_CONFIG.AUTHORITY,
        client_id: AUTHENTIK_CONFIG.CLIENT_ID,
        redirect_uri: AUTHENTIK_CONFIG.REDIRECT_URI
      })
      await userManager.signinRedirect()
      console.log('userManager.signinRedirect() completed successfully')
    } catch (err) {
      console.error('Signin redirect error:', err)
      error.value = `Failed to redirect to authentication server: ${err instanceof Error ? err.message : String(err)}`
      isLoading.value = false
    }
  }

  // Handle signin callback
  const handleSigninCallback = async () => {
    try {
      const callbackUser = await userManager.signinRedirectCallback()
      user.value = callbackUser
      // Clear URL parameters after successful authentication
      window.history.replaceState({}, document.title, window.location.pathname)
    } catch (err) {
      console.error('Signin callback error:', err)
      error.value = 'Authentication callback failed'
      throw err
    }
  }

  // Handle silent callback
  const handleSilentCallback = async () => {
    try {
      await userManager.signinSilentCallback()
      // Refresh user state after silent callback
      const refreshedUser = await userManager.getUser()
      user.value = refreshedUser
      // Clear URL parameters after successful silent authentication
      window.history.replaceState({}, document.title, window.location.pathname)
    } catch (err) {
      console.error('Silent signin callback error:', err)
      error.value = 'Silent authentication callback failed'
      throw err
    }
  }

  // Sign out redirect
  const signoutRedirect = async () => {
    isLoading.value = true
    error.value = null
    try {
      await userManager.signoutRedirect()
    } catch (err) {
      console.error('Signout redirect error:', err)
      error.value = 'Failed to sign out'
      isLoading.value = false
    }
  }

  // Silent signin
  const signinSilent = async () => {
    try {
      const renewedUser = await userManager.signinSilent()
      if (renewedUser) {
        user.value = renewedUser
        return renewedUser
      }
      throw new Error('Silent signin returned null')
    } catch (err) {
      console.error('Silent signin error:', err)
      throw err
    }
  }

  // Get access token for API calls
  const getAccessToken = async (): Promise<string | null> => {
    try {
      const currentUser = await userManager.getUser()
      if (currentUser && !currentUser.expired) {
        return currentUser.access_token
      }
      
      // Try silent renewal if token is expired
      const renewedUser = await signinSilent()
      return renewedUser?.access_token || null
    } catch (err) {
      console.error('Failed to get access token:', err)
      return null
    }
  }

  // Clear error
  const clearError = () => {
    error.value = null
  }

  return {
    // State
    user: user,
    isAuthenticated,
    isLoading,
    error,
    accessToken,
    userProfile,
    
    // Actions
    initialize,
    signinRedirect,
    handleSigninCallback,
    signoutRedirect,
    signinSilent,
    getAccessToken,
    clearError,
    
    // UserManager instance for advanced use cases
    userManager
  }
}

// Create a global instance
export const auth = useAuthentication()