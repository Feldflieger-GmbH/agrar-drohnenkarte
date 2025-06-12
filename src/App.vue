<template>
  <div class="flex flex-col min-h-screen">
    <!-- Header -->
    <header class="bg-blue-900 text-white px-6 py-4 text-2xl font-bold shadow">
      Mein Geo-Viewer
    </header>

    <!-- Drei-Spalten-Layout -->
    <div class="flex flex-1 min-h-0">
      <!-- Linke Sidebar -->
      <aside class="w-72 bg-gray-100 p-4 border-r border-gray-300 flex flex-col">
        <div class="mb-4">
          <label class="block font-semibold mb-2">Basiskarte wählen:</label>
          <select v-model="selectedBasemap" @change="changeBasemap" class="w-full p-1 border rounded">
            <option v-for="b in basemaps" :key="b.name" :value="b.name">{{ b.label }}</option>
          </select>
        </div>
        <h3 class="font-bold mb-2 mt-6">Kartenlayer</h3>
        <div class="space-y-1 overflow-y-auto flex-1">
          <div v-for="layer in dipulLayers" :key="layer.wmsName">
            <label class="inline-flex items-center space-x-2">
              <input
                  type="checkbox"
                  v-model="activeLayers"
                  :value="layer.wmsName"
                  @change="toggleLayer(layer)"
                  class="form-checkbox"
              />
              <span>{{ layer.name }}</span>
            </label>
          </div>
        </div>
      </aside>

      <!-- Kartenbereich -->
      <main class="flex-1 flex flex-col min-w-0">
        <div ref="mapContainer" class="flex-1 min-h-0"></div>
      </main>

      <!-- Rechte Sidebar -->
      <aside class="w-72 bg-gray-50 p-4 border-l border-gray-300 flex flex-col">
        <!-- Hier ist Platz für Legende, Upload, Koordinaten etc. -->
        <h2 class="font-bold mb-2">Infos</h2>

        <div v-if="featureInfo.length" class="mb-4">
          <h4 class="font-bold mb-2">Objekte an dieser Stelle:</h4>

          <div v-for="f in featureInfo" :key="f.id" class="border rounded p-2">
            <p class="font-bold text-xl">{{ f.properties.type_code }}</p>
            <div v-for="(v, k) in f.properties" :key="k">
              <span class="font-semibold">{{ k }}:</span> {{ v || '-' }}
            </div>
          </div>

        </div>


      </aside>


    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import 'ol/ol.css'
import Map from 'ol/Map'
import View from 'ol/View'
import TileLayer from 'ol/layer/Tile'
import XYZ from 'ol/source/XYZ'
import TileWMS from 'ol/source/TileWMS'

const DIPUL_WMS_URL = 'https://uas-betrieb.de/geoservices/dipul/wms'

