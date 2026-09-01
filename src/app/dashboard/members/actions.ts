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
