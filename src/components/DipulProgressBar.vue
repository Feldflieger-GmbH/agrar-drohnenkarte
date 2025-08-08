<template>
  <div class="progress-container">
    <div class="progress-bar-wrapper">
      <div class="progress-bar" :style="{ width: `${progress}%` }"></div>
    </div>
    <div class="progress-text">
      {{ completedCount }} / {{ totalCount }} Punkte geprüft
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { dipulCheckProgress } from '../composables/dipulFeature';

// Computed properties based on dipulCheckProgress
const progress = computed(() => {
  return dipulCheckProgress.value.total > 0
    ? Math.min(Math.round((dipulCheckProgress.value.completed / dipulCheckProgress.value.total) * 100), 100)
    : 0;
});

const completedCount = computed(() => dipulCheckProgress.value.completed);
const totalCount = computed(() => dipulCheckProgress.value.total);
</script>

<style scoped>
.progress-container {
  margin: 10px 0;
}

.progress-bar-wrapper {
  width: 100%;
  height: 8px;
  background-color: #e2e8f0;
  border-radius: 4px;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background-color: #4299e1;
  transition: width 0.3s ease;
}

.progress-text {
  font-size: 0.75rem;
  color: #4a5568;
  margin-top: 4px;
  text-align: center;
}
</style>