<template>
  <div class="flex flex-col min-h-screen">
    <!-- Header -->
    <header class="bg-blue-900 text-white px-6 py-4 text-2xl font-bold shadow">
      <div class="flex">
        Agrar-Drohnenkarte
        <span class="font-light text-sm m-2">by Feldflieger GmbH</span>
        <span class="font-light text-sm m-2"><a href="https://feldflieger.eu" target="_blank">https://feldflieger.eu</a></span>
        <span class="m-2">
          <a href="https://www.instagram.com/feldflieger.eu/" target="_blank"><!-- Instagram -->
            <span class="[&>svg]:h-5 [&>svg]:w-5">
              <svg
                  fill="currentColor"
                  viewBox="0 0 448 512"
                  xmlns="http://www.w3.org/2000/svg">
                <!--!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc. -->
                <path
                    d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z"/>
              </svg>
            </span>
          </a>
        </span>

        <span class="m-2">
          <a href="https://github.com/Feldflieger-GmbH/agrar-drohnenkarte" target="_blank">
            <span class="[&>svg]:h-5 [&>svg]:w-5">
              <svg
                  fill="currentColor"
                  viewBox="0 0 496 512"
                  xmlns="http://www.w3.org/2000/svg">
                <!--!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc. -->
                <path
                    d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3 .3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5 .3-6.2 2.3zm44.2-1.7c-2.9 .7-4.9 2.6-4.6 4.9 .3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3 .7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3 .3 2.9 2.3 3.9 1.6 1 3.6 .7 4.3-.7 .7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3 .7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3 .7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z"/>
              </svg>
            </span>
         </a>
        </span>
        <span class="font-light text-sm m-2"><a href="https://feldflieger.eu/impressum/"
                                                target="_blank">Impressum</a></span>
      </div>
    </header>

    <!-- Drei-Spalten-Layout -->
    <div class="flex flex-1 min-h-0">
      <!-- Linke Sidebar -->
      <aside aria-label="Layer-Configuration"
             class="w-88 bg-gray-100 p-4 border-r border-gray-300 flex flex-col max-h-[calc(100vh-68px)]">
        <div class="flex-1 overflow-y-auto">


          <div class="mb-4">
            <label class="block font-semibold mb-2">Basiskarte wählen:
              <select v-model="selectedBasemap" class="w-full p-1 border rounded" @change="changeBasemap">
                <option v-for="b in basemaps" :key="b.name" :value="b.name">{{ b.label }}</option>
              </select>
            </label>
          </div>


          <div class="mb-4">
            <label class="block font-semibold mb-2">Basiskarten-Transparenz:</label>
            <input
                v-model.number="baseOpacity"
                class="w-full"
                max="1"
                min="0"
                step="0.01"
                type="range"
            />
            <div class="text-sm text-gray-500">
              {{ Math.round(baseOpacity * 100) }}&nbsp;%
            </div>
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
              <span class="font-semibold">DIPUL-Layer</span>
            </button>

            <div v-show="dipulLayerUI">
              <ul>
                <li v-for="(group, gIdx) in dipulLayerGroups" :key="group.name" class="">
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


        </div>
      </aside>

      <!-- Kartenbereich -->
      <main class="flex-1 flex flex-col min-w-0">
        <div ref="mapContainer" class="flex-1 min-h-0"></div>
      </main>

      <!-- Rechte Sidebar -->
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


    </div>
  </div>
</template>

<script setup>
import {computed, onMounted, ref, watch} from 'vue'
import 'ol/ol.css'
import Map from 'ol/Map'
import View from 'ol/View'
import TileLayer from 'ol/layer/Tile'
import XYZ from 'ol/source/XYZ'
import TileWMS from 'ol/source/TileWMS'
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import KML from 'ol/format/KML'
import Text from 'ol/style/Text'
import {getArea} from 'ol/sphere'
import {Attribution} from 'ol/control';
import OSM from 'ol/source/OSM';
import shp from 'shpjs'
import GeoJSON from 'ol/format/GeoJSON'

