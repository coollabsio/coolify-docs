<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  type?: 'info' | 'tip' | 'warning' | 'danger' | 'success' | 'neutral'
  title?: string
}>(), { type: 'info' })

const activeType = computed(() => {
  switch (props.type) {
    case 'info': {
      return {
        icon: 'lucide:info',
        class: 'text-sky-700 dark:text-sky-400',
        style: 'background-color: var(--coollabs-bg-blue-300-5); border-color: var(--coollabs-border-blue-300-20);'
      }
    }
    case 'tip': {
      return {
        icon: 'lucide:lightbulb',
        class: 'text-emerald-700 dark:text-emerald-400',
        style: 'background-color: var(--coollabs-bg-emerald-300-5); border-color: var(--coollabs-border-emerald-300-20);'
      }
    }
    case 'danger': {
      return {
        icon: 'lucide:octagon-alert',
        class: 'text-red-700 dark:text-red-500',
        style: 'background-color: var(--coollabs-bg-red-300-5); border-color: var(--coollabs-border-red-300-20);'
      }
    }
    case 'warning': {
      return {
        icon: 'lucide:triangle-alert',
        class: 'text-amber-700 dark:text-amber-400',
        style: 'background-color: var(--coollabs-bg-yellow-400-5); border-color: var(--coollabs-border-yellow-400-20);'
      }
    }
    case 'success': {
      return {
        icon: 'lucide:check',
        class: 'text-emerald-700 dark:text-emerald-400',
        style: 'background-color: var(--coollabs-bg-green-300-5); border-color: var(--coollabs-border-green-300-20);'
      }
    }
    case 'neutral': {
      return {
        icon: 'lucide:info',
        class: 'text-zinc-600 dark:text-zinc-300',
        style: 'background-color: var(--coollabs-bg-zinc-300-5); border-color: var(--coollabs-border-zinc-300-20);'
      }
    }
    default:
      return {
        icon: '',
        class: 'text-zinc-900 dark:text-zinc-200',
        style: 'background-color: var(--coollabs-bg-zinc-300-5); border-color: var(--coollabs-border-zinc-300-20);'
      }
  }
})
</script>

<template>
  <div
    class="text-sm rounded-xl border px-6 py-4 last:[&>*]:mb-0 my-4"
    :class="activeType.class"
    :style="activeType.style"
  >
    <div class="flex items-center gap-2 font-semibold mb-0">
      <Icon
        class="text-lg"
        :icon="activeType.icon"
      />
      <span v-if="title">{{ title }}</span>
      <span
        v-else
        class="capitalize"
      >
        {{ type }}
      </span>
    </div>

    <slot />
  </div>
</template>

