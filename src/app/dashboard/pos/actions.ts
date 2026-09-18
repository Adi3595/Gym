'use server'

import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { revalidatePath } from 'next/cache'

export async function processSale(cart: any[], memberId: string | null, paymentMethod: string) {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return { error: 'CRITICAL: Vercel Environment Variable SUPABASE_SERVICE_ROLE_KEY is missing. You must add it to Vercel and redeploy!' }
  }

  // Use service role key to bypass RLS for critical POS operations
  const supabase = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!, 
    process.env.SUPABASE_SERVICE_ROLE_KEY
  )

  // 1. Calculate totals
  const totalAmount = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0)
  const discount = 0
  const tax = 0
  const finalAmount = totalAmount - discount + tax

  // 2. Insert Sale Record
  const { data: saleData, error: saleError } = await supabase.from('sales').insert([{
    member_id: memberId || null,
    total_amount: totalAmount,
    discount,
    tax,
    final_amount: finalAmount,
    payment_method: paymentMethod,
    payment_status: 'Completed'
  }]).select().single()

  if (saleError) return { error: saleError.message }

  // 3. Insert Sale Items & Deduct Stock
  const saleId = saleData.id

  for (const item of cart) {
    // Insert sale_item
    const { error: itemError } = await supabase.from('sale_items').insert([{
      sale_id: saleId,
      product_id: item.product_id,
      quantity: item.quantity,
      price: item.price,
      total: item.price * item.quantity
    }])

    if (itemError) {
      console.error("Error inserting sale item:", itemError)
      return { error: `Failed to insert line item: ${itemError.message}` }
    }

    // Deduct stock
    const { data: prodData } = await supabase.from('products').select('current_stock').eq('id', item.product_id).single()
    if (prodData) {
      await supabase.from('products').update({ 
        current_stock: prodData.current_stock - item.quantity 
      }).eq('id', item.product_id)
    }
  }

  revalidatePath('/dashboard')
  revalidatePath('/dashboard/inventory')
  
  return { success: true, saleId }
}
