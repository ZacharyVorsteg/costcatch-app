import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'
import { validateCountCreate } from '@/lib/validation'

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
    const limit = parseInt(searchParams.get('limit') || '30')
    const offset = parseInt(searchParams.get('offset') || '0')

    const { data: counts, error } = await supabase
      .from('inventory_counts')
      .select('*, items:count_items(*, item:inventory_items(*))')
      .eq('restaurant_id', restaurant.id)
      .order('count_date', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) throw error

    return NextResponse.json(counts)
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
    const validation = validateCountCreate(body)
    if (!validation.valid) {
      return NextResponse.json({ error: 'Validation failed', details: validation.errors }, { status: 400 })
    }

    const { count_date, items } = body

    // Create the count record
    const { data: count, error: countError } = await supabase
      .from('inventory_counts')
      .insert({
        restaurant_id: restaurant.id,
        counted_by: user.id,
        count_date: count_date || new Date().toISOString().split('T')[0],
        total_value: items.reduce(
          (sum: number, item: any) => sum + item.total_value,
          0
        ),
      })
      .select()
      .single()

    if (countError) throw countError

    // Create count items
    const countItems = items.map((item: any) => ({
      count_id: count.id,
      item_id: item.item_id,
      quantity: item.quantity,
      unit_price: item.unit_price,
      total_value: item.total_value,
    }))

    const { error: itemsError } = await supabase
      .from('count_items')
      .insert(countItems)

    if (itemsError) throw itemsError

    return NextResponse.json(count, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
