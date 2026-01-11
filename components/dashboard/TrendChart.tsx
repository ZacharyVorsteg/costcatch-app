'use client'

import { Card, CardHeader, CardTitle, LineChart } from '@/components/ui'

interface TrendChartProps {
  data: {
    labels: string[]
    values: number[]
  }
  title?: string
}

export function TrendChart({ data, title = 'Weekly Trend' }: TrendChartProps) {
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
    ],
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <LineChart data={chartData} height={250} />
    </Card>
  )
}
