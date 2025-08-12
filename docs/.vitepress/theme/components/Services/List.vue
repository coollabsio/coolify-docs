<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { withBase } from 'vitepress'
import { services } from '../../../../_data/services.js'
import ServicesModal from './Modal.vue'
import DeployModal from './DeployModal.vue'
import CoolIcon from '../CoolIcon.vue'

defineProps<{
    title: string
    description: string
}>()

const showModal = ref(false)
const selectedService = ref<string | undefined>(undefined)

const rightClick = (serviceName: string) => {
    selectedService.value = serviceName
    showModal.value = true
}

const handleModalClose = () => {
    showModal.value = false
    selectedService.value = undefined
}

const search = ref('')
const selectedCategories = ref(['All'])
const isOpen = ref(false)
const dropdownRef = ref<HTMLElement | null>(null)
const itemsPerPage = ref(20)
const currentPage = ref(1)

const categories = computed(() => {
    const uniqueCategories = new Set(services.map((s: any) => s.category))
    return Array.from(uniqueCategories).sort()
})

// Add click outside handler
const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
        isOpen.value = false
    }
}

// Add and remove event listeners
onMounted(() => {
    document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside)
})

const filteredServicesByCategory = (category: string) => {
    return services.filter(s =>
        s.category === category &&
        (search.value === '' || s.name.toLowerCase().includes(search.value.toLowerCase()) || s.description.toLowerCase().includes(search.value.toLowerCase()))
    )
}

const filteredCategories = computed(() => {
    if (selectedCategories.value.includes('All')) {
        return categories.value.filter(category =>
            filteredServicesByCategory(category).length > 0
        )
    } else {
        return selectedCategories.value.filter(category =>
            filteredServicesByCategory(category).length > 0
        )
    }
})

const toggleCategory = (category: string) => {
    if (category === 'All') {
        selectedCategories.value = ['All']
        return
    }

    // Remove 'All' if it's currently selected and we're selecting a specific category
    if (selectedCategories.value.includes('All')) {
        selectedCategories.value = selectedCategories.value.filter(c => c !== 'All')
    }

    const index = selectedCategories.value.indexOf(category)
    if (index === -1) {
        // Category not found, add it
        selectedCategories.value.push(category)
    } else {
        // Category found, remove it
        selectedCategories.value.splice(index, 1)
        // If no categories are selected, default to 'All'
        if (selectedCategories.value.length === 0) {
            selectedCategories.value = ['All']
        }
    }
}

const navigateTo = (path: string, external: boolean = false) => {
    if (external) {
        window.location.href = path
    } else {
        window.location.href = `/docs/${path}`
    }
}
</script>

