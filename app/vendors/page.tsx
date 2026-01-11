'use client'

import { useState, useEffect } from 'react'
import { Plus, Phone, Mail, Package, Search } from 'lucide-react'
import { DashboardLayout } from '@/components/layout'
import {
  Button,
  Input,
  Card,
  Modal,
  ModalFooter,
  Badge,
  EmptyState,
} from '@/components/ui'
import { createClient } from '@/lib/supabase'
import { Vendor, InventoryItem } from '@/lib/types'
import { useToast } from '@/contexts/ToastContext'

export default function VendorsPage() {
  const supabase = createClient()
  const toast = useToast()
  const [vendors, setVendors] = useState<Vendor[]>([])
  const [items, setItems] = useState<InventoryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingVendor, setEditingVendor] = useState<Vendor | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    contact_name: '',
    phone: '',
    email: '',
  })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

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
          const { data: vendorsData } = await supabase
            .from('vendors')
            .select('*')
            .eq('restaurant_id', restaurant.id)
            .order('name')

          const { data: itemsData } = await supabase
            .from('inventory_items')
            .select('*')
            .eq('restaurant_id', restaurant.id)

          setVendors(vendorsData || [])
          setItems(itemsData || [])
        }
      }
    } catch (error) {
      console.error('Error loading vendors:', error)
    } finally {
      setLoading(false)
    }
  }

  const openForm = (vendor?: Vendor) => {
    if (vendor) {
      setEditingVendor(vendor)
      setFormData({
        name: vendor.name,
        contact_name: vendor.contact_name || '',
        phone: vendor.phone || '',
        email: vendor.email || '',
      })
    } else {
      setEditingVendor(null)
      setFormData({ name: '', contact_name: '', phone: '', email: '' })
    }
    setIsFormOpen(true)
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
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
          if (editingVendor) {
            // Update
            const { data, error } = await supabase
              .from('vendors')
              .update(formData)
              .eq('id', editingVendor.id)
              .select()
              .single()

            if (error) throw error

            if (data) {
              setVendors(vendors.map((v) => (v.id === data.id ? data : v)))
              toast.success('Vendor updated')
            }
          } else {
            // Create
            const { data, error } = await supabase
              .from('vendors')
              .insert({ ...formData, restaurant_id: restaurant.id })
              .select()
              .single()

            if (error) throw error

            if (data) {
              setVendors([...vendors, data])
              toast.success('Vendor added')
            }
          }
          setIsFormOpen(false)
        }
      }
    } catch (error) {
      console.error('Error saving vendor:', error)
      toast.error('Failed to save vendor')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(vendor: Vendor) {
    if (confirm(`Are you sure you want to delete "${vendor.name}"?`)) {
      try {
        const { error } = await supabase.from('vendors').delete().eq('id', vendor.id)
        if (error) throw error
        setVendors(vendors.filter((v) => v.id !== vendor.id))
        toast.success('Vendor deleted')
      } catch (error) {
        console.error('Error deleting vendor:', error)
        toast.error('Failed to delete vendor')
      }
    }
  }

  const getVendorItems = (vendorId: string) => {
    return items.filter((i) => i.vendor_id === vendorId)
  }

  const filteredVendors = vendors.filter((v) =>
    v.name.toLowerCase().includes(search.toLowerCase())
  )

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
            <h1 className="text-2xl font-bold text-gray-900">Vendors</h1>
            <p className="text-gray-500 mt-1">
              Manage your suppliers and track pricing
            </p>
          </div>
          <Button onClick={() => openForm()}>
            <Plus className="h-4 w-4 mr-2" />
            Add Vendor
          </Button>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            placeholder="Search vendors..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Vendors grid */}
        {filteredVendors.length === 0 ? (
          <EmptyState
            title={search ? 'No vendors found' : 'No vendors yet'}
            description={
              search
                ? 'Try adjusting your search'
                : 'Add your first vendor to start tracking prices'
            }
            action={
              !search && (
                <Button onClick={() => openForm()}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add First Vendor
                </Button>
              )
            }
          />
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVendors.map((vendor) => {
              const vendorItems = getVendorItems(vendor.id)
              return (
                <Card key={vendor.id} className="hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-gray-900 text-lg">
                        {vendor.name}
                      </h3>
                      {vendor.contact_name && (
                        <p className="text-sm text-gray-500">
                          {vendor.contact_name}
                        </p>
                      )}
                    </div>
                    <Badge variant="success">{vendorItems.length} items</Badge>
                  </div>

                  <div className="space-y-2 mb-4">
                    {vendor.phone && (
                      <a
                        href={`tel:${vendor.phone}`}
                        className="flex items-center gap-2 text-sm text-gray-600 hover:text-brand-600"
                      >
                        <Phone className="h-4 w-4" />
                        {vendor.phone}
                      </a>
                    )}
                    {vendor.email && (
                      <a
                        href={`mailto:${vendor.email}`}
                        className="flex items-center gap-2 text-sm text-gray-600 hover:text-brand-600"
                      >
                        <Mail className="h-4 w-4" />
                        {vendor.email}
                      </a>
                    )}
                  </div>

                  {vendorItems.length > 0 && (
                    <div className="pt-4 border-t border-gray-100">
                      <p className="text-xs text-gray-500 mb-2">Supplied items:</p>
                      <div className="flex flex-wrap gap-1">
                        {vendorItems.slice(0, 3).map((item) => (
                          <span
                            key={item.id}
                            className="px-2 py-0.5 bg-gray-100 rounded text-xs text-gray-600"
                          >
                            {item.name}
                          </span>
                        ))}
                        {vendorItems.length > 3 && (
                          <span className="px-2 py-0.5 bg-gray-100 rounded text-xs text-gray-600">
                            +{vendorItems.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => openForm(vendor)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(vendor)}
                      className="text-danger-600 hover:text-danger-700 hover:bg-danger-50"
                    >
                      Delete
                    </Button>
                  </div>
                </Card>
              )
            })}
          </div>
        )}

        {/* Form modal */}
        <Modal
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          title={editingVendor ? 'Edit Vendor' : 'Add Vendor'}
        >
          <form onSubmit={handleSave} className="space-y-4">
            <Input
              label="Vendor Name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="e.g., Sysco, US Foods"
              required
            />

            <Input
              label="Contact Name"
              value={formData.contact_name}
              onChange={(e) =>
                setFormData({ ...formData, contact_name: e.target.value })
              }
              placeholder="Your sales rep"
            />

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Phone"
                type="tel"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                placeholder="(555) 123-4567"
              />

              <Input
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder="rep@vendor.com"
              />
            </div>

            <ModalFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsFormOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" isLoading={saving}>
                {editingVendor ? 'Save Changes' : 'Add Vendor'}
              </Button>
            </ModalFooter>
          </form>
        </Modal>
      </div>
    </DashboardLayout>
  )
}
