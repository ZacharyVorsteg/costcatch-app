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
    const reportType = searchParams.get('type') || 'summary'

    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    // Get counts for the period
    const { data: counts } = await supabase
      .from('inventory_counts')
      .select('*, items:count_items(*, item:inventory_items(category:categories(*)))')
      .eq('restaurant_id', restaurant.id)
      .gte('count_date', startDate.toISOString().split('T')[0])
      .order('count_date')

    // Get waste for the period
    const { data: waste } = await supabase
      .from('waste_logs')
      .select('*, item:inventory_items(category:categories(*))')
      .eq('restaurant_id', restaurant.id)
      .gte('logged_at', startDate.toISOString())

    // Calculate summary metrics
    const totalInventoryValue = counts?.length
      ? counts[counts.length - 1]?.total_value || 0
      : 0

    const totalWaste = waste?.reduce((sum, w) => sum + (w.total_value || 0), 0) || 0

    // Calculate waste by reason
    const wasteByReason = waste?.reduce((acc, w) => {
      acc[w.reason] = (acc[w.reason] || 0) + (w.total_value || 0)
      return acc
    }, {} as Record<string, number>) || {}

    // Calculate waste by category
    const wasteByCategory = waste?.reduce((acc, w) => {
      const category = w.item?.category?.name || 'Uncategorized'
      acc[category] = (acc[category] || 0) + (w.total_value || 0)
      return acc
    }, {} as Record<string, number>) || {}

    // Calculate inventory by category (from latest count)
    const latestCount = counts?.[counts.length - 1]
    const inventoryByCategory = latestCount?.items?.reduce((acc: Record<string, number>, item: any) => {
      const category = item.item?.category?.name || 'Uncategorized'
      acc[category] = (acc[category] || 0) + (item.total_value || 0)
      return acc
    }, {} as Record<string, number>) || {}

    // Calculate food cost trend (simplified - would need sales data for real calculation)
    const foodCostTrend = counts?.map((count) => ({
      date: count.count_date,
      value: count.total_value,
    })) || []

    const report = {
      period: {
        start: startDate.toISOString().split('T')[0],
        end: new Date().toISOString().split('T')[0],
        days,
      },
      summary: {
        totalInventoryValue,
        totalWaste,
        wastePercentage: totalInventoryValue > 0
          ? (totalWaste / totalInventoryValue) * 100
          : 0,
        countsCompleted: counts?.length || 0,
        wasteEvents: waste?.length || 0,
      },
      wasteByReason,
      wasteByCategory,
      inventoryByCategory,
      foodCostTrend,
    }

    return NextResponse.json(report)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
