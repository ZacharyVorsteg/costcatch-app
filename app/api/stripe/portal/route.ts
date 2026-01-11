import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'
import { createCustomerPortalSession } from '@/lib/stripe'

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: restaurant } = await supabase
      .from('restaurants')
      .select('stripe_customer_id')
      .eq('user_id', user.id)
      .single()

    if (!restaurant?.stripe_customer_id) {
      return NextResponse.json(
        { error: 'No subscription found' },
        { status: 404 }
      )
    }

    const session = await createCustomerPortalSession(
      restaurant.stripe_customer_id
    )

    return NextResponse.json({ url: session.url })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Portal session failed' }, { status: 500 })
  }
}
