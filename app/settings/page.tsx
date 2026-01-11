'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { DashboardLayout } from '@/components/layout'
import { Button, Input, Select, Card, Badge } from '@/components/ui'
import { createClient } from '@/lib/supabase'
import { Restaurant } from '@/lib/types'
import { RESTAURANT_TYPES } from '@/lib/seed-data'
import { PRICING_PLANS } from '@/lib/stripe'
import { useToast } from '@/contexts/ToastContext'
import {
  Building,
  Target,
  Bell,
  Users,
  CreditCard,
  Check,
  ExternalLink,
} from 'lucide-react'

function SettingsContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()
  const toast = useToast()
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState('restaurant')

  const [formData, setFormData] = useState({
    name: '',
    type: '',
    target_food_cost_pct: '30',
    monthly_food_spend: '',
  })

  useEffect(() => {
    loadData()

    // Check for success/canceled from Stripe
    if (searchParams.get('success')) {
      // Show success message
    }
    if (searchParams.get('canceled')) {
      // Show canceled message
    }
  }, [])

  async function loadData() {
    try {
      const { data: { user } } = await supabase.auth.getUser()

      if (user) {
        const { data: restaurantData } = await supabase
          .from('restaurants')
          .select('*')
          .eq('user_id', user.id)
          .single()

        if (restaurantData) {
          setRestaurant(restaurantData)
          setFormData({
            name: restaurantData.name,
            type: restaurantData.type || '',
            target_food_cost_pct: restaurantData.target_food_cost_pct?.toString() || '30',
            monthly_food_spend: restaurantData.monthly_food_spend?.toString() || '',
          })
        }
      }
    } catch (error) {
      console.error('Error loading settings:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleSave() {
    if (!restaurant) return
    setSaving(true)

    try {
      const { error } = await supabase
        .from('restaurants')
        .update({
          name: formData.name,
          type: formData.type || null,
          target_food_cost_pct: parseFloat(formData.target_food_cost_pct) || 30,
          monthly_food_spend: formData.monthly_food_spend
            ? parseFloat(formData.monthly_food_spend)
            : null,
        })
        .eq('id', restaurant.id)

      if (error) throw error

      // Reload data
      await loadData()
      toast.success('Settings saved')
    } catch (error) {
      console.error('Error saving settings:', error)
      toast.error('Failed to save settings')
    } finally {
      setSaving(false)
    }
  }

  async function handleManageSubscription() {
    try {
      const response = await fetch('/api/stripe/portal', {
        method: 'POST',
      })
      const { url } = await response.json()
      window.location.href = url
    } catch (error) {
      console.error('Error opening customer portal:', error)
      toast.error('Failed to open billing portal')
    }
  }

  async function handleUpgrade(priceId: string) {
    try {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId }),
      })
      const { url } = await response.json()
      window.location.href = url
    } catch (error) {
      console.error('Error creating checkout session:', error)
      toast.error('Failed to start checkout')
    }
  }

  const tabs = [
    { id: 'restaurant', label: 'Restaurant', icon: Building },
    { id: 'targets', label: 'Targets', icon: Target },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'team', label: 'Team', icon: Users },
    { id: 'billing', label: 'Billing', icon: CreditCard },
  ]

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600" />
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-500 mt-1">
            Manage your restaurant settings and preferences
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'bg-brand-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Restaurant Settings */}
        {activeTab === 'restaurant' && (
          <Card>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Restaurant Information
            </h2>
            <div className="space-y-4">
              <Input
                label="Restaurant Name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
              <Select
                label="Restaurant Type"
                options={RESTAURANT_TYPES.map((t) => ({ value: t, label: t }))}
                value={formData.type}
                onChange={(e) =>
                  setFormData({ ...formData, type: e.target.value })
                }
                placeholder="Select type"
              />
              <Input
                label="Average Monthly Food Spend"
                type="number"
                value={formData.monthly_food_spend}
                onChange={(e) =>
                  setFormData({ ...formData, monthly_food_spend: e.target.value })
                }
                placeholder="25000"
                helperText="Used for calculating potential savings"
              />
              <div className="pt-4">
                <Button onClick={handleSave} isLoading={saving}>
                  Save Changes
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Targets Settings */}
        {activeTab === 'targets' && (
          <Card>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Cost Targets
            </h2>
            <div className="space-y-4">
              <Input
                label="Target Food Cost %"
                type="number"
                step="0.5"
                min="0"
                max="100"
                value={formData.target_food_cost_pct}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    target_food_cost_pct: e.target.value,
                  })
                }
                helperText="Your goal food cost percentage (typically 28-35%)"
              />

              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="text-sm font-medium text-gray-700 mb-2">
                  Industry Benchmarks
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Fast Food</p>
                    <p className="font-medium">25-30%</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Casual Dining</p>
                    <p className="font-medium">28-35%</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Fine Dining</p>
                    <p className="font-medium">30-38%</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Bars/Pubs</p>
                    <p className="font-medium">20-25%</p>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <Button onClick={handleSave} isLoading={saving}>
                  Save Changes
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Notifications Settings */}
        {activeTab === 'notifications' && (
          <Card>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Notification Preferences
            </h2>
            <div className="space-y-4">
              {[
                {
                  label: 'Price spike alerts',
                  description: 'When an item price increases by more than 10%',
                },
                {
                  label: 'Low stock warnings',
                  description: 'When inventory falls below par level',
                },
                {
                  label: 'High waste alerts',
                  description: 'When waste exceeds threshold',
                },
                {
                  label: 'Food cost warnings',
                  description: 'When food cost exceeds target',
                },
                {
                  label: 'Weekly summary',
                  description: 'Email summary of key metrics',
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0"
                >
                  <div>
                    <p className="font-medium text-gray-900">{item.label}</p>
                    <p className="text-sm text-gray-500">{item.description}</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-600"></div>
                  </label>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Team Settings */}
        {activeTab === 'team' && (
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Team Members</h2>
              <Button size="sm">Invite Member</Button>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-brand-100 rounded-full flex items-center justify-center">
                    <span className="text-brand-600 font-medium">Y</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">You (Owner)</p>
                    <p className="text-sm text-gray-500">owner@restaurant.com</p>
                  </div>
                </div>
                <Badge variant="success">Owner</Badge>
              </div>
              <p className="text-sm text-gray-500 text-center py-4">
                Invite team members to help with inventory counts and waste logging.
              </p>
            </div>
          </Card>
        )}

        {/* Billing Settings */}
        {activeTab === 'billing' && (
          <div className="space-y-6">
            <Card>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    Current Plan
                  </h2>
                  <p className="text-sm text-gray-500">
                    {restaurant?.subscription_status === 'active'
                      ? 'Your subscription is active'
                      : 'You are on a free trial'}
                  </p>
                </div>
                <Badge
                  variant={
                    restaurant?.subscription_status === 'active'
                      ? 'success'
                      : 'warning'
                  }
                >
                  {restaurant?.subscription_status === 'active'
                    ? 'Active'
                    : 'Trial'}
                </Badge>
              </div>

              {restaurant?.subscription_status === 'active' && (
                <Button variant="outline" onClick={handleManageSubscription}>
                  Manage Subscription
                  <ExternalLink className="h-4 w-4 ml-2" />
                </Button>
              )}
            </Card>

            <div className="grid md:grid-cols-2 gap-6">
              {PRICING_PLANS.map((plan, index) => (
                <Card
                  key={plan.id}
                  className={
                    index === 1 ? 'ring-2 ring-brand-500' : ''
                  }
                >
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {plan.name}
                    </h3>
                    <div className="flex items-baseline gap-1 mt-1">
                      <span className="text-3xl font-bold text-gray-900">
                        ${plan.price}
                      </span>
                      <span className="text-gray-500">/month</span>
                    </div>
                  </div>

                  <ul className="space-y-2 mb-6">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2">
                        <Check className="h-5 w-5 text-brand-500 flex-shrink-0" />
                        <span className="text-sm text-gray-600">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    variant={index === 1 ? 'primary' : 'outline'}
                    className="w-full"
                    onClick={() => handleUpgrade(plan.priceId)}
                  >
                    {restaurant?.subscription_status === 'active'
                      ? 'Switch Plan'
                      : 'Start Trial'}
                  </Button>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}

export default function SettingsPage() {
  return (
    <Suspense fallback={
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600" />
        </div>
      </DashboardLayout>
    }>
      <SettingsContent />
    </Suspense>
  )
}
