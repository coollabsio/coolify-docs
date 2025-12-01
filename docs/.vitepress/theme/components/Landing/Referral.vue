<template>
    <div class="relative flex flex-col gap-4 max-w-lg mx-auto">
        <div class="flex flex-row gap-2 z-10">
            <h3 class="text-2xl font-bold tracking-wide">{{ referralTitle }}</h3>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 181.42 22.24" class="w-auto size-3 my-auto mr-0 ml-auto">
                <g id="Ebene_2">
                    <path fill="#d50c2d" class="cls-1"
                        d="M174.05,14.12a10.22,10.22,0,0,0,4.53-2l0,0a6.15,6.15,0,0,0,1.68-4.78,7.71,7.71,0,0,0-1.14-4.06A6.47,6.47,0,0,0,173.84.09l-1.09,0L170.2,0,158.66,0c-.7,0-1,.29-1,1V21.22c0,.7.29,1,1,1h3c.7,0,1-.29,1-1v-6.7h3.67a3.48,3.48,0,0,1,2.17.91l5.82,5.85a3.08,3.08,0,0,0,2,.92h4.47c.7,0,.87-.41.38-.91Zm-.76-4.3H162.64V4.72h10.65a2.13,2.13,0,0,1,1.87,2.15v.79A2.14,2.14,0,0,1,173.29,9.82Z" />
                    <path fill="#d50c2d" class="cls-1"
                        d="M153,17.52H136.47V13.35h13.19c.7,0,1-.29,1-1V9.92c0-.7-.29-1-1-1h-13.2V4.76H153c.7,0,1-.29,1-1V1c0-.7-.29-1-1-1H132.38c-.7,0-1,.29-1,1V21.24c0,.7.29,1,1,1H153c.7,0,1-.29,1-1V18.51C154,17.81,153.67,17.52,153,17.52Z" />
                    <path fill="#d50c2d" class="cls-1"
                        d="M127.73,7.3a7.25,7.25,0,0,0-1.13-4A6.61,6.61,0,0,0,121.24,0L106.08,0c-.71,0-1,.29-1,1V21.22c0,.7.29,1,1,1h3.26c.7,0,1-.28,1-1V4.73l8.78,0c1.87,0,3.69,1.24,3.69,3.11V21.24c0,.7.29,1,1,1h2.95c.71,0,1-.29,1-1Z" />
                    <path fill="#d50c2d" class="cls-1"
                        d="M100.47,17.39l-14.25,0L100.5,4.84a2.57,2.57,0,0,0,1-1.84V1c0-.7-.3-1-1-1H79.83c-.7,0-1,.29-1,1V3.77c0,.7.29,1,1,1H93.08L79.79,17.24a2.62,2.62,0,0,0-1,1.84v2.17c0,.7.29,1,1,1l20.65,0c.7,0,1-.29,1-1V18.38C101.46,17.68,101.17,17.39,100.47,17.39Z" />
                    <path fill="#d50c2d" class="cls-1"
                        d="M74.19,0H53.55c-.71,0-1,.28-1,1V3.76c0,.7.28,1,1,1h7.78V21.24c0,.7.29,1,1,1h3.3c.7,0,1-.29,1-1V4.75h7.57c.7,0,1-.29,1-1V1C75.18.32,74.89,0,74.19,0Z" />
                    <path fill="#d50c2d" class="cls-1"
                        d="M47.91,17.52H31.41V13.35H44.6c.7,0,1-.29,1-1V9.92c0-.7-.28-1-1-1H31.41V4.76h16.5c.7,0,1-.29,1-1V1c0-.7-.29-1-1-1H27.33c-.7,0-1,.29-1,1V21.24c0,.7.29,1,1,1H47.91c.7,0,1-.29,1-1V18.51C48.9,17.81,48.61,17.52,47.91,17.52Z" />
                    <path fill="#d50c2d" class="cls-1"
                        d="M21.63,0H18.52c-.7,0-1,.29-1,1V8.87H5.13V1c0-.7-.29-1-1-1H1C.29,0,0,.29,0,1V21.25c0,.71.29,1,1,1H4.13c.7,0,1-.28,1-1v-8h12.4v8c0,.7.29,1,1,1h3.11c.7,0,1-.29,1-1V1C22.62.32,22.33,0,21.63,0Z" />
                </g>
            </svg>
        </div>
        <p class="text-sm font-bold z-10">
            {{ referralText }}
        </p>
        <div class="relative rounded-lg border border-gray-200 dark:border-[#202127] overflow-hidden w-full z-10">
            <div class="flex items-center justify-between px-3 py-1.5 bg-gray-100 dark:bg-[#202127]">
                <div class="flex items-center gap-1.5">
                    <!-- TODO: Replace w a Icon module source=https://icones.js.org/collection/all?s=command-line&icon=heroicons:command-line -->
                    <svg xmlns="http://www.w3.org/2000/svg" class="size-5" width="32" height="32" viewBox="0 0 24 24">
                        <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                            stroke-width="1.5"
                            d="m6.75 7.5l3 2.25l-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0 0 21 18V6a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 6v12a2.25 2.25 0 0 0 2.25 2.25" />
                    </svg>
                    <span class="text-xs text-gray-700 dark:text-gray-200">Terminal</span>
                </div>
                <button type="button"
                    v-plausible:cta-click="{ source: 'referral-link' }"
                    class="inline-flex items-center p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-md transition-colors"
                    @click="copyToClipboard"
                >
                    <!-- TODO: Replace w a Icon module source=https://icones.js.org/collection/all?s=clipboard-document&icon=heroicons:clipboard-document -->
                    <svg v-if="!isCopied" xmlns="http://www.w3.org/2000/svg" class="size-5" width="32" height="32"
                        viewBox="0 0 24 24">
                        <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                            stroke-width="1.5"
                            d="M8.25 7.5V6.108c0-1.135.845-2.098 1.976-2.192q.56-.045 1.124-.08M15.75 18H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48 48 0 0 0-1.123-.08M15.75 18.75v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5A3.375 3.375 0 0 0 6.375 7.5H5.25m11.9-3.664A2.25 2.25 0 0 0 15 2.25h-1.5a2.25 2.25 0 0 0-2.15 1.586m5.8 0q.099.316.1.664v.75h-6V4.5q.001-.348.1-.664M6.75 7.5H4.875c-.621 0-1.125.504-1.125 1.125v12c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V16.5a9 9 0 0 0-9-9" />
                    </svg>
                    <svg v-else xmlns="http://www.w3.org/2000/svg" class="size-5" width="32" height="32"
                        viewBox="0 0 16 16">
                        <g fill="currentColor" fill-rule="evenodd" clip-rule="evenodd">
                            <path
                                d="M11.986 3H12a2 2 0 0 1 2 2v6a2 2 0 0 1-1.5 1.937V7A2.5 2.5 0 0 0 10 4.5H4.063A2 2 0 0 1 6 3h.014A2.25 2.25 0 0 1 8.25 1h1.5a2.25 2.25 0 0 1 2.236 2M10.5 4v-.75a.75.75 0 0 0-.75-.75h-1.5a.75.75 0 0 0-.75.75V4z" />
                            <path
                                d="M2 7a1 1 0 0 1 1-1h7a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1zm6.585 1.08a.75.75 0 0 1 .336 1.005l-1.75 3.5a.75.75 0 0 1-1.16.234l-1.75-1.5a.75.75 0 0 1 .977-1.139l1.02.875l1.321-2.64a.75.75 0 0 1 1.006-.336" />
                        </g>
                    </svg>
                </button>
            </div>

            <!-- Terminal Content -->
            <div class="p-3 bg-white dark:bg-[#202127]/40">
                <a :href="referralUrl" target="_blank" rel="noopener noreferrer">
                    <code class="language-bash mr-auto ml-0 text-sm text-[#E2931D] dark:text-[#FFCB6B] hover:text-gray-50">{{ referralUrl }}</code>
                </a>
            </div>

        </div>
        <p class="flex text-xs font-medium z-10">
            <svg v-if="isCopied" class="size-5 my-auto" xmlns="http://www.w3.org/2000/svg" width="32" height="32"
                viewBox="0 0 36 36">
                <circle cx="17" cy="19" r="17" fill="#FFCC4D" />
                <ellipse cx="17.999" cy="26" fill="#664500" rx="2" ry="2.5" />
                <path fill="#664500"
                    d="M8.111 21.383a1 1 0 0 1-.845-1.533c.916-1.453 3.701-3.938 7.69-2.962a1 1 0 0 1-.476 1.942c-3.604-.882-5.502 2.056-5.521 2.086a1 1 0 0 1-.848.467m11.973-3.742a1 1 0 0 1-.634-1.774c3.176-2.604 6.762-1.562 8.215-.646a1 1 0 0 1-1.064 1.694c-.138-.084-3.052-1.823-5.884.499a1 1 0 0 1-.633.227" />
                <path fill="#E2A62D"
                    d="M13.346 31.273a.75.75 0 0 1-.722-.954c.437-1.54.258-3.029-.49-4.086c-.497-.702-1.205-1.131-1.943-1.178c-.414-.025-.728-.382-.702-.795s.381-.751.795-.701c1.193.074 2.313.733 3.073 1.807c1.011 1.429 1.27 3.383.709 5.361a.75.75 0 0 1-.72.546m11.037-3.061a.74.74 0 0 1-.412-.124c-1.167-.77-1.82-2.117-1.792-3.695c.029-1.635.809-3.153 1.984-3.869a.75.75 0 0 1 1.03.251a.75.75 0 0 1-.251 1.03c-.735.448-1.244 1.499-1.264 2.614c-.02 1.055.389 1.936 1.118 2.417a.75.75 0 0 1-.413 1.376" />
                <path fill="#DD2E44"
                    d="M17.179 2.72a.33.33 0 0 0-.189-.091S1.066-.394.377.214C-.311.823.74 16.998.74 16.998c.005.081.023.15.067.199c.604.684 4.758-2.004 9.279-6.001c4.522-3.998 7.697-7.792 7.093-8.476" />
                <path fill="#EA596E"
                    d="M.349.271a.5.5 0 0 0-.038.123C.47 1.765 2.006 13.046 2.963 16.572c1.436-.803 2.895-1.894 4.609-3.253C6.116 10.654 1.158.146.349.271" />
                <path fill="#3B88C3"
                    d="m29.902 29.229l-10.573-1.303c-1.13-.102-3.117-.112-3.015-1.902c.093-1.623 2.04-1.373 3.479-1.16l10.638 1.774z" />
                <path fill="#88C9F9"
                    d="m30.43 26.639l-4.222-.724c-.494-.089-.934.647-.956 1.426c-.025.866.227 1.304.726 1.406l4.144.512z" />
                <path fill="#3B88C3"
                    d="m34.918 26.341l-2.622 2.411l-4.687-5.097l2.622-2.411a3.37 3.37 0 0 1 4.751.199l.135.147a3.373 3.373 0 0 1-.199 4.751" />
                <ellipse cx="29.952" cy="26.203" fill="#88C9F9" rx="2.77" ry="3.462"
                    transform="rotate(-42.597 29.954 26.205)" />
                <ellipse cx="29.952" cy="26.203" fill="#269" rx="1.385" ry="2.077"
                    transform="rotate(-42.597 29.954 26.205)" />
                <circle cx="2.5" cy="33.5" r="1.5" fill="#55ACEE" />
                <circle cx="29" cy="2" r="2" fill="#55ACEE" />
                <path fill="#EA596E" d="M4.864 29.246L2.526 23.63L.412 29.675zM26 5l-4 1l1-4z" />
                <path fill="#77B255" d="M31.999 13L36 7.999L33 6z" />
            </svg>
            <span :class="{ 'ml-2': isCopied }" class="my-auto font-bold">
                {{ !isCopied ? '' : 'Copied to clipboard!' }}
            </span>
        </p>

    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { VPBadge } from 'vitepress/theme'
