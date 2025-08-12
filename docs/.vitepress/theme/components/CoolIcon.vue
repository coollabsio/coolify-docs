<template>
  <Icon v-if="IconComponent" :icon="name" v-bind="$attrs" />
  <svg v-else width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="2" width="20" height="20" rx="2" stroke="currentColor" stroke-width="2"/>
    <text x="12" y="14" text-anchor="middle" font-size="8" fill="currentColor">?</text>
  </svg>
</template>

<script setup lang="ts">
import { ref, onMounted, markRaw } from 'vue'
import type { Component } from 'vue'
import { Icon } from '@iconify/vue'

interface Props {
  /** 
   * Icon name from icones.js.org in the format: "collection:icon-name"
   * 
   * Examples:
   * - "mdi:home" (Material Design Icons)
   * - "heroicons:command-line" (Heroicons)
   * - "logos:vue" (Logos)
   * - "simple-icons:github" (Simple Icons)
   * - "carbon:user" (Carbon Icons)
   * 
   * Find icons at: https://icones.js.org/
   */
  name: string
}

const props = defineProps<Props>()
const IconComponent = ref<Component | null>(null)

// Load the Iconify component dynamically
const loadIconifyComponent = async () => {
  try {
    const { Icon } = await import('@iconify/vue')
    IconComponent.value = markRaw(Icon)
  } catch (error) {
    // sole.warn('Failed to load Iconify component:', error)
    IconComponent.value = null
  }
}

onMounted(() => {
  loadIconifyComponent()
})
</script>