<template>
    <div class="flex flex-col max-w-3xl lg:max-w-4xl xl:max-w-5xl 2xl:max-w-6xl 3xl:max-w-7xl mx-auto px-4 mt-8">
        <h2 class="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">{{ title }}</h2>
        <div class="flex justify-between">
            <p class="text-gray-500 dark:text-gray-400 text-sm mb-8">{{ description }}</p>
            <div class="invisible md:visible flex flex-col">
                <div class="flex items-center gap-2">
                    <CoolIcon name="hugeicons:mouse-left-click-06" color="gray" class="size-5 my-auto" />
                    <p class="text-gray-500 dark:text-gray-400 text-xs"><span class="font-bold my-auto">Left click:</span> Explore the Service Preset.</p>
                </div>

                <div class="flex items-center gap-2 mb-8">
                    <CoolIcon name="hugeicons:mouse-right-click-06" color="gray" class="size-5 my-auto" />
                    <p class="text-gray-500 dark:text-gray-400 text-xs"><span class="font-bold my-auto">Right click:</span> Deploy the Service Preset.</p>
                </div>
            </div>
        </div>

        <div class="input-container w-full flex flex-col justify-between gap-2 mb-2">
            <input v-model="search" type="text" placeholder="Search"
                class="search w-full border-2 border-gray-300 dark:border-gray-600 rounded-lg py-3 sm:py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:border-purple-500 dark:focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-200 dark:focus:ring-purple-800" />

            <div class="button-group relative flex flex-col gap-2" ref="dropdownRef">
                <button @click.stop="isOpen = !isOpen"
                    class="select flex items-center justify-between w-full border-2 border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 sm:px-3 sm:py-2 bg-purple-700 dark:bg-purple-600 text-gray-900 dark:text-white focus:border-purple-500 dark:focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-200 dark:focus:ring-purple-800">
                    <span class="text-sm sm:text-base">{{ selectedCategories.length === 1 ? selectedCategories[0] :
                        `${selectedCategories.length} categories` }}
                    </span>
                    <CoolIcon class="w-4 h-4 ml-2 flex-shrink-0" name="mdi:chevron-down" color="white" />
                </button>
                <div v-if="isOpen"
                    class="dropdown-content absolute z-10 top-full left-0 right-0 rounded-lg shadow-lg bg-white dark:!bg-[#23272f] border border-gray-200 dark:border-gray-700 max-h-60 overflow-y-auto">
                    <div class="p-2">
                        <label
                            class="flex items-center space-x-2 p-2 text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 rounded cursor-pointer">
                            <input type="checkbox" :checked="selectedCategories.includes('All')"
                                @change="toggleCategory('All')"
                                class="rounded border-gray-300 dark:border-gray-600 text-purple-600 dark:text-purple-500 focus:ring-purple-600 dark:focus:ring-purple-500 bg-white dark:bg-gray-800">
                            <span class="text-gray-900 dark:text-white">
                                All Categories
                            </span>
                        </label>
                        <div v-for="category in categories" :key="category" class="mt-1">
                            <label
                                class="flex items-center space-x-2 p-2 text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 rounded cursor-pointer">
                                <input type="checkbox" :checked="selectedCategories.includes(category)"
                                    @change="toggleCategory(category)"
                                    class="rounded border-gray-300 dark:border-gray-600 text-purple-600 dark:text-purple-500 focus:ring-purple-600 dark:focus:ring-purple-500 bg-white dark:bg-gray-800">
                                <span class="text-gray-900 dark:text-white">{{ category }}</span>
                            </label>
                        </div>
                    </div>
                </div>
                <button @click="navigateTo('https://github.com/coollabsio/coolify/blob/v4.x/CONTRIBUTING.md', true)"
                    class="add-service-btn text-gray-900 dark:text-white px-6 py-3 sm:px-4 sm:py-2 rounded-lg transition-colors text-sm sm:text-base w-full">
                    Add Service
                </button>
            </div>
        </div>

        <div class="grid-container">
            <template v-if="selectedCategories.includes('All')">
                <div v-if="filteredCategories.length === 0">
                    <h2 class="text-2xl font-bold my-6 text-gray-900 dark:text-gray-100">
                        No results found
                    </h2>
                    <div class="services-grid not-found-grid grid grid-cols-1 gap-6">
                        <div
                            class="dark:default-soft rounded-lg shadow border border-gray-300 hover:border-purple-500 dark:hover:border-purple-400 transition-colors hover:cursor-pointer flex flex-col">
                            <div class="w-full flex flex-col dark:default-soft rounded-b-xl p-3">
                                <div class="font-bold text-md mb-1 text-gray-900 dark:text-gray-100">
                                    Service not found
                                </div>
                                <div class="text-gray-500 dark:text-gray-400 text-xs">
                                    Try adjusting your search or category filter.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div v-else v-for="category in filteredCategories" :key="category">
                    <h2 class="text-2xl font-bold my-6 text-gray-900 dark:text-gray-100">{{ category }}</h2>
                    <div class="services-grid grid grid-cols-1 gap-6 rounded-lg">
                        <div v-for="(service, index) in filteredServicesByCategory(category)" :key="service.name"
                            @click="navigateTo(`services/${service.name.toLowerCase()}`)"
                            @click.right.prevent="rightClick(service.name)"
                            class="dark:default-soft rounded-lg shadow border border-gray-300 hover:border-purple-500 dark:hover:border-purple-400 transition-all duration-200 hover:cursor-pointer flex flex-col">

                            <div class="w-full h-full flex flex-col dark:default-soft rounded-t-xl p-3">
                                <div class="font-bold text-md text-gray-900 mb-1 dark:text-gray-100">{{ service.name }}
                                </div>
                                <div class="text-gray-500 dark:text-gray-400 text-xs">{{ service.description }}</div>
                            </div>
                            <div class="p-4">
                                <div
                                    class="bg-white dark:default-soft w-full h-full min-h-[100px] rounded-lg flex items-center justify-center">
                                    <img :src="withBase(service.icon)" alt="Coolify" class="w-auto h-8 px-2 rounded-lg"
                                        loading="lazy" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </template>
            <template v-else>
                <div>
                    <div v-for="category in selectedCategories" :key="category">
                        <h2 class="text-2xl font-bold my-6 text-gray-900 dark:text-gray-100">{{ category }}</h2>
                        <div class="services-grid not-found-grid grid grid-cols-1 gap-6 mb-8">
                            <template v-if="filteredServicesByCategory(category).length === 0">
                                <div
                                    class="dark:default-soft h-auto rounded-lg shadow border border-gray-300 hover:border-purple-500 dark:hover:border-purple-400 transition-colors hover:cursor-pointer flex flex-col">
                                    <div class="w-full flex flex-col dark:default-soft rounded-b-xl p-3">
                                        <div class="font-bold text-md mb-1 text-gray-900 dark:text-gray-100">No services
                                            found</div>
                                        <div class="text-gray-500 dark:text-gray-400 text-sm">Try adjusting your search
                                            or category filter.</div>
                                    </div>
                                </div>
                            </template>
                            <template v-else>
                                <div v-for="service in filteredServicesByCategory(category)" :key="service.name"
                                    @click="navigateTo(`services/${service.name.toLowerCase()}`)"
                                    @click.right.prevent="rightClick(service.name)"
                                    class="dark:default-soft rounded-lg shadow border border-gray-300 hover:border-purple-500 dark:hover:border-purple-400 transition-all duration-200 hover:cursor-pointer flex flex-col">
                                    <div class="w-full h-full flex flex-col dark:default-soft rounded-b-xl p-3">
                                        <div class="font-bold text-md text-gray-900 mb-1 dark:text-gray-100">{{
                                            service.name }}
                                        </div>
                                        <div class="text-gray-500 dark:text-gray-400 text-xs">
                                            {{ service.description }}
                                        </div>
                                    </div>
                                    <div class="p-4">
                                        <div
                                            class="bg-white dark:default-soft w-full h-full min-h-[100px] rounded-lg flex items-center justify-center">
                                            <img :src="withBase(service.icon)" alt="Coolify"
                                                class="w-auto h-8 px-2 rounded-lg" loading="lazy" />
                                        </div>
                                    </div>
                                </div>
                            </template>
                        </div>
                    </div>
                </div>
            </template>
        </div>
        <DeployModal :show="showModal" :selected-service="selectedService" @close="handleModalClose" />
    </div>
