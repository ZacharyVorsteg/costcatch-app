'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ChefHat, ArrowRight, ArrowLeft } from 'lucide-react'
import { Button, Input, Select } from '@/components/ui'
import { createClient } from '@/lib/supabase'
import { RESTAURANT_TYPES } from '@/lib/seed-data'

type Step = 'account' | 'restaurant'

export default function SignupPage() {
  const router = useRouter()
  const supabase = createClient()
  const [step, setStep] = useState<Step>('account')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Account step
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')

  // Restaurant step
  const [restaurantName, setRestaurantName] = useState('')
  const [restaurantType, setRestaurantType] = useState('')
  const [monthlySpend, setMonthlySpend] = useState('')

  const handleAccountSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (password.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }

    setStep('restaurant')
  }

  const handleRestaurantSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
          },
        },
      })

      if (authError) throw authError

      if (authData.user) {
        // Create restaurant record
        const { error: restaurantError } = await supabase
          .from('restaurants')
          .insert({
            user_id: authData.user.id,
            name: restaurantName,
            type: restaurantType,
            monthly_food_spend: monthlySpend ? parseFloat(monthlySpend) : null,
          })

        if (restaurantError) throw restaurantError

        router.push('/dashboard')
      }
    } catch (err: any) {
      setError(err.message || 'Failed to create account')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignup = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/api/auth/callback?signup=true`,
      },
    })
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link href="/" className="flex items-center justify-center gap-2 mb-6">
          <div className="p-2 bg-brand-600 rounded-lg">
            <ChefHat className="h-6 w-6 text-white" />
          </div>
          <span className="text-2xl font-bold text-gray-900">CostCatch</span>
        </Link>
        <h2 className="text-center text-2xl font-bold text-gray-900">
          Start your free trial
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          14 days free. No credit card required.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-sm sm:rounded-xl sm:px-10 border border-gray-100">
          {/* Progress indicator */}
          <div className="flex items-center justify-center gap-2 mb-8">
            <div
              className={`w-3 h-3 rounded-full ${
                step === 'account' ? 'bg-brand-600' : 'bg-brand-200'
              }`}
            />
            <div className="w-12 h-0.5 bg-gray-200" />
            <div
              className={`w-3 h-3 rounded-full ${
                step === 'restaurant' ? 'bg-brand-600' : 'bg-gray-200'
              }`}
            />
          </div>

          {error && (
            <div className="mb-4 p-3 bg-danger-50 border border-danger-200 rounded-lg text-sm text-danger-700">
              {error}
            </div>
          )}

          {step === 'account' ? (
            <form onSubmit={handleAccountSubmit} className="space-y-6">
              <div>
                <Input
                  label="Your name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Smith"
                  required
                />
              </div>

              <div>
                <Input
                  label="Email address"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@restaurant.com"
                  required
                />
              </div>

              <div>
                <Input
                  label="Password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 8 characters"
                  helperText="Must be at least 8 characters"
                  required
                />
              </div>

              <Button type="submit" size="lg" className="w-full">
                Continue
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">
                    Or continue with
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleGoogleSignup}
                className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Google
              </button>
            </form>
          ) : (
            <form onSubmit={handleRestaurantSubmit} className="space-y-6">
              <div>
                <Input
                  label="Restaurant name"
                  type="text"
                  value={restaurantName}
                  onChange={(e) => setRestaurantName(e.target.value)}
                  placeholder="My Restaurant"
                  required
                />
              </div>

              <div>
                <Select
                  label="Restaurant type"
                  options={RESTAURANT_TYPES.map((type) => ({
                    value: type,
                    label: type,
                  }))}
                  value={restaurantType}
                  onChange={(e) => setRestaurantType(e.target.value)}
                  placeholder="Select type"
                />
              </div>

              <div>
                <Input
                  label="Average monthly food spend"
                  type="number"
                  value={monthlySpend}
                  onChange={(e) => setMonthlySpend(e.target.value)}
                  placeholder="25000"
                  helperText="Helps us calculate your potential savings"
                />
              </div>

              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  onClick={() => setStep('account')}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
                <Button
                  type="submit"
                  size="lg"
                  className="flex-1"
                  isLoading={loading}
                >
                  Create account
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </form>
          )}

          <p className="mt-6 text-center text-xs text-gray-500">
            By signing up, you agree to our{' '}
            <Link href="/terms" className="text-brand-600 hover:text-brand-500">
              Terms
            </Link>{' '}
            and{' '}
            <Link
              href="/privacy"
              className="text-brand-600 hover:text-brand-500"
            >
              Privacy Policy
            </Link>
          </p>
        </div>

        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link
            href="/login"
            className="font-medium text-brand-600 hover:text-brand-500"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
