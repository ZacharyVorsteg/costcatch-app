import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'

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

    const { searchParams } = new URL(request.url)
    const categoryId = searchParams.get('category_id')
    const active = searchParams.get('active')

    let query = supabase
      .from('inventory_items')
      .select('*, category:categories(*), vendor:vendors(*)')
      .eq('restaurant_id', restaurant.id)
      .order('name')

    if (categoryId) {
      query = query.eq('category_id', categoryId)
    }

    if (active !== null) {
      query = query.eq('is_active', active === 'true')
    }

    const { data: items, error } = await query

    if (error) throw error

    return NextResponse.json(items)
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
    const { name, category_id, unit, current_price, par_level, vendor_id } = body

    const { data: item, error } = await supabase
      .from('inventory_items')
      .insert({
        restaurant_id: restaurant.id,
        name,
        category_id,
        unit,
        current_price,
        par_level,
        vendor_id,
        is_active: true,
      })
      .select('*, category:categories(*), vendor:vendors(*)')
      .single()

    if (error) throw error

    return NextResponse.json(item, { status: 201 })
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

    const body = await request.json()
    const { id, ...updates } = body

    const { data: item, error } = await supabase
      .from('inventory_items')
      .update(updates)
      .eq('id', id)
      .select('*, category:categories(*), vendor:vendors(*)')
      .single()

    if (error) throw error

    return NextResponse.json(item)
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

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Item ID required' }, { status: 400 })
    }

    const { error } = await supabase
      .from('inventory_items')
      .delete()
      .eq('id', id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
