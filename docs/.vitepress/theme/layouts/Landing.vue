<template>
  <KorrektlySearch ref="korrektlySearchRef" />
  <Layout>
    <template #home-features-before>
    </template>
  </Layout>
</template>

<script setup lang="ts">
import { ref, provide, onMounted } from 'vue'
import DefaultTheme from 'vitepress/theme'
import { useData } from 'vitepress'
import KorrektlySearch from '../components/KorrektlySearch.vue'

const { Layout } = DefaultTheme
const { frontmatter } = useData()

// Create ref to KorrektlySearch component
const korrektlySearchRef = ref<InstanceType<typeof KorrektlySearch> | null>(null)

// Provide the openSearch function to all child components
provide('openKorrektlySearch', () => {
  korrektlySearchRef.value?.openSearch()
})

// Also expose globally for easier access
onMounted(() => {
  if (typeof window !== 'undefined') {
    (window as any).__korrektlySearch = korrektlySearchRef.value
  }
})
</script>