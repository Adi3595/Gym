'use client'

import { useEffect } from 'react'
import { AlertTriangle, RefreshCcw } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service if needed
    console.error('[Dashboard Error Boundary]', error)
  }, [error])

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%',
      minHeight: '60vh',
      background: '#b3b3b3',
      borderRadius: '20px',
      border: '1px solid rgba(239, 68, 68, 0.1)',
      padding: '3rem',
      textAlign: 'center'
    }}>
      <div style={{
        width: '80px',
        height: '80px',
        borderRadius: '50%',
        background: 'rgba(239, 68, 68, 0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '1.5rem'
      }}>
        <AlertTriangle size={40} color="#EF4444" />
      </div>
      
      <h2 style={{ 
        fontFamily: 'var(--font-display)', 
        fontSize: '2.5rem', 
        color: 'var(--text-dark)', 
        marginBottom: '0.5rem',
        lineHeight: 1
      }}>
        System Disruption
      </h2>
      
      <p style={{ color: 'var(--text-muted)', maxWidth: '500px', marginBottom: '2rem', fontSize: '1.1rem' }}>
        We encountered an unexpected error while loading this module. This could be a temporary connection issue.
      </p>

      <Button 
        variant="primary" 
        onClick={() => reset()}
        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
      >
        <RefreshCcw size={18} />
        Try Again
      </Button>

      {process.env.NODE_ENV === 'development' && (
        <div style={{ marginTop: '3rem', textAlign: 'left', background: '#fee2e2', padding: '1rem', borderRadius: '8px', border: '1px solid #f87171', color: '#b91c1c', maxWidth: '100%', overflowX: 'auto', fontSize: '0.875rem' }}>
          <strong>Developer Detail:</strong> {error.message}
        </div>
      )}
    </div>
  )
}
