import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { setAccessToken } from '../lib/api-client';
import { getMe, refreshToken as apiRefreshToken } from '../lib/api/auth'
import type { User } from '../types/auth'

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  login: (accessToken: string, refreshToken: string, user: User) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true) // wait for initial auth check

  const login = useCallback((accessToken: string, refreshToken: string, user: User) => {
    localStorage.setItem('refreshToken', refreshToken)
    setAccessToken(accessToken)
    setUser(user)
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('refreshToken')
    setAccessToken(null)
    setUser(null)
  }, [])

  // On mount, attempt silent refresh from stored refresh token
  useEffect(() => {
    const initAuth = async () => {
      const storedRefreshToken = localStorage.getItem('refreshToken')
      if (storedRefreshToken) {
        try {
          const res = await apiRefreshToken(storedRefreshToken)
          setAccessToken(res.data.accessToken)
          localStorage.setItem('refreshToken', res.data.refreshToken)
          // Fetch user details
          const me = await getMe()
          // For now, we only have user ID from /me, but we need email/name. We could store user from login.
          // Since /me only returns token payload, we'll rely on login data. If we don't have it, we'll set a minimal user.
          // We'll keep user data from localStorage? Better to store user info at login time.
          // So we'll store user info in localStorage as well (non-sensitive).
          const cachedUser = localStorage.getItem('user')
          if (cachedUser) {
            setUser(JSON.parse(cachedUser))
          } else {
            // Fallback: minimal user with id from token
            setUser({ id: me.data.sub, email: '', name: '' })
          }
        } catch {
          // Refresh failed, clear storage
          localStorage.removeItem('refreshToken')
          setAccessToken(null)
        }
      }
      setIsLoading(false)
    }
    initAuth()
  }, [])

  if (isLoading) {
    // Could return a loading spinner
    return null
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}