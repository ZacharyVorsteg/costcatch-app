'use client'

import { Card, CardHeader, CardTitle, DoughnutChart } from '@/components/ui'
import { formatCurrency } from '@/lib/calculations'

interface CategoryBreakdownProps {
  data: {
    category: string
    value: number
    percentage: number
  }[]
}

export function CategoryBreakdown({ data }: CategoryBreakdownProps) {
  const chartData = {
    labels: data.map((d) => d.category),
    datasets: [
      {
        data: data.map((d) => d.value),
        backgroundColor: [
          '#16a34a',
          '#22c55e',
          '#4ade80',
          '#86efac',
          '#bbf7d0',
          '#dcfce7',
          '#f0fdf4',
        ],
      },
    ],
  }

  const total = data.reduce((sum, d) => sum + d.value, 0)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cost by Category</CardTitle>
        <span className="text-sm text-gray-500">
          Total: {formatCurrency(total)}
        </span>
      </CardHeader>
      <div className="grid md:grid-cols-2 gap-6 items-center">
        <DoughnutChart data={chartData} height={250} />
        <div className="space-y-3">
          {data.map((item, index) => (
            <div
              key={item.category}
              className="flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{
                    backgroundColor: chartData.datasets[0].backgroundColor[index],
                  }}
                />
                <span className="text-sm text-gray-700">{item.category}</span>
              </div>
              <div className="text-right">
                <span className="text-sm font-medium text-gray-900">
                  {formatCurrency(item.value)}
                </span>
                <span className="text-xs text-gray-500 ml-2">
                  ({item.percentage.toFixed(1)}%)
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  )
}
