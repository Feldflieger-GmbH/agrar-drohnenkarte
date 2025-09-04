<template>
  <SidebarSection 
    title="Authentication"
    help-text="Anmeldung für erweiterte Funktionen wie ShapeFile- und KML-Download vom Backend."
    :default-expanded="true"
  >
    <!-- Loading state -->
    <template v-if="auth.isLoading.value">
      <div class="text-gray-400 italic">
        Authentifizierung wird geladen...
      </div>
    </template>

    <!-- Error state -->
    <template v-else-if="auth.error.value">
      <div class="text-red-500 text-sm mb-2">
        {{ auth.error.value }}
      </div>
      <button
        @click="auth.clearError"
        class="px-2 py-1 text-xs rounded bg-gray-500 text-white hover:bg-gray-600 transition"
      >
        Fehler löschen
      </button>
    </template>

    <!-- Authenticated state -->
    <template v-else-if="auth.isAuthenticated.value">
      <div class="space-y-2">
        <div class="text-green-600 font-semibold">
          ✓ Angemeldet als {{ auth.userProfile.value?.name || auth.userProfile.value?.email || 'Benutzer' }}
        </div>
        
        <div class="space-y-1">
          <button
            @click="downloadKMLFromBackend"
            class="w-full px-3 py-1 rounded bg-purple-600 text-white font-semibold hover:bg-purple-700 transition"
          >
            KML mit GRB/CV vom BE herunterladen
          </button>
          
          <button
            @click="downloadMissionFiles"
            :disabled="!canDownloadMissionFiles"
            class="w-full px-3 py-1 rounded font-semibold transition"
            :class="canDownloadMissionFiles 
              ? 'bg-orange-600 text-white hover:bg-orange-700' 
              : 'bg-gray-400 text-gray-600 cursor-not-allowed'"
          >
            Download Mission-Package
          </button>
        </div>

        <button
          @click="auth.signoutRedirect"
          class="w-full px-3 py-1 text-sm rounded bg-red-600 text-white hover:bg-red-700 transition"
        >
          Abmelden
        </button>
      </div>
    </template>

    <!-- Not authenticated state -->
    <template v-else>
      <div class="space-y-2">
        <div class="text-gray-400 italic">
          Nicht angemeldet.
        </div>
        <div class="space-y-1">
          <button
            @click="handleLoginClick"
            type="button"
            class="w-full px-3 py-2 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
          >
            Anmelden
          </button>
          <!--
          <button
            @click="handleRegisterClick"
            type="button"
            class="w-full px-3 py-2 rounded bg-green-600 text-white font-semibold hover:bg-green-700 transition"
          >
            Registrieren
          </button>
          -->
        </div>
      </div>
    </template>
  </SidebarSection>
</template>

<script setup lang="ts">
import SidebarSection from "./SidebarSection.vue"
import { getApiUrl, makeAuthenticatedRequest } from "../../config/api.ts";
import { FieldLayerListRef } from "../../composables/customerMaps.ts";
import type { Feature } from "ol";
import { fieldPrefix } from "../../composables/shpDownloader.ts";
import GeoJSON from "ol/format/GeoJSON";
import { auth } from "../../composables/authentication";
import { computed } from "vue";
import { calculatedValues } from "../../composables/contingencyVolume.ts";
import { dipulCheckActive, fieldsWithDipul, dipulCheckProgress } from "../../composables/dipulFeature.ts";

import { Log } from 'oidc-client-ts'
Log.setLevel(Log.DEBUG)

// Check if mission files button should be enabled
const canDownloadMissionFiles = computed(() => {
  // Check if GRB/CV has been calculated
  const hasGrbCvCalculated = calculatedValues.value.scv > 0 && calculatedValues.value.sgrb > 0;
  
  // Check if DIPUL check is done (either disabled or completed with results)
  const isDipulCheckDone = !dipulCheckActive.value || 
    (!dipulCheckProgress.value.inProgress && Object.keys(fieldsWithDipul.value).length >= 0);
  
  return hasGrbCvCalculated && isDipulCheckDone && FieldLayerListRef.value.length > 0;
});


/*
// Handle registration button click
const handleRegisterClick = async (event: Event) => {
  console.log('Register button clicked', event)
  event.preventDefault()
  event.stopPropagation()
  
  // Use the specific self-registration flow URL
  const registrationUrl = 'https://ag.bury.local/auth/if/flow/self-registration/'
  
  console.log('Redirecting to self-registration flow:', registrationUrl)
  window.location.href = registrationUrl
}
*/
// Handle login button click
const handleLoginClick = async (event: Event) => {
  console.log('Login button clicked', event)
  event.preventDefault()
  event.stopPropagation()
  
  try {
    console.log('Starting authentication redirect...')
    console.log('Auth config:', {
      authority: auth.userManager.settings.authority,
      client_id: auth.userManager.settings.client_id,
      redirect_uri: auth.userManager.settings.redirect_uri
    })
    
    await auth.signinRedirect()
    console.log('Authentication redirect initiated successfully')
    
  } catch (err) {
    console.error('Login error:', err)
    alert('Login failed: ' + (err instanceof Error ? err.message : String(err)))
    // Prevent page reload on error
    return false
  }
}

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


