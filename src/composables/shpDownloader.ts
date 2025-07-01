
import * as shpwrite from '@mapbox/shp-write'

import type {Feature} from "ol";
import type Polygon from "ol/geom/Polygon";
import {FieldLayerList} from "./customerMaps.ts";
import {ref} from "vue";
import GeoJSON from "ol/format/GeoJSON";

export const fieldPrefix = ref('')

function getAllPolygons(): Feature<Polygon>[] {
    const polys: Feature<Polygon>[] = []


    // Alle Polygone (aus KML und SHP) ablaufen:
    if (FieldLayerList) {
        FieldLayerList.forEach(l => {
            polys.push(...(l.layer.getSource()?.getFeatures()
                .filter(f => f.getGeometry()?.getType().includes('Polygon')) as Feature<Polygon>[]))

        })
    }

    /*
    if (kmlLayer.value) {
        polys.push(...(kmlLayer.value.getSource()?.getFeatures()
            .filter(f => f.getGeometry()?.getType().includes('Polygon')) as Feature<Polygon>[]))
    }
    if (shapefileLayer.value) {
        polys.push(...(shapefileLayer.value.getSource()?.getFeatures()
            .filter(f => f.getGeometry()?.getType().includes('Polygon')) as Feature<Polygon>[]))
    }*/
    return polys
}

export async function downloadAsShapefile() {
    const polygons = getAllPolygons()
    if (!polygons.length) {
        alert('Keine Polygone geladen!')
        return
    }

    // Als GeoJSON exportieren
    const exporter = new GeoJSON()
    const geojson = exporter.writeFeaturesObject(
        polygons,
        {featureProjection: 'EPSG:3857', dataProjection: 'EPSG:4326'}
    )
    const options:  shpwrite.DownloadOptions & shpwrite.ZipOptions = {
        outputType: "blob",
        compression: "DEFLATE"

    };

    // Präfix auf Name-Eigenschaft anwenden (und nur "name" Property exportieren)
    geojson.features.forEach((f, i) => {
        if (!f.properties) f.properties = {}
        f.properties.name = replaceUmlaute(fieldPrefix.value + (f.properties.name ?? f.properties.NAME ?? f.properties.bez ?? (i + 1)))
        f.properties = {name: f.properties.name}
    })

    // ZIP erzeugen mit shpwrite.write
    const zipResult = await shpwrite.zip(geojson, options)

// Immer ArrayBuffer erzeugen (egal was zurückkommt):
    let blobData: BlobPart
    if (zipResult instanceof ArrayBuffer) {
        blobData = zipResult
    } else if (zipResult instanceof Uint8Array) {
        blobData = zipResult.buffer
    } else if (Array.isArray(zipResult)) {
        // number[]: Umwandeln in Uint8Array
        blobData = new Uint8Array(zipResult).buffer
    } else {
        // Fallback: string oder andere
        blobData = zipResult as any
    }
    // Buffer in Blob umwandeln und Download anstoßen
    const blob = new Blob([blobData], { type: 'application/zip' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'felder.zip'
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
}

function replaceUmlaute(str: string) {
    return str
        .replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue')
        .replace(/Ä/g, 'Ae').replace(/Ö/g, 'Oe').replace(/Ü/g, 'Ue')
        .replace(/ß/g, 'ss')
}