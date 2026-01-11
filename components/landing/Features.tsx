'use client'

import {
  ClipboardList,
  TrendingDown,
  Truck,
  BarChart3,
  AlertTriangle,
  Clock,
} from 'lucide-react'

const features = [
  {
    icon: ClipboardList,
    title: '60-Second Inventory',
    description:
      'Quick count system designed for busy kitchens. Just tap quantities - no training needed. Complete your daily inventory in under a minute.',
  },
  {
    icon: TrendingDown,
    title: 'Real Food Cost Tracking',
    description:
      'See your actual food cost percentage daily, not just at month-end. Catch problems before they cost you thousands.',
  },
  {
    icon: AlertTriangle,
    title: 'Waste Tracking & Analysis',
    description:
      'Log waste in seconds. Identify patterns - is it spoilage, overproduction, or mistakes? Fix the root cause.',
  },
  {
    icon: Truck,
    title: 'Vendor Price Monitoring',
    description:
      'Track prices across vendors. Get alerts when costs spike. Never miss a price increase again.',
  },
  {
    icon: BarChart3,
    title: 'Actionable Reports',
    description:
      'Weekly trends, category breakdowns, and waste analysis. Know exactly where your money goes.',
  },
  {
    icon: Clock,
    title: 'Mobile-First Design',
    description:
      'Works great on phones. Count inventory on the floor, log waste in the kitchen, check reports anywhere.',
  },
]

export function Features() {
  return (
    <section className="py-20 bg-gray-50" id="features">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Everything You Need to Cut Food Costs
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Built by restaurant operators, for restaurant operators. No bloat, no
            complexity - just the features that actually save money.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 bg-brand-100 rounded-lg mb-4">
                <feature.icon className="h-6 w-6 text-brand-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
