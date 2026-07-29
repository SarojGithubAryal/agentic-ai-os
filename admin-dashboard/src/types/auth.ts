export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  email: string
  password: string
  name?: string
}

export interface AuthTokens {
  accessToken: string
  refreshToken: string
}

export interface User {
  id: string
  email: string
  name?: string
}

export interface AuthResponse {
  success: boolean
  data: {
    user: User
    accessToken: string
    refreshToken: string
  }
}

export interface RefreshResponse {
  success: boolean
  data: {
    accessToken: string
    refreshToken: string
  }
}

export interface MeResponse {
  success: boolean
  data: {
    sub: string
    type: string
    iat: number
    exp: number
  }
}