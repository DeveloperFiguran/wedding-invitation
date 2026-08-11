const TOKEN_KEY = 'admin_session_token'

export const authClient = {
  getToken(): string | null {
    if (typeof window === 'undefined') return null
    return localStorage.getItem(TOKEN_KEY)
  },

  setToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token)
  },

  clearToken(): void {
    localStorage.removeItem(TOKEN_KEY)
    // Juga clear legacy keys
    localStorage.removeItem('admin_auth')
    localStorage.removeItem('admin_password')
  },

  // Header object untuk fetch
  getAuthHeaders(): Record<string, string> {
    const token = this.getToken()
    return token ? { Authorization: `Bearer ${token}` } : {}
  },

  // Verify token di server
  async verify(): Promise<{ authenticated: boolean; expiresIn?: number }> {
    const token = this.getToken()
    if (!token) return { authenticated: false }

    try {
      const res = await fetch('/api/auth/verify', {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()

      if (!res.ok || !data.authenticated) {
        this.clearToken()
        return { authenticated: false }
      }

      return { authenticated: true, expiresIn: data.expiresIn }
    } catch {
      return { authenticated: false }
    }
  },

  logout(): void {
    this.clearToken()
    if (typeof window !== 'undefined') {
      window.location.href = '/admin/login'
    }
  },
}

// Helper untuk fetch dengan auto-logout kalau token expired
export async function authenticatedFetch(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  const headers = {
    ...authClient.getAuthHeaders(),
    ...options.headers,
  }

  const res = await fetch(url, { ...options, headers })

  // Auto-logout jika token expired/invalid
  if (res.status === 401) {
    authClient.clearToken()
    if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
      window.location.href = '/admin/login'
    }
  }

  return res
}