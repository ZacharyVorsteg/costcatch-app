'use client'

import { Card, CardHeader, CardTitle, DoughnutChart, BarChart } from '@/components/ui'
import { WasteLog } from '@/lib/types'
import { calculateWasteByReason, formatCurrency } from '@/lib/calculations'
import { WASTE_REASONS } from '@/lib/seed-data'

interface WasteChartProps {
  logs: WasteLog[]
}

export function WasteChart({ logs }: WasteChartProps) {
  const wasteByReason = calculateWasteByReason(logs)

  const chartData = {
    labels: WASTE_REASONS.map((r) => r.label),
    datasets: [
      {
        data: WASTE_REASONS.map((r) => wasteByReason[r.value] || 0),
        backgroundColor: ['#ef4444', '#f59e0b', '#3b82f6', '#6b7280'],
      },
    ],
  }

  const totalWaste = Object.values(wasteByReason).reduce((a, b) => a + b, 0)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Waste by Reason</CardTitle>
        <span className="text-sm text-gray-500">
          Total: {formatCurrency(totalWaste)}
        </span>
      </CardHeader>
      <DoughnutChart data={chartData} height={250} />
    </Card>
  )
}

interface WasteTrendChartProps {
  data: {
    labels: string[]
    values: number[]
  }
}

export function WasteTrendChart({ data }: WasteTrendChartProps) {
  const chartData = {
    labels: data.labels,
    datasets: [
      {
        label: 'Waste Value',
        data: data.values,
        backgroundColor: '#ef4444',
      },
    ],
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Waste Trend</CardTitle>
      </CardHeader>
      <BarChart data={chartData} height={250} />
    </Card>
  )
}
