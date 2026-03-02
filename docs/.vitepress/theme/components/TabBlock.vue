<script setup lang="ts">
import { ref, computed, nextTick } from 'vue'
import VPBadge from './VPBadge.vue'
import yaml from 'js-yaml'

type TabItem = {
  icon?: string
  label?: string
  value?: string
  code?: string
  description?: string
}

type TabContent = {
  title: string
  content: {
    items?: TabItem[]
    message?: {
      icon?: string
      value: string
      type: 'warning' | 'info' | 'success' | 'danger'
    }
    subtitle?: string
    compose?: Record<string, any>
  }
}

const props = defineProps<{
  tabs: TabContent[]
  compose?: {
    services: Record<string, {
      image: string
      environment?: string[]
      // ... other service properties
    }>
  }
}>()

// Generate service tabs from compose configuration
const serviceTabs = computed(() => {
  if (!props.compose?.services) return []

  return Object.entries(props.compose.services).map(([serviceName, config]) => ({
    title: `${serviceName} Configuration`,
    content: {
      service: {
        name: serviceName,
        image: config.image,
        envVars: config.environment?.map(env => {
          // Handle different environment variable formats
          if (env.includes('=')) {
            const [name, value] = env.split('=')
            return {
              name,
              value: value.replace(/\${([^}]+)}/g, (_, var_name) => `\${${var_name}}`),
            }
          }
          return { name: env }
        }) || []
      }
    }
  }))
})

const allTabs = computed(() => [...props.tabs, ...serviceTabs.value])

const activeTab = ref(0)
const currentIndex = computed(() => activeTab.value)

const scrollTabIntoView = (tabIndex: number) => {
  nextTick(() => {
    const activeTabElement = document.querySelector(`[data-tab-id="${tabIndex}"]`)
    activeTabElement?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
  })
}

const setActiveTab = (index: number) => {
  activeTab.value = index
  scrollTabIntoView(index)
}

type Direction = 'next' | 'prev'
const navigateTab = (direction: Direction) => {
  const newIndex = direction === 'next'
    ? (currentIndex.value + 1) % allTabs.value.length
    : (currentIndex.value - 1 + allTabs.value.length) % allTabs.value.length
  setActiveTab(newIndex)
}

// Helper to check if it's a service tab
const isServiceTab = (index: number) => index >= props.tabs.length

// Helper to check if it's the last tab
const isLastTab = computed(() => currentIndex.value === allTabs.value.length - 1)
</script>

<template>
  <div class="tabs-container">
    <div class="tabs-navigation">
      <button
        class="group nav-arrow"
        @click="navigateTab('prev')"
        aria-label="Previous tab"
      >
        <svg class="size-10 left" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path fill="currentColor" d="m6.523 12.5l3.735 3.735q.146.146.153.344q.006.198-.153.363q-.166.166-.357.168t-.357-.162l-4.382-4.383q-.243-.242-.243-.565t.243-.566l4.382-4.382q.147-.146.347-.153q.201-.007.367.159q.16.165.162.353q.003.189-.162.354L6.523 11.5h12.38q.214 0 .358.143t.143.357t-.143.357t-.357.143z"/></svg>
      </button>

      <div class="tabs-header">
        <button
          v-for="(tab, index) in allTabs"
          :key="index"
          :data-tab-id="index"
          @click="setActiveTab(index)"
          :class="['tab-button', { active: activeTab === index }]"
        >
          {{ tab.title }}
        </button>
      </div>

      <button
        class="group nav-arrow"
        @click="navigateTab('next')"
        aria-label="Next tab"
      >
        <Transition mode="out-in">
          <svg v-if="!isLastTab" class="size-10 right" key="next" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path fill="currentColor" d="M17.073 12.5H5.5q-.213 0-.357-.143T5 12t.143-.357t.357-.143h11.573l-3.735-3.734q-.146-.147-.152-.345t.152-.363q.166-.166.357-.168t.357.162l4.383 4.383q.13.13.183.267t.053.298t-.053.298t-.183.268l-4.383 4.382q-.146.146-.347.153t-.367-.159q-.16-.165-.162-.354t.162-.354z"/></svg>
          <svg v-else class="size-10 return-arrow" key="return" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path fill="currentColor" d="m6.921 9.5l3.439 3.439q.165.165.162.353q-.003.189-.162.354q-.166.165-.364.159t-.344-.153L5.566 9.566q-.131-.132-.184-.268T5.329 9t.053-.298t.184-.267L9.64 4.359q.165-.165.356-.165q.192 0 .357.165q.165.166.156.364t-.156.344L6.92 8.5h9.464q.67 0 1.143.472q.472.472.472 1.144V18.5q0 .214-.143.357T17.5 19t-.357-.143T17 18.5v-8.384q0-.27-.173-.443t-.442-.173z"/></svg>
        </Transition>
      </button>
    </div>

    <div class="tab-content rounded-lg mt-2">
      <template v-for="(tab, index) in allTabs" :key="index">
        <div v-show="activeTab === index" class="space-y-4">
          <!-- Service Configuration -->
          <div v-if="isServiceTab(index)" class="service-config space-y-4">
            <div class="service-header mb-4">
              <h3 class="text-lg font-medium">{{ tab.content.service.name }}</h3>
              <code class="text-sm block mt-2">Image: {{ tab.content.service.image }}</code>
            </div>

            <div class="env-vars">
              <h4 class="font-medium mb-3">Environment Variables</h4>
              <ul class="env-list space-y-2">
                <li v-for="env in tab.content.service.envVars"
                    :key="env.name"
                    class="env-var flex items-start gap-2">
                  <code class="text-sm px-2 py-1 bg-[var(--vp-c-bg-soft)] rounded shrink-0 text-[var(--vp-c-text-2)]">{{ env.name }}</code>
                  <span v-if="env.value" class="text-sm text-[var(--vp-c-text-2)]">
                    Default: <code class="px-1 bg-[var(--vp-c-bg-soft)] rounded text-[var(--vp-c-text-2)]">{{ env.value }}</code>
                  </span>
                </li>
              </ul>
            </div>
          </div>

          <!-- Regular content -->
          <template v-else>


            <h4 v-if="tab.content.subtitle" class="font-medium text-lg">{{ tab.content.subtitle }}</h4>

            <ul v-if="tab.content.items" class="space-y-2">
              <li v-for="(item, itemIndex) in tab.content.items"
                  :key="itemIndex"
                  class="flex items-center gap-2">
                <template v-if="item.icon && item.label">
                  <span class="text-lg">{{ item.icon }}</span>
                  <span class="font-mono font-medium">{{ item.label }}:</span>
                  <span>{{ item.value }}</span>
                </template>
                <template v-else-if="item.code">
                  <code class="text-sm bg-[var(--vp-c-bg-soft)] px-2 py-1 rounded font-mono">{{ item.code }}</code>
                  <span>{{ item.description }}</span>
                </template>
              </li>
            </ul>

            <div v-if="tab.content?.message" class="flex items-start gap-2">
              <!-- <VPBadge :type="tab.content.message.type">
                <span v-if="tab.content.message.icon" class="text-lg">{{ tab.content.message.icon }}</span>
                {{ tab.content.message.value }}
              </VPBadge> -->

              <Callout :type="tab.content?.message?.type">
                {{ tab.content?.message?.value }}
              </Callout>
            </div>
          </template>
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped>
@reference "tailwindcss";

