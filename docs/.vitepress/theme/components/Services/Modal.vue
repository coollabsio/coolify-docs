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
const previouslyFocusedElement = ref<HTMLElement | null>(null)

// Focus trap management
const focusableElements = ref<HTMLElement[]>([])
const firstFocusableElement = ref<HTMLElement | null>(null)
const lastFocusableElement = ref<HTMLElement | null>(null)

// Get all focusable elements within the modal
const getFocusableElements = () => {
  if (!modalRef.value) return []
  
  const focusableSelectors = [
    'button:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    'a[href]',
    '[tabindex]:not([tabindex="-1"])',
    '[contenteditable="true"]'
  ]
  
  const allElements = Array.from(modalRef.value.querySelectorAll(focusableSelectors.join(', '))) as HTMLElement[]
  
  // Prioritize form inputs over close button
  const sortedElements = allElements.sort((a, b) => {
    // If one is a close button (has aria-label="Close modal"), put it last
    const aIsCloseButton = a.getAttribute('aria-label') === 'Close modal'
    const bIsCloseButton = b.getAttribute('aria-label') === 'Close modal'
    
    if (aIsCloseButton && !bIsCloseButton) return 1
    if (!aIsCloseButton && bIsCloseButton) return -1
    
    return 0
  })
  
  return sortedElements
}

// Handle tab key for focus trapping
const handleTabKey = (event: KeyboardEvent) => {
  if (!modalRef.value || focusableElements.value.length === 0) return
  
  const { shiftKey } = event
  
  if (shiftKey) {
    // Shift + Tab: move backwards
    if (document.activeElement === firstFocusableElement.value) {
      event.preventDefault()
      lastFocusableElement.value?.focus()
    }
  } else {
    // Tab: move forwards
    if (document.activeElement === lastFocusableElement.value) {
      event.preventDefault()
      firstFocusableElement.value?.focus()
    }
  }
}

// Handle escape key
const handleEscape = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && props.closeOnEscape) {
    closeModal('escape')
  }
}

// Handle all keyboard events
const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Tab') {
    handleTabKey(event)
  } else if (event.key === 'Escape') {
    handleEscape(event)
  }
}

// Close modal function
const closeModal = (reason: 'overlay' | 'escape' | 'button' | 'programmatic' = 'programmatic') => {
  if (isAnimating.value) return
  isAnimating.value = true
  isVisible.value = false
  
  // Restore focus to previously focused element
  if (previouslyFocusedElement.value) {
    previouslyFocusedElement.value.focus()
  }
  
  setTimeout(() => {
    emit('close', reason)
    isAnimating.value = false
  }, 200)
}

// Update focus trap method
const updateFocusTrap = async (autoFocus: boolean = true) => {
  await nextTick()
  focusableElements.value = getFocusableElements()
  firstFocusableElement.value = focusableElements.value[0] || null
  lastFocusableElement.value = focusableElements.value[focusableElements.value.length - 1] || null
  
  // Only auto-focus if requested and nothing is currently focused within the modal
  if (autoFocus && !modalRef.value?.contains(document.activeElement)) {
    if (firstFocusableElement.value) {
      firstFocusableElement.value.focus()
    } else if (modalRef.value) {
      modalRef.value.focus()
    }
  }
}

// Expose methods for parent components
defineExpose({
  close: closeModal,
  updateFocusTrap
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
    
    // Store currently focused element
    previouslyFocusedElement.value = document.activeElement as HTMLElement
    
    // Get focusable elements and set up focus trap
    focusableElements.value = getFocusableElements()
    firstFocusableElement.value = focusableElements.value[0] || null
    lastFocusableElement.value = focusableElements.value[focusableElements.value.length - 1] || null
    
    // Focus the first focusable element or the modal itself
    if (firstFocusableElement.value) {
      firstFocusableElement.value.focus()
    } else if (modalRef.value) {
      modalRef.value.focus()
    }
    
    // Add keyboard event listeners
    document.addEventListener('keydown', handleKeydown)
  } else {
    // Remove keyboard event listeners
    document.removeEventListener('keydown', handleKeydown)
  }
}, { immediate: true })

// Cleanup on unmount
onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})

// Watch for content changes to update focusable elements
watch(() => isVisible.value, async (newValue) => {
  if (newValue) {
    await nextTick()
    // Update focusable elements when content changes
    focusableElements.value = getFocusableElements()
    firstFocusableElement.value = focusableElements.value[0] || null
    lastFocusableElement.value = focusableElements.value[focusableElements.value.length - 1] || null
  }
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
              'relative w-full bg-white dark:bg-black rounded-lg shadow-xl border border-purple-500/20 overflow-hidden outline-none',
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
                <h2 id="modal-title" class="text-lg font-semibold text-gray-900 dark:text-white">
                    {{ title }}
                </h2>
                <button
                    type="button"
                    class="p-2 rounded-lg text-gray-400 dark:text-gray-500 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-all duration-200"
                    @click="() => closeModal('button')"
                    aria-label="Close modal"
                >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
                </div>
                
                <!-- Content -->
                <div class="flex p-6 text-gray-900 dark:text-white">
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