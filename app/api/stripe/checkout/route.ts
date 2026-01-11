import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'
import { stripe, createCustomer, createCheckoutSession } from '@/lib/stripe'

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: restaurant } = await supabase
      .from('restaurants')
      .select('id, stripe_customer_id, name')
      .eq('user_id', user.id)
      .single()

    if (!restaurant) {
      return NextResponse.json({ error: 'Restaurant not found' }, { status: 404 })
    }

    const body = await request.json()
    const { priceId } = body

    // Create or get Stripe customer
    let customerId = restaurant.stripe_customer_id

    if (!customerId) {
      const customer = await createCustomer(
        user.email!,
        restaurant.name
      )
      customerId = customer.id

      // Save customer ID to restaurant
      await supabase
        .from('restaurants')
        .update({ stripe_customer_id: customerId })
        .eq('id', restaurant.id)
    }

    // Create checkout session
    const session = await createCheckoutSession(
      customerId,
      priceId,
      restaurant.id
    )

    return NextResponse.json({ url: session.url })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Checkout failed' }, { status: 500 })
  }
}