import Polygon from 'ol/geom/Polygon'
import Style from 'ol/style/Style'
import Stroke from 'ol/style/Stroke'
import Fill from 'ol/style/Fill'
import Icon from 'ol/style/Icon'
import CircleStyle from 'ol/style/Circle'
import {Feature} from "ol";
import {Point} from "ol/geom.js";
import pinImg from './assets/pin_mini_16px.png'

const DIPUL_WMS_URL = 'https://uas-betrieb.de/geoservices/dipul/wms'
const ALKIS_WMS_URL = 'https://owsproxy.lgl-bw.de/owsproxy/ows/WMTS_LGL-BW_ALKIS_Basis? '

const alkisLayerGroups = ref([
  {name: "Flurstücke", wmsName: "Flurstücke", color: 'bg-red-200', checked: false},])

const dipulLayerUI = ref(false)
const dipulLayerGroups = ref([
  {
    name: 'Luftverkehr',
    icon: 'bg-red-300',
    expanded: false,
    layers: [
      {name: 'Flugplätze', wmsName: 'dipul:flugplaetze', color: 'bg-red-200', checked: true},
      {name: 'Flughäfen', wmsName: 'dipul:flughaefen', color: 'bg-red-200', checked: true},
      {name: 'Kontrollzonen', wmsName: 'dipul:kontrollzonen', color: 'bg-red-200', checked: true},
      {
        name: 'Flugbeschränkungsgebiete',
        wmsName: 'dipul:flugbeschraenkungsgebiete',
        color: 'bg-red-200',
        checked: true
      },
    ]
  },
  {
    name: 'Straßenverkehr',
    icon: 'bg-gray-300',
    expanded: false,
    layers: [
      {name: 'Bundesautobahnen', wmsName: 'dipul:bundesautobahnen', color: 'bg-gray-200', checked: true},
      {name: 'Bundesstraßen', wmsName: 'dipul:bundesstrassen', color: 'bg-gray-200', checked: true},
    ]
  },
  {
    name: 'Schienenverkehr',
    icon: 'bg-gray-400',
    expanded: false,
    layers: [
      {name: 'Bahnanlagen', wmsName: 'dipul:bahnanlagen', color: 'bg-gray-100', checked: true}
    ]
  },
  {
    name: 'Schiffsverkehr',
    icon: 'bg-blue-200',
    expanded: false,
    layers: [
      {name: 'Binnenwasserstraßen', wmsName: 'dipul:binnenwasserstrassen', color: 'bg-blue-100', checked: true},
      {name: 'Seewasserstraßen', wmsName: 'dipul:seewasserstrassen', color: 'bg-blue-100', checked: true},
      {name: 'Schifffahrtsanlagen', wmsName: 'dipul:schifffahrtsanlagen', color: 'bg-blue-100', checked: true},
    ]
  },
  {
    name: 'Siedlungen',
    icon: 'bg-yellow-200',
    expanded: false,
    layers: [
      {name: 'Wohngrundstücke', wmsName: 'dipul:wohngrundstuecke', color: 'bg-yellow-200', checked: true},
      {name: "Freibäder und Badestrände", wmsName: "dipul:freibaeder", color: 'bg-yellow-200', checked: true},
    ]
  },
  {
    name: 'Industrie',
    icon: 'bg-gray-600',
    expanded: false,
    layers: [
      {name: "Industrieanlagen", wmsName: "dipul:industrieanlagen", color: 'bg-gray-600', checked: true},
      {name: "Kraftwerke", wmsName: "dipul:kraftwerke", color: 'bg-gray-600', checked: true},
      {name: "Umspannwerke", wmsName: "dipul:umspannwerke", color: 'bg-gray-600', checked: true},
      {name: "Stromleitungen", wmsName: "dipul:stromleitungen", color: 'bg-gray-600', checked: true},
      {name: "Windkraftanlagen", wmsName: "dipul:windkraftanlagen", color: 'bg-gray-600', checked: true},
    ]
  },
  {
    name: 'Einrichtungen und Behörden',
    icon: 'bg-orange-200',
    expanded: false,
    layers: [
      {
        name: "JVA und Einrichtungen des Maßregelvollzugs",
        wmsName: "dipul:justizvollzugsanstalten",
        color: 'bg-orange-200',
        checked: true
      },
      {
        name: "Militärische Anlagen und Organisationen",
        wmsName: "dipul:militaerische_anlagen",
        color: 'bg-orange-200',
        checked: true
      },
      {name: "Einrichtungen BSL-4", wmsName: "dipul:labore", color: 'bg-orange-200', checked: true},
      {name: "Behörden", wmsName: "dipul:behoerden", color: 'bg-orange-200', checked: true},
      {
        name: "Diplomatische und konsularische Vertretungen",
        wmsName: "dipul:diplomatische_vertretungen",
        color: 'bg-orange-200',
        checked: true
      },
      {
        name: "Internationale Organisationen",
        wmsName: "dipul:internationale_organisationen",
        color: 'bg-orange-200',
        checked: true
      },
      {name: "Liegenschaften der Polizei", wmsName: "dipul:polizei", color: 'bg-orange-200', checked: true},
      {
        name: "Andere Sicherheitsbehörden",
        wmsName: "dipul:sicherheitsbehoerden",
        color: 'bg-orange-200',
        checked: true
      },
      {name: "Krankenhäuser", wmsName: "dipul:krankenhaeuser", color: 'bg-orange-200', checked: true},
    ]
  },
  {
    name: 'Naturschutz',
    icon: 'bg-green-200',
    expanded: false,
    layers: [
      {name: "Nationalparks", wmsName: "dipul:nationalparks", color: 'bg-green-200', checked: true},
      {name: "Naturschutzgebiete", wmsName: "dipul:naturschutzgebiete", color: 'bg-green-200', checked: true},
      {name: "FFH-Gebiete", wmsName: "dipul:ffh-gebiete", color: 'bg-green-200', checked: true},
      {name: "Vogelschutzgebiete", wmsName: "dipul:vogelschutzgebiete", color: 'bg-green-200', checked: true},
    ]
  },
  {
    name: 'Temporäre Betriebseinschränkungen',
    icon: 'bg-red-200',
    expanded: false,
    layers: [
      {
        name: "Temporäre Betriebseinschränkungen",
        wmsName: "dipul:temporaere_betriebseinschraenkungen",
        color: 'bg-red-200',
        checked: true
      },
    ]
  },
  {
    name: 'Weitere Gebiete zur Information',
    icon: 'bg-yellow-200',
    expanded: false,
    layers: [
      {name: "Modellflugplätze", wmsName: "dipul:modellflugplaetze", color: 'bg-yellow-200', checked: true},
    ]
  }
])


