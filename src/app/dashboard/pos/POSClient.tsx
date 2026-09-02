'use client'

import React, { useState, useTransition } from 'react'
import { processSale } from './actions'
import { Button } from '@/components/ui/Button'
import { ShoppingCart, Plus, Minus, X, CreditCard, Search, User, CheckCircle2 } from 'lucide-react'

export default function POSClient({ products, members }: { products: any[], members: any[] }) {
  const [cart, setCart] = useState<any[]>([])
  const [selectedMember, setSelectedMember] = useState<string>('')
  const [paymentMethod, setPaymentMethod] = useState<string>('Card')
  const [searchQuery, setSearchQuery] = useState('')
  const [isPending, startTransition] = useTransition()
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(val || 0)
  }

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.sku.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const addToCart = (product: any) => {
    setCart(prev => {
      const existing = prev.find(item => item.product_id === product.id)
      if (existing) {
        return prev.map(item => item.product_id === product.id ? { ...item, quantity: item.quantity + 1 } : item)
      }
      return [...prev, { product_id: product.id, name: product.name, price: product.selling_price, quantity: 1 }]
    })
  }

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.product_id === id) {
        const newQ = item.quantity + delta
        return newQ > 0 ? { ...item, quantity: newQ } : item
      }
      return item
    }))
  }

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.product_id !== id))
  }

  const total = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0)

  const handleCheckout = () => {
    if (cart.length === 0) return
    setError(null)
    setSuccess(false)

    startTransition(async () => {
      const res = await processSale(cart, selectedMember || null, paymentMethod)
      if (res.error) {
        setError(res.error)
      } else {
        setSuccess(true)
        setCart([])
        setSelectedMember('')
        setTimeout(() => setSuccess(false), 3000)
        
        // Open receipt in new tab
        if (res.saleId) {
          window.open(`/receipt/pos/${res.saleId}`, '_blank')
        }
      }
    })
  }

  return (
    <div style={{ display: 'flex', gap: '2rem', height: 'calc(100vh - 150px)' }}>
      
      {/* Products Section (Left) */}
      <div style={{ flex: 2, display: 'flex', flexDirection: 'column', gap: '1.5rem', overflow: 'hidden' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', color: 'var(--color-primary)', lineHeight: 1 }}>Point of Sale</h1>
          <p style={{ color: 'var(--text-muted)' }}>Scan or select products to checkout.</p>
        </div>

        <div style={{ position: 'relative' }}>
          <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input 
            type="text" 
            placeholder="Search by SKU or Name..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width: '100%', padding: '1rem 1rem 1rem 3rem', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.1)' }}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem', overflowY: 'auto', paddingBottom: '2rem' }}>
          {filteredProducts.map(product => (
            <div 
              key={product.id}
              onClick={() => addToCart(product)}
              style={{
                background: '#f6f6f6',
                border: '1px solid rgba(22, 105, 122, 0.08)',
                borderRadius: '12px',
                padding: '1.25rem',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem',
                transition: 'all var(--transition-fast)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.02)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--color-primary)';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(22, 105, 122, 0.08)';
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.02)';
              }}
            >
              <div style={{ height: '120px', width: '100%', borderRadius: '8px', overflow: 'hidden', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.5rem' }}>
                {product.product_image ? (
                  <img src={product.product_image} alt={product.name} style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }} />
                ) : (
                  <ShoppingCart size={32} color="rgba(0,0,0,0.1)" />
                )}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>{product.sku}</div>
              <div style={{ fontWeight: 600, color: 'var(--text-dark)', lineHeight: 1.2 }}>{product.name}</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '0.5rem' }}>
                <span style={{ color: 'var(--color-primary)', fontWeight: 700 }}>{formatCurrency(product.selling_price)}</span>
                <span style={{ fontSize: '0.75rem', color: product.current_stock < 5 ? '#EF4444' : 'var(--text-muted)' }}>
                  Stock: {product.current_stock}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cart Section (Right) */}
      <div style={{ flex: 1, background: '#f6f6f6', borderRadius: '16px', border: '1px solid rgba(22, 105, 122, 0.08)', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.02)' }}>
        
        <div style={{ padding: '1.5rem', borderBottom: '1px solid rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'white' }}>
          <ShoppingCart size={20} color="var(--color-primary)" />
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', color: 'var(--color-primary)', margin: 0 }}>Current Order</h2>
        </div>

        <div style={{ padding: '1.5rem', borderBottom: '1px solid rgba(0,0,0,0.05)', background: 'white' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>Assign to Member (Optional)</label>
            <div style={{ position: 'relative' }}>
              <User size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <select 
                value={selectedMember} 
                onChange={(e) => setSelectedMember(e.target.value)}
                style={{ width: '100%', padding: '0.75rem 0.75rem 0.75rem 2.5rem', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.1)', background: '#f6f6f6' }}
              >
                <option value="">Walk-in Customer</option>
                {members.map(m => (
                  <option key={m.id} value={m.id}>{m.first_name} {m.last_name} ({m.phone})</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {cart.length === 0 ? (
            <div style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: '2rem' }}>Cart is empty</div>
          ) : (
            cart.map(item => (
              <div key={item.product_id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '1rem', borderBottom: '1px dashed rgba(0,0,0,0.1)' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, color: 'var(--text-dark)', fontSize: '0.9rem' }}>{item.name}</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{formatCurrency(item.price)}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <button onClick={() => updateQuantity(item.product_id, -1)} style={{ width: '24px', height: '24px', borderRadius: '4px', border: '1px solid #ddd', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><Minus size={14}/></button>
                  <span style={{ fontWeight: 600, width: '20px', textAlign: 'center' }}>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.product_id, 1)} style={{ width: '24px', height: '24px', borderRadius: '4px', border: '1px solid #ddd', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><Plus size={14}/></button>
                  <button onClick={() => removeFromCart(item.product_id)} style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer', marginLeft: '0.5rem' }}><X size={16}/></button>
                </div>
              </div>
            ))
          )}
        </div>

        <div style={{ padding: '1.5rem', background: 'var(--bg-main)', borderTop: '1px solid rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-dark)' }}>
            <span>Total</span>
            <span style={{ color: 'var(--color-accent)' }}>{formatCurrency(total)}</span>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
            {['Card', 'Cash', 'UPI'].map(method => (
              <button 
                key={method}
                onClick={() => setPaymentMethod(method)}
                style={{ 
                  flex: 1, 
                  padding: '0.5rem', 
                  borderRadius: '6px', 
                  border: `1px solid ${paymentMethod === method ? 'var(--color-primary)' : 'rgba(0,0,0,0.1)'}`,
                  background: paymentMethod === method ? 'rgba(22, 105, 122, 0.1)' : 'white',
                  color: paymentMethod === method ? 'var(--color-primary)' : 'var(--text-muted)',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                {method}
              </button>
            ))}
          </div>

          {error && <div style={{ color: '#EF4444', marginBottom: '1rem', fontSize: '0.875rem', textAlign: 'center' }}>{error}</div>}
          {success && <div style={{ color: '#22C55E', marginBottom: '1rem', fontSize: '0.875rem', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}><CheckCircle2 size={16}/> Payment Successful!</div>}

          <Button variant="primary" fullWidth size="lg" onClick={handleCheckout} disabled={isPending || cart.length === 0}>
            {isPending ? 'Processing...' : `Charge ${formatCurrency(total)}`}
          </Button>
        </div>
      </div>

    </div>
  )
}
