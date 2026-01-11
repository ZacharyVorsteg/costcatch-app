'use client'

import { DollarSign, Package, Clock, CheckCircle } from 'lucide-react'
import { Card } from '@/components/ui'
import { formatCurrency } from '@/lib/calculations'

interface CountSummaryProps {
  totalValue: number
  itemsCounted: number
  totalItems: number
  startTime: Date | null
}

export function CountSummary({
  totalValue,
  itemsCounted,
  totalItems,
  startTime,
}: CountSummaryProps) {
  const percentComplete = totalItems > 0 ? (itemsCounted / totalItems) * 100 : 0

  const elapsedTime = startTime
    ? Math.floor((Date.now() - startTime.getTime()) / 1000)
    : 0

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <Card className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm">
      <div className="grid grid-cols-4 gap-4">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-10 h-10 bg-brand-100 rounded-lg mb-2">
            <DollarSign className="h-5 w-5 text-brand-600" />
          </div>
          <p className="text-lg font-semibold text-gray-900">
            {formatCurrency(totalValue)}
          </p>
          <p className="text-xs text-gray-500">Total Value</p>
        </div>

        <div className="text-center">
          <div className="inline-flex items-center justify-center w-10 h-10 bg-blue-100 rounded-lg mb-2">
            <Package className="h-5 w-5 text-blue-600" />
          </div>
          <p className="text-lg font-semibold text-gray-900">
            {itemsCounted}/{totalItems}
          </p>
          <p className="text-xs text-gray-500">Items</p>
        </div>

        <div className="text-center">
          <div className="inline-flex items-center justify-center w-10 h-10 bg-purple-100 rounded-lg mb-2">
            <Clock className="h-5 w-5 text-purple-600" />
          </div>
          <p className="text-lg font-semibold text-gray-900">
            {formatTime(elapsedTime)}
          </p>
          <p className="text-xs text-gray-500">Time</p>
        </div>

        <div className="text-center">
          <div className="inline-flex items-center justify-center w-10 h-10 bg-amber-100 rounded-lg mb-2">
            <CheckCircle className="h-5 w-5 text-amber-600" />
          </div>
          <p className="text-lg font-semibold text-gray-900">
            {percentComplete.toFixed(0)}%
          </p>
          <p className="text-xs text-gray-500">Complete</p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mt-4">
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-brand-500 rounded-full transition-all duration-300"
            style={{ width: `${percentComplete}%` }}
          />
        </div>
      </div>
    </Card>
  )
}
