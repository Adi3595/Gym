'use client'

import React from 'react'

export function PrintButton() {
  return (
    <button 
      onClick={() => window.print()}
      style={{ 
        background: 'var(--color-primary)', 
        color: 'white', 
        padding: '0.75rem 1.5rem', 
        borderRadius: '8px', 
        fontWeight: 600,
        border: 'none',
        cursor: 'pointer',
        boxShadow: '0 4px 12px rgba(22, 105, 122, 0.2)'
      }}
    >
      Generate Report
    </button>
  )
}
