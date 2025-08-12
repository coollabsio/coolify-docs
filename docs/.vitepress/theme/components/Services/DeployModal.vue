<script setup lang="ts">
import { ref, computed, watch, nextTick } from "vue";
import Modal from "./Modal.vue";
import { useCoolFetch } from "../../composables/coolfetch";
import CoolIcon from "../CoolIcon.vue";
import { Motion } from "motion-v";

interface ApiConfig {
  deploymentType: "cloud" | "self-host";
  domain: string;
  serverId: string;
  apiKey: string;
}

interface Server {
  uuid: string;
  name: string;
}

interface Props {
  show: boolean;
  selectedService: string | null | undefined;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  close: [];
  submit: [config: ApiConfig];
}>();

const modalRef = ref();
const connected = ref(false);
const serverOptions = ref<Server[]>([]);
const currentStep = ref(0);
const apiKeyInput = ref<HTMLInputElement>();
const serviceUrl = ref('');
const isPasswordVisible = ref(false);

const {
  connect,
  status,
  projectStatus,
  serviceStatus,
  deployStatus,
  deploy,
} = useCoolFetch();

// Form data
const formData = ref({
  deploymentType: "cloud" as "cloud" | "self-host",
  domain: "",
  serverId: "",
  apiKey: "",
});

// Form validation
const errors = ref<Record<string, string>>({});
const isSubmitting = ref(false);

// Computed properties
const isCloudDeployment = computed(
  () => formData.value.deploymentType === "cloud"
);

const selectedServer = computed(() => {
  if (!formData.value.serverId) return null;
  return serverOptions.value.find(server => server.uuid === formData.value.serverId);
});

// Validation function
const validateForm = () => {
  errors.value = {};

  if (!formData.value.apiKey.trim()) {
    errors.value.apiKey = "API Key is required";
  }

  if (!formData.value.serverId.trim()) {
    errors.value.serverId = "Server selection is required";
  }

  if (!isCloudDeployment.value) {
    if (!formData.value.domain.trim()) {
      errors.value.domain = "Server URL is required";
    } else if (!isValidUrl(formData.value.domain)) {
      errors.value.domain = "Please enter a valid URL";
    }
  }

  return Object.keys(errors.value).length === 0;
};

// URL validation helper
const isValidUrl = (url: string) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// Handle form submission
const handleSubmit = async () => {
  if (!validateForm()) return;

  isSubmitting.value = true;

  try {
    if (formData.value.deploymentType === "cloud") {
      const data = await connect(formData.value.domain, formData.value.apiKey);
      if (data instanceof Error) {
        // Check if it's an authentication/authorization error
        if (data.message.includes('401') || data.message.includes('403') ||
          data.message.includes('Unauthorized') || data.message.includes('Forbidden')) {
          errors.value.apiKey = 'Invalid API key or insufficient permissions';
          isSubmitting.value = false;
          return; // Block progression
        }
        throw new Error(data.message);
      }
    } else {
      const data = await connect(formData.value.domain, formData.value.apiKey);
      if (data instanceof Error) {
        // Check if it's an authentication/authorization error
        if (data.message.includes('401') || data.message.includes('403') ||
          data.message.includes('Unauthorized') || data.message.includes('Forbidden')) {
          errors.value.apiKey = 'Invalid API key or insufficient permissions';
          isSubmitting.value = false;
          return; // Block progression
        }
        throw new Error(data.message);
      }
    }
    isSubmitting.value = false;
    formData.value = {
      deploymentType: "cloud",
      domain: "",
      serverId: "",
      apiKey: "",
    };
    errors.value = {};
  } catch (error) {
    // console.error("Failed to submit configuration:", error);
    if (error instanceof Error) {
      if (error.message.includes('401') || error.message.includes('403') ||
        error.message.includes('Unauthorized') || error.message.includes('Forbidden')) {
        errors.value.apiKey = 'Invalid API key or insufficient permissions';
        isSubmitting.value = false;
        return; // Block progression
      }
    }
    isSubmitting.value = false;
  }
};

const handleConnect = async () => {
  try {
    validateForm();
    const data = await connect(formData.value.domain, formData.value.apiKey);
    if (data instanceof Error) {
      // Check if it's an authentication/authorization error
      if (data.message.includes('401') || data.message.includes('403') ||
        data.message.includes('Unauthorized') || data.message.includes('Forbidden')) {
        errors.value.apiKey = 'Invalid API key or insufficient permissions';
        return; // Block progression
      }
      throw data;
    }

    serverOptions.value = data;
    connected.value = true;
    currentStep.value++;
  } catch (error) {
    // console.error('Connection failed:', error);
    if (error instanceof Error) {
      if (error.message.includes('401') || error.message.includes('403') ||
        error.message.includes('Unauthorized') || error.message.includes('Forbidden')) {
        errors.value.apiKey = 'Invalid API key or insufficient permissions';
        return; // Block progression
      }
    }
  }
};

