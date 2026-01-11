import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'
import { validateCountCreate } from '@/lib/validation'
import { checkRateLimit, getClientIdentifier, rateLimitResponse, RATE_LIMITS } from '@/lib/rate-limit'

// Maximum allowed values to prevent abuse
const MAX_LIMIT = 100
const MAX_OFFSET = 10000

export async function GET(request: NextRequest) {
  // Rate limiting
  const clientId = getClientIdentifier(request)
  const rateLimit = checkRateLimit(clientId, 'counts-get', RATE_LIMITS.api)
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
    // Enforce max limits to prevent abuse
    const limit = Math.min(parseInt(searchParams.get('limit') || '30'), MAX_LIMIT)
    const offset = Math.min(parseInt(searchParams.get('offset') || '0'), MAX_OFFSET)

    const { data: counts, error } = await supabase
      .from('inventory_counts')
      .select('*, items:count_items(*, item:inventory_items(*))')
      .eq('restaurant_id', restaurant.id)
      .order('count_date', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) throw error

    return NextResponse.json(counts)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch counts' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  // Rate limiting
  const clientId = getClientIdentifier(request)
  const rateLimit = checkRateLimit(clientId, 'counts-post', RATE_LIMITS.api)
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
          (sum: number, item: { total_value: number }) => sum + item.total_value,
          0
        ),
      })
      .select()
      .single()

    if (countError) throw countError

    // Create count items
    const countItems = items.map((item: { item_id: string; quantity: number; unit_price: number; total_value: number }) => ({
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
  } catch {
    return NextResponse.json({ error: 'Failed to create count' }, { status: 500 })
  }
}
