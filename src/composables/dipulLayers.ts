import {type Ref, ref} from "vue";
import TileLayer from "ol/layer/Tile";
import TileWMS from "ol/source/TileWMS";

const DIPUL_WMS_URL = 'https://uas-betrieb.de/geoservices/dipul/wms'


interface dipulLayer {
    name: string
    wmsName: string
    color: string
    checked: boolean
}

interface dipulLayerGroup {
    name: string
    icon: string
    expanded: boolean
    layers: dipulLayer[]
}


export const activeDipulLayers = ref<string[]>([])
export const dipulLayerUI = ref(false)
export const dipulLayerGroups: Ref<dipulLayerGroup[]> = ref([
    {
        name: 'Luftverkehr',
        icon: 'bg-red-300',
        expanded: false,
        layers: [
            {name: 'Flugplätze', wmsName: 'dipul:flugplaetze', color: 'bg-red-200', checked: true},
            {name: 'Flughäfen', wmsName: 'dipul:flughaefen', color: 'bg-red-200', checked: true},
            {name: 'Kontrollzonen', wmsName: 'dipul:kontrollzonen', color: 'bg-red-200', checked: true},
            {
                name: 'Flugbeschränkungsgebiete',
                wmsName: 'dipul:flugbeschraenkungsgebiete',
                color: 'bg-red-200',
                checked: true
            },
        ]
    },
    {
        name: 'Straßenverkehr',
        icon: 'bg-gray-300',
        expanded: false,
        layers: [
            {name: 'Bundesautobahnen', wmsName: 'dipul:bundesautobahnen', color: 'bg-gray-200', checked: true},
            {name: 'Bundesstraßen', wmsName: 'dipul:bundesstrassen', color: 'bg-gray-200', checked: true},
        ]
    },
    {
        name: 'Schienenverkehr',
        icon: 'bg-gray-400',
        expanded: false,
        layers: [
            {name: 'Bahnanlagen', wmsName: 'dipul:bahnanlagen', color: 'bg-gray-100', checked: true}
        ]
    },
    {
        name: 'Schiffsverkehr',
        icon: 'bg-blue-200',
        expanded: false,
        layers: [
            {name: 'Binnenwasserstraßen', wmsName: 'dipul:binnenwasserstrassen', color: 'bg-blue-100', checked: true},
            {name: 'Seewasserstraßen', wmsName: 'dipul:seewasserstrassen', color: 'bg-blue-100', checked: true},
            {name: 'Schifffahrtsanlagen', wmsName: 'dipul:schifffahrtsanlagen', color: 'bg-blue-100', checked: true},
        ]
    },
    {
        name: 'Siedlungen',
        icon: 'bg-yellow-200',
        expanded: false,
        layers: [
            {name: 'Wohngrundstücke', wmsName: 'dipul:wohngrundstuecke', color: 'bg-yellow-200', checked: true},
            {name: "Freibäder und Badestrände", wmsName: "dipul:freibaeder", color: 'bg-yellow-200', checked: true},
        ]
    },
    {
        name: 'Industrie',
        icon: 'bg-gray-600',
        expanded: false,
        layers: [
            {name: "Industrieanlagen", wmsName: "dipul:industrieanlagen", color: 'bg-gray-600', checked: true},
            {name: "Kraftwerke", wmsName: "dipul:kraftwerke", color: 'bg-gray-600', checked: true},
            {name: "Umspannwerke", wmsName: "dipul:umspannwerke", color: 'bg-gray-600', checked: true},
            {name: "Stromleitungen", wmsName: "dipul:stromleitungen", color: 'bg-gray-600', checked: true},
            {name: "Windkraftanlagen", wmsName: "dipul:windkraftanlagen", color: 'bg-gray-600', checked: true},
        ]
    },
    {
        name: 'Einrichtungen und Behörden',
        icon: 'bg-orange-200',
        expanded: false,
        layers: [
            {
                name: "JVA und Einrichtungen des Maßregelvollzugs",
                wmsName: "dipul:justizvollzugsanstalten",
                color: 'bg-orange-200',
                checked: true
            },
            {
                name: "Militärische Anlagen und Organisationen",
                wmsName: "dipul:militaerische_anlagen",
                color: 'bg-orange-200',
                checked: true
            },
            {name: "Einrichtungen BSL-4", wmsName: "dipul:labore", color: 'bg-orange-200', checked: true},
            {name: "Behörden", wmsName: "dipul:behoerden", color: 'bg-orange-200', checked: true},
            {
                name: "Diplomatische und konsularische Vertretungen",
                wmsName: "dipul:diplomatische_vertretungen",
                color: 'bg-orange-200',
                checked: true
            },
            {
                name: "Internationale Organisationen",
                wmsName: "dipul:internationale_organisationen",
                color: 'bg-orange-200',
                checked: true
            },
            {name: "Liegenschaften der Polizei", wmsName: "dipul:polizei", color: 'bg-orange-200', checked: true},
            {
                name: "Andere Sicherheitsbehörden",
                wmsName: "dipul:sicherheitsbehoerden",
                color: 'bg-orange-200',
                checked: true
            },
            {name: "Krankenhäuser", wmsName: "dipul:krankenhaeuser", color: 'bg-orange-200', checked: true},
        ]
    },
    {
        name: 'Naturschutz',
        icon: 'bg-green-200',
        expanded: false,
        layers: [
            {name: "Nationalparks", wmsName: "dipul:nationalparks", color: 'bg-green-200', checked: true},
            {name: "Naturschutzgebiete", wmsName: "dipul:naturschutzgebiete", color: 'bg-green-200', checked: true},
            {name: "FFH-Gebiete", wmsName: "dipul:ffh-gebiete", color: 'bg-green-200', checked: true},
            {name: "Vogelschutzgebiete", wmsName: "dipul:vogelschutzgebiete", color: 'bg-green-200', checked: true},
        ]
    },
    {
        name: 'Temporäre Betriebseinschränkungen',
        icon: 'bg-red-200',
        expanded: false,
        layers: [
            {
                name: "Temporäre Betriebseinschränkungen",
                wmsName: "dipul:temporaere_betriebseinschraenkungen",
                color: 'bg-red-200',
                checked: true
            },
        ]
    },
    {
        name: 'Weitere Gebiete zur Information',
        icon: 'bg-yellow-200',
        expanded: false,
        layers: [
            {name: "Modellflugplätze", wmsName: "dipul:modellflugplaetze", color: 'bg-yellow-200', checked: true},
        ]
    }
])

export const dipulWmsLayer = new TileLayer({
    source: new TileWMS({
        url: DIPUL_WMS_URL,
        params: {
            LAYERS: activeDipulLayers.value.join(','),
            TILED: true,
        },
        serverType: 'geoserver',
    }),
    opacity: 0.6,
    visible: true,
})

export function toggleLayer(layer: dipulLayer) {

    const src = dipulWmsLayer.getSource()
    if (src === null)
        return;

    // Hier muss deine Layer-Anzeige-Logik rein.
    // Beispiel: Layer ein-/ausblenden (OpenLayers)
    const layerName: string = layer.wmsName
    if (layer.checked) {
        if (!activeDipulLayers.value.includes(layerName)) {
            activeDipulLayers.value.push(layerName)
            src.updateParams({
                LAYERS: activeDipulLayers.value.join(',')
            });
        }
    } else {
        const idx = activeDipulLayers.value.indexOf(layerName)
        if (idx !== -1) {
            activeDipulLayers.value.splice(idx, 1)
            src.updateParams({
                LAYERS: activeDipulLayers.value.join(',')
            });
        }
    }

    src.updateParams({
        LAYERS: activeDipulLayers.value.join(',')
    });
}

