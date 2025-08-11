<script setup lang="ts">
import { ref, computed, defineProps } from "vue";
import Modal from "./Modal.vue";
import { useCoolFetch } from "../../composables/coolfetch";

interface ApiConfig {
  deploymentType: "cloud" | "self-host";
  domain: string;
  serverId: string;
  apiKey: string;
}

interface Props {
  show: boolean;
  selectedService: string;
}

const connected = ref(false);
const serverOptions = ref<Array<{ id: string; name: string }>>([]);
const props = defineProps({
  show: {
    type: Boolean,
    required: true,
  },
  selectedService: {
    type: String,
    required: true,
  },
});
const emit = defineEmits<{
  close: [];
  submit: [config: ApiConfig];
}>();

const currentStep = ref(0);
const apiKeyInput = ref<HTMLInputElement>();

const {
  connect,
  status,
  createProject,
  createService,
  createApplication,
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
const isValid = computed(() => {
  if (currentStep.value === 0) {
    return true; // Always valid for step 0 (deployment type selection)
  }
  
  const required = ["apiKey"];
  if (!isCloudDeployment.value) {
    required.push("domain");
  }
  
  if (connected.value) {
    required.push("serverId");
  }

  return required.every(
    (field) => formData.value[field as keyof typeof formData.value]
  );
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
    const config: ApiConfig = {
      deploymentType: formData.value.deploymentType,
      domain: formData.value.domain,
      serverId: formData.value.serverId,
      apiKey: formData.value.apiKey,
    };

    if (formData.value.deploymentType === "cloud") {
      const data = await connect(formData.value.domain, formData.value.apiKey);
      if (data instanceof Error) {
        throw new Error(data.message);
      }
    } else {
      const data = await connect(formData.value.domain, formData.value.apiKey);
      if (data instanceof Error) {
        throw new Error(data.message);
      }
      console.log(data);
    }

    // emit('submit', config)

    // Reset form
    formData.value = {
      deploymentType: "cloud",
      domain: "",
      serverId: "",
      apiKey: "",
    };
    errors.value = {};
  } catch (error) {
    console.error("Failed to submit configuration:", error);
  } finally {
    isSubmitting.value = false;
  }
};

const handleConnect = async () => {
  const data = await connect(formData.value.domain, formData.value.apiKey);
  if (data instanceof Error) {
    throw new Error(data.message);
  }

  serverOptions.value = data;
  connected.value = true;
  currentStep.value++;
};

// Handle modal close
const handleClose = () => {
  // Reset form state
  currentStep.value = 0;
  connected.value = false;
  serverOptions.value = [];
  formData.value = {
    deploymentType: "cloud" as "cloud" | "self-host",
    domain: "https://watch.darweb.nl",
    serverId: "",
    apiKey: "9|hnq.....you-dont-see-this...1241",
  };
  errors.value = {};
  isSubmitting.value = false;
  
  emit("close");
};

const goBack = () => {
  currentStep.value--;
  connected.value = false;
  serverOptions.value = [];
  formData.value.serverId = "";
};
</script>

<template>
  <Modal
    :show="show"
    :title="`Deploy ${selectedService} to`"
    size="xl"
    @close="handleClose"
  >
    <div class="w-full">
      <div v-if="currentStep === 0" class="w-full justify-between flex gap-2">
        <label
          v-for="type in ['cloud', 'self-host']"
          :key="type"
          class="relative w-full flex cursor-pointer rounded-lg border bg-white dark:bg-black p-4 shadow-sm focus:outline-none transition-all duration-200"
          :class="{
            'ring-2 ring-purple-500 border-purple-500 bg-purple-50 dark:bg-purple-900/20':
              formData.deploymentType === type,
            'hover:border-gray-400 dark:hover:border-gray-500':
              formData.deploymentType !== type,
          }"
        >
          <input
            type="radio"
            name="deploymentType"
            :value="type"
            v-model="formData.deploymentType"
            class="sr-only"
          />
          <div class="flex flex-1 items-center justify-between">
            <div class="flex items-center">
              <img
                src="/coolify-logo-transparent.png"
                alt="Coolify Self-Hosted"
                class="w-10 h-10 mr-3"
              />
              <span
                class="block text-lg font-medium text-gray-900 dark:text-white"
                >{{ type === "cloud" ? "Cloud" : "Self Host" }}</span
              >
            </div>

            <!-- Check icon for selected state -->
            <div v-if="formData.deploymentType === type" class="flex-shrink-0">
              <svg
                class="w-6 h-6 text-purple-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fill-rule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
          </div>
        </label>
      </div>

      <form
        v-if="currentStep === 1"
        @submit.prevent="handleSubmit"
        class="space-y-6 text-sm"
      >
        <!-- Deployment Type Selection -->

        <!-- Server URL (Self-hosted only) -->
        <div v-if="!isCloudDeployment && !connected">
          <label
            for="serverUrl"
            class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Server URL
          </label>
          <input
            id="serverUrl"
            v-model="formData.domain"
            type="url"
            placeholder="https://your-coolify-instance.com/v1/api"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            :class="{ 'border-red-500 dark:border-red-400': errors.serverUrl }"
          />
          <p
            v-if="errors.domain"
            class="mt-1 text-sm text-red-600 dark:text-red-400"
          >
            {{ errors.domain }}
          </p>
        </div>

        <!-- API Token -->
        <div v-if="!connected">
          <label
            for="apiKey"
            class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            API Token
          </label>
          <div class="flex gap-2">
            <div class="relative flex-1">
              <input
                ref="apiKeyInput"
                id="apiKey"
                v-model="formData.apiKey"
                type="password"
                placeholder="Enter your API key"
                class="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                :class="{ 'border-red-500 dark:border-red-400': errors.apiKey }"
              />
              <button
                type="button"
                class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
                @click="() => { if (apiKeyInput) apiKeyInput.type = apiKeyInput.type === 'password' ? 'text' : 'password' }"
              >
                <svg
                  class="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              </button>
            </div>
            <!-- <button type="button" @click="handleConnect" class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800">
              Connect
            </button> -->
          </div>
          <p
            v-if="errors.apiKey"
            class="mt-1 text-sm text-red-600 dark:text-red-400"
          >
            {{ errors.apiKey }}
          </p>
        </div>

        <!-- Server Selection -->
        <div v-if="currentStep === 1 && connected" class="space-y-2">
          <label
            for="serverId"
            class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Available Servers
          </label>
          <select
            id="serverId"
            v-model="formData.serverId"
            placeholder="Select a server"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            :class="{ 'border-red-500 dark:border-red-400': errors.serverId }"
          >
            <option
              value=""
              class="bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              Select a server
            </option>
            <option
              v-for="server in serverOptions"
              :key="server.id"
              :value="server.id"
              class="bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              {{ server.name }}
            </option>
          </select>
          <p
            v-if="errors.serverId"
            class="mt-1 text-sm text-red-600 dark:text-red-400"
          >
            {{ errors.serverId }}
          </p>
        </div>
      </form>

      <div class="flex items-center justify-end gap-3 mt-3">
        <button
          v-if="currentStep > 0"
          @click="goBack"
          class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-black border border-gray-400 dark:border-gray-200 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
        >
          Back
        </button>
        <button
          v-if="currentStep === 0"
          @click="currentStep++"
          class="px-4 py-2 text-sm font-medium text-white bg-purple-600 border border-transparent rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
        <button
          v-else-if="currentStep === 1 && !connected"
          @click="handleConnect"
          :disabled="status === 'pending'"
          class="px-4 py-2 text-sm font-medium text-white bg-purple-600 border border-transparent rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span v-if="status === 'pending'">Verifying...</span>
          <span v-else>Verify</span>
        </button>
        <button
          v-else-if="currentStep === 1 && connected"
          @click="handleSubmit"
          :disabled="!isValid || isSubmitting"
          class="px-4 py-2 text-sm font-medium text-white bg-purple-600 border border-transparent rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span v-if="isSubmitting">Creating...</span>
          <span v-else>Create Service</span>
        </button>
      </div>
    </div>
  </Modal>
</template>

<style scoped>
/* Custom radio button styling */
input[type="radio"]:checked + span {
  @apply border-blue-500;
}
</style>
