<template>
  <SidebarSection 
    title="Bearbeiten"
    help-text="Eckpunkte anzeigen, um die Flächen zu bearbeiten. Linksklick zum löschen von Punkten."
  >
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
        <HelpTooltip>
          Findet und entfernt überflüssige Punkte. Höhere Toleranz entfernt mehr Punkte.
        </HelpTooltip>
      </div>
      <div v-if="removedVertexCount > 0" class="text-green-700 font-semibold">
        {{ removedVertexCount }} Punkt{{ removedVertexCount === 1 ? '' : 'e' }} entfernt!
      </div>
  </SidebarSection>
</template>

<script setup lang="ts">
import { removedVertexCount, showEdgePoints, simplifyAllPolygons, simplifyTolerance } from "../../composables/fieldOptimisatzion.ts"
import SidebarSection from "./SidebarSection.vue"
import HelpTooltip from "../HelpTooltip.vue";
</script>