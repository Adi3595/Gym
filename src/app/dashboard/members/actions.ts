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

export async function deleteMember(id: string) {
  const supabase = await createClient()

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
  
  const textMessage = `*SMFitness Gym - Subscription Reminder* ⏰\n\nHi ${name},\nYour gym subscription has recently expired. Please renew it at the front desk to continue your fitness journey! 💪\n\n- SMFitness Gym & Supplements`;
  
  await sendWhatsAppMessage(phone, textMessage);
  return { success: true }
}