const deployFunc = async () => {
  try {
    if (!formData.value.serverId) {
      throw new Error('No server selected');
    }

    if (!props.selectedService) {
      throw new Error('Service is not selected');
    }

    currentStep.value++;
    const data = await deploy(formData.value.serverId, props.selectedService.toLowerCase());

    if (data instanceof Error) {
      // Check if it's an authentication/authorization error
      if (data.message.includes('401') || data.message.includes('403') ||
        data.message.includes('Unauthorized') || data.message.includes('Forbidden')) {
        errors.value.apiKey = 'Invalid API key or insufficient permissions';
        currentStep.value--;
        return; // Block progression
      }
      throw data;
    }

    if (data && typeof data === 'object' && 'url' in data) {
      serviceUrl.value = data.url;
      currentStep.value++;
    } else {
      throw new Error('Failed to get deployment URL');
    }
  } catch (error) {
    // console.error('Deployment failed:', error);
    if (error instanceof Error) {
      if (error.message.includes('401') || error.message.includes('403') ||
        error.message.includes('Unauthorized') || error.message.includes('Forbidden')) {
        errors.value.apiKey = 'Invalid API key or insufficient permissions';
        currentStep.value--;
        return; // Block progression
      }
    }
    currentStep.value--;
  }
}

const handleClose = () => {
  emit("close");
  currentStep.value = 0;
  connected.value = false;
  serverOptions.value = [];
  formData.value = {
    deploymentType: "cloud" as "cloud" | "self-host",
    domain: "",
    serverId: "",
    apiKey: "",
  };
  errors.value = {};
  isSubmitting.value = false;
};

const goBack = () => {
  currentStep.value--;
  connected.value = false;
  serverOptions.value = [];
  formData.value.serverId = "";
};

const togglePasswordVisibility = () => {
  if (apiKeyInput.value) {
    isPasswordVisible.value = !isPasswordVisible.value;
    apiKeyInput.value.type = isPasswordVisible.value ? 'text' : 'password';
  }
};

// Watch for step changes to update focus trap
watch(currentStep, async (newStep, oldStep) => {
  await nextTick()
  if (modalRef.value?.updateFocusTrap) {
    // Don't auto-focus when going back to step 0 (deployment type selection)
    // Don't auto-focus on step 4 (final success step) to avoid focusing the URL link
    const autoFocus = !(oldStep > 0 && newStep === 0) && newStep !== 4
    modalRef.value.updateFocusTrap(autoFocus)
  }
})

// Watch for modal show/hide to reset form when closed
watch(() => props.show, (newValue) => {
  if (!newValue) {
    // Reset form when modal is closed
    currentStep.value = 0;
    connected.value = false;
    serverOptions.value = [];
    formData.value = {
      deploymentType: "cloud" as "cloud" | "self-host",
      domain: "",
      serverId: "",
      apiKey: "",
    };
    errors.value = {};
    isSubmitting.value = false;
  }
})
</script>

