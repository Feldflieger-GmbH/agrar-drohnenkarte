<template>
  <SidebarSection 
    title="Betriebsvolumen (GRB, CV)" 
    help-text="Berechnen des Ground Risk Buffers und Contingency-Volumes nach LBA-Richtlinien."
  >

      <div class="mb-3 flex gap-2">
        <button @click="calculateAndShowBuffers()"
                class="px-3 py-1 rounded bg-red-600 text-white font-semibold hover:bg-red-700">
          Berechnen
        </button>
        <button @click="deleteBuffers()"
                class="px-3 py-1 rounded bg-gray-600 text-white font-semibold hover:bg-gray-700">
          Löschen
        </button>
      </div>

      <div class="mb-3">
        <button @click="generateKML()"
                :disabled="isGenerating"
                class="px-3 py-1 rounded bg-green-600 text-white font-semibold hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed w-full">
          {{ isGenerating ? 'Generiere KML...' : 'KML + Dipul-Dateien generieren' }}
        </button>
      </div>

      
      <div class="mb-3 flex items-center gap-2">
        <label for="v0Value" class="font-semibold">v0 (km/h):</label>
        <input id="v0Value" type="number" v-model.number="v0" 
               class="border rounded p-1 w-16" step="1" min="0" />
      </div>
      
      <div class="mb-3 flex items-center gap-2">
        <label for="cdValue" class="font-semibold">Characteristic Dimension (m):</label>
        <input id="cdValue" type="number" v-model.number="cd" 
               class="border rounded p-1 w-16" step="0.1" min="0" />
        <HelpTooltip>
          3.25m für T25
        </HelpTooltip>
      </div>
      
      <div class="mb-3 flex items-center gap-2">
        <label for="flightHeightValue" class="font-semibold">Flight Height (m):</label>
        <input id="flightHeightValue" type="number" v-model.number="flightHeight" 
               class="border rounded p-1 w-16" step="1" min="0" />
      </div>
      
      <div v-if="calculatedValues.calculated" class="mt-4 p-3 bg-gray-100 rounded">
        <h3 class="font-bold mb-2">Berechnete Werte:</h3>
        
        <div class="mb-2">
          <div class="font-semibold">Horizontal</div>
          <div>Contingency Volume SCV = {{ calculatedValues.scv.toFixed(1) }} m</div>
          <div>Ground Risk Buffer SGRB = {{ calculatedValues.sgrb.toFixed(1) }} m</div>
        </div>
        
        <div>
          <div class="font-semibold">Vertikal</div>
          <span>Contingency Volume HCV = {{ calculatedValues.hcv.toFixed(1) }} m</span>
          <div>Flight Geography HFG = {{ calculatedValues.hfg.toFixed(1) }} m</div>
        </div>
      </div>

      <div class="mt-4 p-3 bg-gray-100 rounded">
        <h3 class="font-bold mb-2">⚠️ Hinweis ⚠️</h3>

        <div class="mb-2">
          <div class="font-semibold">Referenz</div>
          <span ><a href="https://www.lba.de/SharedDocs/Downloads/DE/B/B5_UAS/Leitfaden_FG_CV_GRB.pdf?__blob=publicationFile&v=2">Leitfaden zur Dimensionierung des LBA Rev 1.7</a></span>
        </div>

        <div class="mb-2">
          <div class="font-semibold">Annahmen</div>
          <ul>
            <li>Höhenmessfehler 𝐻𝑏𝑎𝑟𝑜 = 1 m für barometrische Höhenmessung</li>
            <li>Reaktionshöhe 𝐻𝑅𝑍: Reaktionszeit: t=1 s, mit 45° Bahnneigewinkel, 𝐻𝑅𝑍 = 𝑉0 ∙ 0,7 ∙ 1 s</li>
            <li>GPS – Ungenauigkeit: 𝑆𝐺𝑃𝑆 = 3m</li>
            <li>Positionshaltefehler: 𝑆𝑃𝑜𝑠 = 3m</li>
            <li>Kartenfehler: 𝑆𝐾 = 1m</li>
            <li>Reaktionsweg: 𝑆𝑅𝑍: Reaktionszeit: t=1 s, 𝑆𝑅𝑍 = 𝑉0 ∙ 1 s</li>
            <li>Maximaler Nickwinkel Θmax 45°</li>
          </ul>
        </div>

        <div class="font-bold mb-2">⚠️ Verwendung auf eigene Gefahr!</div>
      </div>
  </SidebarSection>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import {
  calculateGRBCV,
  setV0,
  setCD,
  setFlightHeight,
  getCalculatedValues,
  deleteAllBuffers
} from '../../composables/contingencyVolume';
import {FieldLayerList, FieldLayerListRef} from '../../composables/customerMaps';
import { getApiUrl } from '../../config/api';
import SidebarSection from "./SidebarSection.vue";
import HelpTooltip from "../HelpTooltip.vue";
import GeoJSON from "ol/format/GeoJSON";
import type {Feature} from "ol";
import {fieldPrefix} from "../../composables/shpDownloader.ts";
const v0 = ref(12); // Default value 25 km/h (approximately 7 m/s)
const cd = ref(3.15); // Default characteristic dimension
const flightHeight = ref(10); // Default flight height in meters
const isGenerating = ref(false);