const polygonsWithDipul = ref({})
const shapefileLayer = ref(null)
const kmlLayer = ref(null)
let dipulWmsLayer = null;
const dipulCheckShowPoints = ref(false)
const dipulCheckActive = ref(true)
const dipulCheckRes = ref(5)


const activeDipulLayers = ref([])

// Basemap-Auswahl
const basemaps = [
  {
    name: "osm",
    label: "OpenStreetMap",
    layer: () => new TileLayer({
      source: new OSM(),
    }),
  },
  {
    name: "satellite",
    label: "Satellit (ESRI)",
    layer: () => new TileLayer({
      source: new XYZ({
        url: 'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        attributions: "Powered by <a href='https://www.esri.com/en-us/home' target='_blank'>Esri</a>"
      })
    })
  }
]

const selectedBasemap = ref("osm")
let currentBaseLayer = null;

const baseOpacity = ref(1) // 1 = 100%, 0 = ganz durchsichtig
const mapContainer = ref(null)
let map
let baseLayers = {}
const wmsLayers = {}

const pinSource = new VectorSource()
const pinLayer = new VectorLayer({
  source: pinSource,
  zIndex: 99,
  visible: dipulCheckShowPoints.value
})

// Aktualisiere die Layer-Opacity, wenn sich der Wert ändert:
watch(baseOpacity, (val) => {
  if (currentBaseLayer) currentBaseLayer.setOpacity(val)
})

