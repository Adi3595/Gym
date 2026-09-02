import React from 'react'

export default function DashboardLoading() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', width: '100%' }}>
      {/* Header Skeleton */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <div className="skeleton" style={{ width: '250px', height: '48px', borderRadius: '8px' }}></div>
        <div className="skeleton" style={{ width: '400px', height: '24px', borderRadius: '4px' }}></div>
      </div>

      {/* Grid Skeleton for KPI Cards or Data Tables */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem' }}>
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="skeleton" style={{ height: '140px', borderRadius: '16px' }}></div>
        ))}
      </div>

      {/* Large Table Skeleton */}
      <div className="skeleton" style={{ width: '100%', height: '400px', borderRadius: '16px', marginTop: '1rem' }}></div>
    </div>
  )
}
