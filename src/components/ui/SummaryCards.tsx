import React from 'react';

interface SummaryCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: string;
  trendUp?: boolean;
}

export function SummaryCard({ title, value, icon, trend, trendUp }: SummaryCardProps) {
  return (
    <div style={{
      background: 'white', padding: '1.5rem', borderRadius: '16px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.03)', border: '1px solid rgba(22, 105, 122, 0.05)',
      display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1, minWidth: '200px'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', margin: 0 }}>{title}</h3>
        <div style={{ color: 'var(--color-primary)', background: 'var(--color-neutral)', padding: '0.5rem', borderRadius: '10px' }}>
          {icon}
        </div>
      </div>
      <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--text-dark)', fontFamily: 'var(--font-display)', lineHeight: 1 }}>
        {value}
      </div>
      {trend && (
        <div style={{ fontSize: '0.85rem', fontWeight: 600, color: trendUp ? '#22C55E' : '#EF4444', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          {trendUp ? '↑' : '↓'} {trend}
        </div>
      )}
    </div>
  );
}

export function SummaryGrid({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
      {children}
    </div>
  );
}
