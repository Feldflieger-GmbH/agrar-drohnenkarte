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
import {onMounted, ref} from 'vue'
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




</script>
