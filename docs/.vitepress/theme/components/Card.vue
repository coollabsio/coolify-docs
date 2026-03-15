<script setup lang="ts">
import { computed } from 'vue'
const props = defineProps<{
    title?: string
    image?: string
    imageAlt?: string
    imageSize?: 'small' | 'medium' | 'large'
    link?: string
    icon?: string
    iconSize?: 'small' | 'medium' | 'large'
    iconColor?: string
    theme?: 'outlined' | 'solid' | 'icon'
}>()

const imageSizeClass = computed(() => ({
    small: 'w-[50px] h-[50px]',
    medium: 'w-[100px] h-[100px]',
    large: 'w-[150px] h-[150px]'
}[props.imageSize ?? 'medium']))
</script>

<template>
  <div class="group p-1 bg-gray-50 rounded-lg dark:bg-gray-800 border transition-all duration-200 border-gray-50 dark:border-gray-800 hover:border-purple-500 dark:hover:border-purple-700">
    <div class="flex flex-col h-[225px] dark:bg-gray-800 rounded-lg cursor-pointer transition-transform duration-200">
      <div class="flex-[3] bg-linear-to-r from-[#00D1EE] via-[#08ABDD] via-[#15ACF1] via-[#1575C1] to-[#14336d] rounded-lg flex items-center justify-center">
        <img 
          :src="image" 
          :alt="imageAlt"
          :class="[
            imageSizeClass,
            'p-1 rounded-lg text-white',
            'bg-[#18222EDF]/70 shadow-xl'
          ]"
        />
      </div>
      <div class="flex items-center justify-between px-4">
        <div class="flex items-center gap-2">
          <p class="text-base font-medium m-0 text-gray-800 dark:text-gray-100">{{ title }}</p>
          <div class="group-hover:translate-x-1 transition-all duration-200 w-4 h-4 text-gray-500 dark:text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


