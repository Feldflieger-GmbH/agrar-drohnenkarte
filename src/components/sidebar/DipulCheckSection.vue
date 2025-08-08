<template>
  <SidebarSection 
    title="Dipul-Check" 
    help-text="Prüfen Sie Ihre Flächen automatisch auf Überschneidungen mit DIPUL-Zonen. Aktivieren Sie den Check und passen Sie die Auflösung an."
    :default-expanded="true"
  >
      <div v-if="featureInfo.length" class="mb-4">
        <h3 class="font-bold mb-2">Objekte an dieser Stelle:</h3>
        <div v-for="f in featureInfo" :key="f.id" class="border rounded p-2">
          <p class="font-bold text-xl">{{ f.properties.type_code }}</p>
          <div v-for="(v, k) in f.properties" :key="k">
            <span class="font-semibold">{{ k }}:</span> {{ v || '-' }}
          </div>
        </div>
      </div>

      <div class="mb-3 flex items-center gap-2">
        <label for="dipulCheck" class="font-bold">
          <input id="dipulCheck" v-model="dipulCheckActive" class="form-checkbox " type="checkbox">
          Check Aktiv
        </label>
      </div>
      
      <div v-if="dipulCheckActive && dipulCheckProgress.inProgress" class="mb-3">
        <DipulProgressBar />
      </div>
      <div v-if="dipulCheckActive" class="mb-3 flex items-center gap-2">

        <input id="dipulCheckRes" v-model="dipulCheckRes" class="border rounded p-1 w-16" max="10" min="2" type="number">
        <label for="dipulCheckRes"> Auflösung (jeder x-te punkt wird geprüft.)         </label>

      </div>
      <div v-if="dipulCheckActive" class="mb-3 flex items-center gap-2">
        <label for="dipulCheckShowPoints">
          <input id="dipulCheckShowPoints" v-model="dipulCheckShowPoints" class="form-checkbox" type="checkbox">
          Prüfpunkte anzeigen
        </label>
      </div>
      <div v-if="dipulCheckActive && Object.keys(dipulZoneList).length > 0">
        <div
            v-for="(zoneNameList, zoneCategory) in dipulZoneList"
            :key="zoneCategory"
            class="mb-4"
        >
          <div class="font-semibold text-blue-700 mb-1">
            {{ zoneCategory }}
          </div>
          <div
              v-for="(felder, zoneName) in zoneNameList"
              :key="zoneName"
              class="mb-4"
          >
            <div class="font-semibold text-blue-400 mb-1">
              {{ zoneName }}
            </div>
            <ul class="ml-3 list-disc text-sm">
              <li v-for="feld in felder" :key="JSON.stringify(feld.geometry.getCoordinates()[0][0])">
                {{ feld.feature.get('name') || feld.feature.get('NAME') || feld.feature.get('bez') || '-' }}
                &nbsp;(
                {{
                  (getArea(feld.geometry, {projection: 'EPSG:3857'}) / 10000).toLocaleString(undefined, {maximumFractionDigits: 2}) + ' ha'
                }}
                )
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div v-else-if="dipulCheckActive" class="text-gray-400 italic">
        Keine Überschneidungen gefunden.
      </div>
  </SidebarSection>
</template>

<script setup lang="ts">
import { getArea } from "ol/sphere"
import { dipulCheckActive, dipulCheckRes, dipulCheckShowPoints, dipulZoneList, featureInfo, dipulCheckProgress } from "../../composables/dipulFeature.ts"
import DipulProgressBar from "../DipulProgressBar.vue"
import SidebarSection from "./SidebarSection.vue"
</script>