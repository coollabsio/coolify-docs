<template>
    <div class="max-w-6xl h-[500px] mx-auto">
        <!-- Add wrapper for glow effect -->
        <div class="relative group glow-wrapper">
            <!-- Glow effect overlay -->
            <div class="absolute -inset-0.5 bg-linear-to-r from-brand-alt/50 to-purple-600/50 rounded-lg blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
            
            <div class="relative bg-[#1C1C1C] rounded-lg">
                <!-- Toolbars -->
                <div class="w-full">
                    <div class="bg-[#1C1C1C] border border-[#2D2D2D] rounded-t-lg flex items-stretch relative z-10">
                        <!-- Window controls -->
                        <div class="px-4 pt-4 pb-3 mr-4 text-sm flex-0 text-[#4D4D4D] whitespace-no-wrap">
                            <i class="mx-1 rounded-full w-3 h-3 bg-[#4D4D4D] inline-block"></i>
                            <i class="mx-1 rounded-full w-3 h-3 bg-[#4D4D4D] inline-block"></i>
                            <i class="mx-1 rounded-full w-3 h-3 bg-[#4D4D4D] inline-block"></i>
                        </div>
                        <!-- Active tab -->
                        <div class="relative px-4 py-2 mt-2 -mb-px flex-0 border-t border-[#2D2D2D] bg-[#161616] rounded-t-lg">
                            <!-- Left side of tab -->
                            <div class="absolute bottom-0 w-4 h-8 border-b border-r border-[#2D2D2D] bg-[#1C1C1C] rounded-br-lg" style="right:100%;"></div>
                            <!-- Tab text -->
                            <div class="text-sm overflow-hidden pt-1 w-56 whitespace-no-wrap text-[#E5E5E5]">
                                Documentation Browser Preview
                            </div>
                            <!-- Tab text fade -->
                            <span class="absolute h-full rounded-tr-lg top-0 right-0 m-px w-1/2"
                                  style="background: linear-gradient(to right, rgba(22, 22, 22, 0.0) 0%, rgb(22, 22, 22) 80%);"></span>
                            <!-- Tab close button -->
                            <div class="text-[#4D4D4D] absolute top-0 right-0 pt-3 pr-2 text-xs hover:text-[#E5E5E5] transition-colors">
                                <svg class="mx-px w-4 h-4 inline-block" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <path fill-rule="evenodd"
                                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                          clip-rule="evenodd"></path>
                                </svg>
                            </div>
                            <!-- Right side of tab -->
                            <div class="absolute bottom-0 w-4 h-8 border-b border-l border-[#2D2D2D] bg-[#1C1C1C] rounded-bl-lg" style="left:100%;"></div>
                        </div>
                    </div>

                    <!-- URL bar and controls -->
                    <div class="bg-[#161616] border-l border-r border-b border-[#2D2D2D] flex flex-row py-2">
                        <!-- Navigation controls -->
                        <div class="px-4 py-2 flex-0 text-[#4D4D4D] whitespace-no-wrap">
                            <svg class="mx-px w-6 h-6 inline-block hover:text-[#E5E5E5] transition-colors" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                <path fill-rule="evenodd" d="M7.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l2.293 2.293a1 1 0 010 1.414z"
                                      clip-rule="evenodd"></path>
                            </svg>
                            <svg class="mx-px w-6 h-6 inline-block hover:text-[#E5E5E5] transition-colors" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                <path fill-rule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                                      clip-rule="evenodd"></path>
                            </svg>
                            <svg class="mx-px w-6 h-6 inline-block hover:text-[#E5E5E5] transition-colors" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                <path fill-rule="evenodd"
                                      d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                                      clip-rule="evenodd"></path>
                            </svg>
                        </div>
                        <!-- URL input -->
                        <div class="px-4 py-2 my-auto flex-1 border border-[#2D2D2D] bg-[#1C1C1C] rounded-md whitespace-no-wrap overflow-hidden text-[#E5E5E5]">
                            https://docs.example.com/getting-started
                        </div>
                        <!-- Action buttons -->
                        <div class="px-4 py-2 flex-0 text-[#4D4D4D] whitespace-no-wrap">
                            <svg class="mx-px w-6 h-6 inline-block hover:text-[#E5E5E5] transition-colors" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                <path fill-rule="evenodd"
                                      d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                                      clip-rule="evenodd"></path>
                            </svg>
                            <svg class="mx-px w-6 h-6 inline-block hover:text-[#E5E5E5] transition-colors" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                <path fill-rule="evenodd"
                                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z"
                                      clip-rule="evenodd"></path>
                            </svg>
                            <svg class="mx-px w-6 h-6 inline-block hover:text-[#E5E5E5] transition-colors" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                <path fill-rule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                                      clip-rule="evenodd"></path>
                            </svg>
                        </div>
                    </div>
                </div>
                <!-- Faux Sides -->
                <div class="absolute left-0 border-l border-r border-[#2D2D2D] h-16 w-full"></div>
            </div>
            
            <!-- Content area -->
            <div class="w-full bg-[#161616] p-8 rounded-b-lg relative z-10">
                <!-- <div class="container text-center">
                    <svg class="inline-block m-4" width="300px" viewBox="0 0 218 28" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                        <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                            <path d="M16.5760536,0.474354511 C16.5760536,0.474354511 25.4090458,11.3491047 21.6422669,22.163638 C19.338752,28.7734916 12.6340898,29.776027 7.97799644,29.6376923 C8.38527124,25.9331271 9.40986583,22.7792677 11.0508657,20.176385 C12.3684857,20.3998224 14.3457354,19.9312857 16.9826148,18.7707747 C14.4868724,19.3547151 12.6790865,19.4905083 11.5592573,19.1781542 L11.5592573,19.1781542 L11.7028099,19.2136718 C13.2608089,17.076071 15.2822942,15.3514936 17.7672658,14.0399398 C14.6535818,14.7584678 12.0929072,16.2289107 10.0864045,18.4537674 C9.30581083,17.927787 8.44168374,17.1512382 7.49402322,16.124121 C8.03119669,17.5633575 8.65794495,18.6224628 9.37397416,19.2997098 C7.39789448,21.8389372 6.03769452,25.215563 5.2933743,29.4295873 C5.22285537,29.4223962 5.15327768,29.4136267 5.08521332,29.4048249 C4.20764183,29.3150292 3.49492575,28.8333342 2.77883163,28.0154909 C-2.87631569,20.2248285 1.82807546,13.3221315 7.94518385,11.0202862 C19.2027606,6.78287572 16.5760536,0.474354511 16.5760536,0.474354511 Z"
                                  fill="#0ED3CF"/>
                        </g>
                    </svg>
                    <p class="text-[#E5E5E5] mt-4">
                        Welcome to Documentation Browser Preview
                    </p>
                    <p class="text-[#4D4D4D] italic m-3">
                        Modern documentation made simple
                    </p>
                </div> -->
            </div>
        </div>
    </div>
