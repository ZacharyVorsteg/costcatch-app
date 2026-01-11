'use client'

import { useEffect, useState } from 'react'
import { DashboardLayout } from '@/components/layout'
import {
  FoodCostCard,
  TrendChart,
  AlertsList,
  QuickActions,
  StatsGrid,
} from '@/components/dashboard'
import { createClient } from '@/lib/supabase'
import { Alert, Restaurant } from '@/lib/types'

// Sample data for demo - in production, this would come from the database
const sampleTrendData = {
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  values: [31.2, 29.8, 32.1, 30.5, 28.9, 31.4, 29.2],
}

const sampleAlerts: Alert[] = [
  {
    id: '1',
    type: 'price_spike',
    title: 'Salmon price up 15%',
    message: 'Salmon fillet increased from $11.29 to $12.99/lb',
    severity: 'warning',
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '2',
    type: 'low_stock',
    title: 'Low stock: Avocados',
    message: 'Only 5 avocados remaining, par level is 20',
    severity: 'danger',
    created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '3',
    type: 'food_cost',
    title: 'Food cost trending up',
    message: 'Weekly average is 32%, target is 30%',
    severity: 'warning',
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
]

export default function DashboardPage() {
  const supabase = createClient()
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        const { data: { user } } = await supabase.auth.getUser()

        if (user) {
          const { data: restaurantData } = await supabase
            .from('restaurants')
            .select('*')
            .eq('user_id', user.id)
            .single()

          if (restaurantData) {
            setRestaurant(restaurantData)
          }
        }
      } catch (error) {
        console.error('Error loading dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [supabase])

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600" />
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout
      restaurantName={restaurant?.name || 'My Restaurant'}
      userName="Owner"
    >
      <div className="space-y-6">
        {/* Page header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 mt-1">
            Here's what's happening with your food costs today
          </p>
        </div>

        {/* Stats grid */}
        <StatsGrid
          inventoryValue={12450}
          wasteThisWeek={342}
          itemsTracked={47}
          savingsThisMonth={1240}
        />

        {/* Main content grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left column - Food cost & trend */}
          <div className="lg:col-span-2 space-y-6">
            <FoodCostCard
              currentPercentage={29.2}
              previousPercentage={31.4}
              targetPercentage={restaurant?.target_food_cost_pct || 30}
            />
            <TrendChart data={sampleTrendData} />
          </div>

          {/* Right column - Alerts & Quick actions */}
          <div className="space-y-6">
            <QuickActions />
            <AlertsList alerts={sampleAlerts} />
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
