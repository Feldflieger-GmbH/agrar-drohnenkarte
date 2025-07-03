import { ref, watch } from 'vue'
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import Feature from 'ol/Feature'
import Point from 'ol/geom/Point'
import Style from 'ol/style/Style'
import CircleStyle from 'ol/style/Circle'
import Fill from 'ol/style/Fill'
import Stroke from 'ol/style/Stroke'
import {FieldLayerList, FieldLayerListRef} from "./customerMaps.ts";
import {agMap} from "./basemap.ts";
import Polygon from "ol/geom/Polygon";
import {MapBrowserEvent} from "ol";
import {DragPan} from "ol/interaction";

export const showEdgePoints = ref(false)
export const simplifyTolerance = ref(25)
export const removedVertexCount = ref(0)


function polygonVerticesFromLayer(layer: VectorLayer): Feature<Point>[] {
    const arr: Feature<Point>[] = []
    const features = layer.getSource()?.getFeatures() ?? []
    for (const feat of features) {
        const geom = feat.getGeometry()
        if (!geom) continue
        if (geom.getType() === 'Polygon') {
            const coords = (geom as Polygon).getCoordinates()[0]
            coords.forEach((coord, i) => {
                const vertexFeature = new Feature<Point>({ geometry: new Point(coord) })
                // Setze Parent & Index als Properties
                vertexFeature.set('parentFeature', feat)
                vertexFeature.set('vertexIndex', i)
                arr.push(vertexFeature)
            })
        }
        // MultiPolygon analog, falls benötigt
    }
    return arr
}


function recreatePointsLayer() {

    for (const l of FieldLayerList) {
        if (l.active) {

            const features: Feature<Point>[] = []
            features.push(...polygonVerticesFromLayer(l.layer))
            if (l.additionalLayers.edgePointLayer) {
                agMap.removeLayer(l.additionalLayers.edgePointLayer)
            }

            l.additionalLayers.edgePointLayer = new VectorLayer({
                source: new VectorSource({ features }),
                visible: showEdgePoints.value,
                zIndex: 200,
                style: new Style({
                    image: new CircleStyle({
                        radius: 5,
                        fill: new Fill({ color: '#2563eb' }),   // Tailwind blue-600
                        stroke: new Stroke({ color: '#fff', width: 1 })
                    })
                })
            })


            if (l.additionalLayers.edgePointLayer != null) {
                agMap.addLayer(l.additionalLayers.edgePointLayer)
            }

        }
    }
}

watch(showEdgePoints, (val) => {
    for (const l of FieldLayerList) {

        if (val) {
            recreatePointsLayer()
        }
        if (l.additionalLayers?.edgePointLayer != null) {
            l.additionalLayers.edgePointLayer.setVisible(val)
        }
    }
})

// Aktualisiere Punkte, wenn KML/SHP geladen/geändert werden:
watch(FieldLayerListRef, () => {
    console.log("Watcher2!")
    if (showEdgePoints.value) {
        recreatePointsLayer()
    }
},
    { deep: true })

export function registerContextMenuHandler() {
    agMap.on('click', function (evt: MapBrowserEvent) {
        evt.preventDefault()
        const allPointLayers = FieldLayerList.map(item => item.additionalLayers.edgePointLayer).filter(Boolean)
        agMap.forEachFeatureAtPixel(evt.pixel, function (feature, layer) {
            if (allPointLayers.includes(layer as VectorLayer) && feature.getGeometry()?.getType() === 'Point') {
                const parentFeature = feature.get('parentFeature') as Feature<Polygon>
                let idx = feature.get('vertexIndex') as number
                if (!parentFeature || typeof idx !== 'number') return true

                const geom = parentFeature.getGeometry() as Polygon
                let coords = geom.getCoordinates()[0].slice()
                //console.log("remove point at idx", idx, coords.length)

                if (idx == coords.length-1) {
                    idx = 0
                }

                if (coords.length <= 4) {
                    alert('Ein Polygon braucht mindestens 4 Punkte (inkl. Abschluss).')
                    return true
                }
                coords.splice(idx, 1)
                if (!pointsEqual(coords[0], coords[coords.length - 1])) {
                    coords[coords.length - 1] = [...coords[0]]
                }
                geom.setCoordinates([coords])

                recreatePointsLayer()
                return true
            }
        })
    })
}


