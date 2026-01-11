'use client'

import Link from 'next/link'
import { Button } from '@/components/ui'
import { TrendingDown, Clock, DollarSign, ArrowRight } from 'lucide-react'

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-brand-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-100 rounded-full text-brand-700 text-sm font-medium mb-8">
            <TrendingDown className="h-4 w-4" />
            Cut food costs by 10-15% in 30 days
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 tracking-tight mb-6">
            Stop Losing{' '}
            <span className="text-brand-600">20% of Your Food</span>{' '}
            to Waste
          </h1>

          {/* Subheadline */}
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            The 60-second inventory system that helps restaurant owners track food costs,
            reduce waste, and boost profits. No complex software. No training required.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href="/signup">
              <Button size="xl" className="w-full sm:w-auto">
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="#demo">
              <Button variant="outline" size="xl" className="w-full sm:w-auto">
                Watch Demo
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-gray-900">$162B</div>
              <div className="text-xs sm:text-sm text-gray-500">Annual restaurant food waste</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-gray-900">60 sec</div>
              <div className="text-xs sm:text-sm text-gray-500">Daily inventory time</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-gray-900">10-15%</div>
              <div className="text-xs sm:text-sm text-gray-500">Average cost reduction</div>
            </div>
          </div>
        </div>

        {/* Hero image placeholder */}
        <div className="mt-16 max-w-5xl mx-auto">
          <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-gray-200">
            <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-brand-600 rounded-full mb-4">
                  <DollarSign className="h-8 w-8 text-white" />
                </div>
                <p className="text-gray-600 font-medium">Dashboard Preview</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Background decoration */}
      <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-96 h-96 bg-brand-200 rounded-full blur-3xl opacity-30" />
      <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 w-96 h-96 bg-brand-300 rounded-full blur-3xl opacity-20" />
    </section>
  )
}
