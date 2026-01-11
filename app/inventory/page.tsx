'use client'

import { useState, useEffect } from 'react'
import { Plus, Search, Upload } from 'lucide-react'
import { DashboardLayout } from '@/components/layout'
import { Button, Input, EmptyState } from '@/components/ui'
import { ItemList, ItemForm, CategoryFilter } from '@/components/inventory'
import { createClient } from '@/lib/supabase'
import { InventoryItem, Category, Vendor } from '@/lib/types'
import { DEFAULT_CATEGORIES, DEFAULT_ITEMS } from '@/lib/seed-data'
import { useToast } from '@/contexts/ToastContext'

export default function InventoryPage() {
  const supabase = createClient()
  const toast = useToast()
  const [items, setItems] = useState<InventoryItem[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [vendors, setVendors] = useState<Vendor[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null)

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    try {
      const { data: { user } } = await supabase.auth.getUser()

      if (user) {
        // Get restaurant ID
        const { data: restaurant } = await supabase
          .from('restaurants')
          .select('id')
          .eq('user_id', user.id)
          .single()

        if (restaurant) {
          // Load categories
          const { data: categoriesData } = await supabase
            .from('categories')
            .select('*')
            .eq('restaurant_id', restaurant.id)
            .order('sort_order')

          // Load vendors
          const { data: vendorsData } = await supabase
            .from('vendors')
            .select('*')
            .eq('restaurant_id', restaurant.id)

          // Load items with category
          const { data: itemsData } = await supabase
            .from('inventory_items')
            .select('*, category:categories(*), vendor:vendors(*)')
            .eq('restaurant_id', restaurant.id)
            .order('name')

          setCategories(categoriesData || [])
          setVendors(vendorsData || [])
          setItems(itemsData || [])

          // If no categories exist, seed with defaults
          if (!categoriesData || categoriesData.length === 0) {
            await seedDefaultData(restaurant.id)
          }
        }
      }
    } catch (error) {
      console.error('Error loading inventory:', error)
    } finally {
      setLoading(false)
    }
  }

  async function seedDefaultData(restaurantId: string) {
    try {
      // Insert default categories
      const { data: newCategories } = await supabase
        .from('categories')
        .insert(
          DEFAULT_CATEGORIES.map((c) => ({
            restaurant_id: restaurantId,
            ...c,
          }))
        )
        .select()

      if (newCategories) {
        setCategories(newCategories)

        // Create a map of category names to IDs
        const categoryMap = newCategories.reduce((acc, cat) => {
          acc[cat.name] = cat.id
          return acc
        }, {} as Record<string, string>)

        // Insert default items
        const itemsToInsert = DEFAULT_ITEMS.map((item) => ({
          restaurant_id: restaurantId,
          name: item.name,
          unit: item.unit,
          category_id: categoryMap[item.category] || null,
          current_price: item.default_price,
          is_active: true,
        }))

        const { data: newItems } = await supabase
          .from('inventory_items')
          .insert(itemsToInsert)
          .select('*, category:categories(*)')

        if (newItems) {
          setItems(newItems)
        }
      }
    } catch (error) {
      console.error('Error seeding default data:', error)
    }
  }

  async function handleSaveItem(itemData: Partial<InventoryItem>) {
    try {
      const { data: { user } } = await supabase.auth.getUser()

      if (user) {
        const { data: restaurant } = await supabase
          .from('restaurants')
          .select('id')
          .eq('user_id', user.id)
          .single()

        if (restaurant) {
          if (itemData.id) {
            // Update existing item
            const { data, error } = await supabase
              .from('inventory_items')
              .update(itemData)
              .eq('id', itemData.id)
              .select('*, category:categories(*), vendor:vendors(*)')
              .single()

            if (error) throw error

            if (data) {
              setItems(items.map((i) => (i.id === data.id ? data : i)))
              toast.success('Item updated')
            }
          } else {
            // Create new item
            const { data, error } = await supabase
              .from('inventory_items')
              .insert({ ...itemData, restaurant_id: restaurant.id })
              .select('*, category:categories(*), vendor:vendors(*)')
              .single()

            if (error) throw error

            if (data) {
              setItems([...items, data])
              toast.success('Item added')
            }
          }
        }
      }
    } catch (error) {
      console.error('Error saving item:', error)
      toast.error('Failed to save item')
    }
  }

  async function handleDeleteItem(item: InventoryItem) {
    if (confirm(`Are you sure you want to delete "${item.name}"?`)) {
      try {
        const { error } = await supabase.from('inventory_items').delete().eq('id', item.id)
        if (error) throw error
        setItems(items.filter((i) => i.id !== item.id))
        toast.success('Item deleted')
      } catch (error) {
        console.error('Error deleting item:', error)
        toast.error('Failed to delete item')
      }
    }
  }

  const filteredItems = items.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase())
    const matchesCategory = !selectedCategory || item.category_id === selectedCategory
    return matchesSearch && matchesCategory
  })

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
        {/* Page header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Inventory</h1>
            <p className="text-gray-500 mt-1">
              Manage your tracked items, prices, and par levels
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline">
              <Upload className="h-4 w-4 mr-2" />
              Import
            </Button>
            <Button onClick={() => setIsFormOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Item
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Search items..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </div>

        <CategoryFilter
          categories={categories}
          selectedCategory={selectedCategory}
          onSelect={setSelectedCategory}
        />

        {/* Items list */}
        {filteredItems.length === 0 ? (
          <EmptyState
            title={search ? 'No items found' : 'No inventory items yet'}
            description={
              search
                ? 'Try adjusting your search or filters'
                : 'Add your first inventory item to start tracking costs'
            }
            action={
              !search && (
                <Button onClick={() => setIsFormOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add First Item
                </Button>
              )
            }
          />
        ) : (
          <ItemList
            items={filteredItems}
            onEdit={(item) => {
              setEditingItem(item)
              setIsFormOpen(true)
            }}
            onDelete={handleDeleteItem}
          />
        )}

        {/* Item form modal */}
        <ItemForm
          isOpen={isFormOpen}
          onClose={() => {
            setIsFormOpen(false)
            setEditingItem(null)
          }}
          onSave={handleSaveItem}
          item={editingItem}
          categories={categories}
          vendors={vendors}
        />
      </div>
    </DashboardLayout>
  )
}
