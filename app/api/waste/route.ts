import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'
import { validateWasteCreate } from '@/lib/validation'
import { checkRateLimit, getClientIdentifier, rateLimitResponse, RATE_LIMITS } from '@/lib/rate-limit'

// Maximum allowed values to prevent abuse
const MAX_DAYS = 365

export async function GET(request: NextRequest) {
  // Rate limiting
  const clientId = getClientIdentifier(request)
  const rateLimit = checkRateLimit(clientId, 'waste-get', RATE_LIMITS.api)
  if (!rateLimit.success) {
    return rateLimitResponse(rateLimit)
  }

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
    // Enforce max limit to prevent abuse
    const days = Math.min(parseInt(searchParams.get('days') || '30'), MAX_DAYS)
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
  } catch {
    return NextResponse.json({ error: 'Failed to fetch waste logs' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  // Rate limiting
  const clientId = getClientIdentifier(request)
  const rateLimit = checkRateLimit(clientId, 'waste-post', RATE_LIMITS.api)
  if (!rateLimit.success) {
    return rateLimitResponse(rateLimit)
  }

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
    const validation = validateWasteCreate(body)
    if (!validation.valid) {
      return NextResponse.json({ error: 'Validation failed', details: validation.errors }, { status: 400 })
    }

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
  } catch {
    return NextResponse.json({ error: 'Failed to log waste' }, { status: 500 })
  }
}
