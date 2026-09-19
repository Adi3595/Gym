'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function addMember(formData: FormData) {
  const supabase = await createClient()

  const data = {
    first_name: formData.get('first_name'),
    last_name: formData.get('last_name'),
    email: formData.get('email') || null,
    phone: formData.get('phone'),
    status: formData.get('status') || 'Active',
  }

  const { error } = await supabase.from('members').insert([data])

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/dashboard/members')
  return { success: true }
}

export async function editMember(id: string, formData: FormData) {
  const supabase = await createClient()

  const data = {
    first_name: formData.get('first_name'),
    last_name: formData.get('last_name'),
    email: formData.get('email') || null,
    phone: formData.get('phone'),
    status: formData.get('status') || 'Active',
  }

  const { error } = await supabase.from('members').update(data).eq('id', id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/dashboard/members')
  revalidatePath(`/dashboard/members/${id}`)
  return { success: true }
}

export async function deleteMember(id: string) {
  const supabase = await createClient()

  // Nullify member_id in sales to avoid foreign key constraint violations
  await supabase
    .from('sales')
    .update({ member_id: null })
    .eq('member_id', id)

  const { error } = await supabase
    .from('members')
    .delete()
    .eq('id', id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/dashboard/members')
  return { success: true }
}

export async function sendManualReminder(phone: string, name: string) {
  const { sendWhatsAppMessage } = await import('@/utils/messaging')
  
  const english = `*SMFitness Gym - Subscription Reminder* ⏰\n\nHi ${name},\nYour gym subscription has recently expired. Please renew it at the front desk to continue your fitness journey! 💪\n\n- SMFitness Gym`;
  
  const hindi = `*SMFitness Gym - सदस्यता अनुस्मारक* ⏰\n\nनमस्ते ${name},\nआपकी जिम सदस्यता हाल ही में समाप्त हो गई है। कृपया अपनी फिटनेस यात्रा जारी रखने के लिए रिसेप्शन पर इसे नवीनीकृत करें! 💪\n\n- SMFitness Gym`;
  
  const marathi = `*SMFitness Gym - सबस्क्रिप्शन रिमाइंडर्स* ⏰\n\nनमस्कार ${name},\nतुमची जिम मेंबरशिप नुकतीच संपली आहे. कृपया तुमचा फिटनेस प्रवास सुरू ठेवण्यासाठी फ्रंट डेस्कवर तिचे नूतनीकरण करा! 💪\n\n- SMFitness Gym`;

  const textMessage = `${english}\n\n---\n\n${hindi}\n\n---\n\n${marathi}`;
  
  await sendWhatsAppMessage(phone, textMessage);
  return { success: true }
}
