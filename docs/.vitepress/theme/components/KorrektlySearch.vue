<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { onKeyStroke } from '@vueuse/core'

interface SearchResult {
  id: string
  title: string
  content: string
  url: string
  highlight?: string
  hierarchy?: string
  breadcrumb?: string
}

const isOpen = ref(false)
const searchQuery = ref('')
const searchResults = ref<SearchResult[]>([])
const isLoading = ref(false)
const selectedIndex = ref(0)
const searchInputRef = ref<HTMLInputElement | null>(null)
const searchError = ref<string | null>(null)

// Korrektly SDK configuration
const korrektlyConfig = {
  baseUrl: import.meta.env.VITE_KORREKTLY_BASE_URL,
  apiToken: import.meta.env.VITE_KORREKTLY_API_TOKEN,
  datasetId: import.meta.env.VITE_KORREKTLY_DATASET_ID,
}

// Initialize Korrektly SDK
let korrektlySDK: any = null

const openSearch = () => {
  isOpen.value = true
  setTimeout(() => {
    searchInputRef.value?.focus()
  }, 100)
}

onMounted(async () => {
  try {
    const { Korrektly } = await import('@korrektly/sdk')
    korrektlySDK = new Korrektly({
      baseUrl: korrektlyConfig.baseUrl,
      apiToken: korrektlyConfig.apiToken,
    })
  } catch (error) {
    console.error('Failed to initialize Korrektly SDK:', error)
  }
})

// Expose openSearch method so it can be called from parent components
defineExpose({
  openSearch
})

const clearSearch = () => {
  // Cancel any ongoing search operations
  if (searchTimeout) {
    clearTimeout(searchTimeout)
    searchTimeout = null
  }
  if (abortController) {
    abortController.abort()
    abortController = null
  }

  searchQuery.value = ''
  searchResults.value = []
  selectedIndex.value = 0
  searchError.value = null
  isLoading.value = false
}

const closeSearch = () => {
  clearSearch()
  isOpen.value = false
}

// Keyboard shortcuts (only for modal interactions)
onKeyStroke('Escape', () => {
  if (isOpen.value) {
    closeSearch()
  }
})

onKeyStroke('ArrowDown', (e) => {
  if (isOpen.value && searchResults.value.length > 0) {
    e.preventDefault()
    selectedIndex.value = Math.min(selectedIndex.value + 1, searchResults.value.length - 1)
  }
})

onKeyStroke('ArrowUp', (e) => {
  if (isOpen.value && searchResults.value.length > 0) {
    e.preventDefault()
    selectedIndex.value = Math.max(selectedIndex.value - 1, 0)
  }
})

onKeyStroke('Enter', () => {
  if (isOpen.value && searchResults.value[selectedIndex.value]) {
    navigateToResult(searchResults.value[selectedIndex.value])
  }
})

// Debounced search
let searchTimeout: NodeJS.Timeout | null = null
let abortController: AbortController | null = null

watch(searchQuery, async (newQuery) => {
  // Cancel previous timeout and abort any ongoing request
  if (searchTimeout) {
    clearTimeout(searchTimeout)
    searchTimeout = null
  }
  if (abortController) {
    abortController.abort()
    abortController = null
  }

  if (!newQuery.trim()) {
    searchResults.value = []
    searchError.value = null
    isLoading.value = false
    return
  }

  searchTimeout = setTimeout(async () => {
    await performSearch(newQuery)
  }, 300)
})

