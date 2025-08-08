<template>
  <div>
    <div class="space-y-2">
      <button
          class="flex items-center w-full py-1 focus:outline-none select-none group"
          type="button"
          @click="fieldOptimizationUI = !fieldOptimizationUI"
      >
        <svg :class="['w-4 h-4 mr-1 mb-1 transition-transform', fieldOptimizationUI ? 'rotate-90' : '']"
             fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path d="M9 5l7 7-7 7" stroke-width="2"/>
        </svg>
        <span class="font-bold mb-2 text-lg">Bearbeiten</span>
        <HelpTooltip>
          Eckpunkte anzeigen, um die Flächen zu bearbeiten. Linksklick zum löschen von Punkten.
        </HelpTooltip>
      </button>
    </div>
    <div v-show="fieldOptimizationUI">
      <div class="mb-3 flex items-center gap-2">
        <label for="fildOptiShowNodes">
          <input id="fildOptiShowNodes" v-model="showEdgePoints" class="form-checkbox" type="checkbox">
          Eckpunkte anzeigen
        </label>
      </div>

      <div class="flex items-center gap-2 mb-3">
        <label for="tol" class="font-semibold">Toleranz:</label>
        <input id="tol" type="number" v-model.number="simplifyTolerance"
               class="border rounded p-1 w-12" step="5" min="1" />
        <button @click="simplifyAllPolygons()"
                class="px-3 py-1 rounded bg-green-600 text-white font-semibold hover:bg-green-700">
          Felder vereinfachen
        </button>
      </div>
      <div v-if="removedVertexCount > 0" class="text-green-700 font-semibold">
        {{ removedVertexCount }} Punkt{{ removedVertexCount === 1 ? '' : 'e' }} entfernt!
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { removedVertexCount, showEdgePoints, simplifyAllPolygons, simplifyTolerance } from "../../composables/fieldOptimisatzion.ts"
import HelpTooltip from "../HelpTooltip.vue"

const fieldOptimizationUI = ref(false)
</script>