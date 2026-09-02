import React from 'react'
import { Users, TrendingUp, ShoppingBag, Activity } from 'lucide-react'
import { createClient } from '@/utils/supabase/server'

export const revalidate = 0 // always fetch live data

export default async function DashboardOverview() {
  const supabase = await createClient()

  // 1. Total Members
  const { count: totalMembers } = await supabase
    .from('members')
    .select('*', { count: 'exact', head: true })

  // 2. MRR (Subscriptions in the last 30 days)
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
  
  const { data: mrrData } = await supabase
    .from('subscriptions')
    .select('amount_paid')
    .gte('created_at', thirtyDaysAgo.toISOString())

  const totalMrr = mrrData?.reduce((acc, curr) => acc + Number(curr.amount_paid), 0) || 0

  // 3. Store Sales (Today)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  const { data: salesData } = await supabase
    .from('sales')
    .select('final_amount')
    .gte('created_at', today.toISOString())

  const todaySales = salesData?.reduce((acc, curr) => acc + Number(curr.final_amount), 0) || 0

  // 4. Active Now (Check-ins without check-outs today)
  const { count: activeNow } = await supabase
    .from('attendance')
    .select('*', { count: 'exact', head: true })
    .gte('check_in_time', today.toISOString())
    .is('check_out_time', null)

  // Format currency
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', color: 'var(--color-primary)', lineHeight: 1 }}>Overview</h1>
          <p style={{ color: 'var(--text-muted)' }}>Welcome back. Here is the live data from your database.</p>
        </div>
        <button style={{ 
          background: 'var(--color-primary)', 
          color: 'white', 
          padding: '0.75rem 1.5rem', 
          borderRadius: '8px', 
          fontWeight: 600,
          border: 'none',
          cursor: 'pointer'
        }}>
          Generate Report
        </button>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem' }}>
        
        <div style={{ background: 'white', padding: '1.75rem', borderRadius: '16px', border: '1px solid rgba(22,105,122,0.05)', boxShadow: '0 10px 30px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.25rem', color: 'var(--text-muted)' }}>
            <span style={{ fontSize: '0.875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>Total Members</span>
            <Users size={20} color="var(--color-primary)" />
          </div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', color: 'var(--color-primary)', marginBottom: '0.5rem', lineHeight: 1 }}>
            {totalMembers || 0}
          </div>
          <div style={{ fontSize: '0.875rem', color: 'var(--status-success)', fontWeight: 600 }}>
            Live Data
          </div>
        </div>

        <div style={{ background: 'white', padding: '1.75rem', borderRadius: '16px', border: '1px solid rgba(72,159,181,0.1)', boxShadow: '0 10px 30px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.25rem', color: 'var(--text-muted)' }}>
            <span style={{ fontSize: '0.875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>MRR (30 Days)</span>
            <TrendingUp size={20} color="var(--color-secondary)" />
          </div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', color: 'var(--color-secondary)', marginBottom: '0.5rem', lineHeight: 1 }}>
            {formatCurrency(totalMrr)}
          </div>
          <div style={{ fontSize: '0.875rem', color: 'var(--status-success)', fontWeight: 600 }}>
            Live Data
          </div>
        </div>

        <div style={{ background: 'white', padding: '1.75rem', borderRadius: '16px', border: '1px solid rgba(255,166,43,0.15)', boxShadow: '0 10px 30px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.25rem', color: 'var(--text-muted)' }}>
            <span style={{ fontSize: '0.875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>Store Sales Today</span>
            <ShoppingBag size={20} color="var(--color-accent)" />
          </div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', color: 'var(--color-accent)', marginBottom: '0.5rem', lineHeight: 1 }}>
            {formatCurrency(todaySales)}
          </div>
          <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', fontWeight: 600 }}>
            Live Data
          </div>
        </div>

        <div style={{ background: 'white', padding: '1.75rem', borderRadius: '16px', border: '1px solid rgba(34,197,94,0.15)', boxShadow: '0 10px 30px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.25rem', color: 'var(--text-muted)' }}>
            <span style={{ fontSize: '0.875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>Active Now</span>
            <Activity size={20} color="var(--status-success)" />
          </div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', color: 'var(--status-success)', marginBottom: '0.5rem', lineHeight: 1 }}>
            {activeNow || 0}
          </div>
          <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', fontWeight: 600 }}>
            Checked-in currently
          </div>
        </div>
      </div>
    </div>
  )
}
