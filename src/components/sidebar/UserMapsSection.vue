<template>
  <div>
    <div class="space-y-2">
      <button
          class="flex items-center w-full py-1 focus:outline-none select-none group"
          type="button"
          @click="userFieldsUI = !userFieldsUI"
      >
        <svg :class="['w-4 h-4 mr-1 mb-1 transition-transform', userFieldsUI ? 'rotate-90' : '']"
             fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path d="M9 5l7 7-7 7" stroke-width="2"/>
        </svg>
        <span class="font-bold mb-2 text-lg">Benutzer-Karten</span>
        <HelpTooltip>
          Laden Sie eigene KML- oder SHP-Dateien (als ZIP) hoch, um Ihre Felder und Flächen auf der Karte anzuzeigen.
        </HelpTooltip>
      </button>
    </div>
    <div v-show="userFieldsUI">
      <ul>
        <li v-for="layer in FieldLayerListRef" :key="layer.name">
          <label for="fldvsbl" class="font-bold">
            <input id="fldvsbl" v-model="layer.layerActive" v-on:change="toggleFieldLayerVisibility(layer.name)" class="form-checkbox " type="checkbox">
            {{layer.name}}
          </label>
          <button
              class="ml-4 pw-3 px-2 py-3 rounded bg-teal-100 text-teal-700 font-semibold hover:bg-teal-200 transition"
              type="button" v-on:click="removeFieldLayer(layer)"
          >
            X
          </button>
        </li>
      </ul>

      <h3 class="font-bold mb-2">Datei-Import (SHP: Zip, KML)</h3>
      <div class="mb-4">
        <input
            accept=".kml,.zip"
            class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            type="file"
            @change="handleFileUpload"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { FieldLayerListRef, removeFieldLayer, toggleFieldLayerVisibility, handleFileUpload } from "../../composables/customerMaps.ts"
import HelpTooltip from "../HelpTooltip.vue"

const userFieldsUI = ref(true)
</script>