</template>

<style scoped>
.glow-wrapper {
    --glow-size: 200px;
    --glow-offset: -100px;
}

.glow-wrapper::before,
.glow-wrapper::after {
    content: '';
    position: absolute;
    inset: -1px;
    border-radius: 8px;
    background: transparent;
    transition: all 0.3s ease;
    pointer-events: none;
}

.glow-wrapper::before {
    z-index: -2;
    filter: blur(24px);
}

.glow-wrapper::after {
    z-index: -1;
    background: radial-gradient(
        var(--glow-size) var(--glow-size) at calc(var(--x, 0) * 1px) calc(var(--y, 0) * 1px),
        var(--brand-alt),
        transparent 50%
    );
    opacity: 0;
}

.glow-wrapper:hover::after {
    opacity: 0.15;
}

/* Add mouse move effect */
</style>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'

onMounted(() => {
    const wrapper = document.querySelector('.glow-wrapper') as HTMLElement
    
    const handleMouseMove = (e: MouseEvent) => {
        const rect = wrapper.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top
        
        wrapper.style.setProperty('--x', x.toString())
        wrapper.style.setProperty('--y', y.toString())
    }
    
    wrapper.addEventListener('mousemove', handleMouseMove)
    
    onUnmounted(() => {
        wrapper.removeEventListener('mousemove', handleMouseMove)
    })
})
</script>