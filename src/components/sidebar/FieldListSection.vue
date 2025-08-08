<template>
  <SidebarSection 
    title="Flächenliste" 
    help-text="Übersicht aller geladenen Flächen mit Namen, Größe und DIPUL-Prüfungsergebnissen. Klicken Sie auf eine Fläche, um dorthin zu zoomen."
    :default-expanded="true"
  >
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
        Keine Flächen geladen.
      </div>
  </SidebarSection>
</template>

<script setup lang="ts">
import { getArea } from "ol/sphere"
import type { Feature } from "ol"
import type { Geometry, MultiPolygon } from "ol/geom"
import type Polygon from "ol/geom/Polygon"
import { FieldList, zoomToPolygon } from "../../composables/customerMaps.ts"
import { dipulCheckActive, fieldsWithDipul } from "../../composables/dipulFeature.ts"
import SidebarSection from "./SidebarSection.vue"

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
</script>