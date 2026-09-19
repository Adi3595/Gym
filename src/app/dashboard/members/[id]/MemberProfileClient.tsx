'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { ArrowLeft, User, Calendar, CreditCard, ShoppingBag, Clock } from 'lucide-react'
import Link from 'next/link'

export default function MemberProfileClient({ 
  member, 
  subscriptions, 
  sales, 
  attendance 
}: { 
  member: any, 
  subscriptions: any[], 
  sales: any[], 
  attendance: any[] 
}) {
  const [activeTab, setActiveTab] = useState('subscriptions')

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(val || 0)
  }

  const getStatusColor = (status: string) => {
    if (status === 'Active' || status === 'Completed') return '#22c55e'
    if (status === 'Pending') return '#eab308'
    return '#ef4444'
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <Link href="/dashboard/members">
          <Button variant="ghost" icon={<ArrowLeft size={20} />} style={{ padding: '0.5rem' }} />
        </Link>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', color: 'var(--color-primary)', lineHeight: 1, margin: 0 }}>
            {member.first_name} {member.last_name}
          </h1>
          <p style={{ color: 'var(--text-muted)', margin: '0.5rem 0 0 0' }}>{member.phone} &middot; {member.email || 'No email provided'}</p>
        </div>
        <div style={{ marginLeft: 'auto' }}>
          <span style={{ 
            background: member.status === 'Active' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
            color: member.status === 'Active' ? '#22C55E' : '#EF4444',
            padding: '8px 16px', borderRadius: '8px', fontWeight: 700, textTransform: 'uppercase'
          }}>
            {member.status}
          </span>
        </div>
      </div>

      {/* Profile Content */}
      <div style={{ display: 'flex', gap: '2rem' }}>
        
        {/* Sidebar Nav */}
        <div style={{ width: '250px', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {[
            { id: 'subscriptions', label: 'Subscriptions', icon: Calendar },
            { id: 'sales', label: 'Store Purchases', icon: ShoppingBag },
            { id: 'attendance', label: 'Check-in History', icon: Clock },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.75rem',
                padding: '1rem', borderRadius: '12px',
                background: activeTab === tab.id ? 'white' : 'transparent',
                color: activeTab === tab.id ? 'var(--color-primary)' : 'var(--text-muted)',
                fontWeight: activeTab === tab.id ? 700 : 500,
                border: 'none', cursor: 'pointer', textAlign: 'left',
                boxShadow: activeTab === tab.id ? '0 4px 12px rgba(0,0,0,0.02)' : 'none',
                transition: 'all var(--transition-fast)'
              }}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Main Content Area */}
        <div style={{ flex: 1, background: 'white', borderRadius: '16px', border: '1px solid rgba(22, 105, 122, 0.08)', padding: '2.5rem', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
          
          {/* Subscriptions Tab */}
          {activeTab === 'subscriptions' && (
            <div>
              <h2 style={{ fontSize: '1.5rem', color: 'var(--text-dark)', marginBottom: '1.5rem' }}>Subscription History</h2>
              {subscriptions.length === 0 ? (
                <p style={{ color: 'var(--text-muted)' }}>No subscriptions found for this member.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {subscriptions.map(sub => (
                    <div key={sub.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem', border: '1px solid rgba(0,0,0,0.05)', borderRadius: '12px', background: '#f8fafc' }}>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--color-primary)' }}>{sub.membership_plans?.name || 'Unknown Plan'}</div>
                        <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                          {new Date(sub.start_date).toLocaleDateString()} to {new Date(sub.end_date).toLocaleDateString()}
                        </div>
                        <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>Paid via {sub.payment_method}</div>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
                        <span style={{ fontWeight: 700, color: 'var(--color-accent)', fontSize: '1.25rem' }}>{formatCurrency(sub.amount_paid)}</span>
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: getStatusColor(sub.payment_status), textTransform: 'uppercase', background: 'white', padding: '4px 8px', borderRadius: '4px', border: '1px solid rgba(0,0,0,0.05)' }}>
                          {sub.payment_status}
                        </span>
                        <a href={`/receipt/subscription/${sub.id}`} target="_blank" style={{ fontSize: '0.75rem', background: 'var(--color-primary)', color: 'white', padding: '0.5rem 0.75rem', borderRadius: '6px', textDecoration: 'none', fontWeight: 600, marginTop: '0.5rem' }}>View Receipt</a>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Sales Tab */}
          {activeTab === 'sales' && (
            <div>
              <h2 style={{ fontSize: '1.5rem', color: 'var(--text-dark)', marginBottom: '1.5rem' }}>Store Purchases</h2>
              {sales.length === 0 ? (
                <p style={{ color: 'var(--text-muted)' }}>No store purchases found.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {sales.map(sale => (
                    <div key={sale.id} style={{ padding: '1.5rem', border: '1px solid rgba(0,0,0,0.05)', borderRadius: '12px', background: '#f8fafc' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px dashed rgba(0,0,0,0.1)' }}>
                        <div>
                          <div style={{ fontWeight: 600, color: 'var(--text-dark)' }}>{new Date(sale.created_at).toLocaleString()}</div>
                          <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{sale.payment_method}</div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                          <span style={{ fontWeight: 700, color: 'var(--color-accent)', fontSize: '1.25rem' }}>{formatCurrency(sale.final_amount)}</span>
                          <a href={`/receipt/pos/${sale.id}`} target="_blank" style={{ fontSize: '0.75rem', background: 'var(--color-primary)', color: 'white', padding: '0.5rem 0.75rem', borderRadius: '6px', textDecoration: 'none', fontWeight: 600 }}>Receipt</a>
                        </div>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)' }}>Items Purchased:</div>
                        {sale.sale_items?.map((item: any, idx: number) => (
                          <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                            <span>{item.quantity}x {item.products?.name}</span>
                            <span style={{ fontWeight: 600 }}>{formatCurrency(item.total)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Attendance Tab */}
          {activeTab === 'attendance' && (
            <div>
              <h2 style={{ fontSize: '1.5rem', color: 'var(--text-dark)', marginBottom: '1.5rem' }}>Check-in History (Last 30)</h2>
              {attendance.length === 0 ? (
                <p style={{ color: 'var(--text-muted)' }}>No attendance records found.</p>
              ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr>
                      <th style={{ padding: '1rem', background: '#f6f6f6', borderBottom: '2px solid rgba(0,0,0,0.05)', color: 'var(--text-muted)', fontSize: '0.875rem', textTransform: 'uppercase' }}>Date</th>
                      <th style={{ padding: '1rem', background: '#f6f6f6', borderBottom: '2px solid rgba(0,0,0,0.05)', color: 'var(--text-muted)', fontSize: '0.875rem', textTransform: 'uppercase' }}>Check In</th>
                      <th style={{ padding: '1rem', background: '#f6f6f6', borderBottom: '2px solid rgba(0,0,0,0.05)', color: 'var(--text-muted)', fontSize: '0.875rem', textTransform: 'uppercase' }}>Check Out</th>
                      <th style={{ padding: '1rem', background: '#f6f6f6', borderBottom: '2px solid rgba(0,0,0,0.05)', color: 'var(--text-muted)', fontSize: '0.875rem', textTransform: 'uppercase' }}>Duration</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attendance.map(record => {
                      const checkIn = new Date(record.check_in_time)
                      const checkOut = record.check_out_time ? new Date(record.check_out_time) : null
                      
                      let duration = '-'
                      if (checkOut) {
                        const diffMins = Math.round((checkOut.getTime() - checkIn.getTime()) / 60000)
                        const hrs = Math.floor(diffMins / 60)
                        const mins = diffMins % 60
                        duration = hrs > 0 ? `${hrs}h ${mins}m` : `${mins}m`
                      }

                      return (
                        <tr key={record.id} style={{ borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                          <td style={{ padding: '1rem', fontWeight: 600 }}>{checkIn.toLocaleDateString()}</td>
                          <td style={{ padding: '1rem' }}>{checkIn.toLocaleTimeString()}</td>
                          <td style={{ padding: '1rem', color: checkOut ? 'inherit' : 'var(--color-primary)', fontWeight: checkOut ? 500 : 700 }}>
                            {checkOut ? checkOut.toLocaleTimeString() : 'Active Now'}
                          </td>
                          <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>{duration}</td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
