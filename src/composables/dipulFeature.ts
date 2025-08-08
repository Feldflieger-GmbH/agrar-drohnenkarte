import {computed, type Ref, ref, watch} from "vue";
import {FieldLayerList, FieldLayerListRef, getFeatureName, type LayerListItem} from "./customerMaps.ts";
import {Feature} from "ol";
import {Geometry, MultiPolygon, Point} from "ol/geom";
import type {Coordinate} from "ol/coordinate";
import Polygon from "ol/geom/Polygon";
import type TileWMS from "ol/source/TileWMS";
import {activeDipulLayers, dipulWmsLayer} from "./dipulLayers.ts";
import {agMap} from "./basemap.ts";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import Style from "ol/style/Style";
import Icon from "ol/style/Icon";
import pinImg from "../assets/pin_mini_16px.png";

export interface DipulFeatureCollection {
    type: "FeatureCollection";
    features: DipulFeature[];
}

export interface DipulFeature {
    type: "Feature";
    id: string;
    properties: DipulFeatureProperties;
}

export interface DipulFeatureProperties {
    name: string;
    type_code: string;
    lower_limit_unit: string;
    lower_limit_alt_ref: string;
    lower_limit_altitude: string;
    legal_ref: string;
    external_reference: string;
}

export const dipulCheckShowPoints = ref(false)


interface DipulFeatureMap {
    [fielID: string]: DipulFeature[];
}

export const dipulCheckActive = ref(true)
export const dipulCheckRes = ref(5)
export const fieldsWithDipul: Ref<DipulFeatureMap> = ref({})

// Progress tracking
export const dipulCheckProgress = ref({
  total: 0,
  completed: 0,
  inProgress: false
})


//export const dipulZoneList = computed(() => {

export const dipulZoneList = computed(() => {
    // Key: DIPUL-Feature-ID (oder Name)
    // Value: Array von Polygon-Features
    const mapping: {[key: string]: {[key: string]:  {
                feature: Feature<Geometry>
                geometry: Polygon | MultiPolygon
                name: string
            }[]}} = {}


    FieldLayerListRef.value.forEach(fieldLayer => {
        fieldLayer.featureList.forEach(fld => {
            const fGeo  = fld.geometry

            const key = fld.feature.getId() || JSON.stringify(fGeo.getCoordinates()[0][0])

            let dipulList: DipulFeature[] = [];
            if (fieldsWithDipul.value) {
                dipulList = fieldsWithDipul.value[key]
            }

            if (dipulList === undefined) {
                return
            }


            dipulList.forEach(zone => {
                // Zonen-Namen/Feld als Key nehmen (z.B. zone.properties.type_code + zone.id)
                // Nutze am besten eine sprechende Anzeige

                let geo = fld.geometry

                if (zone.properties == null) {
                    return
                }

                const zoneKey1 = zone.properties.type_code
                const zoneKey2 = (zone.properties.name || zone.id)

                if (!mapping[zoneKey1]) {
                    mapping[zoneKey1] = {}
                }

                if (!mapping[zoneKey1][zoneKey2]) mapping[zoneKey1][zoneKey2] = []
                mapping[zoneKey1][zoneKey2].push({
                    feature: fld.feature,
                    geometry: geo as Polygon | MultiPolygon,
                    name: getFeatureName(fld.feature)
                })
            })
        })
    })
    return mapping
})


function getPin(coord: Array<number>) {
    const pinFeature = new Feature({
        geometry: new Point(coord),
    })
    //const textC = coord.toString()
    pinFeature.setStyle(
        new Style({
            image: new Icon({
                src: pinImg,
                anchor: [0.5, 1],
                scale: 1, // Passe ggf. die Größe an
            }),
        })
    )

    return pinFeature
}


watch(dipulCheckShowPoints, (val) => {
    for (const l of FieldLayerList) {

        if (l.additionalLayers?.pointChecklayer != null) {
            l.additionalLayers.pointChecklayer.setVisible(val)
        }
    }
})

