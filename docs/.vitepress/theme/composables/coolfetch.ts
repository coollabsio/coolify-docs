import { ref } from "vue";

export const useCoolFetch = () => {
    const baseUrl = ref('')
    const apiToken = ref('')
    const coolifyCloudUrl = 'https://app.coolify.io'
    const templateUrl = ref('https://raw.githubusercontent.com/coollabsio/coolify/v4.x/templates/service-templates.json')
    const templates = ref({})
    const connection = ref(false)
    const connected = ref(false)
    const status = ref('')
    const projectStatus = ref('')
    const serviceStatus = ref('')
    const deployStatus = ref('')

    const getServiceTemplate = async (template_name: string) => {
        try {
            if (!template_name) {
                return undefined
            }

            let override = ''
            if (template_name == 'ollama') {
                override = 'ollama-with-open-webui'
            }   
            
            const response = await fetch(templateUrl.value)
            if (!response.ok) {
                throw new Error(`Failed to fetch templates: ${response.status} ${response.statusText}`)
            }
            const data = await response.json()
            templates.value = data
            
            // Try exact match first
            if (templates.value[override ? override : template_name.toLowerCase()]) {
                return templates.value[override ? override : template_name.toLowerCase()]
            }
            
            // Try case-insensitive match
            const templateKey = Object.keys(override ? templates.value[override] : templates.value).find(
                key => key.toLowerCase() === (override ? override : template_name.toLowerCase())
            )
            
            if (templateKey) {
                return override ? templates.value[override] : templates.value[templateKey]
            }
            return undefined
        } catch (error) {
            // console.warn('Error fetching service template:', error)
            throw error
        }
    }

    const coolfetch = (url: string, options: RequestInit) => {
        return fetch(`${baseUrl.value}${url}`, {
            ...options,
            headers: {
                'Authorization': `Bearer ${apiToken.value}`,
                'Agent': 'Coolify.io Docs',
                'Content-Type': 'application/json'
            }
        })
    }

    const connect = async (domain: string, apiKey: string) => {
        try{    
        status.value = 'pending'
        baseUrl.value = domain ? domain : coolifyCloudUrl
        apiToken.value = apiKey
        const response = await coolfetch(
            `/api/v1/servers`,
            {
                method: 'GET'
            }
        )

        // Check if response is ok (status 200-299)
        if (!response.ok) {
            status.value = 'error'
            if (response.status === 401) {
                return new Error('401 Unauthorized - Invalid API key')
            } else if (response.status === 403) {
                return new Error('403 Forbidden - Insufficient permissions')
            } else {
                return new Error(`HTTP ${response.status} - ${response.statusText}`)
            }
        }

        status.value = 'success'
        const data = await response.json()
        if (data.success) {
            connection.value = true
            return data
        }
        return data
    } catch (error) {
        status.value = 'error'
        if (error instanceof Error) {
            return error
        }
        return new Error('Failed to connect')
    }
    }

    const createProject = async (name: string, description: string) => {
        projectStatus.value = 'pending'
        try {
            const response = await coolfetch(`/api/v1/projects`, {
                method: 'POST',
                body: JSON.stringify({
                    name,
                    description
                })
            })
            
            // Check if response is ok (status 200-299)
            if (!response.ok) {
                projectStatus.value = 'error'
                if (response.status === 401) {
                    return new Error('401 Unauthorized - Invalid API key')
                } else if (response.status === 403) {
                    return new Error('403 Forbidden - Insufficient permissions')
                } else {
                    return new Error(`HTTP ${response.status} - ${response.statusText}`)
                }
            }
            
            const data = await response.json()
            if (data.uuid) {
                projectStatus.value = 'success'
                return data.uuid
            } else {
                // console.error('Unexpected response structure:', data)
                return new Error('Invalid response structure from API')
            }
            
        } catch (error) {
            projectStatus.value = 'error'
            // console.error('Error creating project:', error)
            if (error instanceof Error) {
                return error
            }
            return new Error('Failed to create project')
        }
    }

    const createService = async (server_uuid: string, project_uuid: string, template_name: string, environment_name?: string) => {
        serviceStatus.value = 'pending'
        try {
            const templateConfig = await getServiceTemplate(template_name)
            const { slogan, compose } = templateConfig
            
            const response = await coolfetch(`/api/v1/services`, {
                method: 'POST',
                body: JSON.stringify({
                    "name": template_name,
                    "description": slogan,
                    "project_uuid": project_uuid,
                    "environment_name": environment_name || "production",
                    "server_uuid": server_uuid,
                    "environment_uuid": environment_name || "production",
                    "destination_uuid": "production",
                    "instant_deploy": true,
                    "docker_compose_raw": compose
                })
            })

            // Check if response is ok (status 200-299)
            if (!response.ok) {
                serviceStatus.value = 'error'
                if (response.status === 401) {
                    return new Error('401 Unauthorized - Invalid API key')
                } else if (response.status === 403) {
                    return new Error('403 Forbidden - Insufficient permissions')
                } else {
                    return new Error(`HTTP ${response.status} - ${response.statusText}`)
                }
            }

            const data = await response.json()
            if (data.uuid && data.domains.length > 0) {
                serviceStatus.value = 'success'
                return data
            }
            
            return new Error('Failed to create service')
        } catch (error) {
            serviceStatus.value = 'error'
            // console.error('Error creating service:', error)
            if (error instanceof Error) {
                return error
            }
            return new Error('Failed to create service')
        }
    }

    const fetchProjects = async () => {
        try {
            const response = await coolfetch('/api/v1/projects', {
                method: 'GET'
            })
            
            if (!response.ok) {
                if (response.status === 401) {
                    return new Error('401 Unauthorized - Invalid API key')
                } else if (response.status === 403) {
                    return new Error('403 Forbidden - Insufficient permissions')
                } else {
                    return new Error(`HTTP ${response.status} - ${response.statusText}`)
                }
            }
            
            const data = await response.json()
            return data
        } catch (error) {
            if (error instanceof Error) {
                return error
            }
            return new Error('Failed to fetch projects')
        }
    }

    const fetchProjectDetails = async (projectUuid: string) => {
        try {
            const response = await coolfetch(`/api/v1/projects/${projectUuid}`, {
                method: 'GET'
            })
            
            if (!response.ok) {
                if (response.status === 401) {
                    return new Error('401 Unauthorized - Invalid API key')
                } else if (response.status === 403) {
                    return new Error('403 Forbidden - Insufficient permissions')
                } else {
                    return new Error(`HTTP ${response.status} - ${response.statusText}`)
                }
            }
            
            const data = await response.json()
            return data
        } catch (error) {
            if (error instanceof Error) {
                return error
            }
            return new Error('Failed to fetch project details')
        }
    }

    const fetchVersion = async () => {
        try {
            const response = await coolfetch('/api/v1/version', {
                method: 'GET'
            })
            
            if (!response.ok) {
                if (response.status === 401) {
                    return new Error('401 Unauthorized - Invalid API key')
                } else if (response.status === 403) {
                    return new Error('403 Forbidden - Insufficient permissions')
                } else {
                    return new Error(`HTTP ${response.status} - ${response.statusText}`)
                }
            }
            
            const version = await response.text()
            return version
        } catch (error) {
            if (error instanceof Error) {
                return error
            }
            return new Error('Failed to fetch version')
        }
    }

    const deploy = async (server_uuid: string, template_name: string, project_uuid?: string, environment_name?: string) => {
        const templateConfig = await getServiceTemplate(template_name.toLowerCase())
        
        if (!templateConfig) {
            return new Error(`Template '${template_name}' not found`)
        }
        
        const { slogan, compose } = templateConfig
        if (!template_name || !slogan) {
            return new Error('Template name and description are required')
        }

        // Use provided project or create new one
        let finalProjectUuid = project_uuid
        if (!finalProjectUuid) {
            finalProjectUuid = await createProject(template_name, slogan)
            
            if (!finalProjectUuid) {
                return new Error('Failed to create project')
            }
        }

        const service = await createService(server_uuid, finalProjectUuid, template_name, environment_name)
        const domain = service.domains.filter(domain => domain !== null)[0]

        apiToken.value = ''
        baseUrl.value = ''
        connection.value = false
        connected.value = false
        status.value = ''
        projectStatus.value = ''
        serviceStatus.value = ''
        deployStatus.value = ''

        return {
            url: domain,
            serviceUuid: service.uuid,
            projectUuid: finalProjectUuid,
            environmentName: environment_name || 'production',
            environmentUuid: service.environment_uuid || environment_name || 'production'
        }
    }

    const checkServiceHealth = async (serviceUrl: string): Promise<boolean> => {
        try {
            const controller = new AbortController()
            const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout
            
            // Path overrides for common endpoints
            const endpointsToTry = [
                '/' // Root path
            ]
            
            for (const endpoint of endpointsToTry) {
                try {
                    const url = `${serviceUrl}${endpoint}`
                    const response = await fetch(url, {
                        method: 'GET',
                        signal: controller.signal
                    })
                    
                    // Check if the response is successful (2xx status codes)
                    // Also accept 3xx redirects as healthy (service is responding)
                    if (response.ok || (response.status >= 300 && response.status < 400)) {
                        clearTimeout(timeoutId)
                        return true
                    }
                } catch (endpointError) {
                    // Continue to next endpoint if this one fails
                    continue
                }
            }
            
            clearTimeout(timeoutId)
            return false
        } catch (error) {
            // If the request fails (network error, timeout, etc.), the service is not healthy
            return false
        }
    }

    return {
        connect,
        connected,
        status,
        projectStatus,
        serviceStatus,
        deployStatus,
        createProject,
        createService,
        fetchProjects,
        fetchProjectDetails,
        fetchVersion,
        deploy,
        checkServiceHealth
    }
}