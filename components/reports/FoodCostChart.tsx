'use client'

import { Card, CardHeader, CardTitle, LineChart } from '@/components/ui'

interface FoodCostChartProps {
  data: {
    labels: string[]
    values: number[]
  }
  targetPercentage?: number
}

export function FoodCostChart({ data, targetPercentage = 30 }: FoodCostChartProps) {
  const chartData = {
    labels: data.labels,
    datasets: [
      {
        label: 'Food Cost %',
        data: data.values,
        borderColor: '#16a34a',
        backgroundColor: 'rgba(22, 163, 74, 0.1)',
        fill: true,
      },
      {
        label: 'Target',
        data: data.labels.map(() => targetPercentage),
        borderColor: '#6b7280',
        borderDash: [5, 5],
        fill: false,
        pointRadius: 0,
      },
    ],
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Food Cost Trend</CardTitle>
      </CardHeader>
      <LineChart data={chartData} height={300} />
    </Card>
  )
}
