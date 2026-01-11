'use client'

import { Check } from 'lucide-react'
import { InventoryItem } from '@/lib/types'
import { formatCurrency } from '@/lib/calculations'
import { cn } from '@/lib/utils'

interface ItemRowProps {
  item: InventoryItem
  quantity: number | null
  isActive: boolean
  onClick: () => void
}

export function ItemRow({ item, quantity, isActive, onClick }: ItemRowProps) {
  const isCounted = quantity !== null
  const value = isCounted && item.current_price ? quantity * item.current_price : 0

  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full flex items-center justify-between p-4 rounded-xl transition-all',
        isActive
          ? 'bg-brand-50 border-2 border-brand-500'
          : isCounted
          ? 'bg-gray-50 border-2 border-transparent'
          : 'bg-white border-2 border-gray-100 hover:border-gray-200'
      )}
    >
      <div className="flex items-center gap-3">
        <div
          className={cn(
            'w-8 h-8 rounded-full flex items-center justify-center transition-colors',
            isCounted ? 'bg-brand-600' : 'bg-gray-200'
          )}
        >
          {isCounted ? (
            <Check className="h-4 w-4 text-white" />
          ) : (
            <span className="text-xs text-gray-500">{item.name[0]}</span>
          )}
        </div>
        <div className="text-left">
          <p className="font-medium text-gray-900">{item.name}</p>
          <p className="text-sm text-gray-500">
            {item.unit}
            {item.current_price && ` - ${formatCurrency(item.current_price)}`}
          </p>
        </div>
      </div>
      <div className="text-right">
        {isCounted ? (
          <>
            <p className="text-lg font-semibold text-gray-900">
              {quantity} {item.unit}
            </p>
            {value > 0 && (
              <p className="text-sm text-gray-500">{formatCurrency(value)}</p>
            )}
          </>
        ) : (
          <p className="text-sm text-gray-400">Tap to count</p>
        )}
      </div>
    </button>
  )
}
