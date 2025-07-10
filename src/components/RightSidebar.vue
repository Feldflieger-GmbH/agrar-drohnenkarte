<template>
  <aside aria-label="Customer-Data"
         class="w-72 bg-gray-50 p-4 border-l border-gray-300 flex flex-col max-h-[calc(100vh-68px)]">
    <div class="flex-1 overflow-y-auto">


      <h3 class="font-bold mb-2">Geladene Karten</h3>

      <ul>
        <li v-for="layer in FieldLayerListRef" :key="layer.name">

          <label for="fldvsbl"  class="font-bold">
            <input id="fldvsbl" v-model="layer.active" v-on:change="toggleFieldLayerVisibility(layer.name)" class="form-checkbox " type="checkbox">
            {{layer.name}}
          </label>
          <button
              class="ml-4 pw-3 px-2 py-2 rounded bg-teal-100 text-teal-700 font-semibold hover:bg-teal-200 transition"
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


      <div v-if="featureInfo.length" class="mb-4">
        <h3 class="font-bold mb-2">Objekte an dieser Stelle:</h3>

        <div v-for="f in featureInfo" :key="f.id" class="border rounded p-2">
          <p class="font-bold text-xl">{{ f.properties.type_code }}</p>
          <div v-for="(v, k) in f.properties" :key="k">
            <span class="font-semibold">{{ k }}:</span> {{ v || '-' }}
          </div>
        </div>

      </div>

      <!-- Liste nach Zonen -->
      <div class="mb-6" >
        <div class="mb-3 flex items-center gap-2">
          <label for="dipulCheck"  class="font-bold">
            <input id="dipulCheck" v-model="dipulCheckActive" class="form-checkbox " type="checkbox">
            Dipul-Check Aktiv
          </label>
        </div>
        <div v-if="dipulCheckActive" class="mb-3 flex items-center gap-2">
          <label for="dipulCheckRes">
            <input id="dipulCheckRes" v-model="dipulCheckRes" class="form-textbox " max="10" min="2" type="number">
            Auflösung (jeder x-te punkt wird geprüft.)
          </label>
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
          (Keine Überschneidungen gefunden)
        </div>
      </div>

      <div class="space-y-2">
        <button
            class="flex items-center w-full py-1 focus:outline-none select-none group"
            type="button"
            @click="fieldOptimizationUI = !fieldOptimizationUI"
        >
          <!-- Chevron Icon -->
          <svg :class="['w-4 h-4 mr-1 transition-transform', fieldOptimizationUI ? 'rotate-90' : '']"
               fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M9 5l7 7-7 7" stroke-width="2"/>
          </svg>
          <span class="font-semibold">Datei-Optimierungen</span>
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


      <!-- Flächenliste -->
      <div class="space-y-2">
        <button
            class="flex items-center w-full py-1 focus:outline-none select-none group"
            type="button"
            @click="fieldListUI = !fieldListUI"
        >
          <!-- Chevron Icon -->
          <svg :class="['w-4 h-4 mr-1 transition-transform', fieldListUI ? 'rotate-90' : '']"
               fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M9 5l7 7-7 7" stroke-width="2"/>
          </svg>
          <span class="font-semibold">Flächenliste</span>
        </button>

      </div>
      <div v-show="fieldListUI">
      <div v-if="FieldList.length" class="mb-4">
        <div class="font-bold mt-4">
          Flächenzahl:&nbsp;
          {{ FieldList.length }}
        </div>
        <div class="font-bold">
          Gesamtfläche:&nbsp;
          {{
            (() => {
              const sum = FieldList.reduce(
                  (acc, f) => acc + getArea(f.geometry, {projection: 'EPSG:3857'}), 0
              )
              return (sum / 10000).toLocaleString(undefined, {maximumFractionDigits: 2}) + ' ha'
            })()
          }}
        </div>
        <ul class="space-y-2">
          <li
              v-for="(f, i) in FieldList"
              :key="f.feature.getId() || i"
              class="border rounded p-2 bg-white shadow"
              @click="zoomToPolygon(f.feature)"
          >
            <div>
              <span class="font-semibold">Name:</span>
              {{ f.feature.get('name') || f.feature.get('NAME') || f.feature.get('bez') || '-' }}
            </div>
            <div>
              <span class="font-semibold">Fläche:</span>
              {{
                (
                    (getArea(f.geometry, {projection: 'EPSG:3857'}) / 10000).toLocaleString(undefined, {maximumFractionDigits: 2}) + ' ha'
                )
              }}
            </div>
            <div v-if="dipulCheckActive">
              <span class="font-semibold">DIPUL-Zonen: </span>
              <template v-if="getDipulForFeature(f) === null">
                <span class="text-gray-400">⏳ Prüfung läuft…</span>
              </template>
              <template v-else-if="Array.isArray(getDipulForFeature(f)) && getDipulForFeature(f).length === 0">
                <span class="text-green-600 font-bold">Keine</span>
              </template>
              <ul
                  v-else-if="Array.isArray(getDipulForFeature(f))"
                  class="list-disc list-inside text-sm mt-1"
              >
                <li v-for="feature in getDipulForFeature(f)" :key="feature.id">
                  <span class="font-semibold">{{ feature.properties.type_code }}</span>
                  <template v-if="feature.properties">
                    <template v-if="feature.properties.name && feature.properties.name !== ''">
                      – {{ feature.properties.name }}
                    </template>
                  </template>
                </li>
              </ul>
              <template v-else>
                <span class="text-gray-400">⏳ Prüfung läuft…</span>
              </template>

            </div>
          </li>
        </ul>
      </div>
      <div v-else class="text-gray-400 italic">
        (Keine Flächen geladen)
      </div>
    </div>
    </div>

  </aside>
</template>
<script setup lang="ts">
import {getArea} from "ol/sphere";
import {
  FieldList, FieldLayerListRef,
  removeFieldLayer, toggleFieldLayerVisibility, zoomToPolygon, handleFileUpload
} from "../composables/customerMaps.ts";
import type Polygon from "ol/geom/Polygon";
import type {Feature} from "ol";
import type {Geometry, MultiPolygon} from "ol/geom";
import {onMounted, ref} from "vue";
import {
  removedVertexCount,
  showEdgePoints,
  simplifyAllPolygons,
  simplifyTolerance
} from "../composables/fieldOptimisatzion.ts";
import {downloadAsShapefile, fieldPrefix} from "../composables/shpDownloader.ts";
import {
  dipulCheckActive,
  dipulCheckRes,
  dipulCheckShowPoints, dipulZoneList, featureInfo,
  fieldsWithDipul
} from "../composables/dipulFeature.ts";


onMounted(() => {
  console.log("RightSidebar mounted")
})


function getDipulForFeature(f: {
  feature: Feature<Geometry>
  geometry: Polygon | MultiPolygon
}) {

  let fID;
  let ID = f.feature.getId()
  if (ID != undefined) {
    fID = ID.toString()
  }


  const key: string = fID || JSON.stringify(f.geometry.getCoordinates()[0][0]);
  const v = fieldsWithDipul.value[key]
  return v;
}
const fieldOptimizationUI = ref(true)
const fieldListUI = ref(true)
</script>