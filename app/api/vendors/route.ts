import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'
import { validateVendorCreate, validateVendorUpdate } from '@/lib/validation'

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: restaurant } = await supabase
      .from('restaurants')
      .select('id')
      .eq('user_id', user.id)
      .single()

    if (!restaurant) {
      return NextResponse.json({ error: 'Restaurant not found' }, { status: 404 })
    }

    const { data: vendors, error } = await supabase
      .from('vendors')
      .select('*')
      .eq('restaurant_id', restaurant.id)
      .order('name')

    if (error) throw error

    return NextResponse.json(vendors)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: restaurant } = await supabase
      .from('restaurants')
      .select('id')
      .eq('user_id', user.id)
      .single()

    if (!restaurant) {
      return NextResponse.json({ error: 'Restaurant not found' }, { status: 404 })
    }

    const body = await request.json()

    // Validate input
    const validation = validateVendorCreate(body)
    if (!validation.valid) {
      return NextResponse.json({ error: 'Validation failed', details: validation.errors }, { status: 400 })
    }

    const { name, contact_name, phone, email } = body

    const { data: vendor, error } = await supabase
      .from('vendors')
      .insert({
        restaurant_id: restaurant.id,
        name,
        contact_name,
        phone,
        email,
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(vendor, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: restaurant } = await supabase
      .from('restaurants')
      .select('id')
      .eq('user_id', user.id)
      .single()

    if (!restaurant) {
      return NextResponse.json({ error: 'Restaurant not found' }, { status: 404 })
    }

    const body = await request.json()

    // Validate input
    const validation = validateVendorUpdate(body)
    if (!validation.valid) {
      return NextResponse.json({ error: 'Validation failed', details: validation.errors }, { status: 400 })
    }

    const { id, ...updates } = body

    // Ensure vendor belongs to user's restaurant
    const { data: vendor, error } = await supabase
      .from('vendors')
      .update(updates)
      .eq('id', id)
      .eq('restaurant_id', restaurant.id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(vendor)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: restaurant } = await supabase
      .from('restaurants')
      .select('id')
      .eq('user_id', user.id)
      .single()

    if (!restaurant) {
      return NextResponse.json({ error: 'Restaurant not found' }, { status: 404 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Vendor ID required' }, { status: 400 })
    }

    // Ensure vendor belongs to user's restaurant
    const { error } = await supabase
      .from('vendors')
      .delete()
      .eq('id', id)
      .eq('restaurant_id', restaurant.id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
