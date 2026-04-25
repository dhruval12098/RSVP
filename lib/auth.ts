import bcryptjs from 'bcryptjs'

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'luxury-event-2024'
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'

// Generate a simple JWT-like token for admin authentication
export function generateAdminToken(password: string): string | null {
  if (password === ADMIN_PASSWORD) {
    // Create a simple token that includes timestamp
    const timestamp = Date.now()
    const token = Buffer.from(`admin:${timestamp}`).toString('base64')
    return token
  }
  return null
}

// Verify admin token
export function verifyAdminToken(token: string): boolean {
  try {
    const decoded = Buffer.from(token, 'base64').toString('utf-8')
    const [role, timestamp] = decoded.split(':')
    
    if (role !== 'admin') {
      return false
    }

    // Token is valid for 24 hours
    const tokenTime = parseInt(timestamp)
    const now = Date.now()
    const maxAge = 24 * 60 * 60 * 1000 // 24 hours

    return (now - tokenTime) < maxAge
  } catch (error) {
    return false
  }
}

// Hash password for storage (for future use)
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcryptjs.genSalt(10)
  return bcryptjs.hash(password, salt)
}

// Compare password with hash
export async function comparePassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcryptjs.compare(password, hash)
}