import { useClipboard } from '@vueuse/core'
import { useData } from 'vitepress'
import Globe from './Globe.vue'

// Get frontmatter data
const { frontmatter } = useData()

// Default values
const referralTitle = frontmatter.value.referral?.title ?? 'Referral Program'
const referralUrl = frontmatter.value.referral?.url ?? 'https://coolify.io/hetzner'
const referralText = frontmatter.value.referral?.text ?? "If you don't have a server or server provider yet."
const referralDescription = frontmatter.value.referral?.description ?? "Copy and visit the above url to get a present at Hetzner!"

const { copy } = useClipboard()

const isCopied = ref(false)

const copyToClipboard = async () => {
    await copy(referralUrl)
    isCopied.value = true
    setTimeout(() => {
        isCopied.value = false
    }, 3000)
}
</script>

<style scoped>
a code {
    background-color: transparent !important;
    color: var(--vp-c-gray-12) !important;
    -webkit-text-fill-color: var(--vp-c-gray-12) !important;
}

a code:hover {
    background-color: var(--vp-c-brand-1) !important;
    color: white !important;
    -webkit-text-fill-color: white !important;
}

/* Responsive adjustments for the referral component */
@media (min-width: 640px) {
    .relative.flex.flex-col.gap-4.max-w-lg.mx-auto {
        max-width: 32rem; /* 512px */
    }
}

@media (min-width: 768px) {
    .relative.flex.flex-col.gap-4.max-w-lg.mx-auto {
        max-width: 36rem; /* 576px */
    }
}

@media (min-width: 1024px) {
    .relative.flex.flex-col.gap-4.max-w-lg.mx-auto {
        max-width: 40rem; /* 640px */
    }
}

@media (min-width: 1280px) {
    .relative.flex.flex-col.gap-4.max-w-lg.mx-auto {
        max-width: 44rem; /* 704px */
    }
}
</style>