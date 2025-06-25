<template>
  <aside aria-label="Customer-Data"
         class="w-72 bg-gray-50 p-4 border-l border-gray-300 flex flex-col max-h-[calc(100vh-68px)]">
    <div class="flex-1 overflow-y-auto">

      <h2 class="font-bold mb-2">Infos</h2>

      <h3 class="font-bold mb-2">SHP-Import (ZIP)</h3>
      <div class="mb-4">
        <input
            accept=".zip"
            class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100"
            type="file"
            @change="handleShpUpload"
        />

        <button
            v-if="shapefileLayer"
            class="mb-4 w-full px-3 py-2 rounded bg-teal-100 text-teal-700 font-semibold hover:bg-teal-200 transition"
            type="button"
            @click="removeShapefileLayer"
        >
          Shape-Layer entfernen
        </button>
      </div>


      <h3 class="font-bold mb-2">KML-Import</h3>
      <div class="mb-4">
        <input
            accept=".kml"
            class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            type="file"
            @change="handleKmlUpload"
        />
        <button
            v-if="kmlLayer"
            class="mt-2 mb-4 w-full px-3 py-2 rounded bg-blue-100 text-blue-700 font-semibold hover:bg-blue-200 transition"
            type="button"
            @click="removeKmlLayer"
        >
          KML-Layer entfernen
        </button>
      </div>


      <div v-if="featureInfo.length" class="mb-4">
        <h4 class="font-bold mb-2">Objekte an dieser Stelle:</h4>

        <div v-for="f in featureInfo" :key="f.id" class="border rounded p-2">
          <p class="font-bold text-xl">{{ f.properties.type_code }}</p>
          <div v-for="(v, k) in f.properties" :key="k">
            <span class="font-semibold">{{ k }}:</span> {{ v || '-' }}
          </div>
        </div>

      </div>


      <!-- Liste nach Zonen -->
      <div class="mb-6">
        <h4 class="font-bold mb-2">Dipul-Zonen und betroffene Felder</h4>
        <div class="mb-3 flex items-center gap-2">
          <label for="dipulCheck">
            <input id="dipulCheck" v-model="dipulCheckActive" class="form-checkbox" type="checkbox">
            Dipul-Check Aktiv
          </label>
        </div>
        <div v-if="dipulCheckActive" class="mb-3 flex items-center gap-2">
          <label for="dipulCheckRes">
            <input id="dipulCheckRes" v-model="dipulCheckRes" class="form-textbox" max="10" min="2" type="number">
            Auflösung (jeder x-te punkt wird geprüft.)
          </label>
        </div>
        <div v-if="dipulCheckActive" class="mb-3 flex items-center gap-2">
          <label for="dipulCheckShowPoints">
            <input id="dipulCheckShowPoints" v-model="dipulCheckShowPoints" class="form-checkbox" type="checkbox">
            Prüfpunkte anzeigen
          </label>
        </div>
        <div v-if="dipulCheckActive && Object.keys(dipulZoneToFields).length > 0">
          <div
              v-for="(zoneNameList, zoneCategory) in dipulZoneToFields"
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
                <li v-for="feld in felder" :key="JSON.stringify(feld.getGeometry().getCoordinates()[0][0])">
                  {{ feld.get('name') || feld.get('NAME') || feld.get('bez') || '-' }}
                  &nbsp;(
                  {{
                    (getArea(feld.getGeometry(), {projection: 'EPSG:3857'}) / 10000).toLocaleString(undefined, {maximumFractionDigits: 2}) + ' ha'

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

      <!-- Flächenliste -->
      <div v-if="allPolygonFeatures.length" class="mb-4">
        <h4 class="font-bold mb-2">Flächen auf der Karte</h4>
        <div class="font-bold mt-4">
          Flächenzahl:&nbsp;
          {{ allPolygonFeatures.length }}
        </div>
        <div class="font-bold mt-4">
          Gesamtfläche:&nbsp;
          {{
            (() => {
              const sum = allPolygonFeatures.reduce(
                  (acc, f) => acc + getArea(f.getGeometry(), {projection: 'EPSG:3857'}), 0
              )
              return (sum / 10000).toLocaleString(undefined, {maximumFractionDigits: 2}) + ' ha'
            })()
          }}
        </div>
        <ul class="space-y-2">
          <li
              v-for="(f, i) in allPolygonFeatures"
              :key="f.getId() || i"
              class="border rounded p-2 bg-white shadow"
              @click="zoomToPolygon(f)"
          >
            <div>
              <span class="font-semibold">Name:</span>
              {{ f.get('name') || f.get('NAME') || f.get('bez') || '-' }}
            </div>
            <div>
              <span class="font-semibold">Fläche:</span>
              {{
                (
                    (getArea(f.getGeometry(), {projection: 'EPSG:3857'}) / 10000).toLocaleString(undefined, {maximumFractionDigits: 2}) + ' ha'
                )
              }}
            </div>
            <div>
              <span class="font-semibold">DIPUL-Zonen:</span>
              <template
                  v-if="polygonsWithDipul.length === 0 || polygonsWithDipul[f.getId() || JSON.stringify(f.getGeometry().getCoordinates()[0][0])] === null">
                <span class="text-gray-400">⏳ Prüfung läuft…</span>
              </template>
              <template
                  v-else-if="polygonsWithDipul.length > 0 && polygonsWithDipul[f.getId() || JSON.stringify(f.getGeometry().getCoordinates()[0][0])].length === 0">
                <span class="text-green-600 font-bold"> Keine</span>
              </template>
              <ul
                  v-else
                  class="list-disc list-inside text-sm mt-1"
              >
                <li
                    v-for="feature in polygonsWithDipul[f.getId() || JSON.stringify(f.getGeometry().getCoordinates()[0][0])]"
                    :key="feature.id"
                >
                  <span class="font-semibold">{{ feature.id }}</span>
                  <template v-if="feature.properties">
                    <template v-if="feature.properties.type_code">
                      ({{ feature.properties.type_code }})
                    </template>
                    <template v-if="feature.properties.name && feature.properties.name !== ''">
                      – {{ feature.properties.name }}
                    </template>
                  </template>
                </li>
              </ul>
            </div>
          </li>
        </ul>
      </div>
      <div v-else class="text-gray-400 italic">
        (Keine Flächen geladen)
      </div>
    </div>

  </aside>
</template>
<script setup lang="ts">
import {getArea} from "ol/sphere";
import {
  allPolygonFeatures,
  dipulCheckActive,
  dipulCheckRes, dipulCheckShowPoints, dipulZoneToFields, featureInfo,
  handleKmlUpload,
  handleShpUpload,
  kmlLayer, polygonsWithDipul, removeKmlLayer,
  removeShapefileLayer,
  shapefileLayer, zoomToPolygon
} from "../composables/customerMaps.ts";
</script>