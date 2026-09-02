import React from 'react'
import { createClient } from '@/utils/supabase/server'
import { Activity, TrendingUp, Users } from 'lucide-react'

export const revalidate = 0

export default async function AnalyticsPage() {
  const supabase = await createClient()

  // Fetch recent sales
  const { data: recentSales } = await supabase
    .from('sales')
    .select('*, members(first_name, last_name)')
    .order('created_at', { ascending: false })
    .limit(5)

  // Fetch recent check-ins
  const { data: recentCheckIns } = await supabase
    .from('attendance')
    .select('*, members(first_name, last_name)')
    .order('check_in_time', { ascending: false })
    .limit(5)

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(val || 0)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '3rem', color: 'var(--color-primary)', lineHeight: 1 }}>Analytics</h1>
        <p style={{ color: 'var(--text-muted)' }}>Deep dive into your gym's performance.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        
        {/* Recent Transactions */}
        <div style={{ background: 'white', borderRadius: '16px', border: '1px solid rgba(22, 105, 122, 0.08)', padding: '2rem', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
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
        <div style={{ background: 'white', borderRadius: '16px', border: '1px solid rgba(22, 105, 122, 0.08)', padding: '2rem', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
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
