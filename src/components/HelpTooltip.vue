<template>
  <div class="relative inline-block">
    <button
        ref="buttonRef"
        @mouseenter="showTooltip = true"
        @mouseleave="showTooltip = false"
        @click="showTooltip = !showTooltip"
        class="ml-1 w-3 h-3 bg-blue-500 text-white rounded-full text-xs inline-flex items-center justify-center hover:bg-blue-600 transition-colors"
        style="vertical-align: super; font-size: 8px;"
        type="button"
    >
      i
    </button>
    <teleport to="body">
      <div
          v-if="showTooltip"
          :style="tooltipStyle"
          class="fixed z-[9999] w-64 p-3 bg-gray-800 text-white text-sm rounded-lg shadow-lg"
      >
        <slot></slot>
        <div class="absolute top-3 -right-1 w-2 h-2 bg-gray-800 rotate-45"></div>
      </div>
    </teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'

const showTooltip = ref(false)
const buttonRef = ref<HTMLElement | null>(null)
const tooltipStyle = ref({})

watch(showTooltip, async (value) => {
  if (value && buttonRef.value) {
    await nextTick()
    const rect = buttonRef.value.getBoundingClientRect()
    // Place tooltip to the left of the button
    tooltipStyle.value = {
      top: `${rect.top + window.scrollY-10}px`,      // Same vertical position as button
      left: `${rect.left + window.scrollX - 265}px`, // 270 = width + margin (adjust as needed)
      position: 'absolute',
    }
  }
})
</script>
