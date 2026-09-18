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
