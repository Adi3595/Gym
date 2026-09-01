import React from 'react'
import { createClient } from '@/utils/supabase/server'
import BillingClient from './BillingClient'

export const revalidate = 0 // always fetch live data

export default async function BillingPage() {
  const supabase = await createClient()

  // Fetch subscriptions with joined member and plan data
  const { data: subscriptions } = await supabase
    .from('subscriptions')
    .select(`
      *,
      members(first_name, last_name, phone),
      membership_plans(name)
    `)
    .order('created_at', { ascending: false })

  // Fetch active members for the dropdown
  const { data: members } = await supabase
    .from('members')
    .select('id, first_name, last_name, phone')
    .eq('status', 'Active')
    .order('first_name')

  // Fetch active plans for the dropdown
  const { data: plans } = await supabase
    .from('membership_plans')
    .select('*')
    .eq('is_active', true)
    .order('price')

  return (
    <BillingClient 
      initialSubscriptions={subscriptions || []} 
      members={members || []} 
      plans={plans || []} 
    />
  )
}
