<template>
  <SidebarSection 
    title="Authenticated"
    help-text="Übersicht aller geladenen Flächen mit Namen, Größe und DIPUL-Prüfungsergebnissen. Klicken Sie auf eine Fläche, um dorthin zu zoomen."
    :default-expanded="true"
  >
    <template v-if="isAuthenticated">
      <button
          @click="downloadShapeFromBackend"
          class="px-3 py-1 mt-1 rounded bg-orange-600 text-white font-semibold hover:bg-orange-700 transition"
      >
        ShapeFile vom BE herunterladen
      </button>
      <br />
      <button
          @click="downloadKMLFromBackend"
          class="px-3 py-1 mt-1 rounded bg-purple-600 text-white font-semibold hover:bg-purple-700 transition"
      >
        KML mit GRB/CV vom BE herunterladen
      </button>
    </template>


    <template v-if="isAuthenticated">
      <span class="text-gray-400">Angemeldet!</span>
    </template>
    <template v-else>
      <div  class="text-gray-400 italic">
        Nicht angemeldet.
      </div>
    </template>
  </SidebarSection>
</template>

<script setup lang="ts">
import {onMounted, ref} from "vue";

import SidebarSection from "./SidebarSection.vue"
import {getApiUrl} from "../../config/api.ts";
import {FieldLayerListRef} from "../../composables/customerMaps.ts";
import type {Feature} from "ol";
import {fieldPrefix} from "../../composables/shpDownloader.ts";
import GeoJSON from "ol/format/GeoJSON";


const isAuthenticated = ref(false)
async function checkAuthStatus() {
  try {
    const response = await fetch(getApiUrl('PROTECTED'), {
      credentials: 'include',

    });
    return response.ok;
  } catch {
    return false;
  }
}
// Check auth when component mounts
onMounted(async () => {
  isAuthenticated.value = await checkAuthStatus();

});

function prepareFieldDataForBackend() {
  // Get current field data
  const fieldsData: Array<{
    name: string;
    geometry: any;
  }> = [];

  if (FieldLayerListRef.value) {
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
  }

  const fieldData = {
    fields: fieldsData,
    prefix: fieldPrefix.value || 'felder',
    timestamp: new Date().toISOString()
  };

  console.log('Prepared field data for backend:', fieldData);
  return fieldData;
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

async function downloadShapeFromBackend() {
  // Show loading state - find the specific button
  const buttons = document.querySelectorAll('button');
  let targetButton: HTMLButtonElement | null = null;
  let originalText = '';

  for (const btn of buttons) {
    if (btn.textContent?.includes('ShapeFile vom Server herunterladen')) {
      targetButton = btn as HTMLButtonElement;
      originalText = btn.textContent;
      btn.disabled = true;
      btn.textContent = 'Herunterladen...';
      break;
    }
  }

  try {
    // Prepare field data to send to backend
    const fieldData = prepareFieldDataForBackend();

    const response = await fetch(getApiUrl('GENERATE_SHAPEFILE'), {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/zip, application/octet-stream'
      },
      body: JSON.stringify(fieldData)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Get filename from response headers or use default
    const contentDisposition = response.headers.get('Content-Disposition');
    let filename = 'agrarkarte_shapefile.zip';
    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
      if (filenameMatch && filenameMatch[1]) {
        filename = filenameMatch[1].replace(/['"]/g, '');
      }
    }

    // Convert response to blob and download
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
    // Restore button state
    if (targetButton && originalText) {
      targetButton.disabled = false;
      targetButton.textContent = originalText;
    }
  }
}

async function downloadKMLFromBackend() {
  // Show loading state - find the specific button
  const buttons = document.querySelectorAll('button');
  let targetButton: HTMLButtonElement | null = null;
  let originalText = '';

  for (const btn of buttons) {
    if (btn.textContent?.includes('KML mit GRB/CV vom Server herunterladen')) {
      targetButton = btn as HTMLButtonElement;
      originalText = btn.textContent;
      btn.disabled = true;
      btn.textContent = 'Herunterladen...';
      break;
    }
  }

  try {
    // Prepare field data to send to backend
    const fieldData = prepareFieldDataForBackend();

    const response = await fetch(getApiUrl('GENERATE_KML'), {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/vnd.google-earth.kml+xml, application/octet-stream'
      },
      body: JSON.stringify(fieldData)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Get filename from response headers or use default
    const contentDisposition = response.headers.get('Content-Disposition');
    let filename = 'agrarkarte_grb_cv.kml';
    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
      if (filenameMatch && filenameMatch[1]) {
        filename = filenameMatch[1].replace(/['"]/g, '');
      }
    }

    // Convert response to blob and download
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);

    console.log('KML with GRB/CV downloaded successfully from backend');
  } catch (error) {
    console.error('Failed to download KML from backend:', error);
    alert('Fehler beim Herunterladen der KML-Datei vom Server. Bitte versuchen Sie es erneut.');
  } finally {
    // Restore button state
    if (targetButton && originalText) {
      targetButton.disabled = false;
      targetButton.textContent = originalText;
    }
  }
}


</script>