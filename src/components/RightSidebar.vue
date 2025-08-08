<template>
  <aside aria-label="Customer-Data"
         class="w-full md:w-96 bg-gray-50 p-4 border-l border-gray-300 flex flex-col max-h-[calc(100vh-68px)] overflow-visible">
    <div class="flex-1 overflow-y-auto overflow-x-visible">
      <BasemapSection />
      <hr class="my-2" />
      <UserMapsSection />
      <GRBCV_Check />
      <hr class="my-2" />
      <DipulCheckSection />
      <hr class="my-2" />
      <OptimizationSection />
      <hr class="my-2" />
      <ExportSection />
      <hr class="my-2" />
      <FieldListSection />
    </div>
  </aside>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import GRBCV_Check from "./sidebar/GRBCV_Check.vue"
import BasemapSection from "./sidebar/BasemapSection.vue"
import UserMapsSection from "./sidebar/UserMapsSection.vue"
import DipulCheckSection from "./sidebar/DipulCheckSection.vue"
import OptimizationSection from "./sidebar/OptimizationSection.vue"
import ExportSection from "./sidebar/ExportSection.vue"
import FieldListSection from "./sidebar/FieldListSection.vue"

onMounted(() => {
  console.log("RightSidebar mounted")
})
</script>