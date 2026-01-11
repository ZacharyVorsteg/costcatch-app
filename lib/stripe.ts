import Stripe from 'stripe'
import { loadStripe } from '@stripe/stripe-js'
import { PricingPlan } from './types'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

let stripePromise: ReturnType<typeof loadStripe> | null = null

export const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)
  }
  return stripePromise
}

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: 'starter',
    name: 'Starter',
    price: 79,
    priceId: 'price_starter_monthly',
    features: [
      'Up to 100 inventory items',
      'Daily inventory counts',
      'Waste tracking',
      'Basic reports',
      '1 user',
      'Email support',
    ],
    limits: {
      items: 100,
      users: 1,
      historyDays: 30,
    },
  },
  {
    id: 'growth',
    name: 'Growth',
    price: 129,
    priceId: 'price_growth_monthly',
    features: [
      'Unlimited inventory items',
      'Real-time inventory counts',
      'Advanced waste analytics',
      'Custom reports & exports',
      'Up to 5 users',
      'Vendor management',
      'Price tracking & alerts',
      'Priority support',
    ],
    limits: {
      items: -1, // unlimited
      users: 5,
      historyDays: 365,
    },
  },
]

export async function createCheckoutSession(
  customerId: string,
  priceId: string,
  restaurantId: string
) {
  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    payment_method_types: ['card'],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    mode: 'subscription',
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?success=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/settings?canceled=true`,
    metadata: {
      restaurantId,
    },
  })

  return session
}

export async function createCustomerPortalSession(customerId: string) {
  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: `${process.env.NEXT_PUBLIC_APP_URL}/settings`,
  })

  return session
}

export async function createCustomer(email: string, name: string) {
  const customer = await stripe.customers.create({
    email,
    name,
  })

  return customer
}
