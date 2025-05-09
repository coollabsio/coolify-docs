import spec from '../../../.vitepress/theme/openapi.json' with { type: 'json' }

export default {
  async paths() {
    // Extract all operationIds
    const operations: string[] = []
    Object.entries(spec.paths).forEach(([path, pathItem]: [string, Record<string, any>]) => {
      Object.entries(pathItem).forEach(([method, operation]: [string, { operationId?: string }]) => {
        if (operation?.operationId) {
          operations.push(operation.operationId)
        }
      })
    })

    // Return the params array
    return operations.map(op => ({
      params: { operation: op }
    }))
  }
}