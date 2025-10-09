<template>
  <aside aria-label="Customer-Data"
         class="w-full md:w-96 bg-gray-50 border-l border-gray-300 flex flex-col max-h-[calc(100vh-68px)] overflow-visible">
    <div class="flex-1 overflow-y-auto overflow-x-visible">
      <BasemapSection />
      <UserMapsSection />
      <GRBCV_Check />
      <DipulCheckSection />
      <OptimizationSection />
      <ExportSection />
      <FieldListSection />
      <Authenticated />
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
import Authenticated from "./sidebar/Authenticated.vue";

onMounted(() => {
  console.log("RightSidebar mounted")
})
</script>