// Object to store calculated values
const calculatedValues = ref({
  calculated: false,
  scv: 0,
  sgrb: 0,
  hcv: 0,
  hfg: 0
});


function deleteBuffers() {
  // Delete all buffers
  deleteAllBuffers();
  
  // Reset calculated values display
  calculatedValues.value.calculated = false;
}

function calculateAndShowBuffers() {
  // Set all values before calculation
  setV0(v0.value);
  setCD(cd.value);
  setFlightHeight(flightHeight.value);
  
  // Calculate buffers
  calculateGRBCV();
  
  // Get calculated values
  const values = getCalculatedValues();
  calculatedValues.value = {
    calculated: true,
    scv: values.scv,
    sgrb: values.sgrb,
    hcv: values.hcv,
    hfg: values.hfg
  };

}

async function generateKML() {
  if (FieldLayerList.length === 0) {
    alert('Keine Felder vorhanden. Bitte laden Sie zuerst Felddaten hoch.');
    return;
  }

  isGenerating.value = true;

  // Get current field data
  const fieldsData: Array<{
    name: string;
    geometry: any;
  }> = [];

  try {
    // Convert field features to GeoJSON format expected by the API
    FieldLayerListRef.value.forEach(layerItem => {
      layerItem.featureList.forEach(featureItem => {
        const fieldName = getFeatureName(featureItem.feature);

        // Convert OpenLayers geometry to GeoJSON
        const geoJsonFormat = new GeoJSON();
        const fieldGeometry = JSON.parse(geoJsonFormat.writeGeometry(featureItem.geometry, {
          featureProjection: 'EPSG:3857',
          dataProjection: 'EPSG:4326'
        }));

        fieldsData.push({
          name: fieldName,
          geometry: fieldGeometry
        });
      });
    });

    if (fieldsData.length === 0) {
      alert('Keine gültigen Felder gefunden.');
      return;
    }

    function getFeatureName(feature: Feature): string {
      const props = feature.getProperties();
      return (
          props.name ||
          props.NAME ||
          props.Name ||
          props.FLUR ||
          props.BEZEICHNUNG ||
          'Unnamed Field'
      ).toString();
    }


    // Prepare request payload
    const timestamp = new Date().toISOString().split('T')[0];
    const payload = {
      fields: fieldsData,
      prefix: fieldPrefix.value || 'felder',
      timestamp: new Date().toISOString(),
      v0: v0.value,
      characteristicDimension: cd.value,
      flightHeight: flightHeight.value
    };


    // Make API request
    const response = await fetch(getApiUrl('GENERATE_KML'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Fehler bei der KML-Generierung');
    }

    // Download the ZIP file
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `agrarkarte_grb_cv_buffers_${timestamp}.zip`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

  } catch (error) {
    console.error('KML generation error:', error);
    alert(`Fehler bei der KML-Generierung: ${error instanceof Error ? error.message : 'Unbekannter Fehler'}`);
  } finally {
    isGenerating.value = false;
  }
}
</script>