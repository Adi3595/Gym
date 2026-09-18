'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { Settings, Shield, Bell, Key, MessageCircle, CheckCircle2, XCircle } from 'lucide-react'
import { checkWhatsAppStatus } from './actions'

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('general')
  const [waStatus, setWaStatus] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)

  const fetchWhatsAppStatus = async (isPolling = false) => {
    if (!isPolling) setIsLoading(true)
    try {
      const data = await checkWhatsAppStatus()
      setWaStatus(data)
    } catch (err) {
      setWaStatus({ connected: false, error: 'Failed to fetch status' })
    } finally {
      if (!isPolling) setIsLoading(false)
    }
  }

  useEffect(() => {
    let interval: NodeJS.Timeout

    if (activeTab === 'whatsapp') {
      fetchWhatsAppStatus(false)
      
      // Poll every 10 seconds to get fresh QR codes
      interval = setInterval(() => {
        fetchWhatsAppStatus(true)
      }, 10000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [activeTab])

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
            { id: 'whatsapp', label: 'WhatsApp Bot', icon: MessageCircle },
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
                background: activeTab === tab.id ? 'white' : 'transparent',
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
        <div style={{ flex: 1, background: 'white', borderRadius: '16px', border: '1px solid rgba(22, 105, 122, 0.08)', padding: '2.5rem', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
          
          {activeTab === 'general' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <h2 style={{ fontSize: '1.5rem', color: 'var(--text-dark)', marginBottom: '1rem' }}>Gym Details</h2>
              
              <div style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>Facility Name</label>
                  <input type="text" defaultValue="SMFitness Gym & Supplements" style={{ padding: '0.875rem', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.1)', background: 'white' }} />
                </div>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>Contact Email</label>
                  <input type="email" defaultValue="admin@smfitness.com" style={{ padding: '0.875rem', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.1)', background: 'white' }} />
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>Physical Address</label>
                <textarea rows={3} defaultValue="123 Elite Fitness Blvd, Mumbai, MH 400001" style={{ padding: '0.875rem', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.1)', background: 'white', resize: 'none' }}></textarea>
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
              <div style={{ background: 'white', padding: '1.5rem', borderRadius: '8px', border: '1px dashed rgba(0,0,0,0.1)' }}>
                <p style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Stripe Webhook Secret</p>
                <div style={{ background: '#f6f6f6', padding: '0.75rem', borderRadius: '6px', fontFamily: 'monospace' }}>whsec_xxxxxxxxxxxxxxxxxxxxxxxx</div>
              </div>
            </div>
          )}

          {activeTab === 'whatsapp' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <h2 style={{ fontSize: '1.5rem', color: 'var(--text-dark)', marginBottom: '0.5rem' }}>WhatsApp Bot Integration</h2>
              <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>Check the connection status of your automated WhatsApp bot.</p>
              
              <div style={{ 
                background: waStatus?.connected ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)', 
                border: `1px solid ${waStatus?.connected ? '#22c55e' : '#ef4444'}`, 
                padding: '2rem', borderRadius: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' 
              }}>
                {isLoading ? (
                  <div style={{ color: 'var(--text-muted)' }}>Checking connection...</div>
                ) : waStatus?.connected ? (
                  <>
                    <CheckCircle2 size={48} color="#22c55e" />
                    <h3 style={{ margin: 0, color: '#15803d', fontSize: '1.25rem' }}>Bot is Connected and Active!</h3>
                    <p style={{ margin: 0, color: '#166534', textAlign: 'center' }}>The microservice is successfully communicating with WhatsApp Web.</p>
                  </>
                ) : (
                  <>
                    <XCircle size={48} color="#ef4444" />
                    <h3 style={{ margin: 0, color: '#b91c1c', fontSize: '1.25rem' }}>Bot is Disconnected</h3>
                    {waStatus?.qr ? (
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                        <p style={{ margin: 0, color: '#991b1b', textAlign: 'center', fontWeight: 600 }}>Scan this QR code with your Gym WhatsApp to reconnect!</p>
                        <div style={{ padding: '1rem', background: 'white', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                          <img src={`https://api.qrserver.com/v1/create-qr-code/?size=256x256&data=${encodeURIComponent(waStatus.qr)}`} alt="WhatsApp QR Code" width={256} height={256} />
                        </div>
                      </div>
                    ) : (
                      <>
                        <p style={{ margin: 0, color: '#991b1b', textAlign: 'center' }}>
                          {waStatus?.error || 'The microservice is offline or the WhatsApp session was logged out.'}
                        </p>
                        <p style={{ margin: 0, color: '#7f1d1d', fontSize: '0.875rem', marginTop: '0.5rem', textAlign: 'center' }}>
                          To reconnect, make sure the microservice is running. The QR code will appear here once generated.
                        </p>
                      </>
                    )}
                  </>
                )}
              </div>

              <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
                <Button variant="secondary" onClick={fetchWhatsAppStatus} disabled={isLoading}>
                  {isLoading ? 'Refreshing...' : 'Refresh Status'}
                </Button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
