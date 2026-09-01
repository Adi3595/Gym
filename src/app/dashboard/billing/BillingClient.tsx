'use client'

import React, { useState, useTransition } from 'react'
import { DataTable } from '@/components/ui/DataTable'
import { Button } from '@/components/ui/Button'
import { Plus, X, Loader2 } from 'lucide-react'
import { addSubscription } from './actions'

export default function BillingClient({ 
  initialSubscriptions, 
  members, 
  plans 
}: { 
  initialSubscriptions: any[], 
  members: any[], 
  plans: any[] 
}) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(val || 0)
  }

  const columns = [
    { 
      key: 'member', 
      header: 'Member',
      cell: (item: any) => `${item.members?.first_name || 'Unknown'} ${item.members?.last_name || ''}`
    },
    { 
      key: 'plan', 
      header: 'Plan',
      cell: (item: any) => item.membership_plans?.name || 'Unknown Plan'
    },
    { 
      key: 'amount_paid', 
      header: 'Amount Paid',
      cell: (item: any) => formatCurrency(item.amount_paid)
    },
    { 
      key: 'start_date', 
      header: 'Start Date',
      cell: (item: any) => new Date(item.start_date).toLocaleDateString()
    },
    { 
      key: 'end_date', 
      header: 'End Date',
      cell: (item: any) => (
        <span style={{
          color: new Date(item.end_date) < new Date() ? '#EF4444' : 'var(--text-dark)',
          fontWeight: new Date(item.end_date) < new Date() ? 700 : 500
        }}>
          {new Date(item.end_date).toLocaleDateString()}
        </span>
      )
    },
    { 
      key: 'payment_status', 
      header: 'Status',
      cell: (item: any) => (
        <span style={{
          background: item.payment_status === 'Completed' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
          color: item.payment_status === 'Completed' ? '#22C55E' : '#EF4444',
          padding: '4px 8px',
          borderRadius: '4px',
          fontSize: '0.75rem',
          fontWeight: 700,
          textTransform: 'uppercase'
        }}>
          {item.payment_status}
        </span>
      )
    }
  ]

  async function handleSubmit(formData: FormData) {
    setError(null)
    startTransition(async () => {
      const result = await addSubscription(formData)
      if (result?.error) {
        setError(result.error)
      } else {
        setIsModalOpen(false)
      }
    })
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '3rem', color: 'var(--color-primary)', lineHeight: 1 }}>Billing</h1>
          <p style={{ color: 'var(--text-muted)' }}>Manage memberships and subscription payments.</p>
        </div>
        <Button variant="primary" icon={<Plus size={18} />} onClick={() => setIsModalOpen(true)}>
          Assign Subscription
        </Button>
      </div>

      <DataTable 
        data={initialSubscriptions || []} 
        columns={columns} 
        searchPlaceholder="Search subscriptions..."
      />

      {/* Modal */}
      {isModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(10, 31, 36, 0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
          backdropFilter: 'blur(4px)'
        }}>
          <div style={{
            background: '#f6f6f6',
            padding: '2.5rem',
            borderRadius: '20px',
            width: '100%',
            maxWidth: '500px',
            position: 'relative',
            boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
          }}>
            <button 
              onClick={() => setIsModalOpen(false)}
              style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'none', border: 'none', cursor: 'pointer' }}
            >
              <X size={24} color="var(--text-muted)" />
            </button>
            
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', color: 'var(--color-primary)', marginBottom: '1.5rem' }}>Assign Plan</h2>
            
            {error && <div style={{ color: '#EF4444', marginBottom: '1rem', fontSize: '0.875rem' }}>{error}</div>}

            <form action={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase' }}>Select Member *</label>
                <select name="member_id" required style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.1)', background: 'white' }}>
                  <option value="">-- Choose Member --</option>
                  {members.map(m => (
                    <option key={m.id} value={m.id}>{m.first_name} {m.last_name} ({m.phone})</option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase' }}>Membership Plan *</label>
                <select name="plan_id" required style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.1)', background: 'white' }}>
                  <option value="">-- Choose Plan --</option>
                  {plans.map(p => (
                    <option key={p.id} value={p.id}>{p.name} - {formatCurrency(p.price)} ({p.duration_days} Days)</option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase' }}>Payment Method *</label>
                <select name="payment_method" required style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.1)', background: 'white' }}>
                  <option value="Card">Credit/Debit Card</option>
                  <option value="UPI">UPI</option>
                  <option value="Cash">Cash</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                </select>
              </div>

              <Button type="submit" variant="primary" fullWidth disabled={isPending}>
                {isPending ? <Loader2 className="animate-spin" /> : 'Process Subscription'}
              </Button>
            </form>
          </div>
        </div>
      )}

    </div>
  )
}
