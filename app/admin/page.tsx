'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { AdminDashboard } from '@/components/admin-dashboard'

export default function AdminPage() {
  const router = useRouter()

  useEffect(() => {
    // Check if user is authenticated
    const token = sessionStorage.getItem('adminToken')
    if (!token) {
      router.push('/admin/login')
    }
  }, [router])

  return <AdminDashboard />
}
