<template>
  <div>
    <div class="space-y-2">
      <button
          class="flex items-center w-full py-1 focus:outline-none select-none group"
          type="button"
          @click="exportUI = !exportUI"
      >
        <svg :class="['w-4 h-4 mr-1 mb-1 transition-transform', exportUI ? 'rotate-90' : '']"
             fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path d="M9 5l7 7-7 7" stroke-width="2"/>
        </svg>
        <span class="font-bold mb-2 text-lg">Export</span>
        <HelpTooltip>
          Exportieren der Daten als Shapefile mit anpassbaren Feldnamen.
        </HelpTooltip>
      </button>
    </div>
    <div v-show="exportUI">
      <div class="mb-3">
        <label class="block font-semibold text-sm mb-1">Präfix für Feldnamen:</label>
        <input
            type="text"
            v-model="fieldPrefix"
            class="border p-1 rounded w-full"
            placeholder="z. B. Muster-"
        />
      </div>
      <button
          @click="downloadAsShapefile"
          class="px-3 py-1 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
      >
        Als ShapeFile herunterladen
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { downloadAsShapefile, fieldPrefix } from "../../composables/shpDownloader.ts"
import HelpTooltip from "../HelpTooltip.vue"

const exportUI = ref(false)
</script>