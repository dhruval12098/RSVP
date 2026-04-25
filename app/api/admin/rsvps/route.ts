import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import { verifyAdminToken } from '@/lib/auth'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase credentials')
}

const supabase = createClient(supabaseUrl, supabaseKey)

export async function GET(request: NextRequest) {
  try {
    // Verify admin token
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    if (!token || !verifyAdminToken(token)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get all RSVPs
    const { data, error } = await supabase
      .from('rsvps')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch RSVPs' },
        { status: 500 }
      )
    }

    // Calculate statistics
    const totalRsvps = data?.length || 0
    const totalGuests = data?.reduce((sum, rsvp) => sum + rsvp.guests, 0) || 0

    return NextResponse.json({
      success: true,
      stats: {
        totalRsvps,
        totalGuests,
      },
      rsvps: data,
    })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Verify admin token
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    if (!token || !verifyAdminToken(token)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'RSVP ID is required' },
        { status: 400 }
      )
    }

    // Delete RSVP
    const { error } = await supabase
      .from('rsvps')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { error: 'Failed to delete RSVP' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
