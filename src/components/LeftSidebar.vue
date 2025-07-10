<template>
<aside aria-label="Layer-Configuration"
       class="w-88 bg-gray-100 p-4 border-r border-gray-300 flex flex-col max-h-[calc(100vh-68px)]">
<div class="flex-1 overflow-y-auto">


  <div class="mb-4">
    <label class="block font-semibold mb-2">Basiskarte wählen:
      <select v-model="selectedBasemap" class="w-full p-1 border rounded" @change="changeBasemap">
        <option v-for="b in basemapList" :key="b.name" :value="b.name">{{ b.label }}</option>
      </select>
    </label>
  </div>


  <div class="mb-4">
    <label class="block font-semibold mb-2">Transparenz:</label>
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
      <!-- Chevron Icon -->
      <svg :class="['w-4 h-4 mr-1 transition-transform', dipulLayerUI ? 'rotate-90' : '']"
           fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path d="M9 5l7 7-7 7" stroke-width="2"/>
      </svg>
      <span class="font-semibold">DIPUL</span>
    </button>

  </div>
  <div v-show="dipulLayerUI">

      <div class="mb-4">
        <label class="block font-semibold mb-2">Transparenz:</label>
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
          <!-- Gruppenkopf -->
          <button
              class="flex items-center w-full py-1 focus:outline-none select-none group"
              type="button"
              @click="group.expanded = !group.expanded"
          >
            <!-- Chevron Icon -->
            <svg :class="['w-4 h-4 mr-1 transition-transform', group.expanded ? 'rotate-90' : '']"
                 fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M9 5l7 7-7 7" stroke-width="2"/>
            </svg>
            <!-- Farbpunkte (Gruppe) -->
            <span :class="['w-3 h-3 rounded-full mr-2', group.icon]"></span>
            <span class="font-semibold">{{ group.name }}</span>
          </button>
          <ul v-show="group.expanded" class="pl-7 mt-1 space-y-1">
            <li v-for="layer in group.layers" :key="layer.wmsName" class="flex items-center">
              <!-- Checkbox -->
              <input
                  v-model="layer.checked"
                  class="form-checkbox accent-blue-500"
                  type="checkbox"
                  @change="toggleLayer(layer)"
              />
              <!-- Farbpunkte (Layer) -->
              <span :class="['w-3 h-3 rounded-full mx-2', layer.color]"></span>
              <span>{{ layer.name }}</span>
            </li>
          </ul>
        </li>
      </ul>
    </div>
  </div>


  <div class="space-y-2">
    <button
        class="flex items-center w-full py-1 focus:outline-none select-none group"
        type="button"
        @click="geoBWLayerUI = !geoBWLayerUI"
    >
      <!-- Chevron Icon -->
      <svg :class="['w-4 h-4 mr-1 transition-transform', geoBWLayerUI ? 'rotate-90' : '']"
           fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path d="M9 5l7 7-7 7" stroke-width="2"/>
      </svg>
      <span class="font-semibold">GeoBW</span>
    </button>
    <div v-show="geoBWLayerUI">
      <div class="mb-4">
        <label class="block font-semibold mb-2">Transparenz:</label>
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
          <!-- Gruppenkopf -->
          <button
              class="flex items-center w-full py-1 focus:outline-none select-none group"
              type="button"
              @click="group.expanded = !group.expanded"
          >
            <!-- Chevron Icon -->
            <svg :class="['w-4 h-4 mr-1 transition-transform', group.expanded ? 'rotate-90' : '']"
                 fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M9 5l7 7-7 7" stroke-width="2"/>
            </svg>
            <!-- Farbpunkte (Gruppe) -->
            <span :class="['w-3 h-3 rounded-full mr-2', group.icon]"></span>
            <span class="font-semibold">{{ group.name }}</span>
          </button>
          <ul v-show="group.expanded" class="pl-7 mt-1 space-y-1">
            <li v-for="layer in group.layers" :key="layer.wmsName" class="flex items-center">
              <!-- Checkbox -->
              <input
                  v-model="layer.checked"
                  class="form-checkbox accent-blue-500"
                  type="checkbox"
                  @change="toggleGeoBWLayer(layer)"
              />
              <!-- Farbpunkte (Layer) -->
              <span :class="['w-3 h-3 rounded-full mx-2', layer.color]"></span>
              <span>{{ layer.name }}</span>
            </li>
          </ul>
        </li>
      </ul>
    </div>
  </div>


</div>
</aside>
</template>
<script setup lang="ts">
import {basemapList, changeBasemap, selectedBasemap} from "../composables/basemap.ts";
import {baseOpacity} from "../composables/basemap.ts";
import {dipulLayerGroups, dipulLayerUI, dipulOpacity, toggleLayer} from "../composables/dipulLayers.ts";
import {ref} from "vue";
import {geobwOpacity, geoBWLayerGroups, toggleGeoBWLayer} from "../composables/geoBWLayer.ts";


const geoBWLayerUI = ref(false)
</script>