import {ref, type Ref, watch} from "vue";
import {type agMapLayerGroup, type dipulLayer} from "./dipulLayers.ts";
import TileLayer from "ol/layer/Tile";
import TileWMS from "ol/source/TileWMS";
import {agMap} from "./basemap.ts";

export const geobwOpacity: Ref<number> = ref(1) // 0 = ganz durchsichtig
export const activeLayers = ref<string[]>([])
const ALKIS_WMS_URL = 'https://owsproxy.lgl-bw.de/owsproxy/ows/WMS_LGL-BW_ALKIS_Basis_transparent'
export const geoBWLayerGroups: Ref<agMapLayerGroup[]> = ref([
    {
        name: 'Layer',
        icon: 'bg-red-300',
        expanded: true,
        layers: [
            {
                name: 'Gebäude und Bauwerke',
                wmsName: 'nora:ALKIS_Basis_Bauwerke_transparent',
                color: 'bg-gray-200',
                checked: false
            },
            {
                name: 'Gewässer',
                wmsName: 'nora:ALKIS_Basis_Gewaesser_transparent',
                color: 'bg-blue-200',
                checked: false
            },
            {
                name: 'Flurstücke',
                wmsName: 'nora:ALKIS_Basis_transparent',
                color: 'bg-yellow-200',
                checked: false
            },
            {
                name: 'Beschriftung',
                wmsName: 'nora:ALKIS_Basis_Beschriftung_transparent',
                color: 'bg-gray-200',
                checked: false
            }
        ]
    }
]);

// Aktualisiere die Layer-Opacity, wenn sich der Wert ändert:
watch(geobwOpacity, (val) => {
    if (geoBWWmsLayer) geoBWWmsLayer.setOpacity(val)
})

export const geoBWWmsLayer = new TileLayer({
    source: new TileWMS({
        url: ALKIS_WMS_URL,
        params: {
            LAYERS: activeLayers.value.join(','),
            TILED: true,
        },
        serverType: 'geoserver',
    }),
    opacity: geobwOpacity.value,
    visible: geobwOpacity.value>0,
})

export function toggleGeoBWLayer(layer: dipulLayer) {

    const src = geoBWWmsLayer.getSource()
    if (src === null)
        return;

    // Hier muss deine Layer-Anzeige-Logik rein.
    // Beispiel: Layer ein-/ausblenden (OpenLayers)
    const layerName: string = layer.wmsName
    if (layer.checked) {
        if (!activeLayers.value.includes(layerName)) {
            activeLayers.value.push(layerName)
            src.updateParams({
                LAYERS: activeLayers.value.join(',')
            });
        }
    } else {
        const idx = activeLayers.value.indexOf(layerName)
        if (idx !== -1) {
            activeLayers.value.splice(idx, 1)
            src.updateParams({
                LAYERS: activeLayers.value.join(',')
            });
        }
    }

    src.updateParams({
        LAYERS: activeLayers.value.join(',')
    });

    if (activeLayers.value.length === 0) {
        agMap.removeLayer(geoBWWmsLayer)
    } else {
        if (!agMap.getLayers().getArray().includes(geoBWWmsLayer)) {
            agMap.addLayer(geoBWWmsLayer)
        }
    }
}