<template>
  <Modal ref="modalRef" :show="show" :title="`Deploy ${selectedService || 'Service'} on`" size="xl"
    @close="handleClose">
    <div class="w-full">
      <div v-if="currentStep === 0" class="w-full justify-between flex gap-2">
        <label v-for="type in ['cloud', 'self-host']" :key="type"
          class="relative w-full flex cursor-pointer rounded-lg border bg-white dark:bg-black p-4 shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
          :class="{
            'ring-2 ring-purple-500 border-purple-500 bg-purple-50 dark:bg-purple-900/20':
              formData.deploymentType === type,
            'border-gray-300 dark:border-gray-600 hover:border-purple-400 dark:hover:border-purple-400 hover:bg-purple-50/50 dark:hover:bg-purple-900/10':
              formData.deploymentType !== type,
          }" tabindex="0" role="radio" :aria-checked="formData.deploymentType === type"
          @click="formData.deploymentType = type as 'cloud' | 'self-host'"
          @keydown.enter="formData.deploymentType = type as 'cloud' | 'self-host'"
          @keydown.space.prevent="formData.deploymentType = type as 'cloud' | 'self-host'">
          <input type="radio" name="deploymentType" :value="type" v-model="formData.deploymentType" class="sr-only" />
          <div class="flex flex-1 items-center justify-between">
            <div class="flex items-center">
              <img src="/coolify-logo-transparent.png" alt="Coolify Self-Hosted" class="w-10 h-10 mr-3" />
              <span class="block text-lg font-medium text-gray-900 dark:text-white">{{ type === "cloud" ? "Cloud" :
                "Self Host" }}</span>
            </div>

            <!-- Check icon for selected state -->
            <div v-if="formData.deploymentType === type" class="flex-shrink-0">
              <CoolIcon class="w-6 h-6" name="meteor-icons:circle-check" color="purple" />
            </div>
          </div>
        </label>
      </div>

      <form v-if="currentStep > 0" @submit.prevent="handleSubmit" class="space-y-6 text-sm">
        <!-- Server URL (Self-hosted only) -->
        <Motion :initial="{ opacity: 0, y: 10 }" :animate="{ opacity: 1, y: 0 }" :exit="{ opacity: 0, y: 10 }"
          :transition="{ duration: 0.5 }">
          <div v-if="!isCloudDeployment && !connected">
            <label for="serverUrl" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Server URL
            </label>
            <input id="serverUrl" v-model="formData.domain" type="url" placeholder="https://your-coolify-instance.com"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              :class="{ 'border-red-500 dark:border-red-400': errors.domain }" @input="errors.domain = ''" />
            <p v-if="errors.domain" class="mt-1 text-sm text-red-600 dark:text-red-400">
              {{ errors.domain }}
            </p>
          </div>
        </Motion>

        <!-- API Token -->
        <Motion :initial="{ opacity: 0, y: 10 }" :animate="{ opacity: 1, y: 0 }" :exit="{ opacity: 0, y: 10 }"
          :transition="{ duration: 0.5 }">
          <div v-if="!connected">
            <label for="apiKey" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              API Token
            </label>
            <div class="flex gap-2">
              <div class="relative flex-1">
                <input ref="apiKeyInput" id="apiKey" v-model="formData.apiKey"
                  :type="isPasswordVisible ? 'text' : 'password'" placeholder="Enter your API key"
                  class="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                  :class="{ 'border-red-500 dark:border-red-400': errors.apiKey }" @input="errors.apiKey = ''" />
                <button type="button"
                  class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 dark:text-gray-500 hover:text-purple-600 dark:hover:text-purple-400 focus:outline-none transition-colors duration-200"
                  @click="togglePasswordVisibility" @keydown.enter="togglePasswordVisibility"
                  @keydown.space.prevent="togglePasswordVisibility"
                  :aria-label="isPasswordVisible ? 'Hide password' : 'Show password'">
                  <CoolIcon class="w-5 h-5" :name="isPasswordVisible ? 'mdi:eye-off' : 'mdi:eye'"
                    color="currentColor" />
                </button>
              </div>
            </div>
            <p v-if="errors.apiKey" class="mt-1 text-sm text-red-600 dark:text-red-400">
              {{ errors.apiKey }}
            </p>
          </div>
        </Motion>

        <!-- Server Selection -->
        <Motion :initial="{ opacity: 0, y: 10 }" :animate="{ opacity: 1, y: 0 }" :exit="{ opacity: 0, y: 10 }"
          :transition="{ duration: 0.5 }">
          <div v-if="connected && currentStep === 2" class="space-y-2">
            <label for="serverId" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Available Servers
            </label>
            <select id="serverId" v-model="formData.serverId" placeholder="Select a server"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              :class="{ 'border-red-500 dark:border-red-400': errors.serverId }">
              <option value="" class="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
                Select a server
              </option>
              <option v-for="server in serverOptions" :key="server.uuid" :value="server.uuid"
                class="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
                {{ server.name }}
              </option>
            </select>
            <p v-if="errors.serverId" class="mt-1 text-sm text-red-600 dark:text-red-400">
              {{ errors.serverId }}
            </p>
          </div>
        </Motion>
      </form>

      <div v-if="currentStep === 3" class="space-y-2">
        <Motion
          :initial="{ opacity: 0, y: 10 }"
          :animate="{ opacity: 1, y: 0 }"
          :exit="{ opacity: 0, y: 10 }"
          :transition="{ duration: 0.5 }"
        >
          <p class="text-gray-900 dark:text-white">Preparing to deploy...</p>
        </Motion>
        <ul>
          <Motion v-show="currentStep === 3 && (projectStatus === 'pending' || projectStatus === 'success')"
            :initial="{ opacity: 0, y: 10 }" :animate="{ opacity: 1, y: 0 }" :exit="{ opacity: 0, y: 10 }"
            :transition="{ duration: 0.5 }">
            <li class="flex items-center gap-2">
              <CoolIcon class="w-4 h-4"
                :name="projectStatus === 'pending' ? 'line-md:loading-twotone-loop' : 'meteor-icons:circle-check'"
                :color="projectStatus === 'pending' ? 'gray' : 'green'" />
              <span class="text-gray-900 dark:text-white">Creating new Project...</span>
            </li>
          </Motion>
          <Motion v-show="currentStep === 3 && (serviceStatus === 'pending' || serviceStatus === 'success')"
            :initial="{ opacity: 0, y: 10 }" :animate="{ opacity: 1, y: 0 }" :exit="{ opacity: 0, y: 10 }"
            :transition="{ duration: 0.5 }">
            <li class="flex items-center gap-2">
              <CoolIcon class="w-4 h-4"
                :name="serviceStatus === 'pending' ? 'line-md:loading-twotone-loop' : 'meteor-icons:circle-check'"
                :color="serviceStatus === 'pending' ? 'gray' : 'green'" />
              <span class="text-gray-900 dark:text-white">Creating new Service...</span>
            </li>
          </Motion>
          <Motion v-show="currentStep === 3 && (deployStatus === 'pending' || deployStatus === 'success')"
            :initial="{ opacity: 0, y: 10 }" :animate="{ opacity: 1, y: 0 }" :exit="{ opacity: 0, y: 10 }"
            :transition="{ duration: 0.5 }">
            <li class="flex items-center gap-2">
              <CoolIcon class="w-4 h-4"
                :name="deployStatus === 'pending' ? 'line-md:loading-twotone-loop' : 'meteor-icons:circle-check'"
                :color="deployStatus === 'pending' ? 'gray' : 'green'" />
              <span class="text-gray-900 dark:text-white">Deploying Service...</span>
            </li>
          </Motion>
        </ul>
      </div>

      <div v-if="currentStep === 4" class="space-y-2">
        <Motion :initial="{ opacity: 0, y: 10 }" :animate="{ opacity: 1, y: 0 }" :exit="{ opacity: 0, y: -10 }"
          :transition="{ duration: 0.5 }">
          <div class="flex flex-col gap-2">
            <Motion :initial="{ opacity: 0, y: 10 }" :animate="{ opacity: 1, y: 0 }" :exit="{ opacity: 0, y: -10 }"
              :transition="{ duration: 0.5 }" delay={0.5}>
              <CoolIcon class="w-10 h-10 mx-auto" name="meteor-icons:circle-check" color="green" />
            </Motion>
            <Motion :initial="{ opacity: 0, y: 10 }" :animate="{ opacity: 1, y: 0 }" :exit="{ opacity: 0, y: -10 }"
              :transition="{ duration: 0.5 }" delay={0.5}>
              <div class="flex flex-col items-center gap-2">
                <p class="text-gray-900 dark:text-white">Your service is being deployed at:</p>
                <a :href="serviceUrl" target="_blank" rel="noopener noreferrer"
                  class="text-blue-500 hover:text-blue-600 underline focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 rounded"
                  :aria-label="`Open ${serviceUrl} in new tab`">
                  {{ serviceUrl }}
                </a>
              </div>
            </Motion>
          </div>
        </Motion>
      </div>

      <div class="flex items-center justify-end gap-3 mt-6">
        <button v-if="currentStep > 0 && currentStep < 4" @click="goBack" @keydown.enter="goBack"
          @keydown.space.prevent="goBack"
          class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-black border border-gray-400 dark:border-gray-200 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800">
          Back
        </button>
        <button v-if="currentStep === 4" @click="handleClose" @keydown.enter="handleClose"
          @keydown.space.prevent="handleClose"
          class="px-4 py-2 text-sm font-medium text-white bg-purple-600 border border-transparent rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed">
          Finish
        </button>
        <button v-if="currentStep === 0" @click="currentStep++" @keydown.enter="currentStep++"
          @keydown.space.prevent="currentStep++"
          class="px-4 py-2 text-sm font-medium text-white bg-purple-600 border border-transparent rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed">
          Next
        </button>
        <button v-else-if="currentStep === 1 && !connected" @click="handleConnect" @keydown.enter="handleConnect"
          @keydown.space.prevent="handleConnect" :disabled="status === 'pending' || formData.apiKey?.length < 4"
          class="px-4 py-2 text-sm font-medium text-white bg-purple-600 border border-transparent rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed">
          <span v-if="status === 'pending'">Verifying...</span>
          <span v-else>Verify</span>
        </button>
        <button v-else-if="connected && formData.serverId && currentStep <= 3" @click.prevent="deployFunc"
          @keydown.enter.prevent="deployFunc" @keydown.space.prevent="deployFunc" :disabled="isSubmitting"
          class="px-4 py-2 text-sm font-medium text-white bg-purple-600 border border-transparent rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed">
          <span v-if="isSubmitting">Creating...</span>
          <span v-else>Create Service</span>
        </button>
      </div>
    </div>
  </Modal>
</template>

<style scoped>
/* Custom radio button styling */
input[type="radio"]:checked+span {
  @apply border-blue-500;
}
</style>
