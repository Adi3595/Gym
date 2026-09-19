'use server'

export async function checkWhatsAppStatus() {
  const baseUrl = process.env.WHATSAPP_MICROSERVICE_URL || 'http://localhost:4000/api/send';
  // If the URL ends with /api/send, replace it with /api/status
  const statusUrl = baseUrl.replace(/\/api\/send$/, '/api/status');
  
  try {
    const res = await fetch(statusUrl, { cache: 'no-store' });
    if (!res.ok) {
      return { connected: false, error: `Microservice returned status ${res.status}` };
    }
    const data = await res.json();
    return data;
  } catch (err: any) {
    return { connected: false, error: err.message };
  }
}

export async function requestWhatsAppPairingCode(phone: string) {
  const baseUrl = process.env.WHATSAPP_MICROSERVICE_URL || 'http://localhost:4000/api/send';
  const pairUrl = baseUrl.replace(/\/api\/send$/, '/api/pair');
  
  try {
    const res = await fetch(pairUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        secret: process.env.MICROSERVICE_SECRET || 'sm_fitness_secure_cron_token_2025',
        phone
      })
    });
    
    const data = await res.json();
    if (!res.ok) {
      return { error: data.error || `Microservice returned status ${res.status}` };
    }
    return { code: data.code };
  } catch (err) {
    return { error: 'Failed to request pairing code' };
  }
}

export async function disconnectWhatsApp() {
  const baseUrl = process.env.WHATSAPP_MICROSERVICE_URL || 'http://localhost:4000/api/send';
  const logoutUrl = baseUrl.replace(/\/api\/send$/, '/api/logout');
  
  try {
    const res = await fetch(logoutUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        secret: process.env.MICROSERVICE_SECRET || 'sm_fitness_secure_cron_token_2025'
      })
    });
    
    if (!res.ok) {
      return { error: 'Failed to disconnect WhatsApp' };
    }
    
    return { success: true };
  } catch (error) {
    return { error: 'Failed to connect to microservice' };
  }
}