const dipulLayers = [
  { name: "Flugplätze", wmsName: "dipul:flugplaetze" },
  { name: "Flughäfen", wmsName: "dipul:flughaefen" },
  { name: "Kontrollzonen", wmsName: "dipul:kontrollzonen" },
  { name: "Flugbeschränkungsgebiete", wmsName: "dipul:flugbeschraenkungsgebiete" },
  { name: "Bundesautobahnen", wmsName: "dipul:bundesautobahnen" },
  { name: "Bundesstraßen", wmsName: "dipul:bundesstrassen" },
  { name: "Bahnanlagen", wmsName: "dipul:bahnanlagen" },
  { name: "Binnenwasserstraßen", wmsName: "dipul:binnenwasserstrassen" },
  { name: "Seewasserstraßen", wmsName: "dipul:seewasserstrassen" },
  { name: "Schifffahrtsanlagen", wmsName: "dipul:schifffahrtsanlagen" },
  { name: "Wohngrundstücke", wmsName: "dipul:wohngrundstuecke" },
  { name: "Freibäder und Badestrände", wmsName: "dipul:freibaeder" },
  { name: "Industrieanlagen", wmsName: "dipul:industrieanlagen" },
  { name: "Kraftwerke", wmsName: "dipul:kraftwerke" },
  { name: "Umspannwerke", wmsName: "dipul:umspannwerke" },
  { name: "Stromleitungen", wmsName: "dipul:stromleitungen" },
  { name: "Windkraftanlagen", wmsName: "dipul:windkraftanlagen" },
  { name: "JVA und Einrichtungen des Maßregelvollzugs", wmsName: "dipul:justizvollzugsanstalten" },
  { name: "Militärische Anlagen und Organisationen", wmsName: "dipul:militaerische_anlagen" },
  { name: "Einrichtungen BSL-4", wmsName: "dipul:labore" },
  { name: "Behörden", wmsName: "dipul:behoerden" },
  { name: "Diplomatische und konsularische Vertretungen", wmsName: "dipul:diplomatische_vertretungen" },
  { name: "Internationale Organisationen", wmsName: "dipul:internationale_organisationen" },
  { name: "Liegenschaften der Polizei", wmsName: "dipul:polizei" },
  { name: "Andere Sicherheitsbehörden", wmsName: "dipul:sicherheitsbehoerden" },
  { name: "Krankenhäuser", wmsName: "dipul:krankenhaeuser" },
  { name: "Nationalparks", wmsName: "dipul:nationalparks" },
  { name: "Naturschutzgebiete", wmsName: "dipul:naturschutzgebiete" },
  { name: "FFH-Gebiete", wmsName: "dipul:ffh-gebiete" },
  { name: "Vogelschutzgebiete", wmsName: "dipul:vogelschutzgebiete" },
  { name: "Temporäre Betriebseinschränkungen", wmsName: "dipul:temporaere_betriebseinschraenkungen" },
  { name: "Modellflugplätze", wmsName: "dipul:modellflugplaetze" },
];

const infoContent = ref(''); // Zum Anzeigen im Template (Sidebar oder Popup)
const activeLayers = ref(dipulLayers.map(layer => layer.wmsName))
let dipulWmsLayer = null;

// Basemap-Auswahl
const basemaps = [
  {
    name: "osm",
    label: "OpenStreetMap",
    layer: () => new TileLayer({
      source: new XYZ({
        url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png'
      })
    })
  },
  {
    name: "satellite",
    label: "Satellit (ESRI)",
    layer: () => new TileLayer({
      source: new XYZ({
        url: 'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      })
    })
  }
]
const selectedBasemap = ref("osm")
let currentBaseLayer = null;

const mapContainer = ref(null)
let map
let baseLayers = {}
const wmsLayers = {}

onMounted(() => {
  const selected = basemaps.find(b => b.name === selectedBasemap.value)
  currentBaseLayer = selected.layer()

  dipulWmsLayer = new TileLayer({
    source: new TileWMS({
      url: DIPUL_WMS_URL,
      params: {
        LAYERS: activeLayers.value.join(','),
        TILED: true,
      },
      serverType: 'geoserver',
    }),
    opacity: 0.6,
    visible: true,
  })


  map = new Map({
    target: mapContainer.value,
    layers: [currentBaseLayer, dipulWmsLayer], // Start mit aktueller Basemap
    view: new View({
      center: [930000, 6640000],
      zoom: 8,
    }),
  })


  // Click-Listener für GetFeatureInfo
  map.on('singleclick', function(evt) {
    getFeatureInfo(evt.coordinate, evt);
  });
})


function changeBasemap() {
  if (currentBaseLayer) {
    map.removeLayer(currentBaseLayer)
  }

  const selected = basemaps.find(b => b.name === selectedBasemap.value)
  currentBaseLayer = selected.layer()
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
        'QUERY_LAYERS': activeLayers.value.join(','),
        'feature_count': 100
      }
  );
  if (url) {
    fetch(url)
        .then(response => response.json())
        .then(data => {
          featureInfo.value = data.features || [];
        });
  } else {
    featureInfo.value = [];
  }
}

watch(activeLayers, (newVal) => {
  dipulWmsLayer.getSource().updateParams({
    LAYERS: newVal.join(',')
  });
});

</script>
