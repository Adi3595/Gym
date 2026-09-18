import React from 'react'
import Link from 'next/link'
import { Dumbbell } from 'lucide-react'

export default function GlobalNotFound() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      background: 'var(--bg-main)',
      color: 'var(--text-dark)',
      textAlign: 'center',
      padding: '2rem'
    }}>
      <div style={{
        width: '100px',
        height: '100px',
        borderRadius: '50%',
        background: 'var(--color-primary)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '2rem',
        boxShadow: '0 20px 40px rgba(22, 105, 122, 0.3)'
      }}>
        <Dumbbell size={50} color="white" />
      </div>
      
      <h1 style={{ 
        fontFamily: 'var(--font-display)', 
        fontSize: '4rem', 
        color: 'var(--color-primary)', 
        marginBottom: '1rem',
        lineHeight: 1
      }}>
        404
      </h1>
      
      <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '1rem' }}>
        Heavy lifting required to find this page.
      </h2>
      
      <p style={{ color: 'var(--text-muted)', maxWidth: '500px', marginBottom: '3rem', fontSize: '1.1rem' }}>
        The page you are looking for has either been moved, deleted, or never existed in the first place. Let's get you back to the gym floor.
      </p>

      <Link 
        href="/dashboard"
        style={{
          background: 'var(--color-accent)',
          color: 'white',
          padding: '1rem 2.5rem',
          borderRadius: '12px',
          fontWeight: 700,
          fontSize: '1.1rem',
          textDecoration: 'none',
          transition: 'all var(--transition-fast)',
          boxShadow: '0 10px 30px rgba(255, 166, 43, 0.3)'
        }}
      >
        Return to Dashboard
      </Link>
    </div>
  )
}
