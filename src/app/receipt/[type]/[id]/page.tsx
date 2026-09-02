import React from 'react'
import { createClient } from '@supabase/supabase-js'
import { Printer } from 'lucide-react'
import Link from 'next/link'

// Create a public client for the receipt (read-only)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

export default async function ReceiptPage({ params }: { params: { type: string, id: string } }) {
  const { type, id } = params
  
  let receiptData: any = null
  
  if (type === 'subscription') {
    const { data } = await supabase
      .from('subscriptions')
      .select(`
        *,
        members (*),
        membership_plans (*)
      `)
      .eq('id', id)
      .single()
    receiptData = data
  } else if (type === 'pos') {
    const { data } = await supabase
      .from('sales')
      .select(`
        *,
        sale_items (
          *,
          products (*)
        )
      `)
      .eq('id', id)
      .single()
    receiptData = data
  }

  if (!receiptData) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f6f6f6' }}>
        <div style={{ padding: '2rem', background: 'white', borderRadius: '12px', textAlign: 'center' }}>
          <h2>Receipt Not Found</h2>
          <p>This receipt may have been deleted or the link is invalid.</p>
        </div>
      </div>
    )
  }

  const formatCurrency = (val: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(val || 0)

  return (
    <div style={{ background: '#f3f4f6', minHeight: '100vh', padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', fontFamily: 'var(--font-sans)' }}>
      
      {/* Print / Action Bar */}
      <div className="no-print" style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', width: '100%', maxWidth: '600px', justifyContent: 'flex-end' }}>
        <button 
          onClick={() => window.print()}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--color-primary)', color: 'white', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}
        >
          <Printer size={18} /> Print Receipt
        </button>
      </div>

      {/* Receipt Paper */}
      <div style={{ background: 'white', width: '100%', maxWidth: '600px', padding: '3rem', borderRadius: '4px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', position: 'relative' }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '3rem', borderBottom: '2px dashed #e5e7eb', paddingBottom: '2rem' }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', color: 'var(--color-primary)', margin: 0 }}>AURA GYM</h1>
          <p style={{ color: '#6b7280', margin: '0.5rem 0 0 0' }}>123 Fitness Avenue, Mumbai, IN 400001</p>
          <p style={{ color: '#6b7280', margin: '0.25rem 0 0 0' }}>Phone: +91 98765 43210</p>
          <div style={{ marginTop: '1.5rem', background: '#f3f4f6', display: 'inline-block', padding: '0.5rem 1rem', borderRadius: '4px', fontWeight: 700, color: 'var(--text-dark)', letterSpacing: '1px' }}>
            RECEIPT #{id.substring(0, 8).toUpperCase()}
          </div>
        </div>

        {/* Info Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '3rem' }}>
          <div>
            <p style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#6b7280', fontWeight: 600, margin: '0 0 0.25rem 0' }}>Date & Time</p>
            <p style={{ margin: 0, fontWeight: 500, color: 'var(--text-dark)' }}>{new Date(receiptData.created_at).toLocaleString()}</p>
          </div>
          <div>
            <p style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#6b7280', fontWeight: 600, margin: '0 0 0.25rem 0' }}>Payment Method</p>
            <p style={{ margin: 0, fontWeight: 500, color: 'var(--text-dark)' }}>{receiptData.payment_method || 'N/A'}</p>
          </div>
          {type === 'subscription' && receiptData.members && (
            <div style={{ gridColumn: 'span 2' }}>
              <p style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#6b7280', fontWeight: 600, margin: '0 0 0.25rem 0' }}>Billed To</p>
              <p style={{ margin: 0, fontWeight: 600, color: 'var(--text-dark)', fontSize: '1.1rem' }}>{receiptData.members.first_name} {receiptData.members.last_name}</p>
              <p style={{ margin: '0.25rem 0 0 0', color: '#6b7280' }}>{receiptData.members.phone}</p>
            </div>
          )}
        </div>

        {/* Items Table */}
        <div style={{ marginBottom: '3rem' }}>
          <div style={{ display: 'flex', borderBottom: '2px solid #e5e7eb', paddingBottom: '0.5rem', marginBottom: '1rem' }}>
            <div style={{ flex: 3, fontWeight: 700, color: '#374151' }}>Description</div>
            <div style={{ flex: 1, fontWeight: 700, color: '#374151', textAlign: 'right' }}>Total</div>
          </div>

          {type === 'subscription' && (
            <div style={{ display: 'flex', padding: '0.5rem 0', borderBottom: '1px solid #f3f4f6' }}>
              <div style={{ flex: 3, color: '#4b5563' }}>
                <div style={{ fontWeight: 600, color: 'var(--text-dark)' }}>{receiptData.membership_plans?.name || 'Membership Subscription'}</div>
                <div style={{ fontSize: '0.85rem' }}>{new Date(receiptData.start_date).toLocaleDateString()} - {new Date(receiptData.end_date).toLocaleDateString()}</div>
              </div>
              <div style={{ flex: 1, textAlign: 'right', fontWeight: 500 }}>{formatCurrency(receiptData.amount_paid)}</div>
            </div>
          )}

          {type === 'pos' && receiptData.sale_items?.map((item: any, idx: number) => (
            <div key={idx} style={{ display: 'flex', padding: '0.5rem 0', borderBottom: '1px solid #f3f4f6' }}>
              <div style={{ flex: 3, color: '#4b5563' }}>
                <div style={{ fontWeight: 600, color: 'var(--text-dark)' }}>{item.products?.name || 'Product'}</div>
                <div style={{ fontSize: '0.85rem' }}>{item.quantity} x {formatCurrency(item.price)}</div>
              </div>
              <div style={{ flex: 1, textAlign: 'right', fontWeight: 500 }}>{formatCurrency(item.total)}</div>
            </div>
          ))}
        </div>

        {/* Totals */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'flex-end' }}>
          {type === 'pos' && receiptData.discount > 0 && (
            <div style={{ display: 'flex', width: '200px', justifyContent: 'space-between', color: '#6b7280' }}>
              <span>Subtotal:</span>
              <span>{formatCurrency(receiptData.total_amount)}</span>
            </div>
          )}
          {type === 'pos' && receiptData.discount > 0 && (
            <div style={{ display: 'flex', width: '200px', justifyContent: 'space-between', color: '#EF4444' }}>
              <span>Discount:</span>
              <span>-{formatCurrency(receiptData.discount)}</span>
            </div>
          )}
          <div style={{ display: 'flex', width: '200px', justifyContent: 'space-between', fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-primary)', borderTop: '2px solid #e5e7eb', paddingTop: '1rem', marginTop: '0.5rem' }}>
            <span>Total:</span>
            <span>{formatCurrency(type === 'pos' ? receiptData.final_amount : receiptData.amount_paid)}</span>
          </div>
        </div>

        {/* Footer */}
        <div style={{ textAlign: 'center', marginTop: '4rem', color: '#9ca3af', fontSize: '0.85rem' }}>
          <p style={{ margin: 0 }}>Thank you for choosing Aura Gym!</p>
          <p style={{ margin: '0.25rem 0 0 0' }}>This is a computer generated receipt.</p>
        </div>

      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          body { background: white !important; }
          .no-print { display: none !important; }
          div[style*="boxShadow"] { box-shadow: none !important; padding: 0 !important; }
        }
      `}} />
    </div>
  )
}
