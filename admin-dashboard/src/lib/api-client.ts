import axios from 'axios'

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Store for in-memory access token (managed by AuthProvider)
let accessToken: string | null = null

export function setAccessToken(token: string | null) {
  accessToken = token
}

export function getAccessToken() {
  return accessToken
}

// Request interceptor: attach access token if available
apiClient.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`
  }
  return config
})

// Response interceptor: handle 401 and refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      try {
        const refreshTokenFromStorage = localStorage.getItem('refreshToken')
        if (!refreshTokenFromStorage) {
          throw new Error('No refresh token')
        }
        // Call refresh endpoint
        const refreshResponse = await axios.post(
          `${apiClient.defaults.baseURL}/auth/refresh`,
          { refreshToken: refreshTokenFromStorage }
        )
        const newAccessToken = refreshResponse.data.data.accessToken
        const newRefreshToken = refreshResponse.data.data.refreshToken
        // Update stored tokens
        localStorage.setItem('refreshToken', newRefreshToken)
        setAccessToken(newAccessToken)
        // Retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
        return apiClient(originalRequest)
      } catch (refreshError) {
        // Refresh failed – clear tokens and redirect to login
        localStorage.removeItem('refreshToken')
        setAccessToken(null)
        window.location.href = '/login'
        return Promise.reject(refreshError)
      }
    }
    return Promise.reject(error)
  }
)

export default apiClient