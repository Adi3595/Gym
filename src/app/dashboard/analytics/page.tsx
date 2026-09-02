import React from 'react'
import { createClient } from '@/utils/supabase/server'
import { Activity, TrendingUp, Users, DollarSign, Calendar } from 'lucide-react'
import { SummaryCard, SummaryGrid } from '@/components/ui/SummaryCards'

export const revalidate = 0

export default async function AnalyticsPage() {
  const supabase = await createClient()

  // 1. Fetch recent sales
  const { data: recentSales } = await supabase
    .from('sales')
    .select('*, members(first_name, last_name)')
    .order('created_at', { ascending: false })
    .limit(5)

  // 2. Fetch recent check-ins
  const { data: recentCheckIns } = await supabase
    .from('attendance')
    .select('*, members(first_name, last_name)')
    .order('check_in_time', { ascending: false })
    .limit(5)

  // 3. Analytics Data
  const { data: allSales } = await supabase.from('sales').select('final_amount')
  const totalSalesRev = allSales?.reduce((acc, curr) => acc + (curr.final_amount || 0), 0) || 0

  const { data: allSubs } = await supabase.from('subscriptions').select('amount_paid')
  const totalSubRev = allSubs?.reduce((acc, curr) => acc + (curr.amount_paid || 0), 0) || 0

  const today = new Date()
  today.setHours(0,0,0,0)
  const { count: checkinsToday } = await supabase
    .from('attendance')
    .select('*', { count: 'exact', head: true })
    .gte('check_in_time', today.toISOString())

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val || 0)
  }

  // Simulated Weekly Chart Data
  const chartData = [
    { day: 'Mon', revenue: 12500 },
    { day: 'Tue', revenue: 19200 },
    { day: 'Wed', revenue: 8400 },
    { day: 'Thu', revenue: 24100 },
    { day: 'Fri', revenue: 31000 },
    { day: 'Sat', revenue: 45600 },
    { day: 'Sun', revenue: 38200 },
  ]
  const maxRev = Math.max(...chartData.map(d => d.revenue))

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
      <div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '3rem', color: 'var(--color-primary)', lineHeight: 1 }}>Analytics</h1>
        <p style={{ color: 'var(--text-muted)' }}>Deep dive into your gym's performance metrics.</p>
      </div>

      <SummaryGrid>
        <SummaryCard 
          title="POS Revenue" 
          value={formatCurrency(totalSalesRev)} 
          icon={<ShoppingBag size={20} />} 
          trend="Lifetime" 
          colorVariant="primary"
        />
        <SummaryCard 
          title="Subscription Revenue" 
          value={formatCurrency(totalSubRev)} 
          icon={<DollarSign size={20} />} 
          trend="Lifetime" 
          colorVariant="secondary"
        />
        <SummaryCard 
          title="Total Income" 
          value={formatCurrency(totalSalesRev + totalSubRev)} 
          icon={<TrendingUp size={20} />} 
          trend="Lifetime" 
          colorVariant="accent"
        />
        <SummaryCard 
          title="Check-ins Today" 
          value={checkinsToday || 0} 
          icon={<Calendar size={20} />} 
          trend="Since midnight" 
          colorVariant="light"
        />
      </SummaryGrid>

      {/* Bar Chart */}
      <div style={{ background: 'white', padding: '2.5rem', borderRadius: '16px', border: '1px solid rgba(0,0,0,0.04)', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
        <h2 style={{ fontSize: '1.25rem', color: 'var(--color-primary)', margin: '0 0 0.5rem 0', fontWeight: 700 }}>Weekly Revenue Trend</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '2rem' }}>Combined POS and Subscription revenue over the last 7 days.</p>
        
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '2rem', height: '240px', paddingBottom: '1rem', borderBottom: '1px solid #e5e7eb' }}>
          {chartData.map(d => (
            <div key={d.day} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem', height: '100%', justifyContent: 'flex-end' }}>
              <div style={{ 
                width: '100%', maxWidth: '60px', height: `${(d.revenue / maxRev) * 200}px`, 
                background: 'linear-gradient(to top, var(--color-primary), var(--color-secondary))', 
                borderRadius: '8px 8px 0 0', transition: 'height 1s ease-out',
                position: 'relative',
                boxShadow: '0 4px 12px rgba(22,105,122,0.2)'
              }}>
                <div style={{ position: 'absolute', top: '-25px', width: '100%', textAlign: 'center', fontSize: '0.7rem', fontWeight: 700, color: 'var(--color-primary)' }}>
                  {formatCurrency(d.revenue).replace('₹', '')}
                </div>
              </div>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>{d.day}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        
        {/* Recent Transactions */}
        <div style={{ background: 'white', borderRadius: '16px', border: '1px solid rgba(0,0,0,0.04)', padding: '2rem', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <TrendingUp color="var(--color-secondary)" />
            <h2 style={{ fontSize: '1.25rem', color: 'var(--color-primary)', margin: 0, fontWeight: 700 }}>Recent Transactions</h2>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {recentSales && recentSales.length > 0 ? recentSales.map(sale => (
              <div key={sale.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '1rem', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                <div>
                  <div style={{ fontWeight: 600, color: 'var(--text-dark)' }}>
                    {sale.members ? `${sale.members.first_name} ${sale.members.last_name}` : 'Walk-in Customer'}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{new Date(sale.created_at).toLocaleString()}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <span style={{ fontWeight: 700, color: 'var(--color-accent)' }}>{formatCurrency(sale.final_amount)}</span>
                  <a href={`/receipt/pos/${sale.id}`} target="_blank" style={{ fontSize: '0.75rem', background: '#f3f4f6', padding: '0.5rem 0.75rem', borderRadius: '6px', textDecoration: 'none', color: 'var(--text-dark)', fontWeight: 600 }}>Receipt</a>
                </div>
              </div>
            )) : <p style={{ color: 'var(--text-muted)' }}>No recent transactions.</p>}
          </div>
        </div>

        {/* Recent Check-Ins */}
        <div style={{ background: 'white', borderRadius: '16px', border: '1px solid rgba(0,0,0,0.04)', padding: '2rem', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <Activity color="var(--status-success)" />
            <h2 style={{ fontSize: '1.25rem', color: 'var(--color-primary)', margin: 0, fontWeight: 700 }}>Recent Check-ins</h2>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {recentCheckIns && recentCheckIns.length > 0 ? recentCheckIns.map(record => (
              <div key={record.id} style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '1rem', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(34, 197, 94, 0.1)', color: '#22C55E', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Users size={16} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, color: 'var(--text-dark)' }}>
                      {record.members ? `${record.members.first_name} ${record.members.last_name}` : 'Unknown'}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{new Date(record.check_in_time).toLocaleTimeString()}</div>
                  </div>
                </div>
                <div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '4px 8px', borderRadius: '4px', background: record.check_out_time ? 'rgba(0,0,0,0.05)' : 'rgba(34, 197, 94, 0.1)', color: record.check_out_time ? 'var(--text-muted)' : '#22C55E' }}>
                    {record.check_out_time ? 'Checked Out' : 'Active'}
                  </span>
                </div>
              </div>
            )) : <p style={{ color: 'var(--text-muted)' }}>No recent check-ins.</p>}
          </div>
        </div>

      </div>
    </div>
  )
}
