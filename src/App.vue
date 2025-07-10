<template>
  <div class="flex flex-col min-h-screen">
    <HeaderBar />

    <div class="flex flex-1 min-h-0 relative">

      <div class="absolute top-2 right-2 z-50 md:hidden">
        <button @click="rightSidebarOpen = !rightSidebarOpen"
                class="bg-white p-2 rounded shadow-lg">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>



      <!-- Main Map Container -->
      <main class="flex-1 flex flex-col min-w-0">
        <div ref="mapContainer" class="flex-1 min-h-0"></div>
      </main>

      <!-- Right Sidebar with Overlay -->
      <div v-if="rightSidebarOpen" @click="rightSidebarOpen = false"
           class="fixed inset-0 z-40 md:hidden"></div>

      <div :class="[
        'fixed md:relative inset-y-0 right-0 z-40 md:z-auto transform transition-transform duration-300',
        'w-full md:w-96',
        rightSidebarOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-0'
      ]">
        <RightSidebar />
      </div>
    </div>
  </div>
</template>


<script setup>
import {onMounted, ref} from 'vue'
import 'ol/ol.css'

import HeaderBar from "./components/HeaderBar.vue";
import {dipulLayerGroups, toggleLayer} from "./composables/dipulLayers.js";
import {agMap, basemapSetup} from "./composables/basemap.js";
import RightSidebar from "./components/RightSidebar.vue";
import {registerContextMenuHandler, registerVertexMoveHandler} from "./composables/fieldOptimisatzion.js";
import {getFeatureInfo} from "./composables/dipulFeature.js";





const rightSidebarOpen = ref(true)
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
