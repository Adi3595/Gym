'use client'

import React, { useState, useTransition } from 'react'
import { DataTable } from '@/components/ui/DataTable'
import { Button } from '@/components/ui/Button'
import { Plus, X, Loader2 } from 'lucide-react'
import { addMember } from './actions'

export default function MembersClient({ initialMembers }: { initialMembers: any[] }) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const columns = [
    { key: 'first_name', header: 'First Name' },
    { key: 'last_name', header: 'Last Name' },
    { key: 'email', header: 'Email' },
    { key: 'phone', header: 'Phone' },
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
    },
    { 
      key: 'join_date', 
      header: 'Join Date',
      cell: (item: any) => new Date(item.join_date).toLocaleDateString()
    }
  ]

  async function handleSubmit(formData: FormData) {
    setError(null)
    startTransition(async () => {
      const result = await addMember(formData)
      if (result?.error) {
        setError(result.error)
      } else {
        setIsModalOpen(false)
      }
    })
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', color: 'var(--color-primary)', lineHeight: 1 }}>Members</h1>
          <p style={{ color: 'var(--text-muted)' }}>Manage your gym's member database.</p>
        </div>
        <Button variant="primary" icon={<Plus size={18} />} onClick={() => setIsModalOpen(true)}>
          Add Member
        </Button>
      </div>

      <DataTable 
        data={initialMembers || []} 
        columns={columns} 
        searchPlaceholder="Search members by name or email..."
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
            background: 'white',
            padding: '1rem',
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
            
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', color: 'var(--color-primary)', marginBottom: '1.5rem' }}>New Member</h2>
            
            {error && <div style={{ color: '#EF4444', marginBottom: '1rem', fontSize: '0.875rem' }}>{error}</div>}

            <form action={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase' }}>First Name *</label>
                  <input type="text" name="first_name" required style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.1)' }} />
                </div>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase' }}>Last Name *</label>
                  <input type="text" name="last_name" required style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.1)' }} />
                </div>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase' }}>Email</label>
                <input type="email" name="email" style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.1)' }} />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase' }}>Phone *</label>
                <input type="tel" name="phone" required style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.1)' }} />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase' }}>Status</label>
                <select name="status" style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.1)', background: 'white' }}>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              <Button type="submit" variant="primary" fullWidth disabled={isPending}>
                {isPending ? <Loader2 className="animate-spin" /> : 'Save Member'}
              </Button>
            </form>
          </div>
        </div>
      )}

    </div>
  )
}
