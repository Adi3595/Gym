'use client'

import React, { useState, useTransition } from 'react'
import { DataTable } from '@/components/ui/DataTable'
import { Button } from '@/components/ui/Button'
import { Plus, X, Loader2, Package, AlertCircle, ShoppingBag } from 'lucide-react'
import { SummaryGrid, SummaryCard } from '@/components/ui/SummaryCards'
import { addProduct } from './actions'
import { createClient } from '@/utils/supabase/client'
import { Image as ImageIcon } from 'lucide-react'

export default function InventoryClient({ initialProducts }: { initialProducts: any[] }) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(val || 0)
  }

  const getFallbackImage = (name: string) => {
    const ids = [
      '1584017911766-d451b3d0e843',
      '1550989460-0adf9ea622e2',
      '1584362917165-526a968579e8',
      '1593095948071-474c5cc2989d',
      '1541534741688-6078c6bfb5c5',
      '1534438327276-14e5300c3a48',
      '1490645935967-10de6ba17061',
      '1517836357463-d25dfeac3438'
    ];
    let sum = 0;
    for (let i = 0; i < name.length; i++) {
      sum += name.charCodeAt(i);
    }
    return `https://images.unsplash.com/photo-${ids[sum % ids.length]}?auto=format&fit=crop&q=80&w=100`;
  }

  const columns = [
    {
      key: 'image',
      header: 'Image',
      cell: (item: any) => (
        <div style={{ width: '40px', height: '40px', borderRadius: '6px', background: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
          <img src={item.product_image || getFallbackImage(item.name)} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
      )
    },
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
    setIsUploading(true)
    
    // We cannot use startTransition for async operations that block state updates if we want to show loading
    // but we can just run it
    
    try {
      const imageFile = formData.get('imageFile') as File
      if (imageFile && imageFile.size > 0) {
        const supabase = createClient()
        const fileExt = imageFile.name.split('.').pop()
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
        
        const { error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(fileName, imageFile)
          
        if (uploadError) {
          setError(`Upload Error: ${uploadError.message}`)
          setIsUploading(false)
          return
        }
        
        const { data: publicUrlData } = supabase.storage
          .from('product-images')
          .getPublicUrl(fileName)
          
        formData.append('product_image', publicUrlData.publicUrl)
      }

      startTransition(async () => {
        const result = await addProduct(formData)
        if (result?.error) {
          setError(result.error)
        } else {
          setIsModalOpen(false)
        }
        setIsUploading(false)
      })
    } catch (err: any) {
      setError(err.message)
      setIsUploading(false)
    }
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
          colorVariant="primary"
        />
        <SummaryCard 
          title="Low Stock Alerts" 
          value={initialProducts?.filter(p => p.current_stock < 10).length || 0} 
          icon={<AlertCircle size={20} />} 
          trend="Needs Attention" trendUp={false} 
          colorVariant="accent"
        />
        <SummaryCard 
          title="Active Inventory" 
          value={initialProducts?.filter(p => p.status === 'Active').length || 0} 
          icon={<ShoppingBag size={20} />} 
          colorVariant="secondary"
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
            padding: '1.5rem',
            borderRadius: '20px',
            width: '90%',
            maxWidth: '600px',
            position: 'relative',
            maxHeight: '90vh',
            overflowY: 'auto',
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
              
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <div style={{ flex: '1 1 120px', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase' }}>SKU *</label>
                  <input type="text" name="sku" required style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.1)' }} />
                </div>
                <div style={{ flex: '2 1 200px', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase' }}>Product Name *</label>
                  <input type="text" name="name" required style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.1)' }} />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <div style={{ flex: '1 1 120px', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase' }}>Purchase Price *</label>
                  <input type="number" step="0.01" name="purchase_price" required style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.1)' }} />
                </div>
                <div style={{ flex: '1 1 120px', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase' }}>Selling Price *</label>
                  <input type="number" step="0.01" name="selling_price" required style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.1)' }} />
                </div>
                <div style={{ flex: '1 1 120px', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase' }}>MRP *</label>
                  <input type="number" step="0.01" name="mrp" required style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.1)' }} />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                <div style={{ flex: '1 1 120px', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase' }}>Initial Stock *</label>
                  <input type="number" name="current_stock" required defaultValue="0" style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.1)' }} />
                </div>
                <div style={{ flex: '1 1 120px', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase' }}>Status</label>
                  <select name="status" style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.1)', background: 'white' }}>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
                <div style={{ flex: '2 1 200px', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase' }}>Product Image</label>
                  <input type="file" name="imageFile" accept="image/*" style={{ padding: '0.5rem', borderRadius: '8px', border: '1px dashed rgba(0,0,0,0.2)', background: 'white', cursor: 'pointer' }} />
                </div>
              </div>

              <Button type="submit" variant="primary" fullWidth disabled={isPending || isUploading}>
                {isPending || isUploading ? <Loader2 className="animate-spin" /> : 'Save Product'}
              </Button>
            </form>
          </div>
        </div>
      )}

    </div>
  )
}