watch(dipulCheckShowPoints, (val) => {
  pinLayer.setVisible(val)
})

function toggleLayer(layer) {
  // Hier muss deine Layer-Anzeige-Logik rein.
  // Beispiel: Layer ein-/ausblenden (OpenLayers)
  const layerName = layer.wmsName
  if (layer.checked) {
    if (!activeDipulLayers.value.includes(layerName)) {
      activeDipulLayers.value.push(layerName)
      dipulWmsLayer.getSource().updateParams({
        LAYERS: activeDipulLayers.value.join(',')
      });
    }
  } else {
    const idx = activeDipulLayers.value.indexOf(layerName)
    if (idx !== -1) {
      activeDipulLayers.value.splice(idx, 1)
      dipulWmsLayer.getSource().updateParams({
        LAYERS: activeDipulLayers.value.join(',')
      });
    }
  }
}


onMounted(() => {
  const selected = basemaps.find(b => b.name === selectedBasemap.value)
  currentBaseLayer = selected.layer()

  dipulWmsLayer = new TileLayer({
    source: new TileWMS({
      url: DIPUL_WMS_URL,
      params: {
        LAYERS: activeDipulLayers.value.join(','),
        TILED: true,
      },
      serverType: 'geoserver',
    }),
    opacity: 0.6,
    visible: true,
  })


  map = new Map({
    target: mapContainer.value,
    controls: [new Attribution({collapsible: false})],
    layers: [currentBaseLayer, dipulWmsLayer], // Start mit aktueller Basemap
    view: new View({
      center: [930000, 6640000],
      zoom: 8,
    }),
  })

  map.addLayer(pinLayer)

  // Click-Listener für GetFeatureInfo
  map.on('click', function (evt) {
    console.log('click')
    getFeatureInfo(evt.coordinate, evt);
  });
  // Click-Listener für GetFeatureInfo
  map.on('singleclick', function (evt) {
    console.log('singleclick')
    getFeatureInfo(evt.coordinate, evt);
  });

  dipulLayerGroups.value.forEach(group => {
    group.layers.forEach(layer => {
      if (layer.checked) toggleLayer(layer)
    })
  })
})


const lineStyle = new Style({
  stroke: new Stroke({
    color: '#22d3ee',
    width: 3,
  }),
})

function removeKmlLayer() {
  if (kmlLayer.value) {
    map.removeLayer(kmlLayer.value)
    kmlLayer.value = null
    removeAllPins()
  }
}

function removeShapefileLayer() {
  if (shapefileLayer.value) {
    map.removeLayer(shapefileLayer.value)
    shapefileLayer.value = null
    removeAllPins()
  }
}


function polygonStyle(feature) {
  const props = feature.getProperties()
  const polyName = props.name || props.NAME || props.Name || props.FLUR || props.BEZEICHNUNG || '' // Holt das <Name>-Element

  return new Style({
    stroke: new Stroke({
      color: '#2563eb', // blau
      width: 2,

    }),
    fill: new Fill({
      color: 'rgba(37, 99, 235, 0.2)',
    }),
    text: polyName // oder ein anderes Feld
        ? new Text({
          text: polyName, // DBF-Feldname!
          font: 'bold 14px Arial, sans-serif',
          fill: new Fill({color: '#0891b2'}),
          stroke: new Stroke({color: '#fff', width: 3}),
          overflow: true,
        })
        : undefined,
  })
}

function polygonInnerStyle(coords) {
  return new Style({
    stroke: new Stroke({color: '#dc2626', width: 2, lineDash: [4, 4]}),
    fill: new Fill({color: 'rgba(255,255,255,0.8)'}),
    geometry: new Polygon([coords]), // Nur Innenring
  })
}

