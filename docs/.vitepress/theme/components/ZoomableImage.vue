<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  src: string
  alt?: string
}>()

const isZoomed = ref(false)

const toggleZoom = () => {
  isZoomed.value = !isZoomed.value
}
</script>

<template>
  <div class="zoomable-image-container">
    <img
      :src="src"
      :alt="alt"
      @click="toggleZoom"
      :class="{ 'cursor-zoom-in': !isZoomed }"
    />
    
    <!-- Overlay for zoomed image -->
    <div
      v-if="isZoomed"
      class="fixed inset-0 bg-black/80 z-50 flex items-center justify-center cursor-zoom-out"
      @click="toggleZoom"
    >
      <img
        :src="src"
        :alt="alt"
        class="max-h-[90vh] max-w-[90vw] object-contain"
      />
    </div>
  </div>
</template>

<style scoped>
.zoomable-image-container img {
  max-width: 100%;
  height: auto;
}

/*.zoomable-image-container img.logo-image {
  max-height: 150px;
  width: auto;
  margin-top: 1rem;
}*/

.cursor-zoom-in {
  cursor: zoom-in;
}
</style> 