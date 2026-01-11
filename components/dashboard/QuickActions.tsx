'use client'

import Link from 'next/link'
import {
  ClipboardList,
  Trash2,
  Package,
  BarChart3,
  ArrowRight,
} from 'lucide-react'
import { Card, CardHeader, CardTitle } from '@/components/ui'

const actions = [
  {
    name: 'Quick Count',
    description: 'Do daily inventory',
    href: '/count',
    icon: ClipboardList,
    color: 'bg-brand-100 text-brand-600',
    primary: true,
  },
  {
    name: 'Log Waste',
    description: 'Record waste event',
    href: '/waste',
    icon: Trash2,
    color: 'bg-danger-100 text-danger-600',
  },
  {
    name: 'Add Item',
    description: 'New inventory item',
    href: '/inventory?action=add',
    icon: Package,
    color: 'bg-blue-100 text-blue-600',
  },
  {
    name: 'View Reports',
    description: 'Cost analysis',
    href: '/reports',
    icon: BarChart3,
    color: 'bg-purple-100 text-purple-600',
  },
]

export function QuickActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <div className="grid grid-cols-2 gap-3">
        {actions.map((action) => (
          <Link
            key={action.name}
            href={action.href}
            className={`flex items-start gap-3 p-4 rounded-xl transition-all hover:shadow-md ${
              action.primary
                ? 'bg-brand-600 text-white col-span-2'
                : 'bg-gray-50 hover:bg-gray-100'
            }`}
          >
            <div
              className={`p-2 rounded-lg ${
                action.primary ? 'bg-brand-500' : action.color
              }`}
            >
              <action.icon
                className={`h-5 w-5 ${action.primary ? 'text-white' : ''}`}
              />
            </div>
            <div className="flex-1">
              <p
                className={`font-medium ${
                  action.primary ? 'text-white' : 'text-gray-900'
                }`}
              >
                {action.name}
              </p>
              <p
                className={`text-sm ${
                  action.primary ? 'text-brand-100' : 'text-gray-500'
                }`}
              >
                {action.description}
              </p>
            </div>
            <ArrowRight
              className={`h-5 w-5 ${
                action.primary ? 'text-brand-200' : 'text-gray-400'
              }`}
            />
          </Link>
        ))}
      </div>
    </Card>
  )
}