const circleStyle = new CircleStyle({
  radius: 6,
  fill: new Fill({color: '#db2777'}),
  stroke: new Stroke({color: '#fff', width: 2})
})
const allPolygonFeatures = computed(() => {
  const features = []
  if (kmlLayer.value) {
    features.push(...kmlLayer.value.getSource().getFeatures().filter(f => {
      const t = f.getGeometry().getType()
      return t === 'Polygon' || t === 'MultiPolygon'
    }))
  }
  if (shapefileLayer.value) {
    features.push(...shapefileLayer.value.getSource().getFeatures().filter(f => {
      const t = f.getGeometry().getType()
      return t === 'Polygon' || t === 'MultiPolygon'
    }))
  }
  // Nach Name sortieren
  return features.sort((a, b) => {
    const nameA = getFeatureName(a);
    const nameB = getFeatureName(b);
    // use localeCompare for proper alphabetical order;
    // sensitivity:'base' makes it case- and accent-insensitive
    return nameA.localeCompare(nameB, undefined, {sensitivity: 'base'});
  })
})

function getFeatureName(feature) {
  const props = feature.getProperties();
  // try all your possible name fields, default to empty string
  const name = (
      props.name ||
      props.NAME ||
      props.Name ||
      props.FLUR ||
      props.BEZEICHNUNG ||
      ''
  ).toString();

  console.log("FeatureName: ", name)

  return name;
}

function zoomToPolygon(feature) {
  // Hole das Extent der Geometrie
  const geometry = feature.getGeometry()
  if (geometry) {
    map.getView().fit(geometry, {
      padding: [60, 60, 60, 60], // Ränder
      maxZoom: 18,               // nicht zu weit reinzoomen
      duration: 600,             // Animationseffekt
    })
  }
}


const dipulZoneToFields = computed(() => {
  // Key: DIPUL-Feature-ID (oder Name)
  // Value: Array von Polygon-Features
  const mapping = {}
  allPolygonFeatures.value.forEach(fld => {
    const key = fld.getId() || JSON.stringify(fld.getGeometry().getCoordinates()[0][0])
    const dipulList = polygonsWithDipul.value[key] || []
    dipulList.forEach(zone => {
      // Zonen-Namen/Feld als Key nehmen (z.B. zone.properties.type_code + zone.id)
      // Nutze am besten eine sprechende Anzeige
      const zoneKey1 = zone.properties?.type_code
      const zoneKey2 = (zone.properties?.name || zone.id)

      if (!mapping[zoneKey1]) {
        mapping[zoneKey1] = {}
      }

      if (!mapping[zoneKey1][zoneKey2]) mapping[zoneKey1][zoneKey2] = []
      mapping[zoneKey1][zoneKey2].push(fld)
    })
  })
  return mapping
})


watch([allPolygonFeatures, dipulCheckActive, dipulCheckRes], async ([features, checkActive]) => {
  if (!checkActive) {
    polygonsWithDipul.value = {}
    return
  }
  removeAllPins()
  const results = {}
  const featurePromises = []
  for (const f of features) {
    const id = f.getId() || JSON.stringify(f.getGeometry().getCoordinates()[0][0])
    const p = getDipulFeaturesForPolygon(f).then(value => {
      results[id] = value
      if (value.length > 0) {
        //break
      }
    })
    featurePromises.push(p)


  }
  await Promise.all(featurePromises)
  polygonsWithDipul.value = results
}, {immediate: true})

function removeAllPins() {
  pinSource.clear()
}

// Funktion zum Setzen des Pins an Koordinaten (EPSG:3857!)
function addPinAt(coord) {
  const pinFeature = new Feature({
    geometry: new Point(coord),
  })
  //const textC = coord.toString()
  pinFeature.setStyle(
      new Style({
        /*text: textC // oder ein anderes Feld
            ? new Text({
              text: textC, // DBF-Feldname!
              font: 'bold 14px Arial, sans-serif',
              fill: new Fill({ color: '#0891b2' }),
              stroke: new Stroke({ color: '#fff', width: 3 }),
              overflow: true,
            })
            : undefined,*/
        image: new Icon({
          src: pinImg,
          anchor: [0.5, 1],
          scale: 1, // Passe ggf. die Größe an
        }),
      })
  )
  pinSource.addFeature(pinFeature)
}

