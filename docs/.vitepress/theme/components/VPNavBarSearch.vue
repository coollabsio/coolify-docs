<script setup lang="ts">
import { inject, onMounted } from 'vue'
import { onKeyStroke } from '@vueuse/core'

// Inject the openSearch function from KorrektlySearch (with global fallback)
const openSearchInjected = inject<() => void>('openKorrektlySearch', () => {})

const openSearch = () => {
  // Try injected function first
  if (openSearchInjected && typeof openSearchInjected === 'function') {
    openSearchInjected()
    return
  }

  // Fallback to global window reference
  if (typeof window !== 'undefined' && (window as any).__korrektlySearch) {
    (window as any).__korrektlySearch.openSearch()
  } else {
    console.warn('KorrektlySearch not available')
  }
}

// Handle keyboard shortcut (Cmd/Ctrl+K)
onKeyStroke(['k', 'K'], (e) => {
  if (e.metaKey || e.ctrlKey) {
    e.preventDefault()
    openSearch()
  }
})

const handleClick = () => {
  openSearch()
}

// Detect Mac for keyboard shortcut display
onMounted(() => {
  if (typeof window !== 'undefined' && /(mac|iphone|ipod|ipad)/i.test(navigator.platform)) {
    document.documentElement.classList.add('mac')
  }
})
</script>

<template>
  <div class="VPNavBarSearch search" @click="handleClick">
    <button
      type="button"
      class="DocSearch DocSearch-Button"
      aria-label="Search"
    >
      <span class="DocSearch-Button-Container">
        <svg
          class="DocSearch-Search-Icon"
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M14.386 14.386l4.0877 4.0877-4.0877-4.0877c-2.9418 2.9419-7.7115 2.9419-10.6533 0-2.9419-2.9418-2.9419-7.7115 0-10.6533 2.9418-2.9419 7.7115-2.9419 10.6533 0 2.9419 2.9418 2.9419 7.7115 0 10.6533z"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
        <span class="DocSearch-Button-Placeholder">Search</span>
      </span>
      <span class="DocSearch-Button-Keys">
        <kbd class="DocSearch-Button-Key"></kbd>
        <kbd class="DocSearch-Button-Key">K</kbd>
      </span>
    </button>
  </div>
</template>

<style scoped>
.VPNavBarSearch {
  display: flex;
  align-items: center;
  padding-left: 16px;
}

@media (min-width: 768px) {
  .VPNavBarSearch {
    padding-left: 0;
  }
}

.DocSearch {
  --docsearch-primary-color: var(--vp-c-brand-1);
  --docsearch-text-color: var(--vp-c-text-1);
  --docsearch-spacing: 12px;
  --docsearch-icon-stroke-width: 1.4;
  --docsearch-highlight-color: var(--docsearch-primary-color);
  --docsearch-muted-color: var(--vp-c-text-2);
  --docsearch-container-background: rgba(101, 108, 133, 0.8);
  --docsearch-modal-background: var(--vp-c-bg-elv);
  --docsearch-searchbox-background: var(--vp-c-bg-alt);
  --docsearch-searchbox-focus-background: var(--vp-c-bg);
  --docsearch-searchbox-shadow: inset 0 0 0 2px var(--docsearch-primary-color);
  --docsearch-hit-color: var(--vp-c-text-2);
  --docsearch-hit-active-color: var(--vp-c-text-1);
  --docsearch-hit-background: var(--vp-c-default-soft);
  --docsearch-hit-shadow: none;
  --docsearch-footer-background: var(--vp-c-bg);
}

.DocSearch.DocSearch-Button {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0;
  padding: 0 12px 0 14px;
  width: 100%;
  height: 42px;
  background: transparent;
  border-color: #e7e6e6 !important;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  transition: border-color 0.25s, background-color 0.25s;
  cursor: pointer;
}

.dark .DocSearch.DocSearch-Button {
  border-color: #3d3c3c !important;
}

.DocSearch.DocSearch-Button:hover {
  background: var(--vp-c-bg-alt);
}

.DocSearch-Button-Container {
  display: flex;
  align-items: center;
}

.DocSearch-Search-Icon {
  position: relative;
  width: 18px;
  height: 18px;
  color: var(--vp-c-text-2);
  fill: none;
  transition: color 0.25s;
}

.DocSearch-Button:hover .DocSearch-Search-Icon {
  color: var(--vp-c-text-1);
}

.DocSearch-Button-Placeholder {
  display: none;
  padding: 0 10px 0 8px;
  font-size: 13px;
  font-weight: 500;
  color: var(--vp-c-text-2);
  transition: color 0.25s;
}

.DocSearch-Button:hover .DocSearch-Button-Placeholder {
  color: var(--vp-c-text-1);
}

@media (min-width: 768px) {
  .DocSearch-Button-Placeholder {
    display: inline-block;
  }
}

.DocSearch-Button-Keys {
  direction: ltr;
  display: none;
  min-width: auto;
}

@media (min-width: 768px) {
  .DocSearch-Button-Keys {
    display: flex;
    align-items: center;
  }
}

.DocSearch-Button-Key {
  display: block;
  margin: 2px 0;
  border: 1px solid var(--vp-c-divider);
  border-right: none;
  border-radius: 3px;
  padding-left: 6px;
  padding-right: 6px;
  min-width: 0;
  width: auto;
  height: 22px;
  line-height: 22px;
  font-family: var(--vp-font-family-base);
  font-size: 12px;
  font-weight: 500;
  transition: color 0.25s, border-color 0.25s;
}

.DocSearch-Button-Key:first-child {
  font-size: 0 !important;
}

.DocSearch-Button-Key:first-child::after {
  content: "⌘";
  font-size: 12px;
}

html:not(.mac) .DocSearch-Button-Key:first-child::after {
  content: "Ctrl";
}

.DocSearch-Button-Key:last-child {
  border-right: 1px solid var(--vp-c-divider);
}

@media (min-width: 768px) {
  .VPNavBarSearch {
    flex-grow: 1;
    padding-left: 24px;
  }
}

@media (min-width: 960px) {
  .VPNavBarSearch {
    padding-left: 32px;
  }
}
</style>
