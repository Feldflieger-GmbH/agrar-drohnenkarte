import { ref } from 'vue'
import Draw from 'ol/interaction/Draw'
import Polygon from 'ol/geom/Polygon'
import type { Feature } from 'ol'
import {agMap} from "./basemap.ts";
import ol from "ol/dist/ol";
import type {Coordinate} from "ol/coordinate";

// Annahme: selectedPolygonFeature ist das aktuelle Polygon-Feature
export const selectedPolygonFeature = ref<Feature<Polygon> | null>(null)
export const drawHoleActive = ref(false)
let drawInteraction: Draw | null = null

export function activateDrawHole() {
    if (!selectedPolygonFeature.value) return

    drawHoleActive.value = true

    // Interaktion aktivieren
    drawInteraction = new Draw({
        source: new ol.source.Vector(), // Dummy, wir übernehmen das Loch manuell
        type: 'Polygon'
    })

    agMap.addInteraction(drawInteraction)

    drawInteraction.on('drawend', function(evt) {


        if(evt.feature == undefined || evt.feature.getGeometry() ==undefined)
            return

        const geom1 = evt.feature.getGeometry()
        if(geom1 == undefined) return;

        let innerRing: Coordinate[] = []
        if(geom1 instanceof Polygon)
            innerRing = geom1.getCoordinates()[0]

        // Loch dem Zielpolygon hinzufügen
        const geom = selectedPolygonFeature.value!.getGeometry() as Polygon
        const allRings = geom.getCoordinates()
        allRings.push(innerRing)
        geom.setCoordinates(allRings)
        // Interaktion entfernen
        agMap.removeInteraction(drawInteraction!)
        drawInteraction = null
        drawHoleActive.value = false
        // Punkte-Layer neu aufbauen, falls du Eckpunkte für Löcher anzeigen willst:
        // updatePointsLayer(pointsLayer, [polygonLayer1, polygonLayer2, ...])
    })
}

agMap.on('singleclick', function(evt) {
    agMap.forEachFeatureAtPixel(evt.pixel, function(feature, _) {
        if (feature.getGeometry()?.getType() === 'Polygon') {
            selectedPolygonFeature.value = feature as Feature<Polygon>
            // Optional: Polygon farblich hervorheben
            return true // nur erstes Feature nehmen
        }
    })
})