async function getDipulFeaturesForPolygon(polygonFeature) {
  const geom = polygonFeature.getGeometry()
  let rings = []

  if (geom.getType() === 'Polygon') {
    rings = [geom.getCoordinates()[0]]
  } else if (geom.getType() === 'MultiPolygon') {
    rings = geom.getCoordinates().map(coords => coords[0])
  }

  const foundFeatures = []

  for (const exteriorRing of rings) {
    const testCoordinates = exteriorRing.filter((_, idx) => idx % dipulCheckRes.value === 0)

    for (const coordinate of testCoordinates) {
      console.log("Request features for: ", coordinate)
      addPinAt(coordinate)
      const url = dipulWmsLayer.getSource().getFeatureInfoUrl(
          coordinate,
          map.getView().getResolutionForZoom(18),
          'EPSG:3857',
          {
            INFO_FORMAT: 'application/json',
            QUERY_LAYERS: activeDipulLayers.value.join(','),
            feature_count: 100
          }
      )
      if (!url) continue

      try {
        const res = await fetch(url)
        if (!res.ok) continue
        const data = await res.json()
        if (data.features && data.features.length > 0) {
          // Füge alle gefundenen Feature-Objekte hinzu, ohne Duplikate (nach id)
          data.features.forEach(feat => {
            if (!foundFeatures.some(f => f.id === feat.id)) {
              console.log("Feat: ", feat)
              foundFeatures.push(feat)
            }
          })
        }
      } catch (e) { /* ignorieren */
      }


    }
  }

  return foundFeatures
}


function handleShpUpload(event) {
  const file = event.target.files[0]
  if (!file) return

  // Muss eine ZIP sein!
  if (!file.name.endsWith('.zip')) {
    alert('Bitte eine Shape-Datei als ZIP-Archiv hochladen.')
    return
  }

  removeAllPins()
  const reader = new FileReader()
  reader.onload = function (e) {
    const arrayBuffer = e.target.result

    shp(arrayBuffer).then(geojson => {
      // geojson ist ein FeatureCollection-Objekt
      const features = new GeoJSON().readFeatures(geojson, {
        featureProjection: 'EPSG:3857',
      })

      // Alten Layer ggf. entfernen
      if (shapefileLayer.value) {
        map.removeLayer(shapefileLayer.value)
      }

      // Layer mit einfachem Style
      shapefileLayer.value = new VectorLayer({
        source: new VectorSource({features}),
        style: (feature) => {
          if (feature.getGeometry().getType() === 'Point') {
            return new Style({
              image: circleStyle
            })
          }
          if (feature.getGeometry().getType() === 'LineString') {
            return lineStyle
          }
          if (feature.getGeometry().getType() === 'Polygon') {
            const coords = feature.getGeometry().getCoordinates()
            const styles = []

            styles.push(polygonStyle(feature))
            for (let i = 1; i < coords.length; ++i) {
              styles.push(polygonInnerStyle(coords[i]))
            }
            return styles
          }
        }
      })

      map.addLayer(shapefileLayer.value)

      // Zoom auf die Shape-Features
      const extent = shapefileLayer.value.getSource().getExtent()
      if (extent && extent[0] !== Infinity) {
        map.getView().fit(extent, {duration: 800, maxZoom: 14})
      }
    })
        .catch(err => {
          alert('Fehler beim Lesen der Shape-Datei: ' + err)
        })
  }
  reader.readAsArrayBuffer(file)
}

