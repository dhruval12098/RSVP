import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase credentials')
}

const supabase = createClient(supabaseUrl, supabaseKey)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, guests, message } = body

    // Validation
    if (!name || !guests) {
      return NextResponse.json(
        { error: 'Name and number of guests are required' },
        { status: 400 }
      )
    }

    if (typeof guests !== 'number' || guests < 1 || guests > 50) {
      return NextResponse.json(
        { error: 'Number of guests must be between 1 and 50' },
        { status: 400 }
      )
    }

    // Insert into database
    const { data, error } = await supabase
      .from('rsvps')
      .insert([
        {
          name: name.trim(),
          guests: parseInt(guests),
          message: message?.trim() || null,
        },
      ])
      .select()

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { error: 'Failed to save RSVP' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { success: true, data },
      { status: 201 }
    )
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
