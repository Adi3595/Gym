'use client'

import React from 'react'
import { DataTable } from '@/components/ui/DataTable'
import { Button } from '@/components/ui/Button'
import { Receipt, Calendar, CreditCard, Users, ExternalLink } from 'lucide-react'
import { SummaryGrid, SummaryCard } from '@/components/ui/SummaryCards'
import { useRouter } from 'next/navigation'

export default function SalesClient({ initialSales }: { initialSales: any[] }) {
  const router = useRouter()

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(val || 0)
  }

  const columns = [
    { 
      key: 'created_at', 
      header: 'Date & Time',
      cell: (item: any) => new Date(item.created_at).toLocaleString()
    },
    { 
      key: 'customer', 
      header: 'Customer',
      cell: (item: any) => {
        if (item.members) {
          return (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontWeight: 600, color: 'var(--color-primary)' }}>
                {item.members.first_name} {item.members.last_name}
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                {item.members.phone}
              </span>
            </div>
          )
        }
        return (
          <span style={{ fontWeight: 500, color: 'var(--text-dark)' }}>
            Walk-in Customer
          </span>
        )
      }
    },
    { 
      key: 'payment_method', 
      header: 'Method',
      cell: (item: any) => (
        <span style={{
          background: 'rgba(0,0,0,0.05)',
          padding: '4px 8px',
          borderRadius: '4px',
          fontSize: '0.75rem',
          fontWeight: 600,
        }}>
          {item.payment_method || 'N/A'}
        </span>
      )
    },
    { 
      key: 'final_amount', 
      header: 'Amount',
      cell: (item: any) => (
        <span style={{ fontWeight: 700, color: 'var(--color-accent)' }}>
          {formatCurrency(item.final_amount)}
        </span>
      )
    },
    {
      key: 'actions',
      header: 'Receipt',
      cell: (item: any) => (
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => router.push(`/receipt/pos/${item.id}`)}
          icon={<ExternalLink size={14} />}
        >
          View
        </Button>
      )
    }
  ]

  // Calculate some basic stats
  const totalRevenue = initialSales.reduce((sum, sale) => sum + (sale.final_amount || 0), 0)
  const todaySales = initialSales.filter(sale => {
    const saleDate = new Date(sale.created_at)
    const today = new Date()
    return saleDate.getDate() === today.getDate() && 
           saleDate.getMonth() === today.getMonth() && 
           saleDate.getFullYear() === today.getFullYear()
  })
  const todayRevenue = todaySales.reduce((sum, sale) => sum + (sale.final_amount || 0), 0)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      <div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '3rem', color: 'var(--color-primary)', lineHeight: 1 }}>Sales History</h1>
        <p style={{ color: 'var(--text-muted)' }}>View and manage past store transactions and receipts.</p>
      </div>

      <SummaryGrid>
        <SummaryCard 
          title="Total Transactions" 
          value={initialSales.length} 
          icon={<Receipt size={20} />} 
          colorVariant="primary"
        />
        <SummaryCard 
          title="Today's Revenue" 
          value={formatCurrency(todayRevenue)} 
          icon={<Calendar size={20} />} 
          colorVariant="accent"
        />
        <SummaryCard 
          title="Total Revenue" 
          value={formatCurrency(totalRevenue)} 
          icon={<CreditCard size={20} />} 
          colorVariant="secondary"
        />
      </SummaryGrid>

      <div style={{ background: 'white', borderRadius: '12px', padding: '1rem', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
        <DataTable 
          data={initialSales} 
          columns={columns} 
          searchPlaceholder="Search transactions..."
        />
      </div>

    </div>
  )
}