async function downloadKMLFromBackend() {
  // Show loading state - find the specific button
  const buttons = document.querySelectorAll('button');
  let targetButton: HTMLButtonElement | null = null;
  let originalText = '';

  for (const btn of buttons) {
    if (btn.textContent?.includes('KML mit GRB/CV vom BE herunterladen')) {
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

    // Get access token for authentication
    const accessToken = await auth.getAccessToken();

    const response = await makeAuthenticatedRequest(getApiUrl('GENERATE_KML'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/vnd.google-earth.kml+xml, application/octet-stream'
      },
      body: JSON.stringify(fieldData)
    }, accessToken || undefined);

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

async function downloadMissionFiles() {
  // Show loading state - find the mission files button
  const buttons = document.querySelectorAll('button');
  let targetButton: HTMLButtonElement | null = null;
  let originalText = '';

  for (const btn of buttons) {
    if (btn.textContent?.includes('Download Mission-Package')) {
      targetButton = btn as HTMLButtonElement;
      originalText = btn.textContent;
      btn.disabled = true;
      btn.textContent = 'Herunterladen...';
      break;
    }
  }

  try {
    // Prepare complete field data including geometries and calculated values
    const fieldData = prepareCompleteFieldData();

    // Get access token for authentication
    const accessToken = await auth.getAccessToken();

    const response = await makeAuthenticatedRequest(getApiUrl('MISSION_PACKAGE'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/zip, application/octet-stream'
      },
      body: JSON.stringify(fieldData)
    }, accessToken || undefined);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Get filename from response headers or use default
    const contentDisposition = response.headers.get('Content-Disposition');
    let filename = 'mission-files.zip';
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

    console.log('Mission files downloaded successfully from backend');
  } catch (error) {
    console.error('Failed to download mission files from backend:', error);
    alert('Fehler beim Herunterladen der Mission-Dateien vom Server. Bitte versuchen Sie es erneut.');
  } finally {
    // Restore button state
    if (targetButton && originalText) {
      targetButton.disabled = false;
      targetButton.textContent = originalText;
    }
  }
}

function prepareCompleteFieldData() {
  // Get current field data
  const fieldsData: Array<{
    name: string;
    geometry: any;
    dipulZones?: any[];
    contingencyVolume?: any;
    groundRiskBuffer?: any;
  }> = [];

  if (FieldLayerListRef.value) {
    FieldLayerListRef.value.forEach((layerItem, layerIndex) => {
      layerItem.featureList.forEach((featureItem, fieldIndex) => {
        const fieldName = getFeatureName(featureItem.feature);
        const fieldKey = featureItem.feature.getId() || JSON.stringify(featureItem.geometry.getCoordinates()[0][0]);

        // Convert OpenLayers geometry to GeoJSON
        const geoJsonFormat = new GeoJSON();
        const fieldGeometry = JSON.parse(geoJsonFormat.writeGeometry(featureItem.geometry, {
          featureProjection: 'EPSG:3857',
          dataProjection: 'EPSG:4326'
        }));

        // Get DIPUL zones for this field
        let dipulZones = undefined;
        if (fieldsWithDipul.value[fieldKey]) {
          dipulZones = fieldsWithDipul.value[fieldKey];
        }

        // Get contingency volume and ground risk buffer if available
        let contingencyVolume = undefined;
        let groundRiskBuffer = undefined;
        
        if (featureItem.contingency_volume) {
          contingencyVolume = JSON.parse(geoJsonFormat.writeGeometry(featureItem.contingency_volume, {
            featureProjection: 'EPSG:3857',
            dataProjection: 'EPSG:4326'
          }));
        }
        
        if (featureItem.ground_risk_buffer) {
          groundRiskBuffer = JSON.parse(geoJsonFormat.writeGeometry(featureItem.ground_risk_buffer, {
            featureProjection: 'EPSG:3857',
            dataProjection: 'EPSG:4326'
          }));
        }

        fieldsData.push({
          name: fieldName,
          geometry: fieldGeometry,
          dipulZones: dipulZones,
          contingencyVolume: contingencyVolume,
          groundRiskBuffer: groundRiskBuffer
        });
      });
    });
  }

  // Get calculated GRB/CV values
  const currentCalculatedValues = calculatedValues.value;

  const fieldData = {
    fields: fieldsData,
    prefix: fieldPrefix.value || 'felder',
    timestamp: new Date().toISOString(),
    calculatedValues: currentCalculatedValues,
    dipulCheckActive: dipulCheckActive.value,
    metadata: {
      totalFields: fieldsData.length,
      hasGrbCvCalculated: currentCalculatedValues.scv > 0 && currentCalculatedValues.sgrb > 0,
      dipulCheckCompleted: !dipulCheckProgress.value.inProgress
    }
  };

  console.log('Prepared complete field data for mission files:', fieldData);
  return fieldData;
}


</script>