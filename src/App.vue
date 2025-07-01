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
import {registerContextMenuHandler, registerVertexMoveHandler} from "./composables/fieldOptimisatzion.js";
import {getFeatureInfo} from "./composables/dipulFeature.js";







const mapContainer = ref(null)





onMounted(() => {
  console.log("main mounting")
  basemapSetup()

  agMap.setTarget(mapContainer.value)


  // Click-Listener für GetFeatureInfo
  agMap.on('click', function (evt) {
    getFeatureInfo(evt.coordinate);
  });

  dipulLayerGroups.value.forEach(group => {
    group.layers.forEach(layer => {
      if (layer.checked) toggleLayer(layer)
    })
  })
  registerContextMenuHandler()
  registerVertexMoveHandler();
  //dipulFeatureSetup()
  console.log("main mounted done")
})




/*
watch([FieldList, dipulCheckActive, dipulCheckRes], async ([features, checkActive]) => {
  if (!checkActive) {
    fieldsWithDipul.value = {}
    return
  }
  removeAllPins()
  const results = {};
  const featurePromises = []
  for (const f of features) {

    let fID;
    if (f.feature.getId() !== undefined) {
      fID = f.feature.getId().toString()
    }

    const id = fID || JSON.stringify(f.geometry.getCoordinates()[0][0])
    const p = getDipulFeaturesForPolygon(f.feature).then(value => {
      results[id] = value
      if (value.length > 0) {
        //break
      }
    })
    featurePromises.push(p)


  }
  await Promise.all(featurePromises)
  fieldsWithDipul.value = results
}, {immediate: true})


*/




</script>
