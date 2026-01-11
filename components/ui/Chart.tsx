'use client'

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js'
import { Line, Bar, Doughnut } from 'react-chartjs-2'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

const defaultOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
  },
  scales: {
    x: {
      grid: {
        display: false,
      },
    },
    y: {
      grid: {
        color: 'rgba(0, 0, 0, 0.05)',
      },
    },
  },
}

interface LineChartProps {
  data: {
    labels: string[]
    datasets: {
      label: string
      data: number[]
      borderColor?: string
      backgroundColor?: string
      fill?: boolean
    }[]
  }
  height?: number
}

export function LineChart({ data, height = 300 }: LineChartProps) {
  const chartData = {
    labels: data.labels,
    datasets: data.datasets.map((dataset) => ({
      ...dataset,
      borderColor: dataset.borderColor || '#16a34a',
      backgroundColor: dataset.backgroundColor || 'rgba(22, 163, 74, 0.1)',
      fill: dataset.fill ?? true,
      tension: 0.3,
      pointRadius: 4,
      pointHoverRadius: 6,
    })),
  }

  return (
    <div style={{ height }}>
      <Line data={chartData} options={defaultOptions as any} />
    </div>
  )
}

interface BarChartProps {
  data: {
    labels: string[]
    datasets: {
      label: string
      data: number[]
      backgroundColor?: string | string[]
    }[]
  }
  height?: number
  horizontal?: boolean
}

export function BarChart({ data, height = 300, horizontal = false }: BarChartProps) {
  const chartData = {
    labels: data.labels,
    datasets: data.datasets.map((dataset) => ({
      ...dataset,
      backgroundColor: dataset.backgroundColor || '#16a34a',
      borderRadius: 6,
    })),
  }

  const options = {
    ...defaultOptions,
    indexAxis: horizontal ? ('y' as const) : ('x' as const),
  }

  return (
    <div style={{ height }}>
      <Bar data={chartData} options={options as any} />
    </div>
  )
}

interface DoughnutChartProps {
  data: {
    labels: string[]
    datasets: {
      data: number[]
      backgroundColor?: string[]
    }[]
  }
  height?: number
}

export function DoughnutChart({ data, height = 300 }: DoughnutChartProps) {
  const defaultColors = [
    '#16a34a',
    '#22c55e',
    '#4ade80',
    '#86efac',
    '#bbf7d0',
    '#dcfce7',
  ]

  const chartData = {
    labels: data.labels,
    datasets: data.datasets.map((dataset) => ({
      ...dataset,
      backgroundColor: dataset.backgroundColor || defaultColors,
      borderWidth: 0,
    })),
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right' as const,
        labels: {
          padding: 20,
          usePointStyle: true,
          pointStyle: 'circle',
        },
      },
    },
    cutout: '60%',
  }

  return (
    <div style={{ height }}>
      <Doughnut data={chartData} options={options} />
    </div>
  )
}
