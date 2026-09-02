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
  const bgColor = isColored ? `var(--color-${colorVariant})` : 'white';
  const textColor = isColored ? 'white' : 'var(--text-dark)';
  const labelColor = isColored ? 'rgba(255,255,255,0.7)' : 'var(--text-muted)';
  const iconBg = isColored ? 'rgba(0,0,0,0.15)' : 'var(--color-neutral)';
  const iconColor = isColored ? 'white' : 'var(--color-primary)';
  const trendColor = isColored ? 'rgba(255,255,255,0.9)' : (trendUp ? '#22C55E' : '#EF4444');

  return (
    <div style={{
      background: bgColor, padding: '1.75rem', borderRadius: '16px',
      boxShadow: isColored ? `0 10px 30px rgba(0,0,0,0.15)` : '0 4px 20px rgba(0,0,0,0.03)', 
      border: isColored ? 'none' : '1px solid rgba(22, 105, 122, 0.05)',
      display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1, minWidth: '200px'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ fontSize: '0.875rem', fontWeight: 700, color: labelColor, textTransform: 'uppercase', letterSpacing: '1px', margin: 0 }}>{title}</h3>
        <div style={{ color: iconColor, background: iconBg, padding: '0.5rem', borderRadius: '10px' }}>
          {icon}
        </div>
      </div>
      <div style={{ fontSize: '2.5rem', fontWeight: 700, color: textColor, fontFamily: 'var(--font-display)', lineHeight: 1 }}>
        {value}
      </div>
      {trend && (
        <div style={{ fontSize: '0.85rem', fontWeight: 600, color: trendColor, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          {trendUp !== undefined && !isColored ? (trendUp ? '↑ ' : '↓ ') : ''}
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
