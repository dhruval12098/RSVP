import { AdminLoginForm } from '@/components/admin-login-form'

export const metadata = {
  title: 'Admin Login',
  robots: 'noindex, nofollow',
}

export default function AdminLoginPage() {
  return (
    <main className="min-h-screen bg-background flex items-center justify-center">
      <div className="max-w-md w-full mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-foreground mb-2">Admin Access</h1>
          <p className="text-muted-foreground">Enter your password to access the dashboard</p>
        </div>
        <AdminLoginForm />
      </div>
    </main>
  )
}
