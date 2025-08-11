<script setup lang="ts">
import { ref, watch, nextTick, onUnmounted } from 'vue'

interface Props {
  show: boolean
  title?: string
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  closeOnOverlay?: boolean
  closeOnEscape?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  title: '',
  size: 'md',
  closeOnOverlay: true,
  closeOnEscape: true
})

const emit = defineEmits<{
  close: [reason?: 'overlay' | 'escape' | 'button' | 'programmatic']
}>()

const modalRef = ref<HTMLDivElement>()
const isVisible = ref(false)
const isAnimating = ref(false)

// Handle escape key
const handleEscape = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && props.closeOnEscape) {
    closeModal('escape')
  }
}

// Close modal function
const closeModal = (reason: 'overlay' | 'escape' | 'button' | 'programmatic' = 'programmatic') => {
  if (isAnimating.value) return
  isAnimating.value = true
  isVisible.value = false
  
  setTimeout(() => {
    emit('close', reason)
    isAnimating.value = false
  }, 200)
}

// Expose close method for parent components
defineExpose({
  close: closeModal
})

// Handle overlay click
const handleOverlayClick = (event: Event) => {
  if (props.closeOnOverlay && event.target === event.currentTarget) {
    closeModal('overlay')
  }
}

// Watch for show prop changes
watch(() => props.show, async (newValue) => {
  if (newValue) {
    isVisible.value = true
    await nextTick()
    // Focus trap - focus the modal
    // modalRef.value?.focus()
    // Add escape key listener
    document.addEventListener('keydown', handleEscape)
  } else {
    // Remove escape key listener
    document.removeEventListener('keydown', handleEscape)
  }
}, { immediate: true })

// Cleanup on unmount
onUnmounted(() => {
  document.removeEventListener('keydown', handleEscape)
})

// Size classes
const sizeClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  full: 'max-w-4xl'
}
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-show="show && isVisible"
        class="fixed inset-0 z-50 flex items-center justify-center p-4x"
        @click="handleOverlayClick"
      >
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" />
        
        <!-- Modal -->
        <Transition
          enter-active-class="transition duration-200 ease-out"
          enter-from-class="opacity-0 scale-95 translate-y-4"
          enter-to-class="opacity-100 scale-100 translate-y-0"
          leave-active-class="transition duration-200 ease-in"
          leave-from-class="opacity-100 scale-100 translate-y-0"
          leave-to-class="opacity-0 scale-95 translate-y-4"
        >
          <div
            v-show="show && isVisible"
            ref="modalRef"
            :class="[
              'relative w-full bg-white dark:bg-black rounded-lg shadow-xl border border-purple-500/20 overflow-hidden',
              sizeClasses[size]
            ]"
            tabindex="-1"
            role="dialog"
            aria-modal="true"
            :aria-labelledby="title ? 'modal-title' : undefined"
          >
            <!-- Content Container -->
            <div class="relative z-10">
                <!-- Header -->
                <div v-if="title" class="flex items-center justify-between p-6 dark:bg-black">
                <h2 id="modal-title" class="text-lg font-semibold text-white">
                    {{ title }}
                </h2>
                <button
                    type="button"
                    class="text-gray-400 hover:text-purple-300 focus:text-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-colors duration-200"
                    @click="() => closeModal('button')"
                    aria-label="Close modal"
                >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
                </div>
                
                <!-- Content -->
                <div class="flex p-6 text-white">
                    <slot />
                </div>
            
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
/* Ensure modal is above everything */
.z-50 {
  z-index: 50;
}

/* Prevent body scroll when modal is open */
:global(body.modal-open) {
  overflow: hidden;
}
</style>