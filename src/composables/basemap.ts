
// Basemap-Auswahl
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import XYZ from "ol/source/XYZ";
import Google from "ol/source/Google";
import {ref, watch} from "vue";
import Map from 'ol/Map.js';
import {Attribution} from "ol/control";
import View from "ol/View";
import {dipulWmsLayer} from "./dipulLayers.ts";
import { GOOGLE_MAPS_CONFIG, MAPBOX_CONFIG } from "../config/api.ts";

interface basemaps {
    name: string
    label: string
    layer: () => TileLayer<OSM> | TileLayer<XYZ> | TileLayer<Google>
    requiresGroup?: string  // Optional: group requirement for access
}


export let agMap: Map;
export let currentBaseLayer: TileLayer<OSM> | TileLayer<XYZ> | TileLayer<Google> | null = null;
export const baseOpacity = ref(1) // 0 = ganz durchsichtig
export const selectedBasemap = ref("osm")
export const basemapList: basemaps[] = [
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
                attributions: "Powered by <a href='https://www.esri.com/en-us/home' target='_blank'>Esri</a>. Source: Esri, Maxar, Earthstar Geographics, and the GIS User Community"
            })
        })
    },
    {
        name: "mapbox-satellite",
        label: "Satellit (Mapbox HD)",
        requiresGroup: "agmap.feature.maps",
        layer: () => new TileLayer({
            source: new XYZ({
                url: `https://api.mapbox.com/styles/v1/mapbox/satellite-v9/tiles/512/{z}/{x}/{y}@2x?access_token=${MAPBOX_CONFIG.API_KEY}`,
                tileSize: 512,
                maxZoom: 22,
                attributions: '© <a href="https://www.mapbox.com/about/maps/">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            })
        })
    },
    {
        name: "google-roadmap",
        label: "Google Maps (Straßenkarte)",
        requiresGroup: "agmap.feature.gmaps",
        layer: () => new TileLayer({
            source: new Google({
                key: GOOGLE_MAPS_CONFIG.API_KEY,
                mapType: 'roadmap',
                language: 'de-DE',
                region: 'DE',
                scale: 'scaleFactor2x',
                highDpi: true
            })
        })
    },
    {
        name: "google-satellite",
        label: "Google Maps (Satellit)",
        requiresGroup: "agmap.feature.gmaps",
        layer: () => new TileLayer({
            source: new Google({
                key: GOOGLE_MAPS_CONFIG.API_KEY,
                mapType: 'satellite',
                language: 'de-DE',
                region: 'DE',
                scale: 'scaleFactor2x',
                highDpi: true
            })
        })
    },
    {
        name: "google-hybrid",
        label: "Google Maps (Hybrid)",
        requiresGroup: "agmap.feature.gmaps",
        layer: () => new TileLayer({
            source: new Google({
                key: GOOGLE_MAPS_CONFIG.API_KEY,
                mapType: 'satellite',
                layerTypes: ['layerRoadmap'],  // Adds road overlay on satellite
                language: 'de-DE',
                region: 'DE',
                scale: 'scaleFactor2x',
                highDpi: true
            })
        })
    },
    {
        name: "google-terrain",
        label: "Google Maps (Terrain)",
        requiresGroup: "agmap.feature.gmaps",
        layer: () => new TileLayer({
            source: new Google({
                key: GOOGLE_MAPS_CONFIG.API_KEY,
                mapType: 'terrain',
                language: 'de-DE',
                region: 'DE',
                scale: 'scaleFactor2x',
                highDpi: true
            })
        })
    }
]


export function basemapSetup() {
    const selected = basemapList.find(b => b.name === selectedBasemap.value)
    if (selected === undefined) return;

    console.log(`GOOGLE_MAPS_CONFIG : '${GOOGLE_MAPS_CONFIG.API_KEY}'`)



    currentBaseLayer = selected.layer()

    agMap = new Map({
        controls: [new Attribution({collapsible: false})],
        layers: [currentBaseLayer, dipulWmsLayer], // Start mit aktueller Basemap
        view: new View({
            center: [930000, 6640000],
            zoom: 8,
        }),
    })



}



// Aktualisiere die Layer-Opacity, wenn sich der Wert ändert:
watch(baseOpacity, (val) => {
    if (currentBaseLayer) currentBaseLayer.setOpacity(val)
})


export function changeBasemap() {
    if (currentBaseLayer) {
        agMap.removeLayer(currentBaseLayer)
    }

    const selected = basemapList.find(b => b.name === selectedBasemap.value)
    if (selected === undefined) return;

    currentBaseLayer = selected.layer()
    currentBaseLayer.setOpacity(baseOpacity.value)
    // Füge neuen Basemap-Layer GANZ vorne ein

    agMap.getLayers().insertAt(0, currentBaseLayer)
}