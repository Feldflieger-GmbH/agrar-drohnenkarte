import { ref, watch } from 'vue'
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import Feature from 'ol/Feature'
import Point from 'ol/geom/Point'
import Style from 'ol/style/Style'
import CircleStyle from 'ol/style/Circle'
import Fill from 'ol/style/Fill'
import Stroke from 'ol/style/Stroke'
import {kmlLayer, shapefileLayer} from "./customerMaps.ts";
import {agMap} from "./basemap.ts";
import Polygon from "ol/geom/Polygon";
import {MapBrowserEvent} from "ol";
import {Geometry} from "ol/geom";

export const showAllPoints = ref(false)
let pointsLayer: VectorLayer | null = null

export const simplifyTolerance = ref(25) // Startwert: sehr kleine Toleranz (in Karten-Einheiten)
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


function createPointsLayer() {
    const features = []

    // Alle Polygone (aus KML und SHP) ablaufen:
    if (kmlLayer.value) {
        features.push(...polygonVerticesFromLayer(kmlLayer.value))
    }
    if (shapefileLayer.value) {
        features.push(...polygonVerticesFromLayer(shapefileLayer.value))
    }

    const source = new VectorSource({ features })
    return new VectorLayer({
        source,
        zIndex: 200,
        style: new Style({
            image: new CircleStyle({
                radius: 5,
                fill: new Fill({ color: '#2563eb' }),   // Tailwind blue-600
                stroke: new Stroke({ color: '#fff', width: 1 })
            })
        })
    })
}

watch(showAllPoints, (active) => {
    if (active) {
        pointsLayer = createPointsLayer()
        agMap.addLayer(pointsLayer)
    } else if (pointsLayer) {
        agMap.removeLayer(pointsLayer)
        pointsLayer = null
    }
})

// Aktualisiere Punkte, wenn KML/SHP geladen/geändert werden:
watch([kmlLayer, shapefileLayer], () => {
    if (showAllPoints.value) {
        if (pointsLayer) agMap.removeLayer(pointsLayer)
        pointsLayer = createPointsLayer()
        agMap.addLayer(pointsLayer)
    }
})

export function registerContextMenuHandler() {
    agMap.on('click', function (evt: MapBrowserEvent) {
        evt.preventDefault()
        console.log("Remove Point")
        agMap.forEachFeatureAtPixel(evt.pixel, function (feature, layer) {
            if (layer === pointsLayer && feature.getGeometry()?.getType() === 'Point') {
                const parentFeature = feature.get('parentFeature') as Feature<Polygon>
                const idx = feature.get('vertexIndex') as number
                if (!parentFeature || typeof idx !== 'number') return true

                const geom = parentFeature.getGeometry() as Polygon
                let coords = geom.getCoordinates()[0].slice()
                if (coords.length <= 4) {
                    alert('Ein Polygon braucht mindestens 4 Punkte (inkl. Abschluss).')
                    return true
                }
                coords.splice(idx, 1)
                if (!pointsEqual(coords[0], coords[coords.length - 1])) {
                    coords[coords.length - 1] = [...coords[0]]
                }
                geom.setCoordinates([coords])

                updatePointsLayer(pointsLayer, [kmlLayer.value, shapefileLayer.value])

                return true
            }
        })
    })
}

function updatePointsLayer(pointsLayer: VectorLayer | null, polygonLayers: (VectorLayer<VectorSource<Feature<Geometry>>, Feature<Geometry>> | undefined)[]) {

    const src = pointsLayer?.getSource()
    src?.clear()


    for (const pl of polygonLayers) {
        if (pl != undefined)
            src?.addFeatures(polygonVerticesFromLayer(pl))
    }
}

function pointsEqual(a: number[], b: number[]): boolean {
    return a[0] === b[0] && a[1] === b[1]
}

export function simplifyAllPolygons(): number {

    const layers = [kmlLayer.value, shapefileLayer.value].filter(Boolean)
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

    updatePointsLayer(pointsLayer, [kmlLayer.value, shapefileLayer.value])
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
        } else {
            console.log("Removed point", curr)
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