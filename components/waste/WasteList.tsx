'use client'

import { Trash2 } from 'lucide-react'
import { Badge } from '@/components/ui'
import { WasteLog } from '@/lib/types'
import { formatCurrency } from '@/lib/calculations'
import { formatDateTime } from '@/lib/utils'
import { WASTE_REASONS } from '@/lib/seed-data'

interface WasteListProps {
  logs: WasteLog[]
}

export function WasteList({ logs }: WasteListProps) {
  const getReasonColor = (reason: string) => {
    switch (reason) {
      case 'spoilage':
        return 'danger'
      case 'overproduction':
        return 'warning'
      case 'mistake':
        return 'info'
      case 'customer_return':
        return 'default'
      default:
        return 'default'
    }
  }

  const getReasonLabel = (reason: string) => {
    return WASTE_REASONS.find((r) => r.value === reason)?.label || reason
  }

  if (logs.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-gray-100 rounded-full mb-3">
          <Trash2 className="h-6 w-6 text-gray-400" />
        </div>
        <p className="text-gray-500">No waste logged yet</p>
        <p className="text-sm text-gray-400 mt-1">
          That's good! Keep up the great work.
        </p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 divide-y divide-gray-100">
      {logs.map((log) => (
        <div key={log.id} className="p-4 hover:bg-gray-50 transition-colors">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-danger-100 rounded-lg">
                <Trash2 className="h-4 w-4 text-danger-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">
                  {log.item?.name || 'Unknown Item'}
                </p>
                <p className="text-sm text-gray-500">
                  {log.quantity} {log.item?.unit}
                </p>
                {log.notes && (
                  <p className="text-sm text-gray-400 mt-1">{log.notes}</p>
                )}
              </div>
            </div>
            <div className="text-right">
              <p className="font-semibold text-danger-600">
                -{formatCurrency(log.total_value || 0)}
              </p>
              <Badge
                variant={getReasonColor(log.reason) as any}
                size="sm"
                className="mt-1"
              >
                {getReasonLabel(log.reason)}
              </Badge>
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-2 ml-11">
            {formatDateTime(log.logged_at)}
          </p>
        </div>
      ))}
    </div>
  )
}
