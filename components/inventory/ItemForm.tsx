'use client'

import { useState, useEffect } from 'react'
import { Button, Input, Select, Modal, ModalFooter } from '@/components/ui'
import { InventoryItem, Category, Vendor } from '@/lib/types'
import { UNIT_OPTIONS } from '@/lib/seed-data'

interface ItemFormProps {
  isOpen: boolean
  onClose: () => void
  onSave: (item: Partial<InventoryItem>) => void
  item?: InventoryItem | null
  categories: Category[]
  vendors: Vendor[]
}

export function ItemForm({
  isOpen,
  onClose,
  onSave,
  item,
  categories,
  vendors,
}: ItemFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    category_id: '',
    unit: '',
    current_price: '',
    par_level: '',
    vendor_id: '',
    is_active: true,
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (item) {
      setFormData({
        name: item.name,
        category_id: item.category_id || '',
        unit: item.unit,
        current_price: item.current_price?.toString() || '',
        par_level: item.par_level?.toString() || '',
        vendor_id: item.vendor_id || '',
        is_active: item.is_active,
      })
    } else {
      setFormData({
        name: '',
        category_id: '',
        unit: '',
        current_price: '',
        par_level: '',
        vendor_id: '',
        is_active: true,
      })
    }
  }, [item, isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await onSave({
        id: item?.id,
        name: formData.name,
        category_id: formData.category_id || undefined,
        unit: formData.unit,
        current_price: formData.current_price
          ? parseFloat(formData.current_price)
          : null,
        par_level: formData.par_level ? parseFloat(formData.par_level) : null,
        vendor_id: formData.vendor_id || undefined,
        is_active: formData.is_active,
      })
      onClose()
    } catch (error) {
      console.error('Error saving item:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={item ? 'Edit Item' : 'Add New Item'}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Item Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="e.g., Chicken breast"
          required
        />

        <div className="grid grid-cols-2 gap-4">
          <Select
            label="Category"
            options={categories.map((c) => ({ value: c.id, label: c.name }))}
            value={formData.category_id}
            onChange={(e) =>
              setFormData({ ...formData, category_id: e.target.value })
            }
            placeholder="Select category"
          />

          <Select
            label="Unit of Measure"
            options={UNIT_OPTIONS}
            value={formData.unit}
            onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
            placeholder="Select unit"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Current Price"
            type="number"
            step="0.01"
            value={formData.current_price}
            onChange={(e) =>
              setFormData({ ...formData, current_price: e.target.value })
            }
            placeholder="0.00"
          />

          <Input
            label="Par Level"
            type="number"
            step="0.5"
            value={formData.par_level}
            onChange={(e) =>
              setFormData({ ...formData, par_level: e.target.value })
            }
            placeholder="Minimum quantity to keep"
          />
        </div>

        <Select
          label="Vendor"
          options={vendors.map((v) => ({ value: v.id, label: v.name }))}
          value={formData.vendor_id}
          onChange={(e) =>
            setFormData({ ...formData, vendor_id: e.target.value })
          }
          placeholder="Select vendor (optional)"
        />

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="is_active"
            checked={formData.is_active}
            onChange={(e) =>
              setFormData({ ...formData, is_active: e.target.checked })
            }
            className="h-4 w-4 text-brand-600 focus:ring-brand-500 border-gray-300 rounded"
          />
          <label htmlFor="is_active" className="text-sm text-gray-700">
            Item is active (show in counts)
          </label>
        </div>

        <ModalFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" isLoading={loading}>
            {item ? 'Save Changes' : 'Add Item'}
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  )
}
