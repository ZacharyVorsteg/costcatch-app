'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Check } from 'lucide-react'
import { DashboardLayout } from '@/components/layout'
import { Button, Card, Modal } from '@/components/ui'
import { NumberPad, ItemRow, CountSummary } from '@/components/count'
import { createClient } from '@/lib/supabase'
import { InventoryItem, Category } from '@/lib/types'
import { formatCurrency } from '@/lib/calculations'
import { useToast } from '@/contexts/ToastContext'

interface CountData {
  [itemId: string]: number
}

export default function CountPage() {
  const router = useRouter()
  const supabase = createClient()
  const toast = useToast()
  const [items, setItems] = useState<InventoryItem[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [counts, setCounts] = useState<CountData>({})
  const [activeItemId, setActiveItemId] = useState<string | null>(null)
  const [inputValue, setInputValue] = useState('')
  const [startTime, setStartTime] = useState<Date | null>(null)
  const [showComplete, setShowComplete] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  useEffect(() => {
    loadItems()
  }, [])

  useEffect(() => {
    // Start timer when first item is counted
    if (Object.keys(counts).length === 1 && !startTime) {
      setStartTime(new Date())
    }
  }, [counts, startTime])

  async function loadItems() {
    try {
      const { data: { user } } = await supabase.auth.getUser()

      if (user) {
        const { data: restaurant } = await supabase
          .from('restaurants')
          .select('id')
          .eq('user_id', user.id)
          .single()

        if (restaurant) {
          const { data: itemsData } = await supabase
            .from('inventory_items')
            .select('*, category:categories(*)')
            .eq('restaurant_id', restaurant.id)
            .eq('is_active', true)
            .order('name')

          const { data: categoriesData } = await supabase
            .from('categories')
            .select('*')
            .eq('restaurant_id', restaurant.id)
            .order('sort_order')

          setItems(itemsData || [])
          setCategories(categoriesData || [])
        }
      }
    } catch {
      // Items load failed - continue with empty state
    } finally {
      setLoading(false)
    }
  }

  const handleItemClick = (itemId: string) => {
    setActiveItemId(itemId)
    setInputValue(counts[itemId]?.toString() || '')
  }

  const handleDone = () => {
    if (activeItemId && inputValue) {
      setCounts({
        ...counts,
        [activeItemId]: parseFloat(inputValue),
      })
    }
    setActiveItemId(null)
    setInputValue('')
  }

  const totalValue = Object.entries(counts).reduce((sum, [itemId, quantity]) => {
    const item = items.find((i) => i.id === itemId)
    if (item?.current_price) {
      return sum + quantity * item.current_price
    }
    return sum
  }, 0)

  const itemsCounted = Object.keys(counts).length

  async function saveCount() {
    setSaving(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()

      if (user) {
        const { data: restaurant } = await supabase
          .from('restaurants')
          .select('id')
          .eq('user_id', user.id)
          .single()

        if (restaurant) {
          // Create the count record
          const { data: count, error: countError } = await supabase
            .from('inventory_counts')
            .insert({
              restaurant_id: restaurant.id,
              counted_by: user.id,
              count_date: new Date().toISOString().split('T')[0],
              total_value: totalValue,
            })
            .select()
            .single()

          if (countError) throw countError

          // Create count items
          const countItems = Object.entries(counts).map(([itemId, quantity]) => {
            const item = items.find((i) => i.id === itemId)
            return {
              count_id: count.id,
              item_id: itemId,
              quantity,
              unit_price: item?.current_price || 0,
              total_value: (item?.current_price || 0) * quantity,
            }
          })

          const { error: itemsError } = await supabase.from('count_items').insert(countItems)
          if (itemsError) throw itemsError

          toast.success('Count saved')
          setShowComplete(true)
        }
      }
    } catch {
      toast.error('Failed to save count')
    } finally {
      setSaving(false)
    }
  }

  const filteredItems = selectedCategory
    ? items.filter((i) => i.category_id === selectedCategory)
    : items

  // Group items by category for display
  const groupedItems = filteredItems.reduce((acc, item) => {
    const categoryName = item.category?.name || 'Uncategorized'
    if (!acc[categoryName]) {
      acc[categoryName] = []
    }
    acc[categoryName].push(item)
    return acc
  }, {} as Record<string, InventoryItem[]>)

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
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.back()}
              className="p-2 rounded-lg hover:bg-gray-100"
            >
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Quick Count</h1>
              <p className="text-sm text-gray-500">
                {new Date().toLocaleDateString('en-US', {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
          </div>
          <Button
            onClick={saveCount}
            disabled={itemsCounted === 0}
            isLoading={saving}
          >
            <Check className="h-4 w-4 mr-2" />
            I'm Done
          </Button>
        </div>

        {/* Summary */}
        <CountSummary
          totalValue={totalValue}
          itemsCounted={itemsCounted}
          totalItems={items.length}
          startTime={startTime}
        />

        {/* Category filter */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
              selectedCategory === null
                ? 'bg-brand-600 text-white'
                : 'bg-gray-100 text-gray-700'
            }`}
          >
            All
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                selectedCategory === category.id
                  ? 'bg-brand-600 text-white'
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Items list */}
        <div className="space-y-6">
          {Object.entries(groupedItems).map(([categoryName, categoryItems]) => (
            <div key={categoryName}>
              <h3 className="text-sm font-medium text-gray-500 mb-2">
                {categoryName}
              </h3>
              <div className="space-y-2">
                {categoryItems.map((item) => (
                  <ItemRow
                    key={item.id}
                    item={item}
                    quantity={counts[item.id] ?? null}
                    isActive={activeItemId === item.id}
                    onClick={() => handleItemClick(item.id)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Number pad modal */}
        {activeItemId && (
          <div className="fixed inset-x-0 bottom-0 z-50 p-4 bg-gradient-to-t from-gray-100 to-transparent pt-20 safe-bottom">
            <div className="max-w-sm mx-auto">
              <div className="text-center mb-4">
                <p className="font-medium text-gray-900">
                  {items.find((i) => i.id === activeItemId)?.name}
                </p>
                <p className="text-sm text-gray-500">
                  Enter quantity in {items.find((i) => i.id === activeItemId)?.unit}
                </p>
              </div>
              <NumberPad
                value={inputValue}
                onChange={setInputValue}
                onDone={handleDone}
              />
            </div>
          </div>
        )}

        {/* Success modal */}
        <Modal isOpen={showComplete} onClose={() => router.push('/dashboard')}>
          <div className="text-center py-6">
            <div className="w-16 h-16 bg-brand-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="h-8 w-8 text-brand-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Count Complete!
            </h2>
            <p className="text-gray-600 mb-2">
              {itemsCounted} items counted
            </p>
            <p className="text-2xl font-bold text-brand-600 mb-6">
              {formatCurrency(totalValue)}
            </p>
            <Button onClick={() => router.push('/dashboard')} className="w-full">
              Back to Dashboard
            </Button>
          </div>
        </Modal>
      </div>
    </DashboardLayout>
  )
}