function pointsEqual(a: number[], b: number[]): boolean {
    return a[0] === b[0] && a[1] === b[1]
}

export function simplifyAllPolygons(): number {

    //const layers = [kmlLayer.value, shapefileLayer.value].filter(Boolean)
    const layers = FieldLayerList.map(item => item.layer)
    const tolerance = simplifyTolerance.value
    let removed = 0
    for (const layer of layers) {
        const features = layer?.getSource()?.getFeatures() ?? []
        for (const feat of features) {
            const geom = feat.getGeometry() as Polygon
            const coords = geom.getCoordinates()[0]
            const simplified = simplifyPolygonCoords(coords, tolerance)
            if (simplified.length < coords.length) {
                removed += coords.length - simplified.length
                geom.setCoordinates([simplified])
            }
        }
    }


    recreatePointsLayer()
    removedVertexCount.value = removed
    return removed
}


function simplifyPolygonCoords(coords: number[][], tolerance: number = 1e-8): number[][] {
    if (coords.length <= 4) return coords // nichts zu tun (mind. 4, inkl. Abschluss)
    const simplified = [coords[0]]
    for (let i = 1; i < coords.length - 1; i++) {
        const prev = simplified[simplified.length - 1]
        const curr = coords[i]
        const next = coords[(i + 1) % coords.length]
        if (!isCollinear(prev, curr, next, tolerance)) {
            simplified.push(curr)
        }

    }
    simplified.push(coords[coords.length - 1]) // Abschluss
    // Immer auf min. 4 reduzieren!
    if (simplified.length < 4) return coords
    // Abschluss-Punkt synchronisieren
    simplified[simplified.length - 1] = simplified[0].slice()
    return simplified
}

function isCollinear(a: number[], b: number[], c: number[], tolerance: number = 1e-8): boolean {
    // Flächenformel: 2*Dreiecksfläche ≈ 0 → Punkte liegen auf Linie
    // Cross-Produkt-Variante:
    const area = Math.abs(
        (b[0] - a[0]) * (c[1] - a[1]) -
        (b[1] - a[1]) * (c[0] - a[0])
    )
    return area < tolerance
}



let draggingVertex: {
    feature: Feature,
    layer: VectorLayer,
    idx: number,
    parentFeature: Feature<Polygon>
} | null = null

export function registerVertexMoveHandler() {
    const dragPanInteraction = agMap.getInteractions().getArray().find(i => i instanceof DragPan) as DragPan;

    //@ts-ignore
    agMap.on('pointerdown', function (evt: MapBrowserEvent<PointerEvent>) {
        const allPointLayers = FieldLayerList.map(item => item.additionalLayers.edgePointLayer).filter(Boolean)
        agMap.forEachFeatureAtPixel(evt.pixel, function (feature, layer) {
            if (
                allPointLayers.includes(layer as VectorLayer) &&
                feature.getGeometry()?.getType() === 'Point'
            ) {
                const parentFeature = feature.get('parentFeature') as Feature<Polygon>
                let idx = feature.get('vertexIndex') as number
                if (!parentFeature || typeof idx !== 'number') return true

                if(feature instanceof Feature && layer instanceof VectorLayer) {
                    draggingVertex = {feature, layer, idx, parentFeature}
                    if (dragPanInteraction) dragPanInteraction.setActive(false);
                }
                return true
            }
        })
    })

    agMap.on('pointermove', function (evt: MapBrowserEvent) {

        if (!draggingVertex) return

        const geom = draggingVertex.parentFeature.getGeometry() as Polygon
        let coords = geom.getCoordinates()[0].slice()

        // Ensure idx is correct for polygons with closure point
        let idx = draggingVertex.idx
        if (idx === coords.length - 1) {
            idx = 0
        }

        const newCoord = agMap.getCoordinateFromPixel(evt.pixel)
        coords[idx] = newCoord

        // Ensure closure point
        if (!pointsEqual(coords[0], coords[coords.length - 1])) {
            coords[coords.length - 1] = [...coords[0]]
        }
        geom.setCoordinates([coords])
        recreatePointsLayer()
    })

    //@ts-ignore
    agMap.on('pointerup', function ()  {
        draggingVertex = null

        if (dragPanInteraction) dragPanInteraction.setActive(true);
    })
}