const performSearch = async (query: string) => {
  if (!korrektlySDK) {
    console.error('Korrektly SDK not initialized')
    searchError.value = 'Search service not initialized. Please try refreshing the page.'
    return
  }

  if (!korrektlyConfig.datasetId || !korrektlyConfig.apiToken) {
    console.error('Korrektly dataset ID not configured')
    searchError.value = 'Search is not properly configured. Please check the environment variables.'
    return
  }

  // Create new abort controller for this search
  abortController = new AbortController()
  const currentAbortController = abortController

  isLoading.value = true
  searchError.value = null
  try {
    const response = await korrektlySDK.search(korrektlyConfig.datasetId, {
      query,
      limit: 10,
      search_type: 'hybrid',
    })

    // Check if this request was aborted
    if (currentAbortController.signal.aborted) {
      return
    }

    // Check if response contains an error
    if (response?.error || response?.message) {
      const errorMessage = response.message || response.error || 'An unknown error occurred'
      searchError.value = errorMessage
      searchResults.value = []
      console.error('Search API error:', response)
      return
    }

    // The API returns { success, data: { results: [...] } }
    const results = response?.data?.results || response?.results || response?.chunks || []

    searchResults.value = results.map((chunk: any) => {
      // Extract metadata from array format
      const getMetadata = (key: string) => {
        const meta = chunk.metadata?.find((m: any) => m.key === key)
        return meta?.value || ''
      }

      const title = getMetadata('title') || getMetadata('heading') || extractTitle(chunk.content_html) || 'Untitled'
      const description = getMetadata('description') || ''

      // Handle hierarchy as array
      const hierarchyMeta = chunk.metadata?.find((m: any) => m.key === 'hierarchy')
      const hierarchy = hierarchyMeta?.value || []

      // Build URL from source_url or group tracking_id
      let url = chunk.source_url || ''
      if (url.includes('/home/aditya/workspace/coollabs/coolify-docs/docs')) {
        // Convert file path to URL path
        url = url.replace('/home/aditya/workspace/coollabs/coolify-docs/docs', '/docs')
        url = url.replace('.md', '')
      } else if (chunk.group?.tracking_id) {
        url = chunk.group.tracking_id.replace('/home/aditya/workspace/coollabs/coolify-docs/docs', '/docs')
        url = url.replace('.md', '')
      }

      // Create breadcrumb from hierarchy array or URL (excluding 'docs' prefix)
      let breadcrumb = ''
      if (Array.isArray(hierarchy) && hierarchy.length > 0) {
        // Find 'docs' in the hierarchy array and take everything after it
        const docsIndex = hierarchy.indexOf('docs')
        if (docsIndex !== -1 && docsIndex < hierarchy.length - 1) {
          breadcrumb = hierarchy.slice(docsIndex + 1).join(' / ')
        } else {
          breadcrumb = hierarchy.join(' / ')
        }
      } else if (url) {
        // Extract from URL: /docs/services/n8n -> services / n8n
        breadcrumb = url.replace(/^\/docs\//, '').replace(/\//g, ' / ')
      }

      return {
        id: chunk.id,
        title,
        content: description || chunk.content_html || chunk.content || '',
        url,
        highlight: chunk.content_html,
        hierarchy,
        breadcrumb,
      }
    })

    selectedIndex.value = 0
  } catch (error: any) {
    // Don't show error if the request was aborted
    if (currentAbortController.signal.aborted) {
      return
    }

    console.error('Search error:', error)

    // Try to extract error message from the error object
    let errorMessage = 'An unexpected error occurred while searching.'

    if (error?.response?.data?.message) {
      errorMessage = error.response.data.message
    } else if (error?.message) {
      errorMessage = error.message
    } else if (typeof error === 'string') {
      errorMessage = error
    }

    searchError.value = errorMessage
    searchResults.value = []
  } finally {
    // Only reset loading if not aborted
    if (!currentAbortController.signal.aborted) {
      isLoading.value = false
    }
  }
}

const extractTitle = (html: string): string => {
  if (!html) return ''
  const temp = document.createElement('div')
  temp.innerHTML = html
  const heading = temp.querySelector('h1, h2, h3, h4, h5, h6')
  return heading?.textContent?.trim() || ''
}

const navigateToResult = (result: SearchResult) => {
  window.location.href = result.url
  closeSearch()
}

const handleBackdropClick = (e: MouseEvent) => {
  if (e.target === e.currentTarget) {
    closeSearch()
  }
}

const stripHtml = (html: string) => {
  const temp = document.createElement('div')
  temp.innerHTML = html
  return temp.textContent || temp.innerText || ''
}

const truncate = (text: string, length: number) => {
  if (text.length <= length) return text
  return text.substring(0, length) + '...'
}
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-opacity duration-200"
      leave-active-class="transition-opacity duration-200"
      enter-from-class="opacity-0"
      leave-to-class="opacity-0"
    >
      <div
        v-if="isOpen"
        class="fixed inset-0 z-[9999] flex items-start justify-center overflow-y-auto bg-black/50 backdrop-blur-sm p-4 pt-[10vh]"
        @click="handleBackdropClick"
      >
        <Transition
          enter-active-class="transition-all duration-200"
          leave-active-class="transition-all duration-200"
          enter-from-class="opacity-0 -translate-y-5"
          leave-to-class="opacity-0 -translate-y-5"
        >
          <div
            v-if="isOpen"
            class="w-full max-w-2xl bg-[var(--vp-c-bg)] rounded-xl shadow-2xl border border-[var(--vp-c-divider)] flex flex-col max-h-[80vh]"
            @click.stop
          >
            <!-- Search Header -->
            <div class="p-4 border-b border-[var(--vp-c-divider)]">
              <div class="relative flex items-center">
                <svg class="absolute left-3 w-5 h-5 text-[var(--vp-c-text-2)] pointer-events-none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="11" cy="11" r="8"></circle>
                  <path d="m21 21-4.35-4.35"></path>
                </svg>
                <input
                  ref="searchInputRef"
                  v-model="searchQuery"
                  type="text"
                  placeholder="Search documentation... (⌘K or Ctrl+K)"
                  class="w-full pl-11 pr-10 py-3 text-base bg-[var(--vp-c-bg-soft)] rounded-lg border-none outline-none text-[var(--vp-c-text-1)] placeholder:text-[var(--vp-c-text-3)] focus:bg-[var(--vp-c-bg-elv)] transition-colors"
                />
                <button
                  v-if="searchQuery"
                  class="absolute right-3 w-6 h-6 flex items-center justify-center rounded bg-[var(--vp-c-bg-soft)] text-[var(--vp-c-text-2)] hover:bg-[var(--vp-c-bg-elv)] hover:text-[var(--vp-c-text-1)] transition-all text-xl leading-none"
                  @click="clearSearch"
                  title="Clear search"
                >
                  ×
                </button>
              </div>
            </div>

            <!-- Search Body -->
            <div class="flex-1 overflow-y-auto min-h-[200px] max-h-[500px]">
              <!-- Loading State -->
              <div v-if="isLoading" class="flex flex-col items-center justify-center py-12 px-6 text-[var(--vp-c-text-2)]">
                <div class="w-8 h-8 border-3 border-[var(--vp-c-divider)] border-t-[var(--vp-c-brand)] rounded-full animate-spin mb-4"></div>
                <p>Searching...</p>
              </div>

              <!-- Error State -->
              <div v-else-if="searchError" class="flex flex-col items-center justify-center py-12 px-6 text-center">
                <div class="max-w-md">
                  <div class="mb-4 text-4xl">⚠️</div>
                  <h3 class="text-lg font-semibold text-[var(--vp-c-text-1)] mb-3">Search Error</h3>
                  <div class="bg-[var(--vp-c-bg-soft)] border border-[var(--vp-c-divider)] rounded-lg p-4 mb-4">
                    <p class="text-sm text-[var(--vp-c-text-2)] font-mono break-words">{{ searchError }}</p>
                  </div>
                  <p class="text-sm text-[var(--vp-c-text-2)] mb-4">
                    If this issue persists, please contact support for assistance.
                  </p>
                  <a
                    href="mailto:support@korrektly.com"
                    class="inline-flex items-center gap-2 px-4 py-2 bg-[var(--vp-c-brand)] text-white rounded-lg hover:bg-[var(--vp-c-brand-dark)] transition-colors no-underline text-sm font-medium"
                  >
                    <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                    </svg>
                    Contact Korrektly Support
                  </a>
                </div>
              </div>

              <!-- Empty State -->
              <div v-else-if="searchQuery && searchResults.length === 0" class="flex items-center justify-center py-12 px-6 text-center text-[var(--vp-c-text-2)]">
                <p>No results found for "{{ searchQuery }}"</p>
              </div>

              <!-- Results List -->
              <div v-else-if="searchResults.length > 0" class="p-2">
                <a
                  v-for="(result, index) in searchResults"
                  :key="result.id"
                  :href="result.url"
                  class="block p-3 mb-1 rounded-lg cursor-pointer no-underline transition-all border border-transparent hover:bg-[var(--vp-c-bg-soft)] hover:border-[var(--vp-c-brand)]"
                  :class="{ 'bg-[var(--vp-c-bg-soft)] border-[var(--vp-c-brand)]': index === selectedIndex }"
                  @click.prevent="navigateToResult(result)"
                  @mouseenter="selectedIndex = index"
                >
                  <div class="mb-1.5">
                    <div class="font-semibold text-sm text-[var(--vp-c-text-1)] mb-0.5">{{ result.title }}</div>
                    <div v-if="result.breadcrumb" class="flex items-center gap-1 text-[11px] text-[var(--vp-c-text-3)] font-mono opacity-80 mt-0.5">
                      <span class="text-[10px] opacity-60">📁</span>
                      <span>{{ result.breadcrumb }}</span>
                    </div>
                  </div>
                  <div class="text-[13px] text-[var(--vp-c-text-2)] leading-relaxed line-clamp-2">
                    {{ truncate(stripHtml(result.content), 150) }}
                  </div>
                </a>
              </div>

              <!-- Initial State -->
              <div v-else class="py-12 px-6 text-center text-[var(--vp-c-text-2)]">
                <div class="mt-6">
                  <p class="text-xs font-semibold text-[var(--vp-c-text-2)] mb-3 uppercase tracking-wide">Popular searches:</p>
                  <div class="flex flex-wrap gap-2 justify-center">
                    <button
                      v-for="tag in ['Backups', 'PostgreSQL', 'Docker Compose', 'GitHub Actions']"
                      :key="tag"
                      class="px-3 py-1.5 bg-[var(--vp-c-bg-soft)] border border-[var(--vp-c-divider)] rounded-md text-[13px] text-[var(--vp-c-text-1)] hover:bg-[var(--vp-c-brand)] hover:text-white hover:border-[var(--vp-c-brand)] transition-all cursor-pointer"
                      @click="searchQuery = tag"
                    >
                      {{ tag }}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Search Footer -->
            <div class="px-4 py-3 border-t border-[var(--vp-c-divider)] flex justify-between items-center text-xs text-[var(--vp-c-text-2)]">
              <div class="hidden md:flex gap-3">
                <span class="flex items-center gap-1">
                  <kbd class="px-1.5 py-0.5 bg-[var(--vp-c-bg-soft)] border border-[var(--vp-c-divider)] rounded text-[11px] font-mono">↑</kbd>
                  <kbd class="px-1.5 py-0.5 bg-[var(--vp-c-bg-soft)] border border-[var(--vp-c-divider)] rounded text-[11px] font-mono">↓</kbd>
                  <span class="ml-1">Navigate</span>
                </span>
                <span class="flex items-center gap-1">
                  <kbd class="px-1.5 py-0.5 bg-[var(--vp-c-bg-soft)] border border-[var(--vp-c-divider)] rounded text-[11px] font-mono">↵</kbd>
                  <span class="ml-1">Select</span>
                </span>
                <span class="flex items-center gap-1">
                  <kbd class="px-1.5 py-0.5 bg-[var(--vp-c-bg-soft)] border border-[var(--vp-c-divider)] rounded text-[11px] font-mono">ESC</kbd>
                  <span class="ml-1">Close</span>
                </span>
              </div>
              <div>
                Powered by <a href="https://korrektly.com" target="_blank" rel="noopener" class="text-[var(--vp-c-brand)] no-underline hover:underline">Korrektly</a>
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>
