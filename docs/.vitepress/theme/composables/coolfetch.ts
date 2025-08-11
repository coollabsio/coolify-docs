import { ref } from "vue";

export const useCoolFetch = () => {
    const baseUrl = ref('')
    const apiToken = ref('')
    const coolifyCloudUrl = 'https://api.coolify.io'
    const connection = ref(false)
    const connected = ref(false)
    const status = ref('')

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
        status.value = 'pending'
        baseUrl.value = domain ? domain : coolifyCloudUrl
        apiToken.value = apiKey
        const response = await coolfetch(
            `/api/v1/servers`,
            {
                method: 'GET'
            }
        ).then(response => {
            status.value = 'success'
            return response
        }).catch(error => {
            status.value = 'error'
            return error
        })

        const data = await response.json()
        if (data.success) {
            connection.value = true
            return data
        }
        return data
    }

    const createProject = async (serverId: string) => {
        const response = await coolfetch(`/api/v1/projects`, {
            method: 'POST',
            body: JSON.stringify({
                name: 'My Project',
                serverId: serverId
            })
        }).then(response => {
            status.value = 'success'
            return response
        }).catch(error => {
            status.value = 'error'
            return error
        })

        const data = await response.json()
        if (data.success) {
            return data
        }

        return new Error('Failed to create project')
    }

    const createService = async (projectId: string) => {
        const response = await coolfetch(`/api/v1/projects/${projectId}`, {
            method: 'POST',
            body: JSON.stringify({
                name: 'My Service'
            })
        }).then(response => {
            status.value = 'success'
            return response
        }).catch(error => {
            status.value = 'error'
            return error
        })

        const data = await response.json()
        if (data.success) {
            return data
        }

        return new Error('Failed to create service')
    }

    const createApplication = async (serviceId: string) => {
        const response = await coolfetch(`/api/v1/services/${serviceId}`, {
            method: 'POST',
            body: JSON.stringify({
                name: 'My Application'
            })
        }).then(response => {
            status.value = 'success'
            return response
        }).catch(error => {
            status.value = 'error'
            return error
        })

        const data = await response.json()
        if (data.success) {
            return data
        }

        return new Error('Failed to create application')
    }

    const deploy = async (serverId: string) => {
      const project = await createProject(serverId)
      const service = await createService(project.id)
      const application = await createApplication(service.id)
      


      return {
        project,
        service,
        application
      }
    }

    return {
        connect,
        connected,
        status,
        createProject,
        createService,
        createApplication,
        deploy
    }
}