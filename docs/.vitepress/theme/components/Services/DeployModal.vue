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

interface Environment {
  id: number;
  uuid?: string; // Add optional UUID field
  name: string;
  project_id: number;
  created_at: string;
  updated_at: string;
  description: string;
}

interface Project {
  id: number;
  uuid: string;
  name: string;
  description: string;
  environments: Environment[];
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
const projectOptions = ref<Project[]>([]);
const environmentOptions = ref<Environment[]>([]);
const selectedProject = ref<Project | null>(null);
const selectedEnvironment = ref<Environment | null>(null);
const showCreateProject = ref(false);
const currentStep = ref(0);
const apiKeyInput = ref<HTMLInputElement>();
const serviceUrl = ref('');
const isPasswordVisible = ref(false);
const isLoadingServers = ref(false);
const isLoadingProjects = ref(false);
const isLoadingEnvironments = ref(false);
const newProjectName = ref('');
const newProjectDescription = ref('');
const newEnvironmentName = ref('');
const newEnvironmentDescription = ref('');
const serviceUuid = ref('');
const environmentUuid = ref('');
const selectedEnvironmentUuid = ref(''); // For v-model binding
const coolifyVersion = ref('');
const supportsEnvironmentCreation = ref(false);

const {
  connect,
  status,
  projectStatus,
  serviceStatus,
  deployStatus,
  deploy,
  fetchProjects,
  fetchProjectDetails,
  fetchVersion,
  createProject,
} = useCoolFetch();

// Form data
const formData = ref({
  deploymentType: "cloud" as "cloud" | "self-host",
  domain: "",
  serverId: "",
  apiKey: "",
  projectId: "",
  environmentId: "",
});

// Form validation
const errors = ref<Record<string, string>>({});
const isSubmitting = ref(false);
const hasInteracted = ref(false);

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

  if (hasInteracted.value && !formData.value.serverId.trim()) {
    errors.value.serverId = "Server selection is required";
  }

  if (currentStep.value >= 3 && !formData.value.projectId.trim()) {
    errors.value.projectId = "Project selection is required";
  }

  if (currentStep.value >= 4 && !formData.value.environmentId.trim()) {
    errors.value.environmentId = "Environment selection is required";
  }

