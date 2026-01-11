'use client'

import { DollarSign, Package, Trash2, TrendingDown } from 'lucide-react'
import { Card } from '@/components/ui'
import { formatCurrency } from '@/lib/calculations'
import { cn } from '@/lib/utils'

interface Stat {
  name: string
  value: string | number
  change?: number
  changeLabel?: string
  icon: React.ElementType
  color: string
}

interface StatsGridProps {
  inventoryValue: number
  wasteThisWeek: number
  itemsTracked: number
  savingsThisMonth: number
}

export function StatsGrid({
  inventoryValue,
  wasteThisWeek,
  itemsTracked,
  savingsThisMonth,
}: StatsGridProps) {
  const stats: Stat[] = [
    {
      name: 'Inventory Value',
      value: formatCurrency(inventoryValue),
      icon: DollarSign,
      color: 'bg-brand-100 text-brand-600',
    },
    {
      name: 'Waste This Week',
      value: formatCurrency(wasteThisWeek),
      change: -12,
      changeLabel: 'vs last week',
      icon: Trash2,
      color: 'bg-danger-100 text-danger-600',
    },
    {
      name: 'Items Tracked',
      value: itemsTracked,
      icon: Package,
      color: 'bg-blue-100 text-blue-600',
    },
    {
      name: 'Savings This Month',
      value: formatCurrency(savingsThisMonth),
      change: 8,
      changeLabel: 'vs last month',
      icon: TrendingDown,
      color: 'bg-purple-100 text-purple-600',
    },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <Card key={stat.name} className="relative">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-500">{stat.name}</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {stat.value}
              </p>
              {stat.change !== undefined && (
                <p
                  className={cn(
                    'text-xs mt-1',
                    stat.change < 0 ? 'text-brand-600' : 'text-danger-600'
                  )}
                >
                  {stat.change > 0 ? '+' : ''}
                  {stat.change}% {stat.changeLabel}
                </p>
              )}
            </div>
            <div className={cn('p-2 rounded-lg', stat.color)}>
              <stat.icon className="h-5 w-5" />
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
