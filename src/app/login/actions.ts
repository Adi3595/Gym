'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function login(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string | null
  const phone = formData.get('phone') as string | null
  const password = formData.get('password') as string

  const credentials = email 
    ? { email, password } 
    : { phone: `+91${phone?.replace(/\D/g, '')}`, password }

  const { error } = await supabase.auth.signInWithPassword(credentials)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function signup(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string | null
  const phone = formData.get('phone') as string | null
  const password = formData.get('password') as string

  const credentials = email 
    ? { email, password } 
    : { phone: `+91${phone?.replace(/\D/g, '')}`, password }

  const { error } = await supabase.auth.signUp(credentials)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}