// check all polys for Dipul-Features on Layerchange.
watch([FieldLayerListRef, dipulCheckActive, dipulCheckRes], async () => {
    if(!FieldLayerListRef)
        return

    console.log("Watcher!")
    if (!dipulCheckActive.value) {
        fieldsWithDipul.value = {}
        dipulCheckProgress.value = { total: 0, completed: 0, inProgress: false }
        return
    }
    
    // Reset progress
    dipulCheckProgress.value.inProgress = true
    dipulCheckProgress.value.completed = 0
    dipulCheckProgress.value.total = 0

    const featurePromises = []
    const results: {[key: string]: DipulFeature[]} = {};
    
    // Count total points to check
    dipulCheckProgress.value.total = 0
    for (const l of FieldLayerList) {
        if (l.layerActive) {
            for (const f of l.featureList) {
                const geom = f.feature.getGeometry()
                let rings: Array<Coordinate>[] = []
                
                if (geom instanceof Polygon) {
                    rings = [geom.getCoordinates()[0]]
                } else if (geom instanceof MultiPolygon) {
                    rings = geom.getCoordinates().map(coords => coords[0])
                }
                
                for (const exteriorRing of rings) {
                    const testCoordinates = exteriorRing.filter((_, idx) => idx % dipulCheckRes.value === 0)
                    dipulCheckProgress.value.total += testCoordinates.length
                }
            }



            if (l.additionalLayers.pointChecklayer) {
                agMap.removeLayer(l.additionalLayers.pointChecklayer)
            }


            l.additionalLayers.pointChecklayer = new VectorLayer({
                    source: new VectorSource(),
                    zIndex: 99,
                    visible: dipulCheckShowPoints.value
            })


            if (l.additionalLayers.pointChecklayer != null) {
                agMap.addLayer(l.additionalLayers.pointChecklayer)
            }

            for (const f of l.featureList) {

                let fID;
                if (f.feature.getId() !== undefined) {
                    fID = f.feature.getId()?.toString()
                }

                const fieldID: string = fID || JSON.stringify(f.geometry.getCoordinates()[0][0])
                const p = getDipulFeaturesForPolygon(l, f.feature).then(value => {
                    if  (value == null) return
                    results[fieldID] = value
                })
                featurePromises.push(p)


            }

        }
    }

    await Promise.all(featurePromises)
    fieldsWithDipul.value = results
    dipulCheckProgress.value.inProgress = false
},
    { deep: true })


export async function getDipulFeaturesForPolygon(l: LayerListItem, polygonFeature: Feature<Geometry>) {

    const geom = polygonFeature.getGeometry()
    let rings: Array<Coordinate>[] = []

    if (geom instanceof Polygon) {
        rings = [geom.getCoordinates()[0]]
    } else if (geom instanceof MultiPolygon) {
        rings = geom.getCoordinates().map(coords => coords[0])
    }

    const foundFeatures: DipulFeature[] = []



    for (const exteriorRing of rings) {
        const testCoordinates = exteriorRing.filter((_, idx) => idx % dipulCheckRes.value === 0)

        for (const coordinate of testCoordinates) {
            console.log("Request features for: ", coordinate)
            const pinSrc = l.additionalLayers?.pointChecklayer?.getSource()
            if (pinSrc != null) {
                pinSrc.addFeature(getPin(coordinate))
            }

            let src: TileWMS
            if (dipulWmsLayer.getSource() == null)  {return}
            else {
                src = dipulWmsLayer.getSource() as TileWMS
            }

            const url = src.getFeatureInfoUrl(
                coordinate,
                agMap.getView().getResolutionForZoom(18),
                'EPSG:3857',
                {
                    INFO_FORMAT: 'application/json',
                    QUERY_LAYERS: activeDipulLayers.value.join(','),
                    feature_count: 100
                }
            )
            if (!url) {
                dipulCheckProgress.value.completed++
                continue
            }

            try {
                const res = await fetch(url)
                if (!res.ok) {
                    dipulCheckProgress.value.completed++
                    continue
                }
                const data = await res.json() as DipulFeatureCollection
                if (data.features && data.features.length > 0) {
                    // Füge alle gefundenen Feature-Objekte hinzu, ohne Duplikate (nach id)
                    data.features.forEach(feat => {
                        if (!foundFeatures.some(f => f.id === feat.id)) {
                            console.log("Feat: ", feat)
                            foundFeatures.push(feat)
                        }
                    })
                }
            } catch (e) { /* ignorieren */ }
            
            // Increment progress after each point is checked
            dipulCheckProgress.value.completed++


        }
    }

    return foundFeatures
}



export const featureInfo: Ref<DipulFeature[]> = ref([]) // Array für Features


export function getFeatureInfo(coordinate: Coordinate) {
    const view = agMap.getView();
    const viewResolution = view.getResolution() ;
    const source = dipulWmsLayer.getSource();

    if (source == null || viewResolution == null) {
        return
    }

    const url = source.getFeatureInfoUrl(
        coordinate,
        viewResolution,
        'EPSG:3857',
        {
            'INFO_FORMAT': 'application/json',
            'QUERY_LAYERS': activeDipulLayers.value.join(','),
            'feature_count': 100
        }
    );

    if (!url) {
        featureInfo.value = []
        return
    }


    fetch(url)
        .then(r => r.json())
        .then(json => {
            const retVal = json  as DipulFeatureCollection
            featureInfo.value = retVal.features ?? []
        })
}