</template>

<style scoped>
.default-soft {
    background: rgba(101, 117, 133, 0.16);
    border-color: #3c3f44;
}

/* Purple checkboxes */
input[type="checkbox"] {
    accent-color: #9333ea;
    /* purple-600 */
}

.dark input[type="checkbox"] {
    accent-color: #8b5cf6;
    /* purple-500 */
}

.search {
    width: 100%;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    padding: 8px 12px;
    background-color: #fff;
    transition: border-color 0.3s ease;
    font-size: 14px;
}

.dark .search {
    border-color: #374151;
    background-color: #1f2937;
    color: #f9fafb;
}

/* Responsive search input */
@media (max-width: 640px) {
    .search {
        padding: 10px 12px;
        font-size: 16px;
        /* Prevents zoom on iOS */
    }
}

@media (max-width: 480px) {
    .search {
        padding: 12px 16px;
        font-size: 16px;
    }
}

.select {
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    padding: 8px 12px;
    background-color: #fff;
    transition: border-color 0.3s ease;
    font-size: 14px;
    min-width: 120px;
}

.dark .select {
    border-color: #374151;
    background-color: #1f2937;
    color: #f9fafb;
}

/* Responsive select dropdown */
@media (max-width: 640px) {
    .select {
        padding: 10px 12px;
        font-size: 16px;
        min-width: 100px;
    }
}

