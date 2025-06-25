import Style from 'ol/style/Style'
import Stroke from 'ol/style/Stroke'
import Fill from 'ol/style/Fill'
import CircleStyle from 'ol/style/Circle'
import Polygon from "ol/geom/Polygon";
import {Feature} from "ol";
import Text from 'ol/style/Text'
import type {FeatureLike} from "ol/Feature";

export const lineStyle = new Style({
    stroke: new Stroke({
        color: '#22d3ee',
        width: 3,
    }),
})

export function polygonStyle(feature: FeatureLike) {
    const props = feature.getProperties()
    const polyName = props.name || props.NAME || props.Name || props.FLUR || props.BEZEICHNUNG || '' // Holt das <Name>-Element

    return new Style({
        stroke: new Stroke({
            color: '#2563eb', // blau
            width: 2,

        }),
        fill: new Fill({
            color: 'rgba(37, 99, 235, 0.2)',
        }),
        text: polyName // oder ein anderes Feld
            ? new Text({
                text: polyName, // DBF-Feldname!
                font: 'bold 14px Arial, sans-serif',
                fill: new Fill({color: '#0891b2'}),
                stroke: new Stroke({color: '#fff', width: 3}),
                overflow: true,
            })
            : undefined,
    })
}

export function polygonInnerStyle(coords) {
    return new Style({
        stroke: new Stroke({color: '#dc2626', width: 2, lineDash: [4, 4]}),
        fill: new Fill({color: 'rgba(255,255,255,0.8)'}),
        geometry: new Polygon([coords]), // Nur Innenring
    })
}

export const circleStyle = new CircleStyle({
    radius: 6,
    fill: new Fill({color: '#db2777'}),
    stroke: new Stroke({color: '#fff', width: 2})
})