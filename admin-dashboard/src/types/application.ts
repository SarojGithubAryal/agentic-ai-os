export interface Application {
  id: string
  name: string
  createdAt: string
  updatedAt: string
}

export interface ApplicationCreateResponse {
  success: boolean
  data: Application & { apiKey: string } // apiKey only on create
}

export interface ApplicationListResponse {
  success: boolean
  data: Application[]
  metadata: {
    total: number
    limit: number
    offset: number
  }
}

export interface ApplicationSingleResponse {
  success: boolean
  data: Application
}

export interface ApplicationUpdateRequest {
  name: string
}

export interface ApplicationCreateRequest {
  name: string
}