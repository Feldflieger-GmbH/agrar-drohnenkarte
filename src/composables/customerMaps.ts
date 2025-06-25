import GeoJSON from "ol/format/GeoJSON";
import {agMap} from "./basemap.ts";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import Style from "ol/style/Style";
import {computed, type Ref, ref} from "vue";
import shp from 'shpjs'
import Icon from "ol/style/Icon";
import pinImg from "../assets/pin_mini_16px.png";
import {circleStyle, lineStyle, polygonInnerStyle, polygonStyle} from "./kmlStyles.ts";
import {Feature} from "ol";
import {Geometry, LineString, MultiPolygon, Point, SimpleGeometry} from "ol/geom";
import KML from "ol/format/KML";
import CircleStyle from "ol/style/Circle";
import Fill from "ol/style/Fill";
import Stroke from "ol/style/Stroke";
import {activeDipulLayers, dipulWmsLayer} from "./dipulLayers.ts";
import type {DipulFeature, DipulFeatureCollection} from "./dipulFeature.ts";
import type {FeatureLike} from "ol/Feature";
import Polygon from "ol/geom/Polygon";
import type {Coordinate} from "ol/coordinate";
import type TileWMS from "ol/source/TileWMS";


interface DipulFeatureMap {
    [key: string]: DipulFeature[];
}
export const polygonsWithDipul: Ref<DipulFeatureMap> = ref({})
export const dipulCheckShowPoints = ref(false)
const pinSource = new VectorSource()
export const pinLayer = new VectorLayer({
    source: pinSource,
    zIndex: 99,
    visible: dipulCheckShowPoints.value
})
export const shapefileLayer : Ref<VectorLayer<VectorSource<Feature<Geometry>>, Feature<Geometry>> | undefined> = ref()
export const kmlLayer: Ref<VectorLayer<VectorSource<Feature<Geometry>>, Feature<Geometry>> | undefined> = ref()

export const featureInfo: Ref<DipulFeature[]> = ref([]) // Array für Features
export const dipulCheckActive = ref(true)
export const dipulCheckRes = ref(5)


