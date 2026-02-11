import { computed } from 'vue'

// Premium feature flag from runtime config
export const isPremium = computed(() => {
  const val = window.config?.premium
  return val === true || val === 'true'
})

// Backwards-compatible group check — returns true when premium
export const hasGroup = (_groupName: string): boolean => {
  return isPremium.value
}

export const hasGoogleMapsAccess = computed(() => isPremium.value)