.tabs-container {
  @apply my-6;
}

.tabs-navigation {
  @apply flex items-center gap-2;
}

.nav-arrow {
  @apply p-2 text-lg font-medium transition-colors duration-200 border-none bg-transparent;
  color: var(--vp-c-text-2);
}

.nav-arrow:hover {
  color: var(--vp-c-text-1);
  background: transparent;
}

.nav-arrow:hover svg.left {
  transform: translateX(-5px);
  transition: transform 0.3s ease-in-out;
}

.nav-arrow:hover svg.right {
  transform: translateX(5px);
  transition: transform 0.3s ease-in-out;
}

.tabs-header {
  @apply flex gap-2 border-b border-[var(--vp-c-divider)] mb-4;
  overflow-x: auto;
  -ms-overflow-style: none;  /* Hide scrollbar for IE and Edge */
  scrollbar-width: none;     /* Hide scrollbar for Firefox */
}

.tabs-header::-webkit-scrollbar {
  display: none;  /* Hide scrollbar for Chrome, Safari and Opera */
}

.tabs-header::-webkit-scrollbar-thumb {
  background-color: var(--vp-c-divider);
  border-radius: 3px;
}

.tabs-header::-webkit-scrollbar-track {
  background-color: transparent;
}

.tab-button {
  @apply px-4 py-2 text-sm font-medium relative transition-colors duration-200 whitespace-nowrap;
  color: var(--vp-c-text-2);
}

.tab-button:hover {
  color: var(--vp-c-text-1);
}

.tab-button.active {
  color: var(--vp-c-brand);
}

.tab-button.active::after {
  content: '';
  @apply absolute bottom-0 left-0 w-full h-0.5;
  background-color: var(--vp-c-brand);
}

.tab-content {
  @apply p-4 rounded-b-lg;
  background-color: var(--vp-c-bg-soft);
  overflow-y: auto;
  -ms-overflow-style: none;  /* Hide scrollbar for IE and Edge */
  scrollbar-width: none;     /* Hide scrollbar for Firefox */
}

.tab-content::-webkit-scrollbar {
  display: none;  /* Hide scrollbar for Chrome, Safari and Opera */
}

.tab-content::-webkit-scrollbar-thumb {
  background-color: var(--vp-c-divider);
  border-radius: 3px;
}

.tab-content::-webkit-scrollbar-track {
  background-color: transparent;
}

.warning {
  @apply p-4 rounded-lg mt-4;
  background-color: var(--vp-c-yellow-dimm);
  color: var(--vp-c-yellow);
}

.return-arrow {
  /* transform: rotate(90deg);
  animation: returnRotate 0.1s ease-out forwards; */
}

@keyframes returnRotate {
  from {
    transform: rotate(90deg);
  }
  to {
    transform: rotate(0deg);
  }
}

.space-y-2 > * + * {
  margin-top: 0.5rem;
}

.space-y-4 > * + * {
  margin-top: 1rem;
}

code {
  font-family: var(--vp-font-family-mono);
}

.compose-config {
  @apply mt-4;
}

.compose-config pre {
  @apply p-4 rounded-lg overflow-x-auto;
  background-color: var(--vp-code-block-bg);
}

.compose-config code {
  font-family: var(--vp-font-family-mono);
  font-size: 0.9em;
  line-height: 1.5;
  white-space: pre-wrap;
}

.service-header {
  border-bottom: 1px solid var(--vp-c-divider);
  padding-bottom: 1rem;
}

.env-var {
  border: 1px solid var(--vp-c-divider);
}

.grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}

@media (min-width: 640px) {
  .grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