export function handleKmlUpload(event: Event) {
    const trgt = event.target as HTMLInputElement
    if (trgt.files ==  null || trgt.files.length <= 0) {
        return
    }
    const file = trgt.files[0]
    if (!file) return


    removeAllPins()
    const reader = new FileReader()
    reader.onload = function (e) {
        if (e.target== null) return

        let kmlText = e.target.result as string

        // Korrigiere <Name> zu <name> für OpenLayers-Kompatibilität!
        kmlText = kmlText.replace(/<Name>/g, '<name>').replace(/<\/Name>/g, '</name>')


        // Entferne alten KML-Layer, falls vorhanden
        if (kmlLayer.value) {
            agMap.removeLayer(kmlLayer.value)
            kmlLayer.value = undefined
        }
        const kmlFormat = new KML({extractStyles: false})
        // Erzeuge neuen KML-Layer
        kmlLayer.value = new VectorLayer({
            source: new VectorSource({
                features: kmlFormat.readFeatures(kmlText, {
                    featureProjection: 'EPSG:3857'
                })
            }),
            style: kmlStyle           // <- will now be called
        })

        agMap.addLayer(kmlLayer.value)

        const src = kmlLayer.value.getSource()
        if (src == null) return

        // Optional: Zoom auf die KML-Geometrie
        const extent = src.getExtent()
        if (extent && extent[0] !== Infinity) {
            agMap.getView().fit(extent, {duration: 800, maxZoom: 14})
        }
    }
    reader.readAsText(file)
}
function kmlStyle(feature: FeatureLike) {
    // : StyleLike | FlatStyleLike | null | undefined
    const geom = feature.getGeometry()
    if(geom == null) return


    if (geom instanceof Point) {

        return new Style({
            image: new CircleStyle({
                radius: 7,
                fill: new Fill({color: '#1e40af'}),
                stroke: new Stroke({color: '#fff', width: 2}),
            }),
        })
    }
    // Linien (z.B. Tracks)
    if (geom.getType() === 'LineString') {
        return new Style({
            stroke: new Stroke({
                color: '#eab308', // gelb
                width: 3,
            }),
        })
    }
    // Flächen (z.B. Polygone)
    if (geom instanceof Polygon) {
        const coords = geom.getCoordinates()
        const styles = []

        // 1. Außenring: blau gefüllt
        styles.push(polygonStyle(feature))

        // 2. Alle Innenringe (Löcher): separat, z. B. rot umranden, weiß füllen
        for (let i = 1; i < coords.length; ++i) {
            styles.push(polygonInnerStyle(coords[i]))
        }
        return styles
    }
    // Standard-Fallback
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
export function removeKmlLayer() {
    if (kmlLayer.value) {
        agMap.removeLayer(kmlLayer.value)
        kmlLayer.value = undefined
        removeAllPins()
    }
}

export function handleShpUpload(event: Event) {
    const trgt = event.target as HTMLInputElement
    if (trgt.files ==  null || trgt.files.length <= 0) {
        return
    }
    const file = trgt.files[0]
    if (!file) return


    // Muss eine ZIP sein!
    if (!file.name.endsWith('.zip')) {
        alert('Bitte eine Shape-Datei als ZIP-Archiv hochladen.')
        return
    }

    removeAllPins()
    const reader = new FileReader()
    reader.onload = function (e) {
        if (e.target == null) return
        const arrayBuffer = e.target.result
        if(arrayBuffer == null) {
            return
        }

        shp(arrayBuffer).then(geojson => {
            // geojson ist ein FeatureCollection-Objekt
            const features = new GeoJSON().readFeatures(geojson, {
                featureProjection: 'EPSG:3857',
            })

            // Alten Layer ggf. entfernen
            if (shapefileLayer.value) {
                agMap.removeLayer(shapefileLayer.value)
            }



            // Layer mit einfachem Style
            shapefileLayer.value = new VectorLayer({
                source: new VectorSource({features}),
                style: (feature) => {

                    let fGeom:  Geometry | undefined
                    if (feature instanceof Feature) {
                      fGeom = feature.getGeometry()
                    }


                    if(fGeom == null) return

                    if (fGeom instanceof Point) {
                        return new Style({
                            image: circleStyle
                        })
                    }
                    if (fGeom instanceof LineString) {
                        return lineStyle
                    }
                    if (fGeom instanceof Polygon) {
                        const coords = fGeom.getCoordinates()
                        const styles = []

                        styles.push(polygonStyle(feature))
                        for (let i = 1; i < coords.length; ++i) {
                            styles.push(polygonInnerStyle(coords[i]))
                        }
                        return styles
                    }
                }
            })

            agMap.addLayer(shapefileLayer.value)


            const src = shapefileLayer.value.getSource()
            if(src==null) return

            // Zoom auf die Shape-Features
            const extent = src.getExtent()
            if (extent && extent[0] !== Infinity) {
                agMap.getView().fit(extent, {duration: 800, maxZoom: 14})
            }
        })
            .catch(err => {
                alert('Fehler beim Lesen der Shape-Datei: ' + err)
            })
    }
    reader.readAsArrayBuffer(file)
}
export function removeShapefileLayer() {
    if (shapefileLayer.value) {
        agMap.removeLayer(shapefileLayer.value)
        shapefileLayer.value = undefined
        removeAllPins()
    }
}

export const allPolygonFeatures = computed(() => {
    const features:  {
        feature: Feature<Geometry>
        geometry: Polygon | MultiPolygon
    }[] = []

    if (kmlLayer.value && kmlLayer.value.getSource()) {

        const src = kmlLayer.value.getSource()
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
    }
    if (shapefileLayer.value && shapefileLayer.value.getSource()) {

        const src = shapefileLayer.value.getSource()
        if (src != null) {

            const featureList = src.getFeatures().filter(f => {
                const t = f.getGeometry()
                return (t instanceof Polygon || t instanceof MultiPolygon)
            })

            features.push(...featureList.map(feature => ({
                feature: feature,
                geometry: feature.getGeometry() as Polygon | MultiPolygon
            })))
        }
    }


    return features.sort((a, b) => {
        const nameA = getFeatureName(a.feature);
        const nameB = getFeatureName(b.feature);
        // use localeCompare for proper alphabetical order;
        // sensitivity:'base' makes it case- and accent-insensitive
        return nameA.localeCompare(nameB, undefined, {sensitivity: 'base'});
    })
})

function getFeatureName(feature: Feature): string {
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

export const dipulZoneToFields = computed(() => {
    // Key: DIPUL-Feature-ID (oder Name)
    // Value: Array von Polygon-Features
    const mapping: {[key: string]: {[key: string]:  {
        feature: Feature<Geometry>
        geometry: Polygon | MultiPolygon
        name: string
    }[]}} = {}

    if (allPolygonFeatures.value == undefined) return mapping

    allPolygonFeatures.value.forEach(fld => {
        const fGeo  = fld.geometry

        const key = fld.feature.getId() || JSON.stringify(fGeo.getCoordinates()[0][0])

        let dipulList: DipulFeature[] = [];
        if (polygonsWithDipul.value) {
            dipulList = polygonsWithDipul.value[key]
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
    return mapping
})


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


// Funktion für GetFeatureInfo
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


export async function getDipulFeaturesForPolygon(polygonFeature: Feature<Geometry>) {


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
            addPinAt(coordinate)

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
            if (!url) continue

            try {
                const res = await fetch(url)
                if (!res.ok) continue
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
            } catch (e) { /* ignorieren */
            }


        }
    }

    return foundFeatures
}


export function removeAllPins() {
    pinSource.clear()
}

// Funktion zum Setzen des Pins an Koordinaten (EPSG:3857!)
export function addPinAt(coord: Array<number>) {
    const pinFeature = new Feature({
        geometry: new Point(coord),
    })
    //const textC = coord.toString()
    pinFeature.setStyle(
        new Style({
            /*text: textC // oder ein anderes Feld
                ? new Text({
                  text: textC, // DBF-Feldname!
                  font: 'bold 14px Arial, sans-serif',
                  fill: new Fill({ color: '#0891b2' }),
                  stroke: new Stroke({ color: '#fff', width: 3 }),
                  overflow: true,
                })
                : undefined,*/
            image: new Icon({
                src: pinImg,
                anchor: [0.5, 1],
                scale: 1, // Passe ggf. die Größe an
            }),
        })
    )
    pinSource.addFeature(pinFeature)
}