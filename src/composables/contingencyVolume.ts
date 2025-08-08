import { Feature } from 'ol';
import { Geometry, Polygon, MultiPolygon } from 'ol/geom';
import {FieldLayerList} from './customerMaps';
import * as turf from '@turf/turf';
import GeoJSON from 'ol/format/GeoJSON';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Style from 'ol/style/Style';
import Stroke from 'ol/style/Stroke';
import Fill from 'ol/style/Fill';
import { agMap } from './basemap';
import { ref } from 'vue';

// Add the contingency_volume and ground_risk_buffer properties to the feature interface
declare module './customerMaps' {
  interface FeatureItem {
    feature: Feature<Geometry>;
    geometry: Polygon | MultiPolygon;
    selected?: boolean;
    contingency_volume?: Polygon | MultiPolygon;
    ground_risk_buffer?: Polygon | MultiPolygon;
  }
}

// Create a style for contingency volumes
const groundRiskBufferStyle = new Style({
  stroke: new Stroke({
    color: 'rgba(255, 0, 0, 0.8)',
    width: 2,
    lineDash: [5, 5]
  }),
  fill: new Fill({
    color: 'rgba(255, 0, 0, 0.1)'
  })
});

// Create a style for ground risk buffer
const contingencyVolumeStyle = new Style({
  stroke: new Stroke({
    color: 'rgba(255, 165, 0, 0.8)', // Orange
    width: 2,
    lineDash: [2, 2]
  }),
  fill: new Fill({
    color: 'rgba(255, 165, 0, 0.1)' // Light orange
  })
});
// Store calculated values
const calculatedValues = {
  scv: 0,
  sgrb: 0,
  hcv: 0,
  hfg: 0
};

// Function to get calculated values
export const getCalculatedValues = () => {
  return calculatedValues;
};

// Track visibility state
export const showContingencyVolumes = ref(false);

// Track visibility state for ground risk buffer
export const showGroundRiskBuffer = ref(false);



// Default values
let v0Value = 36; // km/h (10 m/s = 36 km/h)
let cdValue = 3.25; // Characteristic dimension
let flightHeightValue = 100; // Flight height in meters

// Functions to set values
export const setV0 = (value: number) => {
  v0Value = value;
};

export const setCD = (value: number) => {
  cdValue = value;
};

export const setFlightHeight = (value: number) => {
  flightHeightValue = value;
};

// Function to delete all buffers
export const deleteAllBuffers = () => {
  for (const layerListItem of FieldLayerList) {
    if(layerListItem.additionalLayers.contingency_volume) {
      agMap.removeLayer(layerListItem.additionalLayers.contingency_volume);
      layerListItem.additionalLayers.contingency_volume = undefined;
    }
    
    if(layerListItem.additionalLayers.ground_risk_buffer) {
      agMap.removeLayer(layerListItem.additionalLayers.ground_risk_buffer);
      layerListItem.additionalLayers.ground_risk_buffer = undefined;
    }
  }
};

export const calculateGRB = () => {
  const cd = cdValue; // Use the configurable characteristic dimension
  const grb = calculateVerticalCV() + (0.5 * cd);
  
  // Store calculated value
  calculatedValues.sgrb = grb;
  
  return grb;
}

export const calculateVerticalCV = () => {
  const hBaro = 1; // 4 with GPS, 1 with Barometer
  const v0KmH = v0Value; // v0 in km/h
  const v0 = v0KmH / 3.6; // Convert km/h to m/s
  const hRZ = v0 * 0.7 * 1; // Reaction distance vertical
  const g = 9.81;
  const hCM = 0.5 * (((v0)**2) / g); // Contingency Manöver vertical
  const hFG = flightHeightValue; // Flight height

  const hCV = hFG + hBaro + hRZ + hCM;
  
  // Store calculated values
  calculatedValues.hcv = hCV;
  calculatedValues.hfg = hFG;
  
  return hCV;
}



