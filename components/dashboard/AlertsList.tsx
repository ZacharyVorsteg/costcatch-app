'use client'

import { AlertTriangle, TrendingUp, Package, Trash2 } from 'lucide-react'
import { Card, CardHeader, CardTitle, Badge } from '@/components/ui'
import { Alert } from '@/lib/types'
import { cn } from '@/lib/utils'
import { formatRelativeTime } from '@/lib/utils'

interface AlertsListProps {
  alerts: Alert[]
}

export function AlertsList({ alerts }: AlertsListProps) {
  const getAlertIcon = (type: Alert['type']) => {
    switch (type) {
      case 'price_spike':
        return TrendingUp
      case 'low_stock':
        return Package
      case 'high_waste':
        return Trash2
      default:
        return AlertTriangle
    }
  }

  const getSeverityStyles = (severity: Alert['severity']) => {
    switch (severity) {
      case 'danger':
        return 'bg-danger-50 text-danger-600 border-danger-100'
      case 'warning':
        return 'bg-warning-50 text-warning-600 border-warning-100'
      default:
        return 'bg-blue-50 text-blue-600 border-blue-100'
    }
  }

  if (alerts.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Alerts</CardTitle>
        </CardHeader>
        <div className="text-center py-8">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-brand-100 rounded-full mb-3">
            <AlertTriangle className="h-6 w-6 text-brand-600" />
          </div>
          <p className="text-gray-500">No alerts right now. Nice work!</p>
        </div>
      </Card>
    )
  }

  return (
    <Card padding="none">
      <CardHeader className="px-6 pt-6">
        <CardTitle>Alerts</CardTitle>
        <Badge variant={alerts.length > 0 ? 'danger' : 'success'}>
          {alerts.length} active
        </Badge>
      </CardHeader>
      <div className="divide-y divide-gray-100">
        {alerts.map((alert) => {
          const Icon = getAlertIcon(alert.type)
          return (
            <div
              key={alert.id}
              className="px-6 py-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-start gap-3">
                <div
                  className={cn(
                    'p-2 rounded-lg',
                    getSeverityStyles(alert.severity)
                  )}
                >
                  <Icon className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900">{alert.title}</p>
                  <p className="text-sm text-gray-500 mt-0.5">{alert.message}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {formatRelativeTime(alert.created_at)}
                  </p>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </Card>
  )
}
