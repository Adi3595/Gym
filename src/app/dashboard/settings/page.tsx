'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Settings, Shield, Bell, Key } from 'lucide-react'

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('general')

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '3rem', color: 'var(--color-primary)', lineHeight: 1 }}>Settings</h1>
        <p style={{ color: 'var(--text-muted)' }}>Configure your gym's core preferences.</p>
      </div>

      <div style={{ display: 'flex', gap: '2rem' }}>
        
        {/* Settings Sidebar */}
        <div style={{ width: '250px', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {[
            { id: 'general', label: 'General Info', icon: Settings },
            { id: 'security', label: 'Security & Auth', icon: Shield },
            { id: 'notifications', label: 'Notifications', icon: Bell },
            { id: 'api', label: 'API Keys', icon: Key },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.75rem',
                padding: '1rem', borderRadius: '12px',
                background: activeTab === tab.id ? '#b3b3b3' : 'transparent',
                color: activeTab === tab.id ? 'var(--color-primary)' : 'var(--text-muted)',
                fontWeight: activeTab === tab.id ? 700 : 500,
                border: 'none', cursor: 'pointer', textAlign: 'left',
                boxShadow: activeTab === tab.id ? '0 4px 12px rgba(0,0,0,0.02)' : 'none',
                transition: 'all var(--transition-fast)'
              }}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Settings Content */}
        <div style={{ flex: 1, background: '#b3b3b3', borderRadius: '16px', border: '1px solid rgba(22, 105, 122, 0.08)', padding: '2.5rem', boxShadow: '0 10px 30px rgba(0,0,0,0.02)' }}>
          
          {activeTab === 'general' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <h2 style={{ fontSize: '1.5rem', color: 'var(--text-dark)', marginBottom: '1rem' }}>Gym Details</h2>
              
              <div style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>Facility Name</label>
                  <input type="text" defaultValue="Aura Gym & Supplements" style={{ padding: '0.875rem', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.1)', background: '#b3b3b3' }} />
                </div>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>Contact Email</label>
                  <input type="email" defaultValue="admin@auragym.com" style={{ padding: '0.875rem', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.1)', background: '#b3b3b3' }} />
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>Physical Address</label>
                <textarea rows={3} defaultValue="123 Elite Fitness Blvd, Mumbai, MH 400001" style={{ padding: '0.875rem', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.1)', background: '#b3b3b3', resize: 'none' }}></textarea>
              </div>

              <div style={{ marginTop: '1rem' }}>
                <Button variant="primary">Save Changes</Button>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <h2 style={{ fontSize: '1.5rem', color: 'var(--text-dark)', marginBottom: '1rem' }}>Security Settings</h2>
              <p style={{ color: 'var(--text-muted)' }}>Manage multi-factor authentication and role-based access.</p>
              <Button variant="secondary" style={{ width: 'max-content' }}>Require MFA for Admins</Button>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <h2 style={{ fontSize: '1.5rem', color: 'var(--text-dark)', marginBottom: '1rem' }}>Alert Preferences</h2>
              <p style={{ color: 'var(--text-muted)' }}>Configure automated emails for low inventory and expiring memberships.</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <input type="checkbox" id="low_stock" defaultChecked style={{ width: '18px', height: '18px' }} />
                <label htmlFor="low_stock" style={{ fontWeight: 600 }}>Email me when product stock is below 10</label>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <input type="checkbox" id="expiring" defaultChecked style={{ width: '18px', height: '18px' }} />
                <label htmlFor="expiring" style={{ fontWeight: 600 }}>Auto-email members 3 days before expiry</label>
              </div>
            </div>
          )}

          {activeTab === 'api' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <h2 style={{ fontSize: '1.5rem', color: 'var(--text-dark)', marginBottom: '1rem' }}>Developer Keys</h2>
              <div style={{ background: '#b3b3b3', padding: '1.5rem', borderRadius: '8px', border: '1px dashed rgba(0,0,0,0.1)' }}>
                <p style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Stripe Webhook Secret</p>
                <div style={{ background: '#b3b3b3', padding: '0.75rem', borderRadius: '6px', fontFamily: 'monospace' }}>whsec_xxxxxxxxxxxxxxxxxxxxxxxx</div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
