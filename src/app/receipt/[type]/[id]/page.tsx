import React from 'react'
import { createClient } from '@supabase/supabase-js'
import { ArrowLeft, Receipt as ReceiptIcon } from 'lucide-react'
import Link from 'next/link'
import PrintButton from './PrintButton'
import AutoPrint from './AutoPrint'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function ReceiptPage(props: { params: Promise<{ type: string, id: string }>, searchParams?: Promise<{ [key: string]: string | undefined }> }) {
  const params = await props.params;
  const searchParams = props.searchParams ? await props.searchParams : undefined;
  const { type, id } = params
  
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!serviceKey) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f6f6f6' }}>
        <div style={{ padding: '3rem', background: 'white', borderRadius: '12px', textAlign: 'center', maxWidth: '600px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
          <h2 style={{ color: '#EF4444', fontFamily: 'var(--font-display)', marginBottom: '1rem' }}>Vercel Configuration Missing</h2>
          <p style={{ color: '#374151', marginBottom: '1.5rem', lineHeight: 1.6 }}>
            To view receipts on your live site, you must add your Supabase Service Role Key to Vercel so the system can safely fetch the receipt data.
          </p>
          <div style={{ textAlign: 'left', background: '#f9fafb', padding: '1.5rem', borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '0.9rem', color: '#4b5563' }}>
            <p style={{ margin: '0 0 0.5rem 0' }}>1. Go to your <strong>Supabase Dashboard</strong> → Project Settings → API.</p>
            <p style={{ margin: '0 0 0.5rem 0' }}>2. Copy the <code>service_role</code> secret key.</p>
            <p style={{ margin: '0 0 0.5rem 0' }}>3. Go to your <strong>Vercel Dashboard</strong> → Settings → Environment Variables.</p>
            <p style={{ margin: '0 0 0.5rem 0' }}>4. Add a new variable named <code>SUPABASE_SERVICE_ROLE_KEY</code> and paste the key.</p>
            <p style={{ margin: 0 }}>5. Go to Vercel Deployments and hit <strong>Redeploy</strong>.</p>
          </div>
        </div>
      </div>
    )
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabase = createClient(supabaseUrl, serviceKey)
  
  let receiptData: any = null
  let data: any = null
  let error: any = null
  
  if (type === 'subscription') {
    const res = await supabase
      .from('subscriptions')
      .select(`
        *,
        members (*),
        membership_plans (*)
      `)
      .eq('id', id)
      .single()
    
    if (res.error) {
      return <div style={{ padding: '2rem', color: 'red' }}>Database Error (Subscription): {res.error.message}</div>
    }
    receiptData = res.data
    data = res.data
    error = res.error
  } else if (type === 'pos') {
    const res = await supabase
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
      
    if (res.error) {
      return <div style={{ padding: '2rem', color: 'red' }}>Database Error (POS): {res.error.message}</div>
    }
    receiptData = res.data
    data = res.data
    error = res.error
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
      <div className="no-print" style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', width: '100%', maxWidth: '600px', justifyContent: 'space-between' }}>
        <Link href="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'transparent', color: 'var(--color-primary)', border: '1px solid var(--color-primary)', padding: '0.75rem 1.5rem', borderRadius: '8px', textDecoration: 'none', fontWeight: 600 }}>
          <ArrowLeft size={18} /> Back to Dashboard
        </Link>
        <PrintButton />
      </div>

      {/* Receipt Paper */}
      <div style={{ background: 'white', width: '100%', maxWidth: '600px', padding: 0, borderRadius: '16px', boxShadow: '0 20px 40px rgba(0,0,0,0.06)', position: 'relative', overflow: 'hidden' }}>
        
        {/* Top Accent Band */}
        <div style={{ height: '8px', width: '100%', background: 'var(--color-primary)' }}></div>

        <div style={{ padding: '3rem' }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '56px', height: '56px', borderRadius: '16px', background: 'rgba(22, 105, 122, 0.08)', color: 'var(--color-primary)', marginBottom: '1.25rem' }}>
              <ReceiptIcon size={28} />
            </div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.25rem', color: 'var(--text-dark)', margin: '0 0 0.5rem 0', letterSpacing: '-0.5px' }}>SMFITNESS GYM</h1>
            <p style={{ color: '#6b7280', margin: '0 0 0.25rem 0', fontSize: '0.95rem' }}>123 Fitness Avenue, Mumbai, IN 400001</p>
            <p style={{ color: '#6b7280', margin: 0, fontSize: '0.95rem' }}>Phone: +91 98765 43210</p>
          </div>

          {/* Info Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', background: '#f9fafb', padding: '1.5rem', borderRadius: '12px', marginBottom: '3rem', border: '1px solid #f3f4f6' }}>
            <div>
              <p style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#9ca3af', fontWeight: 700, margin: '0 0 0.35rem 0', letterSpacing: '0.5px' }}>Receipt No.</p>
              <p style={{ margin: 0, fontWeight: 700, color: 'var(--text-dark)', fontFamily: 'monospace', fontSize: '1.1rem' }}>#{id.substring(0, 8).toUpperCase()}</p>
            </div>
            <div>
              <p style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#9ca3af', fontWeight: 700, margin: '0 0 0.35rem 0', letterSpacing: '0.5px' }}>Payment Method</p>
              <p style={{ margin: 0, fontWeight: 600, color: 'var(--text-dark)' }}>{receiptData.payment_method || 'N/A'}</p>
            </div>
            <div>
              <p style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#9ca3af', fontWeight: 700, margin: '0 0 0.35rem 0', letterSpacing: '0.5px' }}>Date & Time</p>
              <p style={{ margin: 0, fontWeight: 600, color: 'var(--text-dark)' }}>{new Date(receiptData.created_at).toLocaleString()}</p>
            </div>
            {type === 'subscription' && receiptData.members && (
              <div>
                <p style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#9ca3af', fontWeight: 700, margin: '0 0 0.35rem 0', letterSpacing: '0.5px' }}>Billed To</p>
                <p style={{ margin: 0, fontWeight: 600, color: 'var(--text-dark)' }}>{receiptData.members.first_name} {receiptData.members.last_name}</p>
              </div>
            )}
          </div>

          {/* Items Table */}
          <div style={{ marginBottom: '3rem' }}>
            <div style={{ display: 'flex', background: '#f3f4f6', padding: '0.85rem 1rem', borderRadius: '8px', marginBottom: '0.5rem' }}>
              <div style={{ flex: 3, fontSize: '0.8rem', textTransform: 'uppercase', fontWeight: 700, color: '#6b7280', letterSpacing: '0.5px' }}>Description</div>
              <div style={{ flex: 1, fontSize: '0.8rem', textTransform: 'uppercase', fontWeight: 700, color: '#6b7280', letterSpacing: '0.5px', textAlign: 'right' }}>Total</div>
            </div>

            {type === 'pos' && (!receiptData.sale_items || receiptData.sale_items.length === 0) && (
              <div style={{ padding: '2rem', textAlign: 'center', color: '#9ca3af', fontStyle: 'italic', background: '#f9fafb', borderRadius: '8px', border: '1px dashed #e5e7eb', marginTop: '1rem' }}>
                No line items were recorded for this transaction.
              </div>
            )}

            {type === 'subscription' && (
              <div style={{ display: 'flex', padding: '1rem', borderBottom: '1px solid #f3f4f6' }}>
                <div style={{ flex: 3 }}>
                  <div style={{ fontWeight: 600, color: 'var(--text-dark)', fontSize: '1.05rem', marginBottom: '0.25rem' }}>{receiptData.membership_plans?.name || 'Membership Subscription'}</div>
                  <div style={{ fontSize: '0.85rem', color: '#6b7280' }}>{new Date(receiptData.start_date).toLocaleDateString()} - {new Date(receiptData.end_date).toLocaleDateString()}</div>
                </div>
                <div style={{ flex: 1, textAlign: 'right', fontWeight: 600, color: 'var(--text-dark)', fontSize: '1.05rem' }}>{formatCurrency(receiptData.amount_paid)}</div>
              </div>
            )}

            {type === 'pos' && receiptData.sale_items?.map((item: any, idx: number) => (
              <div key={idx} style={{ display: 'flex', padding: '1rem', borderBottom: '1px solid #f3f4f6', alignItems: 'center' }}>
                <div style={{ flex: 3 }}>
                  <div style={{ fontWeight: 600, color: 'var(--text-dark)', fontSize: '1.05rem', marginBottom: '0.25rem' }}>{item.products?.name || 'Product'}</div>
                  <div style={{ fontSize: '0.85rem', color: '#6b7280' }}>{item.quantity} x {formatCurrency(item.price)}</div>
                </div>
                <div style={{ flex: 1, textAlign: 'right', fontWeight: 600, color: 'var(--text-dark)', fontSize: '1.05rem' }}>{formatCurrency(item.total)}</div>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div style={{ borderTop: '2px dashed #e5e7eb', paddingTop: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.75rem' }}>
            {type === 'pos' && receiptData.discount > 0 && (
              <div style={{ display: 'flex', width: '100%', maxWidth: '280px', justifyContent: 'space-between', color: '#6b7280', fontWeight: 500, padding: '0 1rem' }}>
                <span>Subtotal:</span>
                <span>{formatCurrency(receiptData.total_amount)}</span>
              </div>
            )}
            {type === 'pos' && receiptData.discount > 0 && (
              <div style={{ display: 'flex', width: '100%', maxWidth: '280px', justifyContent: 'space-between', color: '#EF4444', fontWeight: 500, padding: '0 1rem' }}>
                <span>Discount:</span>
                <span>-{formatCurrency(receiptData.discount)}</span>
              </div>
            )}
            <div style={{ display: 'flex', width: '100%', maxWidth: '280px', justifyContent: 'space-between', fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-dark)', background: '#f9fafb', padding: '1.25rem 1rem', borderRadius: '12px', marginTop: '0.5rem', border: '1px solid #f3f4f6' }}>
              <span>Total Amount</span>
              <span style={{ color: 'var(--color-primary)' }}>{formatCurrency(type === 'pos' ? receiptData.final_amount : receiptData.amount_paid)}</span>
            </div>
          </div>

          {/* Footer */}
          <div style={{ textAlign: 'center', marginTop: '4rem', color: '#9ca3af', fontSize: '0.85rem' }}>
            <p style={{ margin: 0, fontWeight: 500 }}>Thank you for choosing SMFitness Gym!</p>
            <p style={{ margin: '0.35rem 0 0 0' }}>This is a computer generated receipt.</p>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          @page { margin: 5mm; }
          body { 
            background: white !important; 
            -webkit-print-color-adjust: exact; 
          }
          .no-print { display: none !important; }
          div[style*="boxShadow"] { 
            box-shadow: none !important; 
            padding: 0 !important; 
            max-width: 100% !important;
            width: 100% !important;
          }
        }
      `}} />
      
      {searchParams?.autoPrint === 'true' && (
        <AutoPrint />
      )}
    </div>
  )
}
