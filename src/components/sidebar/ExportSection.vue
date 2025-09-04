<template>
  <SidebarSection 
    title="Export" 
    help-text="Exportieren Sie Ihre Daten als Shapefile mit anpassbaren Feldnamen."
  >
    <div class="mb-3">
      <label class="block font-semibold text-sm mb-1">Präfix für Feldnamen:</label>
      <input
          type="text"
          v-model="fieldPrefix"
          class="border p-1 rounded w-full"
          placeholder="z. B. Muster-"
      />
    </div>
    
    <div class="space-y-2">
      <button
          @click="downloadAsShapefile"
          class="w-full px-3 py-1 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
      >
        Als ShapeFile herunterladen
      </button>
      
      <button
          @click="downloadShapeFromBackend"
          :disabled="isDownloading"
          class="w-full px-3 py-1 rounded bg-orange-600 text-white font-semibold hover:bg-orange-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {{ isDownloading ? 'Herunterladen...' : 'ShapeFile vom BE herunterladen' }}
      </button>
    </div>
  </SidebarSection>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { downloadAsShapefile, fieldPrefix } from "../../composables/shpDownloader.ts"
import SidebarSection from "./SidebarSection.vue"
import { getApiUrl } from "../../config/api.ts"
import { FieldLayerListRef } from "../../composables/customerMaps.ts"
import type { Feature } from "ol"
import GeoJSON from "ol/format/GeoJSON"

const isDownloading = ref(false)

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

function prepareFieldDataForBackend() {
  const fieldsData: Array<{
    name: string;
    geometry: any;
  }> = [];

  if (FieldLayerListRef.value) {
    FieldLayerListRef.value.forEach(layerItem => {
      layerItem.featureList.forEach(featureItem => {
        const fieldName = getFeatureName(featureItem.feature);

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
  }

  return {
    fields: fieldsData,
    prefix: fieldPrefix.value || 'felder',
    timestamp: new Date().toISOString()
  };
}

async function downloadShapeFromBackend() {
  isDownloading.value = true;

  try {
    const fieldData = prepareFieldDataForBackend();

    const response = await fetch(getApiUrl('GENERATE_SHAPEFILE'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/zip, application/octet-stream'
      },
      body: JSON.stringify(fieldData)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const contentDisposition = response.headers.get('Content-Disposition');
    let filename = 'agrarkarte_shapefile.zip';
    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
      if (filenameMatch && filenameMatch[1]) {
        filename = filenameMatch[1].replace(/['"]/g, '');
      }
    }

    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);

    console.log('Shapefile downloaded successfully from backend');
  } catch (error) {
    console.error('Failed to download shapefile from backend:', error);
    alert('Fehler beim Herunterladen des ShapeFiles vom Server. Bitte versuchen Sie es erneut.');
  } finally {
    isDownloading.value = false;
  }
}
</script>