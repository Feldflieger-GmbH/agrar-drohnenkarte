import GeoJSON from "ol/format/GeoJSON";
import {agMap} from "./basemap.ts";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import Style from "ol/style/Style";
import {computed, type Ref, ref} from "vue";
import shp from 'shpjs'
import {circleStyle, lineStyle, polygonInnerStyle, polygonStyle} from "./kmlStyles.ts";
import {Feature} from "ol";
import {Geometry, LineString, MultiPolygon, Point, SimpleGeometry} from "ol/geom";
import KML from "ol/format/KML";
import Fill from "ol/style/Fill";
import Stroke from "ol/style/Stroke";
import type {FeatureLike} from "ol/Feature";
import Polygon from "ol/geom/Polygon";





export interface LayerListItem {
    name: string
    layer: VectorLayer<VectorSource<Feature<Geometry>>>,
    active: boolean,
    additionalLayers: {
        pointChecklayer?: VectorLayer
        edgePointLayer?: VectorLayer
    },
    featureList: {
        feature: Feature<Geometry>
        geometry: Polygon | MultiPolygon
    }[]
}
export const FieldLayerListRef: Ref<LayerListItem[]> = ref([])
export const FieldLayerList: LayerListItem[] = []

export function removeFieldLayer(layerItemRef: LayerListItem) {
    const index = FieldLayerList.findIndex((l) => l.name === layerItemRef.name)
    if (index === -1) {
        console.warn('Layer not found in FieldLayerListRef', layerItemRef)
        return
    }

    const layerItem = FieldLayerList[index]

    if (layerItem.layer == null) {
        console.warn('Layer instance is null', layerItemRef)
        return
    }

    // Is the layer in the map?
    const layersArray = agMap.getLayers().getArray()
    console.log('Is layer present in map?', layersArray.includes(layerItem.layer))




    if (layerItem.additionalLayers.pointChecklayer) {
        console.log('Is layer pointChecklayer in map?', layersArray.includes(layerItem.additionalLayers.pointChecklayer))
        agMap.removeLayer(layerItem.additionalLayers.pointChecklayer)
    }
    if (layerItem.additionalLayers.edgePointLayer) {
        console.log('Is layer edgePointLayer in map?', layersArray.includes(layerItem.additionalLayers.edgePointLayer))
        agMap.removeLayer(layerItem.additionalLayers.edgePointLayer)
    }


    agMap.removeLayer(layerItem.layer)
    FieldLayerList.splice(index, 1)
    FieldLayerListRef.value.splice(index, 1)
    console.log('Removed layer', layerItemRef)
}

export function toggleFieldLayerVisibility(layerName: string) {
    const layerItem = FieldLayerList.find((l) => l.name === layerName)
    const layerItemRef = FieldLayerListRef.value.find((l) => l.name === layerName)
    if (layerItem && layerItemRef) {
        layerItem.active = layerItemRef.active
        layerItem.layer.setVisible(layerItemRef.active)

        if(layerItemRef.active) {
            //if going active, show if enabled
            //layerItem.additionalLayers.edgePointLayer?.setVisible(showEdgePoints.value)
            //layerItem.additionalLayers.pointChecklayer?.setVisible(dipulCheckShowPoints.value)

        } else {
            //if not acive, always hinde
            layerItem.additionalLayers.edgePointLayer?.setVisible(layerItemRef.active)
            layerItem.additionalLayers.pointChecklayer?.setVisible(layerItemRef.active)
        }
    }
}




function addLayer(layer: VectorLayer, file: File) {



    const src = layer.getSource()
    if (src == null) return

    // Optional: Zoom auf die KML-Geometrie
    const extent = src.getExtent()
    if (extent && extent[0] !== Infinity) {
        agMap.getView().fit(extent, {duration: 800, maxZoom: 14})
    }


    const featureList = src.getFeatures().filter(f => {
        const t = f.getGeometry()
        return (t instanceof Polygon || t instanceof MultiPolygon)
    })

    const features:{
        feature: Feature<Geometry>
        geometry: Polygon | MultiPolygon
    }[] = []

    features.push(...featureList.map(feature => ({
        feature: feature,
        geometry: feature.getGeometry() as Polygon | MultiPolygon
    })))

    agMap.addLayer(layer)
    FieldLayerList.push({
        name: file.name,
        layer: layer,
        featureList: features,
        additionalLayers: {},
        active: true
    })
    FieldLayerListRef.value.push({
        name: file.name,
        layer: layer,
        featureList: features,
        additionalLayers: {},
        active: true
    })

    console.log(FieldList)
}