@media (max-width: 480px) {
    .select {
        padding: 12px 16px;
        font-size: 16px;
        min-width: 80px;
    }
}

/* Responsive container layout */
@media (min-width: 640px) {
    .input-container {
        flex-direction: row;
        gap: 1rem;
    }

    .input-container .search {
        max-width: 20rem;
    }

    .input-container .button-group {
        flex-direction: row;
    }

    .input-container .select {
        width: 12rem;
    }

    .input-container .add-service-btn {
        width: auto;
        background-color: rgba(101, 117, 133, 0.16);
    }

    .add-service-btn:hover {
        background-color: rgba(75, 85, 99, 0.25);
    }

    .dropdown-content {
        left: 0;
        width: 12rem;
    }
}

/* Responsive dropdown content */
@media (max-width: 640px) {
    .dropdown-content {
        font-size: 14px;
        padding: 8px;
    }

    .dropdown-content label {
        padding: 10px 8px;
    }
}

@media (max-width: 480px) {
    .dropdown-content {
        font-size: 16px;
        padding: 12px;
    }

    .dropdown-content label {
        padding: 12px 10px;
    }
}

.select:hover {
    border-color: #8b5cf6;
}

.dark .select:hover {
    border-color: #a78bfa;
}

.select:focus {
    border-color: #8b5cf6;
    outline: none;
    box-shadow: 0 0 0 2px rgba(139, 92, 246, 0.2);
}

.dark .select:focus {
    border-color: #a78bfa;
    box-shadow: 0 0 0 2px rgba(167, 139, 250, 0.2);
}

.bg-white {
    background-color: #fff;
}

.dark .bg-white {
    background-color: #374151;
}

.category {
    @apply space-y-4;
}

.category h2 {
    @apply text-xl font-semibold mb-4 text-blue-600;
}

.dark .category h2 {
    @apply text-blue-400;
}

.service-card {
    @apply block p-4 rounded-lg border border-gray-200 dark:border-gray-800 hover:border-blue-600 dark:hover:border-blue-600 transition-colors duration-200;
}

.service-card:hover {
    @apply bg-gray-50;
}

.grid {
    display: grid;
    width: 100%;
    grid-auto-rows: minmax(200px, auto);
}

/* Override for not found cards */
.services-grid.not-found-grid {
    grid-auto-rows: auto;
}

.grid-cols-1 {
    grid-template-columns: repeat(1, minmax(0, 1fr));
}

/* Responsive grid columns */
@media (min-width: 640px) {
    .services-grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
    }
}

@media (min-width: 832px) {
    .services-grid {
        grid-template-columns: repeat(3, minmax(0, 1fr));
    }
}

@media (min-width: 1280px) {
    .services-grid {
        grid-template-columns: repeat(4, minmax(0, 1fr));
    }
}

.gap-6 {
    gap: 1.5rem;
}

.services-container {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
}

.services-content {
    flex: 1;
    display: flex;
    flex-direction: column;
}

.grid-container {
    display: grid;
    grid-template-rows: auto;
    min-height: 100vh;
    align-content: start;
    contain: layout style paint;
}

/* Optimize image rendering */
img {
    image-rendering: -webkit-optimize-contrast;
    image-rendering: crisp-edges;
    will-change: transform;
}

/* Optimize animations */
.services-grid>div {
    will-change: transform;
    backface-visibility: hidden;
}
</style>