  if (!isCloudDeployment.value) {
    if (!formData.value.domain.trim()) {
      errors.value.domain = "Coolify URL is required";
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

// Version comparison helper
const compareVersions = (version: string, targetVersion: string): boolean => {
  // Clean up version strings (remove 'v' prefix if present)
  const cleanVersion = version.replace(/^v/, '');
  const cleanTarget = targetVersion.replace(/^v/, '');

  // Split versions into parts
  const versionParts = cleanVersion.split(/[\.\-]/);
  const targetParts = cleanTarget.split(/[\.\-]/);

  // Compare major.minor.patch
  for (let i = 0; i < 3; i++) {
    const vNum = parseInt(versionParts[i] || '0');
    const tNum = parseInt(targetParts[i] || '0');

    if (vNum > tNum) return true;
    if (vNum < tNum) return false;
  }

  // If major.minor.patch are equal, compare beta versions
  const versionBeta = cleanVersion.includes('beta');
  const targetBeta = cleanTarget.includes('beta');

  if (!versionBeta && targetBeta) return true; // release > beta
  if (versionBeta && !targetBeta) return false; // beta < release

  if (versionBeta && targetBeta) {
    // Both are beta, compare beta numbers
    const vBetaMatch = cleanVersion.match(/beta\.(\d+)/);
    const tBetaMatch = cleanTarget.match(/beta\.(\d+)/);

    const vBetaNum = vBetaMatch ? parseInt(vBetaMatch[1]) : 0;
    const tBetaNum = tBetaMatch ? parseInt(tBetaMatch[1]) : 0;

    if (vBetaNum > tBetaNum) return true;
    if (vBetaNum < tBetaNum) return false;

    // If beta numbers are equal, compare the final number (e.g., .7 in beta.420.7)
    const vFinalMatch = cleanVersion.match(/beta\.\d+\.(\d+)/);
    const tFinalMatch = cleanTarget.match(/beta\.\d+\.(\d+)/);

    const vFinalNum = vFinalMatch ? parseInt(vFinalMatch[1]) : 0;
    const tFinalNum = tFinalMatch ? parseInt(tFinalMatch[1]) : 0;

    return vFinalNum >= tFinalNum;
  }

  return true; // Equal versions
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

const checkVersion = async () => {
  try {
    const version = await fetchVersion();
    if (version instanceof Error) {
      // If version check fails, assume it's an older version and disable environment creation
      coolifyVersion.value = '';
      supportsEnvironmentCreation.value = false;
      return;
    }

    coolifyVersion.value = version;
    // Check if version is >= 4.0.0-beta.420.7
    supportsEnvironmentCreation.value = compareVersions(version, '4.0.0-beta.420.7');
  } catch (error) {
    // If version check fails, assume it's an older version and disable environment creation
    coolifyVersion.value = '';
    supportsEnvironmentCreation.value = false;
  }
};

const handleConnect = async () => {
  isLoadingServers.value = true;
  try {
    validateForm();
    const data = await connect(formData.value.domain, formData.value.apiKey);
    if (data instanceof Error) {
      // Handle different types of errors with user-friendly messages
      if (data.message.includes('401') || data.message.includes('403') ||
        data.message.includes('Unauthorized') || data.message.includes('Forbidden')) {
        errors.value.apiKey = 'Invalid API key or insufficient permissions';
      } else if (data.message.includes('404') || data.message.includes('Not Found')) {
        errors.value.domain = 'Invalid Coolify URL - API endpoints not found. Please verify this is a Coolify instance.';
      } else if (data.message.includes('NetworkError') || data.message.includes('Failed to fetch') || 
                 data.message.includes('ERR_NETWORK') || data.message.includes('CONNECTION_REFUSED')) {
        errors.value.domain = 'Cannot connect to the URL. Please check the URL and ensure the server is accessible.';
      } else if (data.message.includes('CORS') || data.message.includes('Cross-Origin')) {
        errors.value.domain = 'CORS error - the Coolify instance may not be configured to allow requests from this domain.';
      } else if (data.message.includes('500') || data.message.includes('Internal Server Error')) {
        errors.value.domain = 'Server error - the Coolify instance is experiencing issues. Please try again later.';
      } else if (data.message.includes('Unexpected token') || data.message.includes('JSON')) {
        errors.value.domain = 'Invalid response from server - this may not be a Coolify instance or the API is not available.';
      } else {
        // Generic error handling
        errors.value.domain = `Connection failed: ${data.message}`;
      }
      isLoadingServers.value = false;
      return; // Block progression
    }

    serverOptions.value = data;
    connected.value = true;

    // Check version after successful connection
    await checkVersion();

    currentStep.value++;
  } catch (error) {
    if (error instanceof Error) {
      // Handle different types of errors with user-friendly messages
      if (error.message.includes('401') || error.message.includes('403') ||
        error.message.includes('Unauthorized') || error.message.includes('Forbidden')) {
        errors.value.apiKey = 'Invalid API key or insufficient permissions';
      } else if (error.message.includes('404') || error.message.includes('Not Found')) {
        errors.value.domain = 'Invalid Coolify URL - API endpoints not found. Please verify this is a Coolify instance.';
      } else if (error.message.includes('NetworkError') || error.message.includes('Failed to fetch') || 
                 error.message.includes('ERR_NETWORK') || error.message.includes('CONNECTION_REFUSED')) {
        errors.value.domain = 'Cannot connect to the URL. Please check the URL and ensure the server is accessible.';
      } else if (error.message.includes('CORS') || error.message.includes('Cross-Origin')) {
        errors.value.domain = 'CORS error - the Coolify instance may not be configured to allow requests from this domain.';
      } else if (error.message.includes('500') || error.message.includes('Internal Server Error')) {
        errors.value.domain = 'Server error - the Coolify instance is experiencing issues. Please try again later.';
      } else if (error.message.includes('Unexpected token') || error.message.includes('JSON')) {
        errors.value.domain = 'Invalid response from server - this may not be a Coolify instance or the API is not available.';
      } else {
        // Generic error handling
        errors.value.domain = `Connection failed: ${error.message}`;
      }
    } else {
      // Handle non-Error objects
      errors.value.domain = 'An unexpected error occurred while connecting to the Coolify instance.';
    }
  } finally {
    isLoadingServers.value = false;
  }
};

const loadProjects = async () => {
  isLoadingProjects.value = true;
  try {
    const data = await fetchProjects();
    if (data instanceof Error) {
      errors.value.projects = data.message;
      return;
    }
    projectOptions.value = data;
  } catch (error) {
    errors.value.projects = 'Failed to load projects';
  } finally {
    isLoadingProjects.value = false;
  }
};

const loadEnvironments = async (projectUuid: string) => {
  isLoadingEnvironments.value = true;
  environmentOptions.value = [];
  try {
    const data = await fetchProjectDetails(projectUuid);
    if (data instanceof Error) {
      errors.value.environments = data.message;
      return;
    }
    environmentOptions.value = data.environments || [];
  } catch (error) {
    errors.value.environments = 'Failed to load environments';
  } finally {
    isLoadingEnvironments.value = false;
  }
};

const handleProjectSelect = async (projectId: string) => {
  const project = projectOptions.value.find(p => p.uuid === projectId);
  selectedProject.value = project || null;
  formData.value.projectId = projectId;

  if (projectId && projectId !== 'create-new') {
    await loadEnvironments(projectId);
  } else {
    environmentOptions.value = [];
    selectedEnvironment.value = null;
    selectedEnvironmentUuid.value = '';
    formData.value.environmentId = '';
  }
};

const handleEnvironmentSelect = (environmentIdOrUuid: string) => {
  if (environmentIdOrUuid === 'create-new') {
    if (!supportsEnvironmentCreation.value) {
      // Fallback for older versions - just use 'production' environment name
      formData.value.environmentId = 'production';
      selectedEnvironment.value = null;
      selectedEnvironmentUuid.value = '';
      return;
    }
    selectedEnvironment.value = null;
    selectedEnvironmentUuid.value = 'create-new';
    formData.value.environmentId = environmentIdOrUuid;
    return;
  }

  // Find environment by UUID first, then by ID as fallback
  const environment = environmentOptions.value.find(e =>
    (e.uuid && e.uuid === environmentIdOrUuid) ||
    e.id.toString() === environmentIdOrUuid
  );
  selectedEnvironment.value = environment || null;

  // Store the environment name for deployment (API expects name, not UUID)
  if (environment) {
    formData.value.environmentId = environment.name;
    selectedEnvironmentUuid.value = environment.uuid || environment.id.toString();
  } else {
    formData.value.environmentId = environmentIdOrUuid; // fallback
    selectedEnvironmentUuid.value = environmentIdOrUuid;
  }

};

const handleCreateEnvironment = () => {
  if (!newEnvironmentName.value.trim()) {
    errors.value.environmentName = 'Environment name is required';
    return;
  }

  // For environments, we just set the name and proceed - the environment will be created
  // implicitly when the service is deployed with this environment name
  formData.value.environmentId = newEnvironmentName.value;

  // Create a mock environment object for UI purposes
  const newEnv: Environment = {
    id: 0, // Will be assigned by API
    name: newEnvironmentName.value,
    project_id: selectedProject.value?.id || 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    description: newEnvironmentDescription.value
  };

  selectedEnvironment.value = newEnv;
  environmentOptions.value.push(newEnv);

  // Reset form
  newEnvironmentName.value = '';
  newEnvironmentDescription.value = '';
};

const handleCreateProject = async () => {
  if (!newProjectName.value.trim()) {
    errors.value.projectName = 'Project name is required';
    return;
  }

  try {
    const projectUuid = await createProject(newProjectName.value, newProjectDescription.value);
    if (projectUuid instanceof Error) {
      errors.value.projectName = projectUuid.message;
      return;
    }

    // Refresh projects list
    await loadProjects();

    // Select the newly created project
    formData.value.projectId = projectUuid;
    const project = projectOptions.value.find(p => p.uuid === projectUuid);
    selectedProject.value = project || null;
    showCreateProject.value = false;
    newProjectName.value = '';
    newProjectDescription.value = '';

    // Load environments for the new project
    await loadEnvironments(projectUuid);
  } catch (error) {
    errors.value.projectName = 'Failed to create project';
  }
};

const handleServerSelect = async () => {
  if (!formData.value.serverId) {
    errors.value.serverId = 'Please select a server';
    return;
  }
  // Load projects when server is selected
  await loadProjects();
  currentStep.value++;
  hasInteracted.value = false;
};

const deployFunc = async () => {
  try {
    if (!formData.value.serverId) {
      throw new Error('No server selected');
    }

    if (!props.selectedService) {
      throw new Error('Service is not selected');
    }

    if (!formData.value.projectId) {
      throw new Error('No project selected');
    }

    if (!formData.value.environmentId) {
      throw new Error('No environment selected');
    }

    currentStep.value++;
    const data = await deploy(
      formData.value.serverId,
      props.selectedService.toLowerCase(),
      formData.value.projectId,
      formData.value.environmentId
    );

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

      // Capture service metadata for dashboard URL
      if (data.serviceUuid) {
        serviceUuid.value = data.serviceUuid;
      }
      if (data.projectUuid) {
        // Store the project UUID returned from deployment (might be different from selected if new project was created)
        formData.value.projectId = data.projectUuid;
      }
      if (data.environmentName) {
        // Store the environment name used in deployment
        formData.value.environmentId = data.environmentName;
      }
      // Check if API response has a valid UUID format (not just environment name)
      const isValidUuid = (uuid) => {
        const uuidRegex = /^[0-9a-f]{8}-?[0-9a-f]{4}-?[0-9a-f]{4}-?[0-9a-f]{4}-?[0-9a-f]{12}$/i;
        const coolifyUuidRegex = /^[a-z0-9]{24,32}$/i; // Coolify's custom UUID format
        return uuidRegex.test(uuid) || coolifyUuidRegex.test(uuid);
      };

      if (data.environmentUuid && isValidUuid(data.environmentUuid)) {
        // Store the environment UUID for dashboard URL (only if it's a valid UUID)
        environmentUuid.value = data.environmentUuid;
      } else if (selectedEnvironment.value?.uuid) {
        // Fallback: use the selected environment's UUID if available
        environmentUuid.value = selectedEnvironment.value.uuid;
      } else if (selectedEnvironment.value?.id) {
        // Secondary fallback: use the selected environment's ID if no UUID
        environmentUuid.value = selectedEnvironment.value.id.toString();
      } else {
        // Last fallback: use the environment name (current behavior)
        environmentUuid.value = formData.value.environmentId;
      }

      currentStep.value++;
    } else {
      throw new Error('Failed to get deployment URL');
    }
  } catch (error) {
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
  projectOptions.value = [];
  environmentOptions.value = [];
  selectedProject.value = null;
  selectedEnvironment.value = null;
  selectedEnvironmentUuid.value = '';
  showCreateProject.value = false;
  newProjectName.value = '';
  newProjectDescription.value = '';
  newEnvironmentName.value = '';
  newEnvironmentDescription.value = '';
  serviceUuid.value = '';
  environmentUuid.value = '';
  coolifyVersion.value = '';
  supportsEnvironmentCreation.value = false;
  formData.value = {
    deploymentType: "cloud" as "cloud" | "self-host",
    domain: "",
    serverId: "",
    apiKey: "",
    projectId: "",
    environmentId: "",
  };
  errors.value = {};
  isSubmitting.value = false;
  hasInteracted.value = false;
};

const goBack = () => {
  if (currentStep.value === 3) {
    // Going back from project selection to server selection
    projectOptions.value = [];
    environmentOptions.value = [];
    selectedProject.value = null;
    selectedEnvironment.value = null;
    selectedEnvironmentUuid.value = '';
    formData.value.projectId = "";
    formData.value.environmentId = "";
    showCreateProject.value = false;
  } else if (currentStep.value === 4) {
    // Going back from environment selection to project selection  
    environmentOptions.value = [];
    selectedEnvironment.value = null;
    selectedEnvironmentUuid.value = '';
    formData.value.environmentId = "";
  } else if (currentStep.value === 2) {
    // Going back from server selection to API key
    connected.value = false;
    serverOptions.value = [];
    formData.value.serverId = "";
    hasInteracted.value = false;
  }

  currentStep.value--;
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
    // Don't auto-focus on step 6 (final success step) to avoid focusing the URL link
    const autoFocus = !(oldStep > 0 && newStep === 0) && newStep !== 6
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
    projectOptions.value = [];
    environmentOptions.value = [];
    selectedProject.value = null;
    selectedEnvironment.value = null;
    selectedEnvironmentUuid.value = '';
    showCreateProject.value = false;
    newProjectName.value = '';
    newProjectDescription.value = '';
    newEnvironmentName.value = '';
    newEnvironmentDescription.value = '';
    serviceUuid.value = '';
    environmentUuid.value = '';
    coolifyVersion.value = '';
    supportsEnvironmentCreation.value = false;
    formData.value = {
      deploymentType: "cloud" as "cloud" | "self-host",
      domain: "",
      serverId: "",
      apiKey: "",
      projectId: "",
      environmentId: "",
    };
    errors.value = {};
    isSubmitting.value = false;
    hasInteracted.value = false;
  }
})
</script>

<template>
  <Modal ref="modalRef" :show="show" :title="`Deploy ${selectedService || 'Service'} on`" size="xl"
    @close="handleClose">
    <div class="w-full">
      <div v-if="currentStep === 0" class="w-full justify-between flex gap-2">
        <label v-for="type in ['cloud', 'self-host']" :key="type"
          class="relative w-full flex cursor-pointer rounded-lg border bg-white dark:bg-black p-4 shadow-sm focus:outline-none focus:ring-2 focus:ring-coollabs focus:border-coollabs transition-all duration-200"
          :class="{
            'ring-2 ring-coollabs border-coollabs ':
              formData.deploymentType === type,
            'border-gray-300 dark:border-gray-600 hover:border-coollabs dark:hover:border-coollabs ':
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
                "Self-hosted" }}</span>
            </div>
          </div>
        </label>
      </div>


      <!-- Selection Summary -->
      <div v-if="currentStep > 0" class="mb-6 p-4 bg-gray-50 dark:bg-coolgray-100 rounded-lg">

        <div class="space-y-2">
          <div v-if="formData.deploymentType" class="flex items-center gap-2">
            <span class="text-xs text-gray-500 dark:text-gray-400 w-20">Type:</span>
            <span class="text-sm text-gray-900 dark:text-white font-medium">{{ formData.deploymentType === 'cloud' ?
              'Cloud' : 'Self-hosted' }}</span>
          </div>
          <div v-if="formData.domain && !isCloudDeployment" class="flex items-center gap-2">
            <span class="text-xs text-gray-500 dark:text-gray-400 w-20">URL:</span>
            <span class="text-sm text-gray-900 dark:text-white">{{ formData.domain }}</span>
          </div>
          <div v-if="selectedServer && currentStep >= 3" class="flex items-center gap-2">
            <span class="text-xs text-gray-500 dark:text-gray-400 w-20">Server:</span>
            <span class="text-sm text-gray-900 dark:text-white font-medium">{{ selectedServer.name }}</span>
          </div>
          <div v-if="selectedProject && currentStep >= 4" class="flex items-center gap-2">
            <span class="text-xs text-gray-500 dark:text-gray-400 w-20">Project:</span>
            <span class="text-sm text-gray-900 dark:text-white font-medium">{{ selectedProject.name }}</span>
          </div>
          <div v-if="selectedEnvironment && currentStep >= 5" class="flex items-center gap-2">
            <span class="text-xs text-gray-500 dark:text-gray-400 w-20">Environment:</span>
            <span class="text-sm text-gray-900 dark:text-white font-medium">{{ selectedEnvironment.name }}</span>
          </div>
        </div>
      </div>

      <form v-if="currentStep > 0" @submit.prevent="handleSubmit" class="space-y-6 text-sm">
        <!-- Coolify URL (Self-hosted only) -->
        <Motion :initial="{ opacity: 0, y: 10 }" :animate="{ opacity: 1, y: 0 }" :exit="{ opacity: 0, y: 10 }"
          :transition="{ duration: 0.5 }">
          <div v-if="!isCloudDeployment && !connected">
            <label for="serverUrl" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Coolify URL
            </label>
            <input id="serverUrl" v-model="formData.domain" type="url" placeholder="https://your-coolify-instance.com"
              class="input" :class="{ 'border-red-500 dark:border-red-400': errors.domain }"
              @input="errors.domain = ''" />
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
                  :type="isPasswordVisible ? 'text' : 'password'" placeholder="Enter your API key" class="input"
                  :class="{ 'border-red-500 dark:border-red-400': errors.apiKey }" @input="errors.apiKey = ''" />
                <button type="button"
                  class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 dark:text-gray-500 hover:text-coollabs dark:hover:text-coollabs focus:outline-none transition-colors duration-200"
                  @click="togglePasswordVisibility" @keydown.enter="togglePasswordVisibility"
                  @keydown.space.prevent="togglePasswordVisibility"
                  :aria-label="isPasswordVisible ? 'Hide password' : 'Show password'">
                  <CoolIcon class="w-5 h-5" :name="isPasswordVisible ? 'mdi:eye-off' : 'mdi:eye'"
                    color="currentColor" />
                </button>
              </div>
            </div>
            <p v-if="errors.apiKey" class="my-2 text-sm text-red-600 dark:text-red-400">
              {{ errors.apiKey }}
            </p>

            <div class="mt-2 space-y-1">
              <p class="text-gray-500 dark:text-gray-400 text-xs">
                Note: Make sure you have the read and write permissions for the API Token.
              </p>
              <p class="text-gray-500 dark:text-gray-400 text-xs">We do not store your token,
                everything is handled in your browser.
              </p>
              <p v-if="isCloudDeployment || (!isCloudDeployment && formData.domain.trim() && isValidUrl(formData.domain))"
                class="text-xs">
                <a :href="`${isCloudDeployment ? 'https://app.coolify.io' : formData.domain}/security/api-tokens`"
                  target="_blank" rel="noopener noreferrer"
                  class="text-purple-500 hover:text-purple-600 underline inline-flex items-center gap-1">
                  Generate new API token
                  <CoolIcon class="w-3 h-3" name="mdi:external-link" color="currentColor" />
                </a>
              </p>
            </div>
          </div>
        </Motion>

        <!-- Server Selection -->
        <Motion :initial="{ opacity: 0, y: 10 }" :animate="{ opacity: 1, y: 0 }" :exit="{ opacity: 0, y: 10 }"
          :transition="{ duration: 0.5 }">
          <div v-if="(connected && currentStep === 2) || (isLoadingServers && currentStep === 1)" class="space-y-2">
            <label for="serverId" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Available Servers
            </label>

            <div v-if="isLoadingServers" class="flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <CoolIcon class="w-4 h-4" name="line-md:loading-twotone-loop" color="gray" />
              <span>Loading servers...</span>
            </div>

            <select v-else-if="connected && !isLoadingServers" id="serverId" v-model="formData.serverId"
              placeholder="Select a server" class="input"
              :class="{ 'border-red-500 dark:border-red-400': errors.serverId }"
              @change="hasInteracted = true">
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

        <!-- Project Selection -->
        <Motion :initial="{ opacity: 0, y: 10 }" :animate="{ opacity: 1, y: 0 }" :exit="{ opacity: 0, y: 10 }"
          :transition="{ duration: 0.5 }">
          <div v-if="currentStep === 3" class="space-y-4">
            <label for="projectId" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Available Projects
            </label>

            <div v-if="isLoadingProjects" class="flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <CoolIcon class="w-4 h-4" name="line-md:loading-twotone-loop" color="gray" />
              <span>Loading projects...</span>
            </div>

            <div v-else class="space-y-2">
              <select id="projectId" v-model="formData.projectId"
                @change="handleProjectSelect($event.target.value)"
                class="input" :class="{ 'border-red-500 dark:border-red-400': errors.projectId }">
                <option value="" class="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
                  Select a project
                </option>
                <option v-for="project in projectOptions" :key="project.uuid" :value="project.uuid"
                  class="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
                  {{ project.name }}
                </option>
                <option value="create-new" class="bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-medium">
                  + Create New Project
                </option>
              </select>

              <p v-if="errors.projectId" class="mt-1 text-sm text-red-600 dark:text-red-400">
                {{ errors.projectId }}
              </p>
              <p v-if="errors.projects" class="mt-1 text-sm text-red-600 dark:text-red-400">
                {{ errors.projects }}
              </p>
            </div>

            <!-- Create New Project Form -->
            <div v-if="formData.projectId === 'create-new'"
              class="space-y-3 py-4 bg-white dark:bg-black rounded-md mt-4 ">
              <div>
                <label for="projectName" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Project Name *
                </label>
                <input id="projectName" v-model="newProjectName" type="text" placeholder="Enter project name"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  :class="{ 'border-red-500 dark:border-red-400': errors.projectName }"
                  @input="errors.projectName = ''" />
                <p v-if="errors.projectName" class="mt-1 text-sm text-red-600 dark:text-red-400">
                  {{ errors.projectName }}
                </p>
              </div>

              <div>
                <label for="projectDescription" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description
                </label>
                <textarea id="projectDescription" v-model="newProjectDescription" rows="2"
                  placeholder="Enter project description (optional)"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white resize-none">
                </textarea>
              </div>

              <div class="flex gap-2">
                <button @click="handleCreateProject" :disabled="projectStatus === 'pending'"
                  class="px-3 py-2 text-sm font-medium text-white bg-coollabs border border-transparent rounded-md hover:bg-coollabs-100 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed">
                  <span v-if="projectStatus === 'pending'">Creating...</span>
                  <span v-else>Create Project</span>
                </button>
                <button @click="formData.projectId = ''; showCreateProject = false"
                  class="px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </Motion>

        <!-- Environment Selection -->
        <Motion :initial="{ opacity: 0, y: 10 }" :animate="{ opacity: 1, y: 0 }" :exit="{ opacity: 0, y: 10 }"
          :transition="{ duration: 0.5 }">
          <div v-if="currentStep === 4" class="space-y-2">
            <label for="environmentId" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Available Environments
            </label>
            <div v-if="isLoadingEnvironments" class="flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <CoolIcon class="w-4 h-4" name="line-md:loading-twotone-loop" color="gray" />
              <span>Loading environments...</span>
            </div>

            <div v-else class="space-y-2">
              <select id="environmentId" v-model="selectedEnvironmentUuid"
                @change="handleEnvironmentSelect($event.target.value)"
                class="input" :class="{ 'border-red-500 dark:border-red-400': errors.environmentId }">
                <option value="" class="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
                  Select an environment
                </option>
                <option v-for="environment in environmentOptions" :key="environment.uuid || environment.id"
                  :value="environment.uuid || environment.id.toString()"
                  class="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
                  {{ environment.name }}
                </option>
                <option v-if="supportsEnvironmentCreation" value="create-new"
                  class="bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-medium">
                  + Create New Environment
                </option>
              </select>

              <p v-if="errors.environmentId" class="mt-1 text-sm text-red-600 dark:text-red-400">
                {{ errors.environmentId }}
              </p>
              <p v-if="errors.environments" class="mt-1 text-sm text-red-600 dark:text-red-400">
                {{ errors.environments }}
              </p>

              <p v-if="environmentOptions.length === 0 && !isLoadingEnvironments"
                class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                No environments found for this project.
              </p>
            </div>

            <!-- Create New Environment Form -->
            <div v-if="formData.environmentId === 'create-new'"
              class="space-y-3 py-4 bg-white dark:bg-black rounded-md mt-4 ">

              <div>
                <label for="environmentName" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Environment Name *
                </label>
                <input id="environmentName" v-model="newEnvironmentName" type="text"
                  placeholder="Enter environment name (e.g., staging, development)"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  :class="{ 'border-red-500 dark:border-red-400': errors.environmentName }"
                  @input="errors.environmentName = ''" />
                <p v-if="errors.environmentName" class="mt-1 text-sm text-red-600 dark:text-red-400">
                  {{ errors.environmentName }}
                </p>
              </div>

              <div>
                <label for="environmentDescription"
                  class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description
                </label>
                <textarea id="environmentDescription" v-model="newEnvironmentDescription" rows="2"
                  placeholder="Enter environment description (optional)"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white resize-none">
                </textarea>
              </div>

              <div class="flex gap-2">
                <button @click="handleCreateEnvironment"
                  class="px-3 py-2 text-sm font-medium text-white bg-coollabs border border-transparent rounded-md hover:bg-coollabs-100 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed">
                  Create Environment
                </button>
                <button @click="formData.environmentId = ''"
                  class="px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </Motion>
      </form>

      <div v-if="currentStep === 5" class="space-y-2">
        <Motion :initial="{ opacity: 0, y: 10 }" :animate="{ opacity: 1, y: 0 }" :exit="{ opacity: 0, y: 10 }"
          :transition="{ duration: 0.5 }">
          <p class="text-gray-900 dark:text-white">Preparing to deploy...</p>
        </Motion>
        <ul>
          <Motion v-show="currentStep === 5 && (projectStatus === 'pending' || projectStatus === 'success')"
            :initial="{ opacity: 0, y: 10 }" :animate="{ opacity: 1, y: 0 }" :exit="{ opacity: 0, y: 10 }"
            :transition="{ duration: 0.5 }">
            <li class="flex items-center gap-2">
              <CoolIcon class="w-4 h-4"
                :name="projectStatus === 'pending' ? 'line-md:loading-twotone-loop' : 'meteor-icons:circle-check'"
                :color="projectStatus === 'pending' ? 'gray' : 'green'" />
              <span class="text-gray-900 dark:text-white">Setting up Project...</span>
            </li>
          </Motion>
          <Motion v-show="currentStep === 5 && (serviceStatus === 'pending' || serviceStatus === 'success')"
            :initial="{ opacity: 0, y: 10 }" :animate="{ opacity: 1, y: 0 }" :exit="{ opacity: 0, y: 10 }"
            :transition="{ duration: 0.5 }">
            <li class="flex items-center gap-2">
              <CoolIcon class="w-4 h-4"
                :name="serviceStatus === 'pending' ? 'line-md:loading-twotone-loop' : 'meteor-icons:circle-check'"
                :color="serviceStatus === 'pending' ? 'gray' : 'green'" />
              <span class="text-gray-900 dark:text-white">Creating new Service...</span>
            </li>
          </Motion>
          <Motion v-show="currentStep === 5 && (deployStatus === 'pending' || deployStatus === 'success')"
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

      <div v-if="currentStep === 6" class="space-y-2">
        <Motion :initial="{ opacity: 0, y: 10 }" :animate="{ opacity: 1, y: 0 }" :exit="{ opacity: 0, y: -10 }"
          :transition="{ duration: 0.5 }">
          <div class="flex flex-col gap-2">
            <Motion :initial="{ opacity: 0, y: 10 }" :animate="{ opacity: 1, y: 0 }" :exit="{ opacity: 0, y: -10 }"
              :transition="{ duration: 0.5 }" delay={0.5}>
              <div class="flex flex-col items-center gap-4">
                <div class="text-center">
                  <p class="text-gray-900 dark:text-white mb-2">Your service is being deployed at:</p>
                  <a :href="serviceUrl" target="_blank" rel="noopener noreferrer"
                    class="text-blue-500 hover:text-blue-600 underline focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 rounded"
                    :aria-label="`Open ${serviceUrl} in new tab`">
                    {{ serviceUrl }}
                  </a>
                  <p class="text-neutral-600 text-sm mt-2">Note: The deployment may take a few minutes
                    to
                    complete.</p>
                </div>

                <div class="text-center">

                  <a :href="`${isCloudDeployment ? 'https://app.coolify.io' : formData.domain}/project/${formData.projectId}/environment/${environmentUuid}/service/${serviceUuid}`"
                    target="_blank" rel="noopener noreferrer"
                    class="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-black dark:text-white hover:text-white border border-coollabs rounded-md hover:bg-coollabs-100 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-colors duration-200">
                    <CoolIcon class="w-4 h-4" name="mdi:external-link" color="currentColor" />
                    Open in Coolify
                  </a>
                </div>
              </div>
            </Motion>
          </div>
        </Motion>
      </div>

      <div class="flex items-center justify-end gap-3 mt-6">
        <button v-if="currentStep > 0 && currentStep < 6" @click="goBack" @keydown.enter="goBack"
          @keydown.space.prevent="goBack"
          class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-black border border-gray-400 dark:border-gray-200 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800">
          Back
        </button>
        <button v-if="currentStep === 6" @click="handleClose" @keydown.enter="handleClose"
          @keydown.space.prevent="handleClose"
          class="px-4 py-2 text-sm font-medium text-white bg-coollabs border border-transparent rounded-md hover:bg-coollabs-100 focus:outline-none focus:ring-2 focus:ring-coollabs focus:ring-offset-2 dark:focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed">
          Finish
        </button>
        <button v-if="currentStep === 0" @click="currentStep++" @keydown.enter="currentStep++"
          @keydown.space.prevent="currentStep++"
          class="px-4 py-2 text-sm font-medium text-white bg-coollabs border border-transparent rounded-md hover:bg-coollabs-100 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed">
          Next
        </button>
        <button v-else-if="currentStep === 1 && !connected" @click="handleConnect" @keydown.enter="handleConnect"
          @keydown.space.prevent="handleConnect" :disabled="status === 'pending' || formData.apiKey?.length < 4"
          class="px-4 py-2 text-sm font-medium text-white bg-coollabs border border-transparent rounded-md hover:bg-coollabs-100 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed">
          <span v-if="status === 'pending'">Verifying...</span>
          <span v-else>Verify</span>
        </button>
        <button v-else-if="currentStep === 2 && connected && formData.serverId" @click="handleServerSelect"
          @keydown.enter="handleServerSelect" @keydown.space.prevent="handleServerSelect"
          class="px-4 py-2 text-sm font-medium text-white bg-coollabs border border-transparent rounded-md hover:bg-coollabs-100 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed">
          Next
        </button>
        <button v-else-if="currentStep === 3 && formData.projectId && formData.projectId !== 'create-new'"
          @click="currentStep++" @keydown.enter="currentStep++" @keydown.space.prevent="currentStep++"
          class="px-4 py-2 text-sm font-medium text-white bg-coollabs border border-transparent rounded-md hover:bg-coollabs-100 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed">
          Next
        </button>
        <button
          v-else-if="currentStep === 4 && formData.projectId && formData.environmentId && formData.environmentId !== 'create-new'"
          @click.prevent="deployFunc" @keydown.enter.prevent="deployFunc" @keydown.space.prevent="deployFunc"
          :disabled="isSubmitting"
          class="px-4 py-2 text-sm font-medium text-white bg-coollabs border border-transparent rounded-md hover:bg-coollabs-100 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed">
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