function handleKmlUpload(event) {
  const file = event.target.files[0]
  if (!file) return
  removeAllPins()
  const reader = new FileReader()
  reader.onload = function (e) {
    let kmlText = e.target.result

    // Korrigiere <Name> zu <name> für OpenLayers-Kompatibilität!
    kmlText = kmlText.replace(/<Name>/g, '<name>').replace(/<\/Name>/g, '</name>')


    // Entferne alten KML-Layer, falls vorhanden
    if (kmlLayer.value) {
      map.removeLayer(kmlLayer.value)
      kmlLayer.value = null
    }
    const kmlFormat = new KML({extractStyles: false})
    // Erzeuge neuen KML-Layer
    kmlLayer.value = new VectorLayer({
      source: new VectorSource({
        features: kmlFormat.readFeatures(kmlText, {
          featureProjection: 'EPSG:3857'
        })
      }),
      style: kmlStyle           // <- will now be called
    })

    map.addLayer(kmlLayer.value)

    // Optional: Zoom auf die KML-Geometrie
    const extent = kmlLayer.value.getSource().getExtent()
    if (extent && extent[0] !== Infinity) {
      map.getView().fit(extent, {duration: 800, maxZoom: 14})
    }
  }
  reader.readAsText(file)
}

function kmlStyle(feature) {
  if (feature.getGeometry().getType() === 'Point') {
    const iconHref = feature.getStyle() && feature.getStyle().getImage() && feature.getStyle().getImage().getSrc();

    if (iconHref) {
      return new Style({
        image: new Icon({
          src: iconHref,
          scale: 1.2,
        }),
      });
    }
    // Fallback: Einfacher Kreis
    return new Style({
      image: new CircleStyle({
        radius: 7,
        fill: new Fill({color: '#1e40af'}),
        stroke: new Stroke({color: '#fff', width: 2}),
      }),
    })
  }
  // Linien (z.B. Tracks)
  if (feature.getGeometry().getType() === 'LineString') {
    return new Style({
      stroke: new Stroke({
        color: '#eab308', // gelb
        width: 3,
      }),
    })
  }
  // Flächen (z.B. Polygone)
  if (feature.getGeometry().getType() === 'Polygon') {
    const coords = feature.getGeometry().getCoordinates()
    const styles = []

    // 1. Außenring: blau gefüllt
    styles.push(polygonStyle(feature))

    // 2. Alle Innenringe (Löcher): separat, z. B. rot umranden, weiß füllen
    for (let i = 1; i < coords.length; ++i) {
      styles.push(polygonInnerStyle(coords[i]))
    }
    return styles
  }
  // Standard-Fallback
  return new Style({
    stroke: new Stroke({
      color: '#a21caf', // violett
      width: 2,
    }),
    fill: new Fill({
      color: 'rgba(162, 28, 175, 0.1)',
    }),
  })
}

function changeBasemap() {
  if (currentBaseLayer) {
    map.removeLayer(currentBaseLayer)
  }

  const selected = basemaps.find(b => b.name === selectedBasemap.value)
  currentBaseLayer = selected.layer()
  currentBaseLayer.setOpacity(baseOpacity.value)
  // Füge neuen Basemap-Layer GANZ vorne ein

  map.getLayers().insertAt(0, currentBaseLayer)
}

// Funktion für GetFeatureInfo
const featureInfo = ref([]) // Array für Features
function getFeatureInfo(coordinate, evt) {
  const view = map.getView();
  const viewResolution = view.getResolution();
  const source = dipulWmsLayer.getSource();

  const url = source.getFeatureInfoUrl(
      coordinate,
      viewResolution,
      'EPSG:3857',
      {
        'INFO_FORMAT': 'application/json',
        'QUERY_LAYERS': activeDipulLayers.value.join(','),
        'feature_count': 100
      }
  );

  if (!url) {
    featureInfo.value = []
    return
  }


  fetch(url)
      .then(r => r.json())                // <-- check console if this throws
      .then(json => {
        featureInfo.value = json.features ?? []
      })


}

watch(activeDipulLayers, (newVal) => {
  dipulWmsLayer.getSource().updateParams({
    LAYERS: newVal.join(',')
  });
});

</script>