export function handleFileUpload(event: Event) {
    const trgt = event.target as HTMLInputElement
    if (trgt.files ==  null || trgt.files.length <= 0) {
        return
    }
    const file = trgt.files[0]
    if (!file) return


    const reader = new FileReader()
    reader.onload = function (e) {
        if (e.target== null) return

        let newLayer: VectorLayer | undefined
        if(file.name.endsWith(".zip")) {
            const arrayBuffer = e.target.result
            if(arrayBuffer == null) {
                return
            }

            shp(arrayBuffer).then(geojson => {
                const features = new GeoJSON().readFeatures(geojson, {
                    featureProjection: 'EPSG:3857',
                })

                newLayer = new VectorLayer({
                    source: new VectorSource({features}),
                    style: fieldStyle
                })
                addLayer(newLayer, file)
            })
        } else if(file.name.endsWith(".kml")) {
            let kmlText = e.target.result as string

            // Korrigiere <Name> zu <name> für OpenLayers-Kompatibilität!
            kmlText = kmlText.replace(/<Name>/g, '<name>').replace(/<\/Name>/g, '</name>')

            const kmlFormat = new KML({extractStyles: false})
            // Erzeuge neuen KML-Layer
            newLayer = new VectorLayer({
                source: new VectorSource({
                    features: kmlFormat.readFeatures(kmlText, {
                        featureProjection: 'EPSG:3857'
                    })
                }),
                style: fieldStyle           // <- will now be called
            })
            addLayer(newLayer, file)

        }

    }

    if(file.name.endsWith(".zip")) {
        reader.readAsArrayBuffer(file)
    } else if(file.name.endsWith(".kml")) {
        reader.readAsText(file)
    }

}

function fieldStyle(feature: FeatureLike) {
    // : StyleLike | FlatStyleLike | null | undefined
    const geom = feature.getGeometry()
    if(geom == null) return


    if (geom instanceof Point) {
        return new Style({
            image: circleStyle
        })
    }
    if (geom instanceof LineString) {
        return lineStyle
    }
    // Flächen (z.B. Polygone)
    if (geom instanceof Polygon) {
        const coords = geom.getCoordinates()
        const styles = []

        styles.push(polygonStyle(feature))
        for (let i = 1; i < coords.length; ++i) {
            styles.push(polygonInnerStyle(coords[i]))
        }
        return styles
    }

    return new Style({
        stroke: new Stroke({
            color: '#a21caf', // violett
            width: 2,
        }),
        fill: new Fill({
            color: 'rgba(162, 28, 175, 0.1)',
        }),
    })
}


export const FieldList = computed(() => {
    const features:  {
        feature: Feature<Geometry>
        geometry: Polygon | MultiPolygon
    }[] = []

    console.log("Getting FieldList")

    FieldLayerListRef.value.forEach(l => {
        const src = l.layer.getSource()
        if(src!=null) {
            const featureList = src.getFeatures().filter(f => {
                const t = f.getGeometry()
                return (t instanceof Polygon || t instanceof MultiPolygon)
            })

            features.push(...featureList.map(feature => ({
                feature: feature,
                geometry: feature.getGeometry() as Polygon | MultiPolygon
            })))
        }
    })

    console.log("Getting FieldList: ")
    console.log(features.length)
    return features.sort((a, b) => {
        const nameA = getFeatureName(a.feature);
        const nameB = getFeatureName(b.feature);
        // use localeCompare for proper alphabetical order;
        // sensitivity:'base' makes it case- and accent-insensitive
        return nameA.localeCompare(nameB, undefined, {sensitivity: 'base'});
    })
})

export function getFeatureName(feature: Feature): string {
    const props = feature.getProperties();
    // try all your possible name fields, default to empty string
    const name = (
        props.name ||
        props.NAME ||
        props.Name ||
        props.FLUR ||
        props.BEZEICHNUNG ||
        ''
    ).toString();

    console.log("FeatureName: ", name)

    return name;
}


export function zoomToPolygon(feature: Feature<Geometry>) {
    // Hole das Extent der Geometrie
    const geometry = feature.getGeometry()
    if (geometry) {
        agMap.getView().fit(geometry as SimpleGeometry, {
            padding: [60, 60, 60, 60], // Ränder
            maxZoom: 18,               // nicht zu weit reinzoomen
            duration: 600,             // Animationseffekt
        })
    }
}

