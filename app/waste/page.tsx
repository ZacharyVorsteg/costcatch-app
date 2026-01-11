'use client'

import { useState, useEffect } from 'react'
import { Plus, Calendar, Filter } from 'lucide-react'
import { DashboardLayout } from '@/components/layout'
import { Button, Card, Select } from '@/components/ui'
import { WasteForm, WasteList, WasteChart, WasteTrendChart } from '@/components/waste'
import { createClient } from '@/lib/supabase'
import { WasteLog, InventoryItem } from '@/lib/types'
import { formatCurrency, calculateWasteTotal } from '@/lib/calculations'
import { useToast } from '@/contexts/ToastContext'

export default function WastePage() {
  const supabase = createClient()
  const toast = useToast()
  const [logs, setLogs] = useState<WasteLog[]>([])
  const [items, setItems] = useState<InventoryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [dateRange, setDateRange] = useState('7')
  const [reasonFilter, setReasonFilter] = useState('')

  useEffect(() => {
    loadData()
  }, [dateRange])

  async function loadData() {
    try {
      const { data: { user } } = await supabase.auth.getUser()

      if (user) {
        const { data: restaurant } = await supabase
          .from('restaurants')
          .select('id')
          .eq('user_id', user.id)
          .single()

        if (restaurant) {
          // Calculate date filter
          const startDate = new Date()
          startDate.setDate(startDate.getDate() - parseInt(dateRange))

          // Load waste logs
          const { data: logsData } = await supabase
            .from('waste_logs')
            .select('*, item:inventory_items(*)')
            .eq('restaurant_id', restaurant.id)
            .gte('logged_at', startDate.toISOString())
            .order('logged_at', { ascending: false })

          // Load items for the form
          const { data: itemsData } = await supabase
            .from('inventory_items')
            .select('*')
            .eq('restaurant_id', restaurant.id)
            .eq('is_active', true)
            .order('name')

          setLogs(logsData || [])
          setItems(itemsData || [])
        }
      }
    } catch (error) {
      console.error('Error loading waste data:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleSaveWaste(data: {
    item_id: string
    quantity: number
    reason: string
    notes: string
  }) {
    try {
      const { data: { user } } = await supabase.auth.getUser()

      if (user) {
        const { data: restaurant } = await supabase
          .from('restaurants')
          .select('id')
          .eq('user_id', user.id)
          .single()

        if (restaurant) {
          const item = items.find((i) => i.id === data.item_id)
          const totalValue = item?.current_price
            ? data.quantity * item.current_price
            : 0

          const { data: newLog, error } = await supabase
            .from('waste_logs')
            .insert({
              restaurant_id: restaurant.id,
              item_id: data.item_id,
              quantity: data.quantity,
              unit_price: item?.current_price || 0,
              total_value: totalValue,
              reason: data.reason,
              notes: data.notes,
              logged_by: user.id,
            })
            .select('*, item:inventory_items(*)')
            .single()

          if (error) throw error

          if (newLog) {
            setLogs([newLog, ...logs])
            toast.success('Waste logged')
          }
        }
      }
    } catch (error) {
      console.error('Error saving waste:', error)
      toast.error('Failed to log waste')
      throw error
    }
  }

  const filteredLogs = reasonFilter
    ? logs.filter((l) => l.reason === reasonFilter)
    : logs

  const totalWaste = calculateWasteTotal(filteredLogs)

  // Generate trend data for the last 7 days
  const trendData = {
    labels: Array.from({ length: 7 }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - (6 - i))
      return date.toLocaleDateString('en-US', { weekday: 'short' })
    }),
    values: Array.from({ length: 7 }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - (6 - i))
      const dateStr = date.toISOString().split('T')[0]
      return logs
        .filter((l) => l.logged_at.split('T')[0] === dateStr)
        .reduce((sum, l) => sum + (l.total_value || 0), 0)
    }),
  }

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
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Waste Tracking</h1>
            <p className="text-gray-500 mt-1">
              Log and analyze food waste to reduce costs
            </p>
          </div>
          <Button onClick={() => setIsFormOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Log Waste
          </Button>
        </div>

        {/* Summary card */}
        <Card className="bg-danger-50 border-danger-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-danger-700">
                Total Waste ({dateRange === '7' ? 'This Week' : dateRange === '30' ? 'This Month' : 'All Time'})
              </p>
              <p className="text-3xl font-bold text-danger-700 mt-1">
                {formatCurrency(totalWaste)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-danger-600">
                {filteredLogs.length} waste events
              </p>
            </div>
          </div>
        </Card>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Select
            options={[
              { value: '7', label: 'Last 7 days' },
              { value: '30', label: 'Last 30 days' },
              { value: '90', label: 'Last 90 days' },
            ]}
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
          />
          <Select
            options={[
              { value: '', label: 'All reasons' },
              { value: 'spoilage', label: 'Spoilage' },
              { value: 'overproduction', label: 'Overproduction' },
              { value: 'mistake', label: 'Prep Mistake' },
              { value: 'customer_return', label: 'Customer Return' },
            ]}
            value={reasonFilter}
            onChange={(e) => setReasonFilter(e.target.value)}
          />
        </div>

        {/* Charts */}
        <div className="grid lg:grid-cols-2 gap-6">
          <WasteChart logs={filteredLogs} />
          <WasteTrendChart data={trendData} />
        </div>

        {/* Waste list */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Recent Waste Events
          </h2>
          <WasteList logs={filteredLogs} />
        </div>

        {/* Form modal */}
        <WasteForm
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          onSave={handleSaveWaste}
          items={items}
        />
      </div>
    </DashboardLayout>
  )
}
