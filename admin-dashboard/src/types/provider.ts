export interface ProviderHealth {
  provider: string
  status: 'ok' | 'error'
  message: string
}

export interface ProvidersHealthResponse {
  success: boolean
  data: ProviderHealth[]
}