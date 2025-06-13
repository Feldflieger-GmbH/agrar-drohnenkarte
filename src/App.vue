<template>
  <div class="flex flex-col min-h-screen">
    <!-- Header -->
    <header class="bg-blue-900 text-white px-6 py-4 text-2xl font-bold shadow">
      Agrar-Drohnenkarte
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
        <h3 class="font-bold mb-2">SHP-Import (ZIP)</h3>

        <div class="mb-4">
          <input
              type="file"
              accept=".zip"
              @change="handleShpUpload"
              class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100"
          />

          <button
              type="button"
              v-if="shapefileLayer"
              @click="removeShapefileLayer"
              class="mb-4 w-full px-3 py-2 rounded bg-teal-100 text-teal-700 font-semibold hover:bg-teal-200 transition"
          >
            Shape-Layer entfernen
          </button>
        </div>


        <h3 class="font-bold mb-2">KML-Import</h3>
        <div class="mb-4">
          <input
              type="file"
              accept=".kml"
              @change="handleKmlUpload"
              class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          <button
              type="button"
              v-if="kmlLayer"
              @click="removeKmlLayer"
              class="mt-2 mb-4 w-full px-3 py-2 rounded bg-blue-100 text-blue-700 font-semibold hover:bg-blue-200 transition"
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
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import KML from 'ol/format/KML'
import Text from 'ol/style/Text'


import shp from 'shpjs'
import GeoJSON from 'ol/format/GeoJSON'

import Polygon from 'ol/geom/Polygon'
import Style from 'ol/style/Style'
import Stroke from 'ol/style/Stroke'
import Fill from 'ol/style/Fill'
import Icon from 'ol/style/Icon'
import CircleStyle from 'ol/style/Circle'

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


const shapefileLayer = ref(null)
const kmlLayer = ref(null)
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
  map.on('click', function(evt) {
    console.log('click')
    getFeatureInfo(evt.coordinate, evt);
  });
  // Click-Listener für GetFeatureInfo
  map.on('singleclick', function(evt) {
    console.log('singleclick')
    getFeatureInfo(evt.coordinate, evt);
  });
})


const lineStyle= new Style({
  stroke: new Stroke({
    color: '#22d3ee',
    width: 3,
  }),
})

function removeKmlLayer() {
  if (kmlLayer.value) {
    map.removeLayer(kmlLayer.value)
    kmlLayer.value = null
  }
}

function removeShapefileLayer() {
  if (shapefileLayer.value) {
    map.removeLayer(shapefileLayer.value)
    shapefileLayer.value = null
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
          fill: new Fill({ color: '#0891b2' }),
          stroke: new Stroke({ color: '#fff', width: 3 }),
          overflow: true,
        })
        : undefined,
  })
}



function polygonInnerStyle(coords) { return new Style({
  stroke: new Stroke({ color: '#dc2626', width: 2, lineDash: [4,4] }),
  fill: new Fill({ color: 'rgba(255,255,255,0.8)' }),
  geometry: new Polygon([coords]), // Nur Innenring
})}

const circleStyle = new CircleStyle({
  radius: 6,
  fill: new Fill({ color: '#db2777' }),
  stroke: new Stroke({ color: '#fff', width: 2 })
})

function handleShpUpload(event) {
  const file = event.target.files[0]
  if (!file) return

  // Muss eine ZIP sein!
  if (!file.name.endsWith('.zip')) {
    alert('Bitte eine Shape-Datei als ZIP-Archiv hochladen.')
    return
  }


  const reader = new FileReader()
  reader.onload = function(e) {
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
        source: new VectorSource({ features }),
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

            styles.push( polygonStyle(feature) )
            for (let i = 1; i < coords.length; ++i) {
              styles.push(polygonInnerStyle  (coords[i]))
            }
            return styles
          }
        }
      })

      map.addLayer(shapefileLayer.value)

      // Zoom auf die Shape-Features
      const extent = shapefileLayer.value.getSource().getExtent()
      if (extent && extent[0] !== Infinity) {
        map.getView().fit(extent, { duration: 800, maxZoom: 14 })
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

  const reader = new FileReader()
  reader.onload = function(e) {
    let kmlText = e.target.result

    // Korrigiere <Name> zu <name> für OpenLayers-Kompatibilität!
    kmlText = kmlText.replace(/<Name>/g, '<name>').replace(/<\/Name>/g, '</name>')


    // Entferne alten KML-Layer, falls vorhanden
    if (kmlLayer.value) {
      map.removeLayer(kmlLayer.value)
      kmlLayer.value = null
    }
    const kmlFormat = new KML({ extractStyles: false })
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
      map.getView().fit(extent, { duration: 800, maxZoom: 14 })
    }
  }
  reader.readAsText(file)
}

function kmlStyle(feature) {
  // Beispiel: Verschiedene Geometrie-Typen unterschiedlich darstellen
  const PolyName = feature.get('name') || feature.get('NAME') || feature.get('Name') || 'NoName'
  if (feature.getGeometry().getType() === 'Point') {
    // Optional: Icon aus dem KML verwenden, falls vorhanden
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
        fill: new Fill({ color: '#1e40af' }),
        stroke: new Stroke({ color: '#fff', width: 2 }),
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
    styles.push( polygonStyle(feature)    )

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

  if (!url) {
    featureInfo.value = []
    return
  }



  fetch(url)
      .then(r => r.json())                // <-- check console if this throws
      .then(json => {
        // GeoServer / MapServer returns a FeatureCollection:
        // { "type":"FeatureCollection", "features":[ … ] }
        featureInfo.value = json.features ?? []
      })


}

watch(activeLayers, (newVal) => {
  dipulWmsLayer.getSource().updateParams({
    LAYERS: newVal.join(',')
  });
});

</script>
