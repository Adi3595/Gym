import React from 'react';

interface SummaryCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: string;
  trendUp?: boolean;
  colorVariant?: 'primary' | 'secondary' | 'accent' | 'light' | 'white';
}

export function SummaryCard({ title, value, icon, trend, trendUp, colorVariant = 'white' }: SummaryCardProps) {
  const isColored = colorVariant !== 'white';
  const colorVar = isColored ? `var(--color-${colorVariant})` : 'var(--color-primary)';

  return (
    <div style={{
      background: 'white', padding: '1.75rem', borderRadius: '16px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.03)', 
      border: '1px solid rgba(0,0,0,0.04)',
      borderTop: isColored ? `4px solid ${colorVar}` : '1px solid rgba(0,0,0,0.04)',
      display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1, minWidth: '200px',
      position: 'relative', overflow: 'hidden',
      transition: 'transform var(--transition-fast), box-shadow var(--transition-fast)'
    }}>
      {/* Decorative ambient glow */}
      {isColored && (
        <div style={{
          position: 'absolute', top: '-40px', right: '-40px', width: '120px', height: '120px',
          background: colorVar, opacity: 0.08, filter: 'blur(30px)', borderRadius: '50%',
          pointerEvents: 'none'
        }} />
      )}
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative' }}>
        <h3 style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', margin: 0 }}>{title}</h3>
        <div style={{ color: colorVar, background: '#f8fafc', padding: '0.6rem', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.02)' }}>
          {icon}
        </div>
      </div>
      <div style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--text-dark)', fontFamily: 'var(--font-display)', lineHeight: 1, position: 'relative' }}>
        {value}
      </div>
      {trend && (
        <div style={{ fontSize: '0.85rem', fontWeight: 600, color: trendUp ? '#22C55E' : '#EF4444', display: 'flex', alignItems: 'center', gap: '0.25rem', position: 'relative' }}>
          {trendUp !== undefined ? (trendUp ? '↑ ' : '↓ ') : ''}
          {trend}
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
