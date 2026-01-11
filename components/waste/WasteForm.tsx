'use client'

import { useState } from 'react'
import { Button, Input, Select, Modal, ModalFooter } from '@/components/ui'
import { InventoryItem } from '@/lib/types'
import { WASTE_REASONS } from '@/lib/seed-data'

interface WasteFormProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: {
    item_id: string
    quantity: number
    reason: string
    notes: string
  }) => void
  items: InventoryItem[]
}

export function WasteForm({ isOpen, onClose, onSave, items }: WasteFormProps) {
  const [formData, setFormData] = useState({
    item_id: '',
    quantity: '',
    reason: '',
    notes: '',
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await onSave({
        item_id: formData.item_id,
        quantity: parseFloat(formData.quantity),
        reason: formData.reason,
        notes: formData.notes,
      })
      setFormData({ item_id: '', quantity: '', reason: '', notes: '' })
      onClose()
    } catch {
      // Parent handles the error
    } finally {
      setLoading(false)
    }
  }

  const selectedItem = items.find((i) => i.id === formData.item_id)
  const estimatedValue = selectedItem?.current_price
    ? parseFloat(formData.quantity || '0') * selectedItem.current_price
    : 0

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Log Waste" size="lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Select
          label="Item"
          options={items.map((i) => ({ value: i.id, label: `${i.name} (${i.unit})` }))}
          value={formData.item_id}
          onChange={(e) => setFormData({ ...formData, item_id: e.target.value })}
          placeholder="Select item"
          required
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            label={`Quantity${selectedItem ? ` (${selectedItem.unit})` : ''}`}
            type="number"
            step="0.1"
            value={formData.quantity}
            onChange={(e) =>
              setFormData({ ...formData, quantity: e.target.value })
            }
            placeholder="0"
            required
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Estimated Value
            </label>
            <div className="px-4 py-2.5 bg-gray-50 rounded-lg border border-gray-200 text-lg font-semibold text-gray-900">
              ${estimatedValue.toFixed(2)}
            </div>
          </div>
        </div>

        <Select
          label="Reason"
          options={WASTE_REASONS.map((r) => ({ value: r.value, label: r.label }))}
          value={formData.reason}
          onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
          placeholder="Select reason"
          required
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Notes (optional)
          </label>
          <textarea
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            placeholder="Any additional details..."
            rows={3}
            className="block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
          />
        </div>

        <ModalFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" isLoading={loading} variant="danger">
            Log Waste
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  )
}
