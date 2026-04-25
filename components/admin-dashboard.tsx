'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Upload, X as XIcon } from 'lucide-react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
)

interface RSVP {
  id: string
  name: string
  guests: number
  message: string | null
  created_at: string
}

interface Stats {
  totalRsvps: number
  totalGuests: number
}

export function AdminDashboard() {
  const [rsvps, setRsvps] = useState<RSVP[]>([])
  const [stats, setStats] = useState<Stats>({ totalRsvps: 0, totalGuests: 0 })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [isUploadingBanner, setIsUploadingBanner] = useState(false)
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const router = useRouter()

  useEffect(() => {
    fetchRsvps()
  }, [])

  async function fetchRsvps() {
    try {
      setIsLoading(true)
      const token = sessionStorage.getItem('adminToken')

      if (!token) {
        router.push('/admin/login')
        return
      }

      const response = await fetch('/api/admin/rsvps', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        if (response.status === 401) {
          router.push('/admin/login')
          return
        }
        throw new Error('Failed to fetch RSVPs')
      }

      const data = await response.json()
      setStats(data.stats)
      setRsvps(data.rsvps || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this RSVP?')) {
      return
    }

    try {
      setDeletingId(id)
      const token = sessionStorage.getItem('adminToken')

      const response = await fetch(`/api/admin/rsvps?id=${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error('Failed to delete RSVP')
      }

      setRsvps(rsvps.filter(r => r.id !== id))
      setStats({
        ...stats,
        totalRsvps: stats.totalRsvps - 1,
        totalGuests: stats.totalGuests - (rsvps.find(r => r.id === id)?.guests || 0),
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete RSVP')
    } finally {
      setDeletingId(null)
    }
  }

  function handleLogout() {
    sessionStorage.removeItem('adminToken')
    router.push('/admin/login')
  }

  async function handleBannerUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file')
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB')
      return
    }

    try {
      setIsUploadingBanner(true)
      setError(null)

      // Upload to Supabase storage
      const { error: uploadError } = await supabase.storage
        .from('rsvp')
        .upload('banner.jpg', file, {
          upsert: true,
        })

      if (uploadError) throw uploadError

      setUploadSuccess(true)
      setTimeout(() => setUploadSuccess(false), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload banner')
    } finally {
      setIsUploadingBanner(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-foreground mb-2">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage event RSVPs</p>
          </div>
          <div className="flex gap-4">
            <Link
              href="/"
              className="px-4 py-2 rounded-md border border-muted text-foreground hover:bg-muted transition-colors"
            >
              Back to Event
            </Link>
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-md bg-accent text-white hover:bg-accent/90 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-md bg-red-50 border border-red-200">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {uploadSuccess && (
          <div className="mb-6 p-4 rounded-md bg-green-50 border border-green-200">
            <p className="text-sm text-green-800">Banner image uploaded successfully!</p>
          </div>
        )}

        {/* Banner Upload Section */}
        <div className="card-luxury mb-8">
          <h2 className="text-foreground font-serif text-xl mb-4">Event Banner</h2>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Upload an image to display as the event banner (A4 size or landscape recommended)
            </p>
            <label className="flex flex-col items-center justify-center border-2 border-dashed border-border rounded-lg p-6 md:p-8 cursor-pointer hover:border-accent hover:bg-muted/30 transition-all">
              <Upload size={32} className="text-muted-foreground mb-2" />
              <p className="text-sm font-medium text-foreground mb-1">
                {isUploadingBanner ? 'Uploading...' : 'Click to upload or drag and drop'}
              </p>
              <p className="text-xs text-muted-foreground">
                PNG, JPG, GIF up to 5MB
              </p>
              <input
                type="file"
                accept="image/*"
                onChange={handleBannerUpload}
                disabled={isUploadingBanner}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          <div className="card-luxury">
            <p className="text-sm text-muted-foreground font-sans mb-1">Total RSVPs</p>
            <p className="text-3xl font-serif text-foreground">{stats.totalRsvps}</p>
          </div>
          <div className="card-luxury">
            <p className="text-sm text-muted-foreground font-sans mb-1">Total Guests</p>
            <p className="text-3xl font-serif text-foreground">{stats.totalGuests}</p>
          </div>
          <div className="card-luxury hidden md:block">
            <p className="text-sm text-muted-foreground font-sans mb-1">Avg. Party Size</p>
            <p className="text-3xl font-serif text-foreground">
              {stats.totalRsvps > 0 ? (stats.totalGuests / stats.totalRsvps).toFixed(1) : 0}
            </p>
          </div>
        </div>

        {/* RSVPs Table */}
        <div className="card-luxury overflow-x-auto">
          <h3 className="text-foreground mb-6 font-serif text-xl">Recent RSVPs</h3>
          {rsvps.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No RSVPs yet</p>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-muted">
                  <th className="text-left py-3 px-4 font-semibold text-foreground text-sm">Name</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground text-sm">Guests</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground text-sm">Date</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground text-sm">Message</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground text-sm">Action</th>
                </tr>
              </thead>
              <tbody>
                {rsvps.map((rsvp) => (
                  <tr key={rsvp.id} className="border-b border-muted hover:bg-muted/30 transition-colors">
                    <td className="py-3 px-4 text-foreground">{rsvp.name}</td>
                    <td className="py-3 px-4 text-foreground">{rsvp.guests}</td>
                    <td className="py-3 px-4 text-sm text-muted-foreground">
                      {new Date(rsvp.created_at).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 text-sm text-muted-foreground max-w-xs truncate">
                      {rsvp.message || '—'}
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => handleDelete(rsvp.id)}
                        disabled={deletingId === rsvp.id}
                        className="text-sm text-red-600 hover:text-red-800 disabled:opacity-50 transition-colors"
                      >
                        {deletingId === rsvp.id ? 'Deleting...' : 'Delete'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </main>
  )
}
