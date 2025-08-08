<template>
  <SidebarSection 
    title="Benutzer-Karten" 
    help-text="Laden Sie eigene KML- oder SHP-Dateien (als ZIP) hoch, um Ihre Felder und Flächen auf der Karte anzuzeigen."
    :default-expanded="true"
  >
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
  </SidebarSection>
</template>

<script setup lang="ts">
import { FieldLayerListRef, removeFieldLayer, toggleFieldLayerVisibility, handleFileUpload } from "../../composables/customerMaps.ts"
import SidebarSection from "./SidebarSection.vue"
</script>