'use client'

import React, { useState, useTransition } from 'react'
import { DataTable } from '@/components/ui/DataTable'
import { Button } from '@/components/ui/Button'
import { Plus, X, Loader2, Package, AlertCircle, ShoppingBag } from 'lucide-react'
import { SummaryGrid, SummaryCard } from '@/components/ui/SummaryCards'
import { addProduct } from './actions'

export default function InventoryClient({ initialProducts }: { initialProducts: any[] }) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(val || 0)
  }

  const columns = [
    { key: 'sku', header: 'SKU' },
    { key: 'name', header: 'Product Name' },
    { 
      key: 'current_stock', 
      header: 'Stock',
      cell: (item: any) => (
        <span style={{
          color: item.current_stock < 10 ? '#EF4444' : 'var(--text-dark)',
          fontWeight: item.current_stock < 10 ? 700 : 500
        }}>
          {item.current_stock}
        </span>
      )
    },
    { 
      key: 'selling_price', 
      header: 'Price',
      cell: (item: any) => formatCurrency(item.selling_price)
    },
    { 
      key: 'status', 
      header: 'Status',
      cell: (item: any) => (
        <span style={{
          background: item.status === 'Active' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
          color: item.status === 'Active' ? '#22C55E' : '#EF4444',
          padding: '4px 8px',
          borderRadius: '4px',
          fontSize: '0.75rem',
          fontWeight: 700,
          textTransform: 'uppercase'
        }}>
          {item.status}
        </span>
      )
    }
  ]

  async function handleSubmit(formData: FormData) {
    setError(null)
    startTransition(async () => {
      const result = await addProduct(formData)
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
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '3rem', color: 'var(--color-primary)', lineHeight: 1 }}>Inventory</h1>
          <p style={{ color: 'var(--text-muted)' }}>Manage products and point of sale inventory.</p>
        </div>
        <Button variant="primary" icon={<Plus size={18} />} onClick={() => setIsModalOpen(true)}>
          Add Product
        </Button>
      </div>

      <SummaryGrid>
        <SummaryCard 
          title="Total Products" 
          value={initialProducts?.length || 0} 
          icon={<Package size={20} />} 
        />
        <SummaryCard 
          title="Low Stock Alerts" 
          value={initialProducts?.filter(p => p.current_stock < 10).length || 0} 
          icon={<AlertCircle size={20} />} 
          trend="Needs Attention" trendUp={false} 
        />
        <SummaryCard 
          title="Active Inventory" 
          value={initialProducts?.filter(p => p.status === 'Active').length || 0} 
          icon={<ShoppingBag size={20} />} 
        />
      </SummaryGrid>

      <DataTable 
        data={initialProducts || []} 
        columns={columns} 
        searchPlaceholder="Search products by SKU or Name..."
      />

      {/* Basic Modal */}
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
            maxWidth: '600px',
            position: 'relative',
            boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
          }}>
            <button 
              onClick={() => setIsModalOpen(false)}
              style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'none', border: 'none', cursor: 'pointer' }}
            >
              <X size={24} color="var(--text-muted)" />
            </button>
            
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', color: 'var(--color-primary)', marginBottom: '1.5rem' }}>New Product</h2>
            
            {error && <div style={{ color: '#EF4444', marginBottom: '1rem', fontSize: '0.875rem' }}>{error}</div>}

            <form action={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              
              <div style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase' }}>SKU *</label>
                  <input type="text" name="sku" required style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.1)' }} />
                </div>
                <div style={{ flex: 2, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase' }}>Product Name *</label>
                  <input type="text" name="name" required style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.1)' }} />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase' }}>Purchase Price *</label>
                  <input type="number" step="0.01" name="purchase_price" required style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.1)' }} />
                </div>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase' }}>Selling Price *</label>
                  <input type="number" step="0.01" name="selling_price" required style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.1)' }} />
                </div>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase' }}>MRP *</label>
                  <input type="number" step="0.01" name="mrp" required style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.1)' }} />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase' }}>Initial Stock *</label>
                  <input type="number" name="current_stock" required defaultValue="0" style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.1)' }} />
                </div>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase' }}>Status</label>
                  <select name="status" style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.1)', background: 'white' }}>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <Button type="submit" variant="primary" fullWidth disabled={isPending}>
                {isPending ? <Loader2 className="animate-spin" /> : 'Save Product'}
              </Button>
            </form>
          </div>
        </div>
      )}

    </div>
  )
}
