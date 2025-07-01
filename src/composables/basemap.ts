
// Basemap-Auswahl
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import XYZ from "ol/source/XYZ";
import {ref, watch} from "vue";
import Map from 'ol/Map.js';
import {Attribution} from "ol/control";
import View from "ol/View";
import {dipulWmsLayer} from "./dipulLayers.ts";

interface basemaps {
    name: string
    label: string
    layer: () => TileLayer<OSM>
}


export let agMap: Map;
export let currentBaseLayer: TileLayer<OSM> | null = null;
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
                attributions: "Powered by <a href='https://www.esri.com/en-us/home' target='_blank'>Esri</a>"
            })
        })
    }
]


export function basemapSetup() {
    const selected = basemapList.find(b => b.name === selectedBasemap.value)
    if (selected === undefined) return;

    currentBaseLayer = selected.layer()

    agMap = new Map({
        controls: [new Attribution({collapsible: false})],
        layers: [currentBaseLayer, dipulWmsLayer], // Start mit aktueller Basemap
        view: new View({
            center: [930000, 6640000],
            zoom: 8,
        }),
    })



};

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