import React from 'react'
import { createClient } from '@/utils/supabase/server'
import MemberProfileClient from './MemberProfileClient'
import { notFound } from 'next/navigation'

export const revalidate = 0

export default async function MemberProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient()

  // 1. Fetch Member Info
  const { data: member, error: memberError } = await supabase
    .from('members')
    .select('*')
    .eq('id', id)
    .single()

  if (memberError || !member) {
    notFound()
  }

  // 2. Fetch Subscriptions
  const { data: subscriptions } = await supabase
    .from('subscriptions')
    .select('*, membership_plans(name)')
    .eq('member_id', id)
    .order('created_at', { ascending: false })

  // 3. Fetch POS History (Sales)
  const { data: sales } = await supabase
    .from('sales')
    .select('id, final_amount, created_at, payment_method, sale_items(quantity, total, products(name))')
    .eq('member_id', id)
    .order('created_at', { ascending: false })

  // 4. Fetch Attendance History
  const { data: attendance } = await supabase
    .from('attendance')
    .select('*')
    .eq('member_id', id)
    .order('check_in_time', { ascending: false })
    .limit(30) // Last 30 visits

  return (
    <MemberProfileClient 
      member={member} 
      subscriptions={subscriptions || []}
      sales={sales || []}
      attendance={attendance || []}
    />
  )
}
