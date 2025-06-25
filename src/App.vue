<template>
  <div class="flex flex-col min-h-screen">
    <!-- Header -->
    <HeaderBar />


    <div class="flex flex-1 min-h-0">

      <LeftSidebar />

      <main class="flex-1 flex flex-col min-w-0">
        <div ref="mapContainer" class="flex-1 min-h-0"></div>
      </main>

      <RightSidebar />
    </div>
  </div>
</template>

<script setup>
import {onMounted, ref, watch} from 'vue'
import 'ol/ol.css'

import HeaderBar from "./components/HeaderBar.vue";
import LeftSidebar from "./components/LeftSidebar.vue";
import {dipulLayerGroups, toggleLayer} from "./composables/dipulLayers.js";
import {agMap, basemapSetup} from "./composables/basemap.js";
import RightSidebar from "./components/RightSidebar.vue";
import {
  allPolygonFeatures,
  dipulCheckActive,
  dipulCheckRes, dipulCheckShowPoints, getDipulFeaturesForPolygon,
  getFeatureInfo,
  pinLayer, polygonsWithDipul, removeAllPins
} from "./composables/customerMaps.js";






const mapContainer = ref(null)


watch(dipulCheckShowPoints, (val) => {
  pinLayer.setVisible(val)
})



onMounted(() => {
  basemapSetup()

  agMap.setTarget(mapContainer.value)

  agMap.addLayer(pinLayer)

  // Click-Listener für GetFeatureInfo
  agMap.on('click', function (evt) {
    console.log('click')
    getFeatureInfo(evt.coordinate);
  });
  // Click-Listener für GetFeatureInfo
  agMap.on('singleclick', function (evt) {
    console.log('singleclick')
    getFeatureInfo(evt.coordinate);
  });

  dipulLayerGroups.value.forEach(group => {
    group.layers.forEach(layer => {
      if (layer.checked) toggleLayer(layer)
    })
  })
})





watch([allPolygonFeatures, dipulCheckActive, dipulCheckRes], async ([features, checkActive]) => {
  if (!checkActive) {
    polygonsWithDipul.value = {}
    return
  }
  removeAllPins()
  const results = {};
  const featurePromises = []
  for (const f of features) {

    let fID;
    if (f.getId() !== undefined) {
      fID = f.getId().toString()
    }

    const id = fID || JSON.stringify(f.getGeometry().getCoordinates()[0][0])
    const p = getDipulFeaturesForPolygon(f).then(value => {
      results[id] = value
      if (value.length > 0) {
        //break
      }
    })
    featurePromises.push(p)


  }
  await Promise.all(featurePromises)
  polygonsWithDipul.value = results
}, {immediate: true})







</script>
