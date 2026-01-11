'use client'

import Link from 'next/link'
import { Button } from '@/components/ui'
import { Check } from 'lucide-react'
import { PRICING_PLANS } from '@/lib/stripe'

export function Pricing() {
  return (
    <section className="py-20 bg-white" id="pricing">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Start with a 14-day free trial. No credit card required. Cancel anytime.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {PRICING_PLANS.map((plan, index) => (
            <div
              key={plan.id}
              className={`relative rounded-2xl p-8 ${
                index === 1
                  ? 'bg-brand-600 text-white ring-4 ring-brand-600 ring-opacity-50'
                  : 'bg-white border-2 border-gray-200'
              }`}
            >
              {index === 1 && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-brand-800 text-white text-sm font-medium px-4 py-1 rounded-full">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="mb-6">
                <h3
                  className={`text-xl font-bold mb-2 ${
                    index === 1 ? 'text-white' : 'text-gray-900'
                  }`}
                >
                  {plan.name}
                </h3>
                <div className="flex items-baseline gap-1">
                  <span
                    className={`text-4xl font-bold ${
                      index === 1 ? 'text-white' : 'text-gray-900'
                    }`}
                  >
                    ${plan.price}
                  </span>
                  <span
                    className={index === 1 ? 'text-brand-200' : 'text-gray-500'}
                  >
                    /month
                  </span>
                </div>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <Check
                      className={`h-5 w-5 flex-shrink-0 mt-0.5 ${
                        index === 1 ? 'text-brand-200' : 'text-brand-600'
                      }`}
                    />
                    <span
                      className={index === 1 ? 'text-brand-50' : 'text-gray-600'}
                    >
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <Link href="/signup">
                <Button
                  variant={index === 1 ? 'secondary' : 'primary'}
                  size="lg"
                  className="w-full"
                >
                  Start Free Trial
                </Button>
              </Link>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-500">
            Need a custom plan for multiple locations?{' '}
            <Link href="/contact" className="text-brand-600 font-medium hover:text-brand-700">
              Contact us
            </Link>
          </p>
        </div>
      </div>
    </section>
  )
}
