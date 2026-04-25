import { NextRequest, NextResponse } from 'next/server'
import { generateAdminToken } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { password } = body

    if (!password) {
      return NextResponse.json(
        { error: 'Password is required' },
        { status: 400 }
      )
    }

    const token = generateAdminToken(password)

    if (!token) {
      return NextResponse.json(
        { error: 'Invalid password' },
        { status: 401 }
      )
    }

    return NextResponse.json({
      success: true,
      token,
    })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
