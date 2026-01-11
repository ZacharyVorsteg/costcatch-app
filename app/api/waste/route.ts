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
    const days = parseInt(searchParams.get('days') || '30')
    const reason = searchParams.get('reason')

    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    let query = supabase
      .from('waste_logs')
      .select('*, item:inventory_items(*)')
      .eq('restaurant_id', restaurant.id)
      .gte('logged_at', startDate.toISOString())
      .order('logged_at', { ascending: false })

    if (reason) {
      query = query.eq('reason', reason)
    }

    const { data: logs, error } = await query

    if (error) throw error

    return NextResponse.json(logs)
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
    const { item_id, quantity, reason, notes } = body

    // Get item price
    const { data: item } = await supabase
      .from('inventory_items')
      .select('current_price')
      .eq('id', item_id)
      .single()

    const unitPrice = item?.current_price || 0
    const totalValue = quantity * unitPrice

    const { data: log, error } = await supabase
      .from('waste_logs')
      .insert({
        restaurant_id: restaurant.id,
        item_id,
        quantity,
        unit_price: unitPrice,
        total_value: totalValue,
        reason,
        notes,
        logged_by: user.id,
      })
      .select('*, item:inventory_items(*)')
      .single()

    if (error) throw error

    return NextResponse.json(log, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
