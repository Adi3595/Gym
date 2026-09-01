'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function addSubscription(formData: FormData) {
  const supabase = await createClient()

  const memberId = formData.get('member_id') as string
  const planId = formData.get('plan_id') as string
  const paymentMethod = formData.get('payment_method') as string
  
  // 1. Fetch plan details
  const { data: planData } = await supabase.from('membership_plans').select('duration_days, price').eq('id', planId).single()
  
  if (!planData) {
    return { error: 'Invalid Plan Selected' }
  }

  // 2. Fetch member's most recent subscription
  const { data: latestSub } = await supabase
    .from('subscriptions')
    .select('end_date')
    .eq('member_id', memberId)
    .order('end_date', { ascending: false })
    .limit(1)
    .single()

  let startDate = new Date()
  const today = new Date()

  if (latestSub && latestSub.end_date) {
    const oldEndDate = new Date(latestSub.end_date)
    
    // Calculate difference in days between today and the old end date
    const diffTime = today.getTime() - oldEndDate.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (oldEndDate > today) {
      // Scenario A: Renewing EARLY. Stack the subscription from the future end date.
      startDate = new Date(oldEndDate)
    } else if (diffDays <= 5) {
      // Scenario B: Renewing during the 5-DAY GRACE PERIOD. Backdate start to the old end date.
      startDate = new Date(oldEndDate)
    } else {
      // Scenario C: Renewing AFTER 5 days. Old membership is gone. Treat as new member, start today.
      startDate = new Date(today)
    }
  }

  // 3. Calculate new end date
  const endDate = new Date(startDate)
  endDate.setDate(endDate.getDate() + planData.duration_days)

  const subscriptionData = {
    member_id: memberId,
    plan_id: planId,
    start_date: startDate.toISOString().split('T')[0],
    end_date: endDate.toISOString().split('T')[0],
    amount_paid: planData.price,
    payment_status: 'Completed',
    payment_method: paymentMethod
  }

  const { error } = await supabase.from('subscriptions').insert([subscriptionData])

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/dashboard')
  revalidatePath('/dashboard/billing')
  
  return { success: true }
}
