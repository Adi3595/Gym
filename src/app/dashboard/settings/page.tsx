'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { Settings, Shield, Bell, Key, MessageCircle, CheckCircle2, XCircle, Loader2 } from 'lucide-react'
import { checkWhatsAppStatus, disconnectWhatsApp, getSettings, updateSettings, getWhatsAppQR } from './actions'
import QRCode from 'react-qr-code'

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('general')
  const [waStatus, setWaStatus] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  
  // Settings States
  const [settings, setSettings] = useState<any>({
    facility_name: 'SMFitness Gym & Supplements',
    contact_email: 'admin@smfitness.com',
    physical_address: '123 Elite Fitness Blvd, Mumbai, MH 400001'
  })
  
  // QR States
  const [qrCodeData, setQrCodeData] = useState<string | null>(null)
  const [qrStatus, setQrStatus] = useState<string>('waiting')

  useEffect(() => {
    async function loadSettings() {
      const data = await getSettings()
      if (data) {
        setSettings(data)
      }
    }
    loadSettings()
  }, [])

  const fetchWhatsAppStatus = async (isPolling = false) => {
    if (!isPolling) setIsLoading(true)
    try {
      const data = await checkWhatsAppStatus()
      setWaStatus(data)
      if (data.connected) {
         setQrCodeData(null)
      }
    } catch (err) {
      setWaStatus({ connected: false, error: 'Failed to fetch status' })
    } finally {
      if (!isPolling) setIsLoading(false)
    }
  }

  useEffect(() => {
    if (activeTab === 'whatsapp') {
      fetchWhatsAppStatus(false)
    }
  }, [activeTab])

  // Poll for QR Code if we are not connected and on the whatsapp tab
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (activeTab === 'whatsapp' && !waStatus?.connected) {
      interval = setInterval(async () => {
        const qrRes = await getWhatsAppQR()
        if (qrRes && qrRes.status === 'ready') {
          setQrCodeData(qrRes.qr)
          setQrStatus('ready')
        } else if (qrRes && qrRes.status === 'connected') {
          setWaStatus({ connected: true })
          setQrCodeData(null)
          setQrStatus('connected')
        } else {
          setQrStatus('waiting')
        }
      }, 3000)
    }
    
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [activeTab, waStatus?.connected])

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSaving(true)
    const formData = new FormData(e.currentTarget)
    const res = await updateSettings(formData)
    setIsSaving(false)
    if (res.success) {
      alert('Settings saved successfully!')
    } else {
      alert(`Error saving settings: ${res.error}`)
    }
  }

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
              
              <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>Facility Name</label>
                    <input type="text" name="facility_name" defaultValue={settings?.facility_name || "SMFitness Gym & Supplements"} style={{ padding: '0.875rem', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.1)', background: 'white' }} />
                  </div>
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>Contact Email</label>
                    <input type="email" name="contact_email" defaultValue={settings?.contact_email || "admin@smfitness.com"} style={{ padding: '0.875rem', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.1)', background: 'white' }} />
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>Physical Address</label>
                  <textarea name="physical_address" rows={3} defaultValue={settings?.physical_address || "123 Elite Fitness Blvd, Mumbai, MH 400001"} style={{ padding: '0.875rem', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.1)', background: 'white', resize: 'none' }}></textarea>
                </div>

                <div style={{ marginTop: '1rem' }}>
                  <Button type="submit" variant="primary" disabled={isSaving}>{isSaving ? 'Saving...' : 'Save Changes'}</Button>
                </div>
              </form>
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
              <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>Link your Gym's WhatsApp account using a Phone Number Pairing Code.</p>
              
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
                    <p style={{ margin: 0, color: '#166534', textAlign: 'center', marginBottom: '1rem' }}>The microservice is successfully communicating with WhatsApp Web.</p>
                    <Button 
                      variant="ghost" 
                      onClick={async () => {
                        if (confirm('Are you sure you want to disconnect the bot and link a new number?')) {
                          setIsLoading(true);
                          await disconnectWhatsApp();
                          setTimeout(() => fetchWhatsAppStatus(false), 2000);
                        }
                      }}
                      style={{ color: '#ef4444', border: '1px solid #ef4444' }}
                    >
                      Disconnect & Link New Number
                    </Button>
                  </>
                ) : (
                  <>
                    <XCircle size={48} color="#ef4444" />
                    <h3 style={{ margin: 0, color: '#b91c1c', fontSize: '1.25rem' }}>Bot is Disconnected</h3>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', width: '100%', maxWidth: '400px', marginTop: '1rem' }}>
                      <p style={{ margin: 0, color: '#991b1b', textAlign: 'center', fontWeight: 600 }}>
                        Open WhatsApp on your phone &rarr; Linked Devices &rarr; Link a Device
                      </p>
                      
                      <div style={{ 
                        background: 'white', 
                        padding: '1.5rem', 
                        borderRadius: '16px', 
                        boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        minHeight: '280px',
                        minWidth: '280px'
                      }}>
                        {qrStatus === 'ready' && qrCodeData ? (
                          <QRCode value={qrCodeData} size={256} style={{ height: "auto", maxWidth: "100%", width: "100%" }} />
                        ) : (
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', color: 'var(--text-muted)' }}>
                            <Loader2 className="animate-spin" size={32} />
                            <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>Generating QR Code...</span>
                          </div>
                        )}
                      </div>
                      
                      <p style={{ margin: 0, color: '#7f1d1d', fontSize: '0.875rem', textAlign: 'center' }}>
                        Scan the QR code above to instantly link the bot.
                      </p>
                    </div>
                  </>
                )}
              </div>

              <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
                <Button variant="secondary" onClick={() => fetchWhatsAppStatus(false)} disabled={isLoading}>
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
