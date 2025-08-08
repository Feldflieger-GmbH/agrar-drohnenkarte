<template>
  <SidebarSection 
    title="Basis-Karte" 
    help-text="Wählen Sie hier die Grundkarte aus (OpenStreetMap oder Satellit) und passen Sie die Transparenz der Kartenebenen an."
  >
      <div class="mb-2">
        <label class="block font-semibold mb-2">Karte wählen:
          <select v-model="selectedBasemap" class="w-full p-1 border rounded" @change="changeBasemap">
            <option v-for="b in basemapList" :key="b.name" :value="b.name">{{ b.label }}</option>
          </select>
        </label>
      </div>
      <div>
        <label class="block">Transparenz:</label>
        <input
            v-model.number="baseOpacity"
            class="w-full"
            max="1"
            min="0"
            step="0.01"
            type="range"
        />
      </div>

      <div class="space-y-2">
        <button
            class="flex items-center w-full py-1 focus:outline-none select-none group"
            type="button"
            @click="dipulLayerUI = !dipulLayerUI"
        >
          <svg :class="['w-4 h-4 mr-1 transition-transform', dipulLayerUI ? 'rotate-90' : '']"
               fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M9 5l7 7-7 7" stroke-width="2"/>
          </svg>
          <span class="font-semibold">DIPUL</span>
        </button>
      </div>
      <div v-show="dipulLayerUI" class="pl-3 pr-2">
        <label class="block">Transparenz:</label>
        <input
            v-model.number="dipulOpacity"
            class="w-full"
            max="1"
            min="0"
            step="0.01"
            type="range"
        />
        <ul>
          <li v-for="(group, _) in dipulLayerGroups" :key="group.name" class="">
            <button
                class="flex items-center w-full py-1 focus:outline-none select-none group"
                type="button"
                @click="group.expanded = !group.expanded"
            >
              <svg :class="['w-4 h-4 mr-1 transition-transform', group.expanded ? 'rotate-90' : '']"
                   fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M9 5l7 7-7 7" stroke-width="2"/>
              </svg>
              <span :class="['w-3 h-3 rounded-full mr-2', group.icon]"></span>
              <span class="font-semibold">{{ group.name }}</span>
            </button>
            <ul v-show="group.expanded" class="pl-7 mt-1 space-y-1">
              <li v-for="layer in group.layers" :key="layer.wmsName" class="flex items-center">
                <input
                    v-model="layer.checked"
                    class="form-checkbox accent-blue-500"
                    type="checkbox"
                    @change="toggleLayer(layer)"
                />
                <span :class="['w-3 h-3 rounded-full mx-2', layer.color]"></span>
                <span>{{ layer.name }}</span>
              </li>
            </ul>
          </li>
        </ul>
      </div>

      <div class="space-y-2">
        <button
            class="flex items-center w-full py-1 focus:outline-none select-none group"
            type="button"
            @click="geoBWLayerUI = !geoBWLayerUI"
        >
          <svg :class="['w-4 h-4 mr-1 transition-transform', geoBWLayerUI ? 'rotate-90' : '']"
               fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M9 5l7 7-7 7" stroke-width="2"/>
          </svg>
          <span class="font-semibold">GeoBW</span>
        </button>
      </div>
      <div v-show="geoBWLayerUI" class="pl-3 pr-2">
        <div>
          <label class="block">Transparenz:</label>
          <input
              v-model.number="geobwOpacity"
              class="w-full"
              max="1"
              min="0"
              step="0.01"
              type="range"
          />
        </div>
        <ul>
          <li v-for="(group, _) in geoBWLayerGroups" :key="group.name" class="">
            <button
                class="flex items-center w-full py-1 focus:outline-none select-none group"
                type="button"
                @click="group.expanded = !group.expanded"
            >
              <svg :class="['w-4 h-4 mr-1 transition-transform', group.expanded ? 'rotate-90' : '']"
                   fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M9 5l7 7-7 7" stroke-width="2"/>
              </svg>
              <span :class="['w-3 h-3 rounded-full mr-2', group.icon]"></span>
              <span class="font-semibold">{{ group.name }}</span>
            </button>
            <ul v-show="group.expanded" class="pl-7 space-y-1">
              <li v-for="layer in group.layers" :key="layer.wmsName" class="flex items-center">
                <input
                    v-model="layer.checked"
                    class="form-checkbox accent-blue-500"
                    type="checkbox"
                    @change="toggleGeoBWLayer(layer)"
                />
                <span :class="['w-3 h-3 rounded-full mx-2', layer.color]"></span>
                <span>{{ layer.name }}</span>
              </li>
            </ul>
          </li>
        </ul>
      </div>
  </SidebarSection>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { basemapList, baseOpacity, changeBasemap, selectedBasemap } from "../../composables/basemap.ts"
import { dipulLayerGroups, dipulLayerUI, dipulOpacity, toggleLayer } from "../../composables/dipulLayers.ts"
import { geoBWLayerGroups, geobwOpacity, toggleGeoBWLayer } from "../../composables/geoBWLayer.ts"
import SidebarSection from "./SidebarSection.vue"

const geoBWLayerUI = ref(false)
</script>