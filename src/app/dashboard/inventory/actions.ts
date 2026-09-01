'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function addProduct(formData: FormData) {
  const supabase = await createClient()

  const data = {
    name: formData.get('name'),
    sku: formData.get('sku'),
    purchase_price: parseFloat(formData.get('purchase_price') as string),
    selling_price: parseFloat(formData.get('selling_price') as string),
    mrp: parseFloat(formData.get('mrp') as string),
    current_stock: parseInt(formData.get('current_stock') as string, 10),
    status: formData.get('status') || 'Active',
  }

  const { error } = await supabase.from('products').insert([data])

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/dashboard/inventory')
  return { success: true }
}
