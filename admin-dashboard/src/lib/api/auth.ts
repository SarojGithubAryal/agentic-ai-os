import apiClient from '../api-client'
import type { LoginRequest, RegisterRequest, AuthResponse, RefreshResponse, MeResponse } from '../../types/auth'

export async function login(data: LoginRequest): Promise<AuthResponse> {
  const response = await apiClient.post<AuthResponse>('/auth/login', data)
  return response.data
}

export async function register(data: RegisterRequest): Promise<AuthResponse> {
  const response = await apiClient.post<AuthResponse>('/auth/register', data)
  return response.data
}

export async function refreshToken(token: string): Promise<RefreshResponse> {
  const response = await apiClient.post<RefreshResponse>('/auth/refresh', { refreshToken: token })
  return response.data
}

export async function getMe(): Promise<MeResponse> {
  const response = await apiClient.get<MeResponse>('/auth/me')
  return response.data
}