export const calculateGRBCV = () => {
  const v0KmH = v0Value; // v0 in km/h
  const v0 = v0KmH / 3.6; // Convert km/h to m/s

  // Calculate Contingency Volume distance
  const sGPS = 3; // GPS – Ungenauigkeit
  const sPOS = 3; // Positionshaltefehler
  const sK = 1; // Kartenfehler
  const sRZ = v0 * 1; // Reaktionsweg. 1 = 1sek
  const tanPhi = 1; // tan(45°) Absturzwinkel
  const g = 9.81;
  const sCM = 0.5 * (((v0)**2) / (g * tanPhi)); // Contingency Manöver
  const sCV = sGPS + sPOS + sK + sRZ + sCM;
  
  // Store calculated value
  calculatedValues.scv = sCV;
  
  // Calculate Ground Risk Buffer distance
  const grbDistance = calculateGRB();
  
  console.log(`Calculated contingency volume distance: ${sCV} meters`);
  console.log(`Calculated ground risk buffer distance: ${grbDistance} meters`);

  // Create GeoJSON format for conversion
  const format = new GeoJSON();



  
  for (const layerListItem of FieldLayerList) {
    // Create vector sources
    const cvSource = new VectorSource();
    const grbSource = new VectorSource();

    if(layerListItem.additionalLayers.contingency_volume)
      agMap.removeLayer(layerListItem.additionalLayers.contingency_volume);

    if(layerListItem.additionalLayers.ground_risk_buffer)
      agMap.removeLayer(layerListItem.additionalLayers.ground_risk_buffer);
    
    layerListItem.featureList.forEach((featureItem) => {
      try {
        // Convert OpenLayers geometry to GeoJSON string
        const geojsonStr = format.writeGeometry(featureItem.geometry, {
          dataProjection: 'EPSG:4326',
          featureProjection: 'EPSG:3857'
        });
        
        // Parse the GeoJSON string to get a proper GeoJSON object
        const geojsonObj = JSON.parse(geojsonStr);
        
        // Create a proper GeoJSON feature
        const geoJsonFeature = turf.feature(geojsonObj);
        
        // Create Contingency Volume (inner buffer)
        const cvBuffered = turf.buffer(geoJsonFeature, sCV / 1000, { units: 'kilometers' });

        if(!cvBuffered)
          return

        // Convert back to OpenLayers geometry
        featureItem.contingency_volume = format.readGeometry(JSON.stringify(cvBuffered.geometry), {
          dataProjection: 'EPSG:4326',
          featureProjection: 'EPSG:3857'
        }) as Polygon | MultiPolygon;
        
        // Create Ground Risk Buffer (outermost buffer)
        // The total distance is CV + GRB
        const totalDistance = sCV + grbDistance;
        const grbBuffered = turf.buffer(geoJsonFeature, totalDistance / 1000, { units: 'kilometers' });

        if(!grbBuffered)
          return

        // Convert back to OpenLayers geometry
        featureItem.ground_risk_buffer = format.readGeometry(JSON.stringify(grbBuffered.geometry), {
          dataProjection: 'EPSG:4326',
          featureProjection: 'EPSG:3857'
        }) as Polygon | MultiPolygon;
        
        const contingencyFeature = new Feature({
          geometry: featureItem.contingency_volume,
          name: `CV_${featureItem.feature.get('name') || 'unnamed'}`
        });
        cvSource.addFeature(contingencyFeature);
        
        // Ground Risk Buffer is created above as the outermost buffer
        
        const grbFeature = new Feature({
          geometry: featureItem.ground_risk_buffer,
          name: `GRB_${featureItem.feature.get('name') || 'unnamed'}`
        });
        grbSource.addFeature(grbFeature);
        
      } catch (error) {
        console.error('Error creating buffers:', error);
      }
    });
    
    // Create vector layers
    const cvLayer = new VectorLayer({
      source: cvSource,
      style: contingencyVolumeStyle,
      visible: true,
      zIndex: 100 // Make sure it's above the field layers
    });
    
    const grbLayer = new VectorLayer({
      source: grbSource,
      style: groundRiskBufferStyle,
      visible: true,
      zIndex: 99 // Below contingency volume
    });

    layerListItem.additionalLayers.ground_risk_buffer = grbLayer;
    layerListItem.additionalLayers.contingency_volume = cvLayer;

    // Add layers to the map
    agMap.addLayer(layerListItem.additionalLayers.contingency_volume);
    agMap.addLayer(layerListItem.additionalLayers.ground_risk_buffer);

  }
};