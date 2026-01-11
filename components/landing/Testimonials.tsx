'use client'

import { Star } from 'lucide-react'

const testimonials = [
  {
    quote:
      "We were losing $3,000 a month to waste and didn't even know it. CostCatch helped us cut that in half within 60 days.",
    author: 'Maria Santos',
    role: 'Owner, La Cocina Fresh',
    type: 'Fast Casual',
    savings: '$18K/year',
  },
  {
    quote:
      "The 60-second count changed everything. My staff actually does it every day now. Before, we'd go weeks without a proper inventory.",
    author: 'James Chen',
    role: 'GM, Bamboo Garden',
    type: 'Full Service',
    savings: '12% cost reduction',
  },
  {
    quote:
      "Finally, software that's built for how restaurants actually work. No training, no complexity. Just results.",
    author: 'Derek Williams',
    role: 'Owner, Southern Comfort BBQ',
    type: 'BBQ Restaurant',
    savings: '$2,100/month saved',
  },
]

export function Testimonials() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Trusted by Restaurant Owners
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            See how real operators are cutting costs and reducing waste with CostCatch
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
            >
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-5 w-5 fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>

              {/* Quote */}
              <blockquote className="text-gray-700 mb-6">
                "{testimonial.quote}"
              </blockquote>

              {/* Author */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold text-gray-900">
                    {testimonial.author}
                  </div>
                  <div className="text-sm text-gray-500">{testimonial.role}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-brand-600">
                    {testimonial.savings}
                  </div>
                  <div className="text-xs text-gray-400">{testimonial.type}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
