'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export function AdminLoginForm() {
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Invalid password')
      }

      const data = await response.json()
      
      // Store token in sessionStorage
      sessionStorage.setItem('adminToken', data.token)
      
      // Redirect to admin dashboard
      router.push('/admin')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card-luxury">
      {error && (
        <div className="mb-4 p-3 rounded-md bg-red-50 border border-red-200">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      <div className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="password" className="block text-sm font-semibold text-foreground">
            Password
          </label>
          <input
            id="password"
            type="password"
            placeholder="Enter admin password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 rounded-md border border-muted bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
            disabled={isLoading}
          />
        </div>

        <button
          type="submit"
          disabled={isLoading || !password}
          className="w-full px-4 py-2 rounded-md bg-accent text-white font-semibold hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? 'Logging in...' : 'Login'}
        </button>
      </div>
    </form>
  )
}
