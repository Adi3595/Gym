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

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getSettings() {
  const supabase = await createClient()
  const { data, error } = await supabase.from('settings').select('*').single()
  if (error) {
    return null
  }
  return data
}

export async function updateSettings(formData: FormData) {
  const supabase = await createClient()
  
  const data = {
    facility_name: formData.get('facility_name'),
    contact_email: formData.get('contact_email'),
    physical_address: formData.get('physical_address'),
  }

  // Assuming we just update the first row
  const { data: settings } = await supabase.from('settings').select('id').single()
  
  if (settings) {
    const { error } = await supabase.from('settings').update(data).eq('id', settings.id)
    if (error) return { error: error.message }
  } else {
    // Should not happen with our migration, but just in case
    const { error } = await supabase.from('settings').insert([data])
    if (error) return { error: error.message }
  }

  revalidatePath('/dashboard/settings')
  return { success: true }
}
