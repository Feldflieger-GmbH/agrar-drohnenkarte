<template>
  <div>
    <div class="space-y-2 bg-gray-200">
      <button
          class="flex items-center w-full py-1 focus:outline-none select-none group"
          type="button"
          @click="isExpanded = !isExpanded"
      >
        <svg :class="['w-4 h-4 mr-1 mb-1 transition-transform', isExpanded ? 'rotate-90' : '']"
             fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path d="M9 5l7 7-7 7" stroke-width="2"/>
        </svg>
        <span class="font-bold mb-2 text-lg">{{ title }}</span>
        <HelpTooltip>
          {{ helpText }}
        </HelpTooltip>
      </button>
    </div>
    <div v-show="isExpanded" class="p-4">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import HelpTooltip from "../HelpTooltip.vue"

interface Props {
  title: string
  helpText: string
  defaultExpanded?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  defaultExpanded: false
})

const isExpanded = ref(props.defaultExpanded)
</script>