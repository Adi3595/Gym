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
        secret: process.env.MICROSERVICE_SECRET || 'smfitness_gym_whatsapp_secret_key_123',
        phone
      })
    });
    
    const data = await res.json();
    if (!res.ok) {
      return { error: data.error || `Microservice returned status ${res.status}` };
    }
    return { code: data.code };
  } catch (err: any) {
    return { error: err.message };
  }
}
