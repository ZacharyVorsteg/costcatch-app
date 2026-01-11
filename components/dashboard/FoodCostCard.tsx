'use client'

import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { Card } from '@/components/ui'
import { getFoodCostStatus, formatPercentage } from '@/lib/calculations'
import { cn } from '@/lib/utils'

interface FoodCostCardProps {
  currentPercentage: number
  previousPercentage?: number
  targetPercentage?: number
}

export function FoodCostCard({
  currentPercentage,
  previousPercentage,
  targetPercentage = 30,
}: FoodCostCardProps) {
  const status = getFoodCostStatus(currentPercentage)
  const change = previousPercentage
    ? currentPercentage - previousPercentage
    : 0

  const statusColors = {
    good: 'text-brand-600 bg-brand-50',
    warning: 'text-warning-600 bg-warning-50',
    danger: 'text-danger-600 bg-danger-50',
  }

  const statusLabels = {
    good: 'On Track',
    warning: 'Watch Closely',
    danger: 'Needs Attention',
  }

  return (
    <Card className="relative overflow-hidden">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 mb-1">
            Food Cost %
          </p>
          <div className="flex items-baseline gap-2">
            <span
              className={cn(
                'text-5xl font-bold',
                status === 'good' && 'text-brand-600',
                status === 'warning' && 'text-warning-600',
                status === 'danger' && 'text-danger-600'
              )}
            >
              {formatPercentage(currentPercentage, 1)}
            </span>
            {previousPercentage !== undefined && (
              <div
                className={cn(
                  'flex items-center gap-0.5 text-sm font-medium',
                  change < 0 && 'text-brand-600',
                  change > 0 && 'text-danger-600',
                  change === 0 && 'text-gray-500'
                )}
              >
                {change < 0 ? (
                  <TrendingDown className="h-4 w-4" />
                ) : change > 0 ? (
                  <TrendingUp className="h-4 w-4" />
                ) : (
                  <Minus className="h-4 w-4" />
                )}
                {formatPercentage(Math.abs(change), 1)}
              </div>
            )}
          </div>
        </div>
        <span
          className={cn(
            'px-3 py-1 rounded-full text-sm font-medium',
            statusColors[status]
          )}
        >
          {statusLabels[status]}
        </span>
      </div>

      {/* Target indicator */}
      <div className="mt-6">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="text-gray-500">Target: {formatPercentage(targetPercentage)}</span>
          <span className="text-gray-500">
            {currentPercentage <= targetPercentage
              ? 'Under target'
              : `${formatPercentage(currentPercentage - targetPercentage)} over`}
          </span>
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className={cn(
              'h-full rounded-full transition-all duration-500',
              status === 'good' && 'bg-brand-500',
              status === 'warning' && 'bg-warning-500',
              status === 'danger' && 'bg-danger-500'
            )}
            style={{ width: `${Math.min((currentPercentage / 50) * 100, 100)}%` }}
          />
        </div>
        <div
          className="relative h-0"
          style={{ left: `${(targetPercentage / 50) * 100}%` }}
        >
          <div className="absolute -top-2 w-0.5 h-2 bg-gray-400" />
        </div>
      </div>
    </Card>
  )
}
