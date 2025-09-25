<template>
  <SidebarSection 
    title="Export" 
    help-text="Exportieren Sie Ihre Daten als Shapefile mit anpassbaren Feldnamen."
  >
    <div class="mb-3">
      <label class="block font-semibold text-sm mb-1">Präfix für Feldnamen:</label>
      <input
          type="text"
          v-model="fieldPrefix"
          class="border p-1 rounded w-full"
          placeholder="z. B. Muster-"
      />
    </div>
    
    <div class="space-y-2">
      <button
          @click="downloadAsShapefile"
          class="w-full px-3 py-1 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
      >
        Als ShapeFile herunterladen
      </button>

    </div>
  </SidebarSection>
</template>

<script setup lang="ts">

import { downloadAsShapefile, fieldPrefix } from "../../composables/shpDownloader.ts"
import SidebarSection from "./SidebarSection.vue"


</script>