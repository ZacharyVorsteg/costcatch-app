'use client'

import { useState, useEffect } from 'react'
import { DashboardLayout } from '@/components/layout'
import { Card, Select, Badge } from '@/components/ui'
import {
  FoodCostChart,
  CategoryBreakdown,
  ExportButton,
} from '@/components/reports'
import { WasteTrendChart } from '@/components/waste'
import { createClient } from '@/lib/supabase'
import { formatCurrency, formatPercentage } from '@/lib/calculations'
import { TrendingDown, TrendingUp, DollarSign, Package, Trash2 } from 'lucide-react'

// Sample data - in production would come from API
const sampleFoodCostData = {
  labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
  values: [31.2, 29.8, 28.5, 27.9],
}

const sampleCategoryData = [
  { category: 'Proteins', value: 4500, percentage: 35 },
  { category: 'Produce', value: 2800, percentage: 22 },
  { category: 'Dairy', value: 1900, percentage: 15 },
  { category: 'Dry Goods', value: 1600, percentage: 12 },
  { category: 'Beverages', value: 1200, percentage: 9 },
  { category: 'Frozen', value: 900, percentage: 7 },
]

const sampleWasteTrendData = {
  labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
  values: [450, 380, 320, 290],
}

export default function ReportsPage() {
  const supabase = createClient()
  const [dateRange, setDateRange] = useState('30')
  const [loading, setLoading] = useState(false)

  const handleExport = (format: 'csv' | 'pdf') => {
    // Export feature placeholder
    alert(`Export as ${format.toUpperCase()} - Feature coming soon!`)
  }

  // Summary stats
  const stats = [
    {
      title: 'Avg Food Cost',
      value: '29.4%',
      change: -2.1,
      changeLabel: 'vs last period',
      icon: DollarSign,
      color: 'text-brand-600 bg-brand-100',
    },
    {
      title: 'Inventory Value',
      value: '$12,900',
      change: 5.2,
      changeLabel: 'vs last period',
      icon: Package,
      color: 'text-blue-600 bg-blue-100',
    },
    {
      title: 'Total Waste',
      value: '$1,440',
      change: -18.5,
      changeLabel: 'vs last period',
      icon: Trash2,
      color: 'text-danger-600 bg-danger-100',
    },
    {
      title: 'Est. Savings',
      value: '$2,100',
      change: 12.4,
      changeLabel: 'this month',
      icon: TrendingDown,
      color: 'text-purple-600 bg-purple-100',
    },
  ]

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
            <p className="text-gray-500 mt-1">
              Analyze your food costs, waste, and savings
            </p>
          </div>
          <div className="flex gap-3">
            <Select
              options={[
                { value: '7', label: 'Last 7 days' },
                { value: '30', label: 'Last 30 days' },
                { value: '90', label: 'Last 90 days' },
                { value: '365', label: 'Last year' },
              ]}
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
            />
            <ExportButton onExport={handleExport} />
          </div>
        </div>

        {/* Summary stats */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <Card key={stat.title}>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-500">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {stat.value}
                  </p>
                  <div
                    className={`flex items-center gap-1 text-xs mt-1 ${
                      stat.change < 0 ? 'text-brand-600' : 'text-danger-600'
                    }`}
                  >
                    {stat.change < 0 ? (
                      <TrendingDown className="h-3 w-3" />
                    ) : (
                      <TrendingUp className="h-3 w-3" />
                    )}
                    {Math.abs(stat.change)}% {stat.changeLabel}
                  </div>
                </div>
                <div className={`p-2 rounded-lg ${stat.color}`}>
                  <stat.icon className="h-5 w-5" />
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Charts */}
        <div className="grid lg:grid-cols-2 gap-6">
          <FoodCostChart data={sampleFoodCostData} targetPercentage={30} />
          <CategoryBreakdown data={sampleCategoryData} />
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <WasteTrendChart data={sampleWasteTrendData} />

          {/* Top wasted items */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Top Wasted Items
            </h3>
            <div className="space-y-3">
              {[
                { name: 'Lettuce', value: 180, reason: 'Spoilage' },
                { name: 'Tomatoes', value: 120, reason: 'Spoilage' },
                { name: 'Salmon', value: 95, reason: 'Overproduction' },
                { name: 'Avocados', value: 75, reason: 'Spoilage' },
                { name: 'Shrimp', value: 60, reason: 'Prep mistake' },
              ].map((item, index) => (
                <div
                  key={item.name}
                  className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-400 w-5">
                      {index + 1}.
                    </span>
                    <div>
                      <p className="font-medium text-gray-900">{item.name}</p>
                      <p className="text-xs text-gray-500">{item.reason}</p>
                    </div>
                  </div>
                  <span className="text-sm font-medium text-danger-600">
                    -{formatCurrency(item.value)}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Vendor price changes */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Recent Price Changes
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs text-gray-500 border-b border-gray-100">
                  <th className="pb-3 font-medium">Item</th>
                  <th className="pb-3 font-medium">Vendor</th>
                  <th className="pb-3 font-medium">Old Price</th>
                  <th className="pb-3 font-medium">New Price</th>
                  <th className="pb-3 font-medium">Change</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {[
                  {
                    item: 'Salmon fillet',
                    vendor: 'Sysco',
                    oldPrice: 11.29,
                    newPrice: 12.99,
                  },
                  {
                    item: 'Avocados',
                    vendor: 'US Foods',
                    oldPrice: 1.29,
                    newPrice: 1.49,
                  },
                  {
                    item: 'Chicken breast',
                    vendor: 'Sysco',
                    oldPrice: 4.29,
                    newPrice: 3.99,
                  },
                  {
                    item: 'Heavy cream',
                    vendor: 'Local Dairy',
                    oldPrice: 5.29,
                    newPrice: 5.49,
                  },
                ].map((row) => {
                  const change =
                    ((row.newPrice - row.oldPrice) / row.oldPrice) * 100
                  return (
                    <tr
                      key={row.item}
                      className="border-b border-gray-50 last:border-0"
                    >
                      <td className="py-3 font-medium text-gray-900">
                        {row.item}
                      </td>
                      <td className="py-3 text-gray-500">{row.vendor}</td>
                      <td className="py-3 text-gray-500">
                        {formatCurrency(row.oldPrice)}
                      </td>
                      <td className="py-3 font-medium text-gray-900">
                        {formatCurrency(row.newPrice)}
                      </td>
                      <td className="py-3">
                        <Badge
                          variant={change > 0 ? 'danger' : 'success'}
                          size="sm"
                        >
                          {change > 0 ? '+' : ''}
                          {formatPercentage(change, 1)}
                        </Badge>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  )
}
